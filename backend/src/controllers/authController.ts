import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AIRTABLE_CONFIG } from '../config/oauth';

// Helper to encode PKCE verifier (if we were using PKCE, but Airtable uses standard code flow for server-side apps usually, 
// but let's stick to the standard Authorization Code flow as per their docs).
// Actually Airtable uses PKCE for public clients, but for confidential clients (server-side) we use client_secret.

export const login = (req: Request, res: Response) => {
    // State should ideally be a random string stored in session to prevent CSRF
    const state = 'some_random_state';

    const params = new URLSearchParams({
        client_id: AIRTABLE_CONFIG.CLIENT_ID,
        redirect_uri: AIRTABLE_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: AIRTABLE_CONFIG.SCOPE,
        state: state
    });

    res.redirect(`${AIRTABLE_CONFIG.AUTH_URL}?${params.toString()}`);
};

export const callback = async (req: Request, res: Response) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).json({ error: 'Airtable auth failed', details: error });
    }

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        // Exchange code for tokens
        // Airtable requires Basic Auth for the token endpoint with client_id:client_secret
        const credentials = Buffer.from(`${AIRTABLE_CONFIG.CLIENT_ID}:${AIRTABLE_CONFIG.CLIENT_SECRET}`).toString('base64');

        const tokenResponse = await axios.post(AIRTABLE_CONFIG.TOKEN_URL,
            new URLSearchParams({
                code: code as string,
                redirect_uri: AIRTABLE_CONFIG.REDIRECT_URI,
                grant_type: 'authorization_code'
            }), {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token, expires_in, refresh_expires_in } = tokenResponse.data;

        // Get User Info from Airtable
        const userResponse = await axios.get(`${AIRTABLE_CONFIG.API_URL}/meta/whoami`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const airtableId = userResponse.data.id;
        const email = userResponse.data.email;

        // Find or Create User
        let user = await User.findOne({ airtableId });

        const tokenExpiry = new Date(Date.now() + expires_in * 1000);

        if (user) {
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            user.tokenExpiry = tokenExpiry;
            user.lastLogin = new Date();
            if (email) user.email = email;
            await user.save();
        } else {
            user = await User.create({
                airtableId,
                email,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiry,
                lastLogin: new Date()
            });
        }

        // Create JWT Session
        const token = jwt.sign({ id: user._id, airtableId: user.airtableId }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend dashboard
        res.redirect('http://localhost:5173/dashboard');

    } catch (err: any) {
        console.error('Auth Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ authenticated: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        const user = await User.findById(decoded.id).select('-accessToken -refreshToken');

        if (!user) return res.status(404).json({ authenticated: false });

        res.json({ authenticated: true, user });
    } catch (err) {
        res.status(401).json({ authenticated: false });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ success: true });
};
