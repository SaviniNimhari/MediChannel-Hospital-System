import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Placeholder = ({ title }) => (
  <DashboardLayout>
    <h1>{title}</h1>
    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>This module is currently being optimized. Please check back later.</p>
  </DashboardLayout>
);

export const ManagePatients = () => <Placeholder title="Manage Patients" />;
export const ManageDepartments = () => <Placeholder title="Manage Departments" />;
export const ManageAppointments = () => <Placeholder title="Manage Appointments" />;
export const ManagePayments = () => <Placeholder title="Manage Payments" />;
export const DoctorAppointments = () => <Placeholder title="Doctor Appointments" />;
export const DoctorProfile = () => <Placeholder title="Doctor Profile" />;
export const PatientProfile = () => <Placeholder title="Patient Profile" />;
export const PatientPayments = () => <Placeholder title="My Payments" />;
