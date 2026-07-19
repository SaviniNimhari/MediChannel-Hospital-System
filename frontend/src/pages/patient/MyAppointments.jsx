import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, FileText, XCircle } from 'lucide-react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/appointments/patient/${user.profile_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.profile_id]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await API.put(`/appointments/${id}`, { appointment_status: 'Cancelled' });
        fetchAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>My Appointments</h1>
        <p style={{ color: 'var(--text-muted)' }}>History and status of your channelings</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {appointments.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>No appointments found</h3>
              <p style={{ color: 'var(--text-muted)' }}>You haven't booked any appointments yet.</p>
            </div>
          )}
          {appointments.map((app) => (
            <div key={app.appointment_id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Doctor</p>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Dr. {app.doctor_name}</p>
                  <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{app.department_name}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Date & Time</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(app.appointment_date).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {app.appointment_time}</div>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Status</p>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    backgroundColor: app.appointment_status === 'Confirmed' ? '#dcfce7' : app.appointment_status === 'Pending' ? '#fef3c7' : '#fee2e2',
                    color: app.appointment_status === 'Confirmed' ? '#166534' : app.appointment_status === 'Pending' ? '#92400e' : '#991b1b'
                  }}>
                    {app.appointment_status}
                  </span>
                </div>
              </div>
              <div>
                {(app.appointment_status === 'Pending' || app.appointment_status === 'Confirmed') && (
                  <button onClick={() => handleCancel(app.appointment_id)} className="btn" style={{ color: 'var(--danger)' }}>
                    <XCircle size={20} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyAppointments;
