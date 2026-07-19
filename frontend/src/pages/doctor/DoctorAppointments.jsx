import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Clock, User, Phone, Eye, Calendar, 
  ChevronRight, Search, Activity, Heart, X, FileText,
  UserCircle, MessageSquare
} from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'completed'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/appointments/doctor/${user.profile_id}`);
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

  const handleComplete = async (id) => {
    try {
      await API.put(`/appointments/${id}`, { appointment_status: 'Completed' });
      fetchAppointments();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const queue = appointments.filter(a => a.appointment_status !== 'Completed' && a.appointment_status !== 'Cancelled');
  const completed = appointments.filter(a => a.appointment_status === 'Completed');

  const groupByDate = (data) => {
    return data.reduce((groups, appt) => {
      const date = new Date(appt.appointment_date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(appt);
      return groups;
    }, {});
  };

  const currentList = activeTab === 'queue' ? queue : completed;
  const groupedData = groupByDate(currentList);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="page-fade-in">
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#1e293b' }}>Clinical Appointments</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage your daily patient queue and medical records.</p>
          </div>
          
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '1rem', gap: '0.4rem' }}>
             <button 
               onClick={() => setActiveTab('queue')}
               style={{ 
                 padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem',
                 background: activeTab === 'queue' ? 'white' : 'transparent',
                 color: activeTab === 'queue' ? '#0d9488' : '#64748b',
                 boxShadow: activeTab === 'queue' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
               }}
             >Active Queue ({queue.length})</button>
             <button 
               onClick={() => setActiveTab('completed')}
               style={{ 
                 padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem',
                 background: activeTab === 'completed' ? 'white' : 'transparent',
                 color: activeTab === 'completed' ? '#0d9488' : '#64748b',
                 boxShadow: activeTab === 'completed' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
               }}
             >Completed ({completed.length})</button>
          </div>
        </div>

        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([date, appts]) => (
            <div key={date} style={{ marginBottom: '3rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#eff6ff', color: '#0d9488', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: '800', fontSize: '0.85rem' }}>
                    {date === new Date().toDateString() ? 'TODAY' : date}
                  </div>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
               </div>

               <div style={{ display: 'grid', gap: '1rem' }}>
                 {appts.map(app => (
                   <div key={app.appointment_id} className="card card-hover" style={{ display: 'grid', gridTemplateColumns: '1fr 200px 300px', alignItems: 'center', padding: '1.5rem 2.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#0d9488', border: '1px solid #e2e8f0' }}>{app.patient_name.charAt(0)}</div>
                        <div>
                           <h3 style={{ fontWeight: '800', fontSize: '1.15rem', color: '#1e293b' }}>{app.patient_name}</h3>
                           <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> {app.patient_phone || 'No phone'}</span>
                              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.age} Yrs â€¢ {app.gender}</span>
                           </div>
                        </div>
                     </div>

                     <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#1e293b', fontWeight: '700' }}>
                           <Clock size={18} color="#0d9488" /> {app.appointment_time.substring(0, 5)}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', marginTop: '0.25rem' }}>15-Min Clinical Slot</p>
                     </div>

                     <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setSelectedPatient(app)}
                          className="btn btn-outline" 
                          style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.75rem', fontWeight: '800' }}
                        >
                          <Eye size={16} /> View Record
                        </button>
                        {app.appointment_status === 'Confirmed' && (
                          <button 
                            onClick={() => handleComplete(app.appointment_id)} 
                            className="btn btn-primary" 
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.75rem', fontWeight: '800' }}
                          >
                            <CheckCircle size={16} /> Finish
                          </button>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc' }}>
            <Activity size={60} style={{ color: '#cbd5e1', marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#64748b', fontWeight: '800' }}>No appointments in this category</h3>
            <p style={{ color: '#94a3b8' }}>Your schedule is currently clear.</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="page-fade-in card" style={{ width: '700px', padding: 0, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
             <div style={{ background: '#1e293b', color: 'white', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '1rem' }}><UserCircle size={24} /></div>
                   <div>
                      <h3 style={{ fontWeight: '800', fontSize: '1.25rem' }}>Patient Clinical Record</h3>
                      <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>UID: PAT-{selectedPatient.patient_id}-{selectedPatient.age}</p>
                   </div>
                </div>
                <X style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setSelectedPatient(null)} />
             </div>
             
             <div style={{ padding: '2.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                   <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Patient Name</p>
                      <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedPatient.patient_name}</p>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Contact Info</p>
                      <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedPatient.patient_phone || 'No Contact Provided'}</p>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Age & Gender</p>
                      <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedPatient.age} Years â€¢ {selectedPatient.gender}</p>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Consultation Time</p>
                      <p style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0d9488' }}>{selectedPatient.appointment_time.substring(0, 5)}</p>
                   </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#1e293b' }}>
                      <MessageSquare size={20} color="#0d9488" />
                      <h4 style={{ fontWeight: '800', fontSize: '1rem' }}>Reason for Consultation</h4>
                   </div>
                   <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '1rem', color: '#0f766e', fontWeight: '600', lineHeight: 1.6, borderLeft: '4px solid #0d9488' }}>
                      {selectedPatient.reason || 'Patient did not provide a specific reason.'}
                   </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#dc2626' }}>
                      <Heart size={20} />
                      <h4 style={{ fontWeight: '800', fontSize: '1rem' }}>Medical History & Findings</h4>
                   </div>
                   <div style={{ background: '#fff1f1', padding: '1.5rem', borderRadius: '1rem', color: '#991b1b', lineHeight: 1.6, minHeight: '120px', whiteSpace: 'pre-wrap' }}>
                      {selectedPatient.medical_history || 'No medical history recorded for this patient.'}
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedPatient(null)} 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '2rem', height: '60px', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: '900' }}
                >
                  Close Record
                </button>
             </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorAppointments;

