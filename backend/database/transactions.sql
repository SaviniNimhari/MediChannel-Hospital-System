-- ============================================================
-- Database Transactions Test Script
-- Hospital Management System
-- ============================================================

-- ------------------------------------------------------------
-- 01. Transaction Test: Booking Appointment with Commit / Rollback
-- ------------------------------------------------------------
CALL sp_book_appointment(
    (SELECT MIN(patient_id) FROM patients), 
    (SELECT MIN(doctor_id) FROM doctors), 
    '2026-11-20', 
    '10:00:00', 
    'Annual Checkup'
);

SELECT * FROM appointments WHERE reason = 'Annual Checkup';


-- ------------------------------------------------------------
-- 02. Transaction Test: Cancel Appointment
-- ------------------------------------------------------------
-- Update trigger to allow status changes to Cancelled cleanly
CREATE OR REPLACE FUNCTION trg_func_prevent_double_booking() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.appointment_status IN ('Pending', 'Confirmed') THEN
        IF EXISTS (
            SELECT 1 FROM appointments 
            WHERE doctor_id = NEW.doctor_id
            AND appointment_date = NEW.appointment_date
            AND appointment_time = NEW.appointment_time
            AND appointment_id != COALESCE(NEW.appointment_id, 0)
            AND appointment_status IN ('Pending', 'Confirmed')
        ) THEN
            RAISE EXCEPTION 'Double booking detected for this doctor at the specified time.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CALL sp_cancel_appointment((SELECT MIN(appointment_id) FROM appointments));
SELECT appointment_id, appointment_status FROM appointments ORDER BY appointment_id ASC LIMIT 1;


-- ------------------------------------------------------------
-- 03. Transaction Test: Process Payment & Auto-Confirm Appointment
-- ------------------------------------------------------------
CALL sp_process_payment((SELECT MIN(payment_id) FROM payments), 'Card');
SELECT * FROM payments ORDER BY payment_id ASC LIMIT 1;


-- ------------------------------------------------------------
-- 04. Transaction Test: Update Patient Medical History
-- ------------------------------------------------------------
CALL sp_update_medical_history(
    (SELECT MIN(patient_id) FROM patients), 
    'Patient reported mild headaches. Prescribed rest.'
);
SELECT patient_id, full_name, medical_history FROM patients ORDER BY patient_id ASC LIMIT 1;


-- ------------------------------------------------------------
-- 05. Transaction Test: Complete Appointment
-- ------------------------------------------------------------
CALL sp_complete_appointment((SELECT MIN(appointment_id) FROM appointments));
SELECT appointment_id, appointment_status FROM appointments ORDER BY appointment_id ASC LIMIT 1;
