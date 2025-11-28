import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_ID = process.argv[2];
const WEBHOOK_URL = process.argv[3];
const ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN; // User needs to provide this temporarily or we use a service account

if (!BASE_ID || !WEBHOOK_URL || !ACCESS_TOKEN) {
    console.error('Usage: ts-node src/scripts/registerWebhook.ts <BASE_ID> <WEBHOOK_URL>');
    process.exit(1);
}

const register = async () => {
    try {
        const response = await axios.post(
            `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks`,
            {
                notificationUrl: WEBHOOK_URL,
                specification: {
                    options: {
                        filters: {
                            dataTypes: ['tableData'],
                            changeTypes: ['add', 'remove', 'update']
                        }
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Webhook registered successfully:', response.data);
    } catch (error: any) {
        console.error('Failed to register webhook:', error.response?.data || error.message);
    }
};

register();
