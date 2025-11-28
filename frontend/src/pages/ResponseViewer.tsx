import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFormById } from '../services/forms';
import api from '../utils/api';

const ResponseViewer = () => {
    const { formId } = useParams();
    const [responses, setResponses] = useState<any[]>([]);
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (formId) {
            loadData();
        }
    }, [formId]);

    const loadData = async () => {
        try {
            const [formData, responsesData] = await Promise.all([
                getFormById(formId!),
                api.get(`/api/submit/${formId}`).then(res => res.data)
            ]);
            setForm(formData);
            setResponses(responsesData);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!form) return <div className="flex h-screen items-center justify-center">Form not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Responses: {form.title}</h1>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Submission Date
                                    </th>
                                    {form.questions.map((q: any) => (
                                        <th key={q.questionKey} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            {q.label}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Airtable ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {responses.map((response) => (
                                    <tr key={response._id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {new Date(response.createdAt).toLocaleString()}
                                        </td>
                                        {form.questions.map((q: any) => (
                                            <td key={q.questionKey} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {String(response.answers[q.questionKey] || '-')}
                                            </td>
                                        ))}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {response.airtableRecordId}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseViewer;
