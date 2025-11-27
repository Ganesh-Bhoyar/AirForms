import dotenv from 'dotenv';

dotenv.config();

export const AIRTABLE_CONFIG = {
    CLIENT_ID: process.env.AIRTABLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.AIRTABLE_CLIENT_SECRET || '',
    REDIRECT_URI: process.env.AIRTABLE_REDIRECT_URI || 'http://localhost:5000/auth/airtable/callback',
    AUTH_URL: 'https://airtable.com/oauth2/v1/authorize',
    TOKEN_URL: 'https://airtable.com/oauth2/v1/token',
    API_URL: 'https://api.airtable.com/v0',
    SCOPE: 'data.records:read data.records:write schema.bases:read webhook:manage'
};
