import axios from 'axios';

export const getBases = async () => {
    const response = await axios.get('/api/airtable/bases');
    return response.data;
};

export const getTables = async (baseId: string) => {
    const response = await axios.get(`/api/airtable/bases/${baseId}/tables`);
    return response.data;
};
