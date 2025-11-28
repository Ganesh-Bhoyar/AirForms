import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBases, getTables } from '../services/airtable';
import { createForm } from '../services/forms';

interface Base {
    id: string;
    name: string;
}

interface Table {
    id: string;
    name: string;
    fields: Field[];
}

interface Field {
    id: string;
    name: string;
    type: string;
    options?: { choices: { name: string }[] };
}

interface Question {
    questionKey: string;
    fieldId: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    conditions: any[];
}

const FormBuilder = () => {
    const navigate = useNavigate();
    const [bases, setBases] = useState<Base[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedBase, setSelectedBase] = useState<string>('');
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [fields, setFields] = useState<Field[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [formTitle, setFormTitle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBases();
    }, []);

    const loadBases = async () => {
        try {
            const data = await getBases();
            setBases(data);
        } catch (error) {
            console.error('Failed to load bases', error);
        }
    };

    const handleBaseChange = async (baseId: string) => {
        setSelectedBase(baseId);
        setSelectedTable('');
        setFields([]);
        setQuestions([]);
        try {
            const data = await getTables(baseId);
            setTables(data);
        } catch (error) {
            console.error('Failed to load tables', error);
        }
    };

    const handleTableChange = (tableId: string) => {
        setSelectedTable(tableId);
        const table = tables.find(t => t.id === tableId);
        if (table) {
            setFields(table.fields);
        }
    };

    const addQuestion = (fieldId: string) => {
        const field = fields.find(f => f.id === fieldId);
        if (!field) return;

        const newQuestion: Question = {
            questionKey: `q_${Date.now()}`,
            fieldId: field.id,
            label: field.name,
            type: field.type,
            required: false,
            options: field.options?.choices?.map(c => c.name) || [],
            conditions: []
        };

        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], ...updates };
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        if (!formTitle || !selectedBase || !selectedTable || questions.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await createForm({
                baseId: selectedBase,
                tableId: selectedTable,
                title: formTitle,
                questions
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save form', error);
            alert('Failed to save form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Create New Form</h1>

                {/* Step 1: Configuration */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Form Title</label>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="My Awesome Form"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Select Base</label>
                        <select
                            value={selectedBase}
                            onChange={(e) => handleBaseChange(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select a Base...</option>
                            {bases.map(base => (
                                <option key={base.id} value={base.id}>{base.name}</option>
                            ))}
                        </select>
                    </div>
                    {selectedBase && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Select Table</label>
                            <select
                                value={selectedTable}
                                onChange={(e) => handleTableChange(e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select a Table...</option>
                                {tables.map(table => (
                                    <option key={table.id} value={table.id}>{table.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Step 2: Field Selection */}
                {selectedTable && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Available Fields</h2>
                        <div className="flex flex-wrap gap-2">
                            {fields.map(field => (
                                <button
                                    key={field.id}
                                    onClick={() => addQuestion(field.id)}
                                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                >
                                    + {field.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Question Builder */}
                {questions.length > 0 && (
                    <div className="mb-8 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Form Questions</h2>
                        {questions.map((q, index) => (
                            <div key={q.questionKey} className="relative rounded-lg border border-gray-200 bg-gray-50 p-6">
                                <button
                                    onClick={() => removeQuestion(index)}
                                    className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">Label</label>
                                        <input
                                            type="text"
                                            value={q.label}
                                            onChange={(e) => updateQuestion(index, { label: e.target.value })}
                                            className="w-full rounded border border-gray-300 p-2"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={q.required}
                                                onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Required</span>
                                        </label>
                                    </div>
                                </div>
                                {/* Logic Builder Placeholder - Can be expanded later */}
                            </div>
                        ))}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-md bg-green-600 px-6 py-3 text-white shadow-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Form'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
