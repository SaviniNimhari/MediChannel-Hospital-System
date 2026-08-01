# Hospital Management System with E-Channelling

A full-stack web application built with React, Node.js, Express, and PostgreSQL.

## Features
- **Role-based Authentication**: Admin, Doctor, and Patient roles. 
- **E-Channelling**: Patients can search for doctors by specialization and book appointments.
- **Admin Dashboard**: Manage doctors, patients, departments, and view hospital stats.
- **Doctor Dashboard**: Manage daily schedules and patient appointments.
- **Patient Dashboard**: View appointment history and book new sessions.
- **Simulated Payment**: Integrated payment flow for appointment confirmation.
- **Premium UI**: Modern, responsive design with a clean healthcare aesthetic.

## Tech Stack
- **Frontend**: React, React Router, Axios, Lucide-React.
- **Backend**: Node.js, Express.js, PostgreSQL (pg).
- **Security**: JWT Authentication, Bcrypt password hashing.

## Setup Instructions

### 1. Database Setup
1. Install PostgreSQL on your machine.
2. Create a database named `hospital_management_db`.
3. Run the schema script:
   ```bash
   psql -U postgres -d hospital_management_db -f backend/database/schema.sql
   ```
4. Run the seed script:
   ```bash
   psql -U postgres -d hospital_management_db -f backend/database/seed.sql
   ```

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hospital_management_db
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Sample Credentials
To get started, you can register a new patient via the UI or manually add an admin to the database:
- **Registration**: Use the `/register` page to create a patient account.
- **Admin**: Manually insert an admin user into the `users` table to access the admin dashboard.

## PostgreSQL Queries Used
- **JOINS**: Used to link appointments with doctor and patient details.
- **Aggregates**: Used for dashboard statistics (Total revenue, patient counts).
- **Filters**: Search doctors by specialization or department name.
