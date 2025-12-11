# Access Request Portal - Frontend

A Vue.js 3 frontend application for managing access requests, built with Vuetify 3 and Vuex 4.

## Features

- 🔐 User authentication (Login/Signup)
- 📝 Create and manage access request tickets
- 👥 Role-based access control (User/IT Support)
- 📊 Admin dashboard with statistics
- 💬 Feedback system for ticket communication
- 📎 File attachment support
- 🎨 Modern, responsive UI with Vuetify

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **Vuex 4** - State management
- **Vuetify 3** - Material Design component framework
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
src/
├── api/                  # API service layer
│   ├── auth.js          # Authentication API calls
│   ├── tickets.js       # Ticket API calls
│   └── axios.js         # Axios instance with interceptors
├── store/                # Vuex store
│   ├── index.js         # Main store
│   └── modules/
│       ├── auth.js      # Authentication state
│       └── tickets.js   # Tickets state
├── router/               # Vue Router
│   └── index.js
├── views/                # Page components
│   ├── Login.vue
│   ├── Signup.vue
│   ├── Dashboard.vue
│   ├── CreateTicket.vue
│   ├── MyTickets.vue
│   ├── TicketDetail.vue
│   ├── AdminDashboard.vue
│   └── AdminTicketDetail.vue
├── components/           # Reusable components
│   ├── TicketCard.vue
│   ├── StatusChip.vue
│   ├── FeedbackCard.vue
│   └── FileUpload.vue
├── plugins/              # Plugins
│   └── vuetify.js       # Vuetify configuration
├── utils/                # Utilities
│   └── auth.js          # Auth helpers
├── App.vue               # Root component
└── main.js               # Entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (optional):
```
VITE_APP_API_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Configuration

### API Base URL

The API base URL is configured in:
- `src/api/axios.js` - Default: `http://localhost:3000`
- Environment variable: `VITE_APP_API_URL`

### Authentication

Tokens are stored in `localStorage` and automatically included in API requests via Axios interceptors.

## Usage

### User Flow

1. **Sign Up / Login**: Create an account or login with existing credentials
2. **Create Ticket**: Submit an access request with details and optional attachment
3. **View Tickets**: Track the status of your tickets
4. **View Details**: See ticket information, timeline, and IT support feedback

### IT Support Flow

1. **Admin Dashboard**: View all tickets with filtering options
2. **Ticket Management**: Update status, add feedback, and close tickets
3. **Statistics**: Monitor ticket counts by status

## API Integration

The frontend expects the backend API to be running on `http://localhost:3000` (or configured URL).

### Endpoints Used

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /tickets` - Create ticket
- `GET /tickets/my` - Get user's tickets
- `GET /tickets/my/:id` - Get user's ticket detail
- `GET /tickets` - Get all tickets (IT Support)
- `GET /tickets/:id` - Get ticket detail (IT Support)
- `PUT /tickets/:id/status` - Update ticket status
- `POST /tickets/:id/feedback` - Add feedback
- `PUT /tickets/:id/close` - Close ticket

## Features Details

### Request Types
- Application Database Access
- Password Recovery
- System Permissions
- API Access
- Other (with custom description)

### Ticket Statuses
- **Pending** - Initial status (blue)
- **In Progress** - Being worked on (orange)
- **Completed** - Resolved (green)

### File Upload
- Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
- Maximum file size: 5MB

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Access Request Portal system.
# access-frontend
