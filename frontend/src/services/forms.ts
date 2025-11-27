import axios from 'axios';

export const createForm = async (formData: any) => {
    const response = await axios.post('/api/forms', formData);
    return response.data;
};

export const getMyForms = async () => {
    const response = await axios.get('/api/forms');
    return response.data;
};

export const getFormById = async (formId: string) => {
    const response = await axios.get(`/api/forms/${formId}`);
    return response.data;
};
