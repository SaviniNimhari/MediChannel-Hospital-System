import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { Calendar, Trash2, CheckCircle, XCircle, Search, Filter, Clock, User } from 'lucide-react';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    document.title = "Appointments | MediChannel Admin";
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { appointment_status: status });
      fetchAppointments();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment record?')) {
      await API.delete(`/appointments/${id}`);
      fetchAppointments();
    }
  };

  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.appointment_status === filter);

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Schedule Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Monitor and control all clinical sessions.</p>
          </div>
          <select 
            className="form-input" 
            style={{ width: '200px', height: '48px' }} 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Appointments</option>
            <option value="Pending">Pending Approval</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient Info</th>
                  <th>Medical Specialist</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.appointment_id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{app.patient_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.patient_phone || 'No phone'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--accent)' }}>Dr. {app.doctor_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.specialization || 'Consultant'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <Calendar size={14} color="var(--text-muted)" /> {new Date(app.appointment_date).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Clock size={14} /> {app.appointment_time}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.35rem 0.85rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: app.appointment_status === 'Confirmed' ? '#ecfdf5' : app.appointment_status === 'Pending' ? '#fffbeb' : '#fef2f2',
                        color: app.appointment_status === 'Confirmed' ? '#065f46' : app.appointment_status === 'Pending' ? '#92400e' : '#991b1b'
                      }}>
                        {app.appointment_status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        {app.appointment_status === 'Pending' && (
                          <button onClick={() => handleUpdateStatus(app.appointment_id, 'Confirmed')} className="btn" style={{ padding: '0.5rem', background: '#ecfdf5', color: '#10b981' }} title="Confirm">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {app.appointment_status !== 'Cancelled' && app.appointment_status !== 'Completed' && (
                          <button onClick={() => handleUpdateStatus(app.appointment_id, 'Cancelled')} className="btn" style={{ padding: '0.5rem', background: '#fffbeb', color: '#f59e0b' }} title="Cancel">
                            <XCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(app.appointment_id)} className="btn" style={{ padding: '0.5rem', background: '#fef2f2', color: 'var(--danger)' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageAppointments;
