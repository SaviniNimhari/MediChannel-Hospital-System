-- Enable Row-Level Security on critical tables 
ALTER TABLE patients ENABLE ROW LEVEL SECURITY; 
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY; 
ALTER TABLE payments ENABLE ROW LEVEL SECURITY; 

-- Drop existing policies if any to allow safe re-execution
DROP POLICY IF EXISTS patient_profile_policy ON patients;
DROP POLICY IF EXISTS appointment_access_policy ON appointments;
DROP POLICY IF EXISTS payment_access_policy ON payments;

-- 1. Patients Table Security Policies 
CREATE POLICY patient_profile_policy ON patients 
    FOR ALL 
    USING ( 
        user_id = current_setting('app.current_user_id', true)::int 
        OR current_setting('app.current_user_role', true) IN ('Admin', 'Doctor') 
    ); 

-- 2. Appointments Table Security Policies 
CREATE POLICY appointment_access_policy ON appointments 
    FOR ALL 
    USING ( 
        patient_id = (SELECT patient_id FROM patients WHERE user_id = current_setting('app.current_user_id', true)::int) 
        OR doctor_id = (SELECT doctor_id FROM doctors WHERE user_id = current_setting('app.current_user_id', true)::int) 
        OR current_setting('app.current_user_role', true) = 'Admin' 
    ); 

-- 3. Payments Table Security Policies 
CREATE POLICY payment_access_policy ON payments 
    FOR ALL 
    USING ( 
        patient_id = (SELECT patient_id FROM patients WHERE user_id = current_setting('app.current_user_id', true)::int) 
        OR current_setting('app.current_user_role', true) = 'Admin' 
    ); 
