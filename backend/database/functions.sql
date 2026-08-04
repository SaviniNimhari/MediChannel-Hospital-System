-- ============================================================
-- Database Stored Functions
-- Hospital Management System
-- ============================================================

-- 1. Get total amount spent by a specific patient
CREATE OR REPLACE FUNCTION fn_get_patient_total_spent(p_patient_id INT)
RETURNS NUMERIC AS $$
DECLARE
    total_spent NUMERIC;
BEGIN
    SELECT COALESCE(SUM(amount), 0.00) INTO total_spent
    FROM payments
    WHERE patient_id = p_patient_id AND payment_status = 'Paid';
    
    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- 2. Get appointment count for a doctor on a specific date
CREATE OR REPLACE FUNCTION fn_get_doctor_appointment_count(p_doctor_id INT, p_date DATE)
RETURNS INT AS $$
DECLARE
    appt_count INT;
BEGIN
    SELECT COUNT(*) INTO appt_count
    FROM appointments
    WHERE doctor_id = p_doctor_id 
      AND appointment_date = p_date 
      AND appointment_status != 'Cancelled';
      
    RETURN appt_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Check if a doctor is available at a given date & time
CREATE OR REPLACE FUNCTION fn_is_doctor_available(p_doctor_id INT, p_date DATE, p_time TIME)
RETURNS BOOLEAN AS $$
DECLARE
    is_taken BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM appointments
        WHERE doctor_id = p_doctor_id
          AND appointment_date = p_date
          AND appointment_time = p_time
          AND appointment_status IN ('Pending', 'Confirmed')
    ) INTO is_taken;
    
    RETURN NOT is_taken;
END;
$$ LANGUAGE plpgsql;

-- 4. Get total number of doctors in a department
CREATE OR REPLACE FUNCTION fn_get_dept_doctor_count(p_department_id INT)
RETURNS INT AS $$
DECLARE
    doc_count INT;
BEGIN
    SELECT COUNT(*) INTO doc_count
    FROM doctors
    WHERE department_id = p_department_id;
    
    RETURN doc_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Get current status of an appointment
CREATE OR REPLACE FUNCTION fn_get_appointment_status(p_appointment_id INT)
RETURNS VARCHAR AS $$
DECLARE
    curr_status VARCHAR(20);
BEGIN
    SELECT appointment_status INTO curr_status
    FROM appointments
    WHERE appointment_id = p_appointment_id;
    
    RETURN curr_status;
END;
$$ LANGUAGE plpgsql;
