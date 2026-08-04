-- ============================================================
-- DCL (Data Control Language) Setup Script
-- Hospital Management System
-- ============================================================

-- 1. Create Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hospital_admin') THEN
        CREATE ROLE hospital_admin;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hospital_doctor') THEN
        CREATE ROLE hospital_doctor;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hospital_patient') THEN
        CREATE ROLE hospital_patient;
    END IF;
END $$;

-- 2. Create Users with Login Passwords
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_user') THEN
        CREATE USER admin_user WITH LOGIN PASSWORD 'AdminPass123!';
    ELSE
        ALTER USER admin_user WITH LOGIN PASSWORD 'AdminPass123!';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dr_smith') THEN
        CREATE USER dr_smith WITH LOGIN PASSWORD 'DocPass123!';
    ELSE
        ALTER USER dr_smith WITH LOGIN PASSWORD 'DocPass123!';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'patient_doe') THEN
        CREATE USER patient_doe WITH LOGIN PASSWORD 'PatPass123!';
    ELSE
        ALTER USER patient_doe WITH LOGIN PASSWORD 'PatPass123!';
    END IF;
END $$;

-- 3. Assign Roles to Users
GRANT hospital_admin TO admin_user;
GRANT hospital_doctor TO dr_smith;
GRANT hospital_patient TO patient_doe;

-- 4. Object Privileges: hospital_patient
GRANT SELECT ON doctors, departments TO hospital_patient;
GRANT SELECT, INSERT ON appointments TO hospital_patient;
GRANT SELECT ON payments TO hospital_patient;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hospital_patient;

-- 5. Object Privileges: hospital_doctor
GRANT SELECT ON departments, doctors, payments TO hospital_doctor;
GRANT SELECT, UPDATE ON appointments TO hospital_doctor;
GRANT SELECT, UPDATE(medical_history) ON patients TO hospital_doctor;

-- 6. System & Object Privileges: hospital_admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hospital_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hospital_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO hospital_admin;
GRANT ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA public TO hospital_admin;

ALTER ROLE hospital_admin CREATEROLE CREATEDB;
