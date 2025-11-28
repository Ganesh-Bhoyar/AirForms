import api from '../utils/api';

export const createForm = async (formData: any) => {
    const response = await api.post('/api/forms', formData);
    return response.data;
};

export const getMyForms = async () => {
    const response = await api.get('/api/forms');
    return response.data;
};

export const getFormById = async (formId: string) => {
    const response = await api.get(`/api/forms/${formId}`);
    return response.data;
};
