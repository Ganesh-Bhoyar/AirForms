"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const airtableRoutes_1 = __importDefault(require("./routes/airtableRoutes"));
const formRoutes_1 = __importDefault(require("./routes/formRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/api/airtable', airtableRoutes_1.default);
app.use('/api/forms', formRoutes_1.default);
app.use('/api/submit', submissionRoutes_1.default);
app.use('/webhooks', webhookRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/airtable-form-builder');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
