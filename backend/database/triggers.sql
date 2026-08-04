-- ============================================================
-- Database Triggers & Audit Log Setup
-- Hospital Management System
-- ============================================================

-- ------------------------------------------------------------
-- 01. Trigger: Auto-create Payment Invoice on Appointment Insert
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_func_auto_create_payment() RETURNS TRIGGER AS $$
DECLARE
    doc_fee NUMERIC(10,2);
BEGIN
    SELECT channeling_fee INTO doc_fee FROM doctors WHERE doctor_id = NEW.doctor_id;
    INSERT INTO payments (appointment_id, patient_id, amount, payment_method, payment_status)
    VALUES (NEW.appointment_id, NEW.patient_id, COALESCE(doc_fee, 50.00), 'Card', 'Pending');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_appointment_insert ON appointments;
CREATE TRIGGER trg_after_appointment_insert
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION trg_func_auto_create_payment();


-- ------------------------------------------------------------
-- 02. Trigger: Prevent Double-Booking
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_func_prevent_double_booking() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM appointments
        WHERE doctor_id = NEW.doctor_id
          AND appointment_date = NEW.appointment_date
          AND appointment_time = NEW.appointment_time
          AND appointment_status IN ('Pending', 'Confirmed')
          AND appointment_id IS DISTINCT FROM NEW.appointment_id
    ) THEN
        RAISE EXCEPTION 'Doctor is already booked for this date and time.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_before_appointment_insert ON appointments;
CREATE TRIGGER trg_before_appointment_insert
BEFORE INSERT OR UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION trg_func_prevent_double_booking();


-- ------------------------------------------------------------
-- 03. Trigger: Prevent Doctor Deletion if Active Appointments Exist
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_func_prevent_doc_deletion() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM appointments 
        WHERE doctor_id = OLD.doctor_id
          AND appointment_status IN ('Pending', 'Confirmed')
    ) THEN
        RAISE EXCEPTION 'Cannot delete doctor. They still have pending or confirmed appointments.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_before_doctor_delete ON doctors;
CREATE TRIGGER trg_before_doctor_delete
BEFORE DELETE ON doctors
FOR EACH ROW
EXECUTE FUNCTION trg_func_prevent_doc_deletion();


-- ------------------------------------------------------------
-- 04. Trigger & Audit Log: Track Appointment Status Changes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointment_audit_log ( 
    log_id SERIAL PRIMARY KEY, 
    appointment_id INT, 
    old_status VARCHAR(20), 
    new_status VARCHAR(20), 
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

CREATE OR REPLACE FUNCTION trg_func_audit_appt_status() RETURNS TRIGGER AS $$ 
BEGIN 
    IF OLD.appointment_status IS DISTINCT FROM NEW.appointment_status THEN 
        INSERT INTO appointment_audit_log (appointment_id, old_status, new_status) 
        VALUES (NEW.appointment_id, OLD.appointment_status, NEW.appointment_status); 
    END IF; 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

DROP TRIGGER IF EXISTS trg_after_appointment_update ON appointments;
CREATE TRIGGER trg_after_appointment_update 
AFTER UPDATE ON appointments 
FOR EACH ROW 
EXECUTE FUNCTION trg_func_audit_appt_status(); 


-- ------------------------------------------------------------
-- 05. Trigger: Validate Payment Amount
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_func_validate_payment() RETURNS TRIGGER AS $$ 
BEGIN 
    IF NEW.amount <= 0 THEN 
        RAISE EXCEPTION 'Payment amount must be greater than zero.'; 
    END IF; 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

DROP TRIGGER IF EXISTS trg_before_payment_update ON payments;
CREATE TRIGGER trg_before_payment_update 
BEFORE INSERT OR UPDATE ON payments 
FOR EACH ROW 
EXECUTE FUNCTION trg_func_validate_payment(); 
