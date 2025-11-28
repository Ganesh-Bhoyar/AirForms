import api from '../utils/api';

export const getBases = async () => {
    const response = await api.get('/api/airtable/bases');
    return response.data;
};

export const getTables = async (baseId: string) => {
    const response = await api.get(`/api/airtable/bases/${baseId}/tables`);
    return response.data;
};
