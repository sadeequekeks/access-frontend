# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file:
```
VITE_APP_API_URL=http://localhost:3000
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Note:** Make sure your backend API is running on `http://localhost:3000` (or your configured URL).

## First Steps

1. **Sign Up**: Create a new user account
2. **Login**: Use your credentials to login
3. **Create Ticket**: Submit your first access request
4. **View Tickets**: Track the status of your requests

## IT Support Access

To access the admin dashboard:
- The user role must be set to `it_support` in the backend
- After login, IT Support users will see an "Admin" button in the navigation bar
- Access the admin dashboard to manage all tickets

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
- Your backend has CORS enabled for `http://localhost:5173`
- The API URL in `.env` matches your backend URL

### Authentication Issues
- Clear browser localStorage if you encounter authentication problems
- Ensure your backend is running and accessible
- Check browser console for detailed error messages

### Environment Variables
In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client code.
