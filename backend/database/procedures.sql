-- ============================================================
-- Database Stored Procedures with Transaction Control
-- Hospital Management System
-- ============================================================

-- 1. Book an Appointment (with Explicit Transaction COMMIT / ROLLBACK)
CREATE OR REPLACE PROCEDURE sp_book_appointment( 
    p_patient_id INT,  
    p_doctor_id INT,  
    p_appt_date DATE,  
    p_appt_time TIME,  
    p_reason TEXT 
) 
AS $$ 
BEGIN 
    IF NOT fn_is_doctor_available(p_doctor_id, p_appt_date, p_appt_time) THEN 
        RAISE EXCEPTION 'Doctor is not available at this time.'; 
    END IF; 
 
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_status, reason) 
    VALUES (p_patient_id, p_doctor_id, p_appt_date, p_appt_time, 'Pending', p_reason); 
     
    COMMIT; -- Explicit transaction commit 
EXCEPTION 
    WHEN OTHERS THEN 
        ROLLBACK; -- Explicit atomic rollback 
        RAISE; 
END; 
$$ LANGUAGE plpgsql; 

-- 2. Cancel an Appointment
CREATE OR REPLACE PROCEDURE sp_cancel_appointment(p_appt_id INT) 
AS $$ 
BEGIN 
    UPDATE appointments  
    SET appointment_status = 'Cancelled'  
    WHERE appointment_id = p_appt_id; 
     
    UPDATE payments  
    SET payment_status = 'Failed'  
    WHERE appointment_id = p_appt_id AND payment_status = 'Pending'; 
END; 
$$ LANGUAGE plpgsql; 

-- 3. Process Payment and Confirm Appointment (Atomic Multi-table Update)
CREATE OR REPLACE PROCEDURE sp_process_payment(p_payment_id INT, p_method VARCHAR) 
AS $$ 
BEGIN 
    UPDATE payments  
    SET payment_status = 'Paid', payment_method = p_method, payment_date = CURRENT_TIMESTAMP 
    WHERE payment_id = p_payment_id; 
     
    -- Automatically confirm the associated appointment
    UPDATE appointments  
    SET appointment_status = 'Confirmed' 
    WHERE appointment_id = (SELECT appointment_id FROM payments WHERE payment_id = p_payment_id); 
END; 
$$ LANGUAGE plpgsql; 

-- 4. Append to Patient Medical History
CREATE OR REPLACE PROCEDURE sp_update_medical_history(p_patient_id INT, p_new_record TEXT) 
AS $$ 
BEGIN 
    UPDATE patients  
    SET medical_history = COALESCE(medical_history, '') || CHR(10) || CURRENT_DATE::TEXT || ': ' || p_new_record 
    WHERE patient_id = p_patient_id; 
END; 
$$ LANGUAGE plpgsql; 

-- 5. Complete an Appointment
CREATE OR REPLACE PROCEDURE sp_complete_appointment(p_appt_id INT) 
AS $$ 
BEGIN 
    UPDATE appointments  
    SET appointment_status = 'Completed'  
    WHERE appointment_id = p_appt_id; 
END; 
$$ LANGUAGE plpgsql; 
