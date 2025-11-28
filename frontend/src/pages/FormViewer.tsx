import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFormById } from '../services/forms';
import { shouldShowQuestion } from '../utils/logicUtils';
import api from '../utils/api';

const FormViewer = () => {
    const { formId } = useParams();
    const [form, setForm] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (formId) {
            loadForm();
        }
    }, [formId]);

    const loadForm = async () => {
        try {
            const data = await getFormById(formId!);
            setForm(data);
        } catch (error) {
            console.error('Failed to load form', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionKey: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionKey]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/api/submit/${formId}`, { answers });
            setSubmitted(true);
        } catch (error) {
            console.error('Submission failed', error);
            alert('Failed to submit form');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!form) return <div className="flex h-screen items-center justify-center">Form not found</div>;
    if (submitted) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                <h2 className="mb-2 text-2xl font-bold text-green-600">Thank You!</h2>
                <p className="text-gray-600">Your response has been recorded.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-8 py-6">
                    <h1 className="text-3xl font-bold text-white">{form.title}</h1>
                    {form.description && <p className="mt-2 text-blue-100">{form.description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {form.questions.map((question: any) => {
                        if (!shouldShowQuestion(question, answers)) return null;

                        return (
                            <div key={question.questionKey} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {question.label}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {question.type === 'singleLineText' && (
                                    <input
                                        type="text"
                                        required={question.required}
                                        value={answers[question.questionKey] || ''}
                                        onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                )}

                                {question.type === 'multilineText' && (
                                    <textarea
                                        required={question.required}
                                        value={answers[question.questionKey] || ''}
                                        onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                )}

                                {question.type === 'singleSelect' && (
                                    <select
                                        required={question.required}
                                        value={answers[question.questionKey] || ''}
                                        onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">Select an option</option>
                                        {question.options?.map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {/* Add other types as needed */}
                            </div>
                        );
                    })}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormViewer;
