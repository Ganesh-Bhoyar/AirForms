import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyForms } from '../services/forms';
import { Link } from 'react-router-dom';

interface Form {
    _id: string;
    title: string;
    createdAt: string;
    questions: any[];
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [forms, setForms] = useState<Form[]>([]);

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const data = await getMyForms();
            setForms(data);
        } catch (error) {
            console.error('Failed to load forms', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">My Forms</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
                    <button
                        onClick={logout}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create New Form Card */}
                <div
                    onClick={() => window.location.href = '/builder'}
                    className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 hover:border-blue-500 hover:bg-blue-50"
                >
                    <span className="text-4xl text-gray-400">+</span>
                    <span className="mt-2 text-gray-600">Create New Form</span>
                </div>

                {/* Existing Forms */}
                {forms.map(form => (
                    <div key={form._id} className="flex h-48 flex-col justify-between rounded-lg bg-white p-6 shadow-sm hover:shadow-md">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                            <p className="text-sm text-gray-500">{form.questions.length} questions</p>
                            <p className="text-xs text-gray-400">Created {new Date(form.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/form/${form._id}`} target="_blank" className="text-blue-600 hover:underline">View</Link>
                            <Link to={`/responses/${form._id}`} className="text-green-600 hover:underline">Responses</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
