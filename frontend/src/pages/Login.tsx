import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const { login, user, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Airtable Form Builder
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Connect your Airtable account to start building forms.
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={login}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Connect Airtable
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
