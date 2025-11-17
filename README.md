# Seeker-Employer Sync

A comprehensive job seeker-employer platform that connects job seekers with employers, enabling seamless job posting, application management, and profile building.

## Features

### For Job Seekers
- **User Registration & Authentication**: Secure signup and login with JWT tokens
- **Profile Management**: Create and update detailed profiles including bio, skills, education, experience, and CV upload
- **Job Search & Filtering**: Browse and search jobs by category, location, job type, and salary range
- **Job Applications**: Apply to jobs with cover letters and CV attachments
- **Saved Jobs**: Save favorite jobs for later reference
- **Application Tracking**: Monitor application status (pending, reviewed, accepted, rejected)

### For Employers
- **Company Profile**: Set up company information, logo, website, and industry details
- **Job Posting**: Create detailed job listings with requirements, salary ranges, and categories
- **Application Management**: View and manage job applications from seekers
- **Dashboard**: Overview of posted jobs and application statistics

### General Features
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS
- **Real-time Updates**: Live data synchronization using React Query
- **Secure API**: Rate-limited, CORS-enabled backend with input validation
- **File Uploads**: Support for CV and company logo uploads
- **Role-based Access**: Different permissions for job seekers, employers, and admins

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Handling**: Multer
- **Development**: ts-node-dev, Jest for testing

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Package Manager**: npm/bun

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun**
- **MongoDB** (local or cloud instance)
- **MongoDB** (if using local database, though Supabase is primary)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seeker-employer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` directory with the following variables:
     ```
    

   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   - Create a `.env` file in the `frontend` directory:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Database Setup**
   - Ensure MongoDB is installed and running locally, or use a cloud MongoDB service (e.g., MongoDB Atlas)
   - The application will automatically create collections and indexes as needed

## Usage

1. **Access the Application**
   

2. **User Registration**
   - Visit the registration page
   - Choose role: Job Seeker or Employer
   - Fill in required information

3. **Job Posting (Employers)**
   - Log in as an employer
   - Navigate to the dashboard
   - Create a new job posting with details

4. **Job Search (Job Seekers)**
   - Browse jobs on the main page
   - Use filters to narrow down results
   - View job details and apply

## API Endpoints

#
## Project Structure

```
seeker-employer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── supabase/
│   │   ├── config.toml
│   │   └── migrations/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── integrations/
│   │   └── lib/
│   ├── public/
│   └── package.json
└── README.md
```

## Development

### Running Tests
```bash
cd backend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Code Quality
- **Linting**: `npm run lint` (frontend)
- **Type Checking**: TypeScript compilation
- **Pre-commit Hooks**: Consider adding Husky for code quality checks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@seeker-employer.com or join our Discord community.

## Roadmap

- [ ] Advanced search with AI-powered job matching
- [ ] Video interview integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Analytics dashboard for employers
- [ ] Referral program

