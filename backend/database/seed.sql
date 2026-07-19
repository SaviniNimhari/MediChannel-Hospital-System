-- Seed Data for Hospital Management System

-- Insert Departments
INSERT INTO departments (department_name, description) VALUES
('Cardiology', 'Heart and blood vessel related healthcare.'),
('Neurology', 'Brain and nervous system related healthcare.'),
('Pediatrics', 'Healthcare for children and infants.'),
('Orthopedics', 'Musculoskeletal system related healthcare.'),
('Dermatology', 'Skin related healthcare.');

-- Note: Users, Patients, and Doctors should be registered via the application 
-- to ensure passwords are correctly hashed with bcrypt.
-- However, for demonstration, here is how you might insert a sample admin (password: password123)
-- INSERT INTO users (full_name, email, password, role) VALUES 
-- ('Admin User', 'admin@hospital.com', '$2b$10$H2nZ2X2nZ2X2nZ2X2nZ2X.6jHkK7/P.v.S.y.R.v.E.A.C.H', 'Admin');
