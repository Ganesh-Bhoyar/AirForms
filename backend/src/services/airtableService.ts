import axios from 'axios';
import User, { IUser } from '../models/User';
import { AIRTABLE_CONFIG } from '../config/oauth';

const SUPPORTED_FIELD_TYPES = [
    'singleLineText',
    'multilineText',
    'singleSelect',
    'multipleSelects',
    'multipleAttachments'
];

export const getValidToken = async (user: IUser): Promise<string> => {
    if (user.tokenExpiry && new Date() < user.tokenExpiry) {
        return user.accessToken;
    }

 
    try {
        const credentials = Buffer.from(`${AIRTABLE_CONFIG.CLIENT_ID}:${AIRTABLE_CONFIG.CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(AIRTABLE_CONFIG.TOKEN_URL,
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.refreshToken
            }), {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data;

        user.accessToken = access_token;
        user.refreshToken = refresh_token;
        user.tokenExpiry = new Date(Date.now() + expires_in * 1000);
        await user.save();

        return access_token;
    } catch (error) {
        console.error('Failed to refresh token', error);
        throw new Error('Authentication expired');
    }
};

export const getBases = async (user: IUser) => {
    const token = await getValidToken(user);
    const response = await axios.get(`${AIRTABLE_CONFIG.API_URL}/meta/bases`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response.data.bases);
    return response.data.bases;
};

export const getTables = async (user: IUser, baseId: string) => {
    const token = await getValidToken(user);
    const response = await axios.get(`${AIRTABLE_CONFIG.API_URL}/meta/bases/${baseId}/tables`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    
    const tables = response.data.tables.map((table: any) => ({
        ...table,
        fields: table.fields.filter((field: any) => SUPPORTED_FIELD_TYPES.includes(field.type))
    }));

    return tables;
};
