# AirForms

A custom form builder for Airtable. Connects to your Airtable bases, lets you design forms with conditional logic, and syncs responses back in real-time. Built with the MERN stack + TypeScript.

## How it works
1.  **Connect:** Log in with Airtable OAuth.
2.  **Build:** Pick a Base and Table. We automatically fetch the fields.
3.  **Customize:** Hide fields, change labels, and add conditional logic (e.g., "Show 'Email' if 'Contact Me' is Yes").
4.  **Share:** Get a public link for your form.
5.  **Sync:** Submissions go to MongoDB immediately and sync to Airtable via their API.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp sample.env .env # Fill in your credentials
npm run dev
```

**Environment Variables needed:**
*   `MONGO_URI`: Your Atlas connection string.
*   `AIRTABLE_CLIENT_ID` & `SECRET`: From Airtable's Developer portal.
*   `AIRTABLE_REDIRECT_URI`: `http://localhost:5000/auth/airtable/callback` (for local dev).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173`.

## Deployment

### Backend (Render/Heroku)
*   Build command: `npm install && npm run build`
*   Start command: `npm start`
*   **Important:** Set `FRONTEND_URL` to your deployed frontend domain to handle CORS and redirects correctly.
*   **Webhooks:** To enable real-time updates from Airtable, run the registration script:
    ```bash
    npx ts-node src/scripts/registerWebhook.ts <BASE_ID> <YOUR_BACKEND_URL>/webhooks
    ```

### Frontend (Vercel/Netlify)
*   Set `VITE_API_URL` to your deployed backend URL.
*   That's it.

## Key Features
*   **OAuth with PKCE:** Secure authentication flow.
*   **Conditional Logic:** Simple rule engine on the frontend to toggle field visibility.
*   **Two-way Sync:** Webhooks listen for changes in Airtable (like deletions) and update our local database.

## Project Structure
*   `backend/src/controllers`: Logic for Forms, Submissions, and Webhooks.
*   `frontend/src/services`: API wrappers for communicating with the backend.
*   `frontend/src/context`: Auth state management.
