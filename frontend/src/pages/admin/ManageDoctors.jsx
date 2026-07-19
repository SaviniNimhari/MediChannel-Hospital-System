import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { 
  UserPlus, Trash2, Edit, Search, MapPin, Phone, Mail, Award, X, 
  User, Lock, Eye, EyeOff, Building2, CreditCard, Calendar, Clock,
  CheckCircle2, ChevronRight, Stethoscope, ArrowRight
} from 'lucide-react';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  // Separate states for time range to make it user-friendly
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', department_id: '', specialization: '', 
    qualification: '', phone: '', available_days: [], available_time: '', channeling_fee: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    document.title = "Manage Specialists | MediChannel Admin";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/departments')
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day) 
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine the time pickers into the clinical string format
    const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    
    const payload = {
      ...formData,
      available_days: formData.available_days.join(', '),
      available_time: timeRange
    };

    try {
      if (isEditing) {
        await API.put(`/doctors/${currentId}`, payload);
      } else {
        await API.post('/doctors', payload);
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving doctor details');
    }
  };

  const handleEdit = (doc) => {
    setIsEditing(true);
    setCurrentId(doc.doctor_id);
    
    // Try to parse existing time string if it exists
    if (doc.available_time && doc.available_time.includes(' - ')) {
       // Note: In a real app we'd need more complex parsing for 12h to 24h conversion
       // but for this demo we will reset to defaults or keep as is
    }

    setFormData({
      full_name: doc.full_name,
      email: doc.email,
      password: '',
      department_id: doc.department_id,
      specialization: doc.specialization,
      qualification: doc.qualification,
      phone: doc.phone || '',
      available_days: doc.available_days ? doc.available_days.split(', ') : [],
      available_time: doc.available_time || '',
      channeling_fee: doc.channeling_fee
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this specialist from the registry?')) {
      await API.delete(`/doctors/${id}`);
      fetchData();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ full_name: '', email: '', password: '', department_id: '', specialization: '', qualification: '', phone: '', available_days: [], available_time: '', channeling_fee: '' });
  };

  const filteredDoctors = doctors.filter(d => 
    d.full_name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Medical Specialists</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Registry of active consultants and their clinical performance.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.2)' }}>
            <UserPlus size={20} /> Register Specialist
          </button>
        </div>

        {/* Smart Search Card */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.25rem', background: 'white' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={22} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '3.5rem', height: '60px', fontSize: '1.1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} 
              placeholder="Filter by name, specialization, or department ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem' }}>SPECIALIST IDENTITY</th>
                  <th style={{ padding: '1.25rem' }}>CLINICAL WING</th>
                  <th style={{ padding: '1.25rem' }}>ACTIVE SCHEDULE</th>
                  <th style={{ padding: '1.25rem' }}>FEE (LKR)</th>
                  <th style={{ padding: '1.25rem', textAlign: 'right' }}>COMMANDS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.doctor_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: 'white', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.4rem' }}>
                          {doc.full_name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' }}>Dr. {doc.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{doc.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <Building2 size={14} color="#64748b" />
                        {doc.department_name}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#475569' }}>{doc.available_days || 'Not Set'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{doc.available_time || 'Check availability'}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: '900', color: '#1e293b', fontSize: '1.2rem' }}>{doc.channeling_fee}</div>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(doc)} className="btn-icon" style={{ background: '#f1f5f9', color: '#1e293b', padding: '0.6rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(doc.doctor_id)} className="btn-icon" style={{ background: '#fef2f2', color: '#ef4444', padding: '0.6rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
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

      {/* --- REDESIGNED SMART FORM MODAL --- */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="card page-fade-in" style={{ width: '100%', maxWidth: '850px', maxHeight: '95vh', overflowY: 'auto', padding: 0, borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '2.5rem', color: 'white', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: '#0d9488', padding: '1rem', borderRadius: '1.25rem' }}>
                  <Stethoscope size={32} />
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.03em' }}>{isEditing ? 'Modify Consultant' : 'Register Specialist'}</h2>
                  <p style={{ opacity: 0.6, fontSize: '1rem' }}>Enter clinical credentials and operational schedule.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* SECTION 1: Personal & Access */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                   <User size={18} color="#0d9488" />
                   <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Identity & Security</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                   <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Full Legal Name</label>
                      <input type="text" className="form-input" style={{ background: '#f8fafc' }} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required placeholder="e.g. Dr. Sarah Jenkins" />
                   </div>
                   <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                      <input type="email" className="form-input" style={{ background: '#f8fafc' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="doctor@medichannel.com" />
                   </div>
                   <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Portal Password</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? 'text' : 'password'} className="form-input" style={{ background: '#f8fafc', paddingRight: '3rem' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditing} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                   </div>
                </div>
              </div>

              {/* SECTION 2: Clinical Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                   <Award size={18} color="#0d9488" />
                   <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Clinical Affiliation</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                   <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Department Wing</label>
                      <select className="form-input" style={{ background: '#f8fafc' }} value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} required>
                        <option value="">Assign to Wing</option>
                        {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                      </select>
                   </div>
                   <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Specialization</label>
                      <input type="text" className="form-input" style={{ background: '#f8fafc' }} value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Cardiologist" />
                   </div>
                   <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Medical Qualifications</label>
                      <input type="text" className="form-input" style={{ background: '#f8fafc' }} value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g. MBBS, FRCP (London)" />
                   </div>
                </div>
              </div>

              {/* SECTION 3: Availability Engine */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                   <Calendar size={18} color="#0d9488" />
                   <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Availability & Logistics</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Active Channeling Days</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            style={{
                              padding: '0.75rem 1.25rem',
                              borderRadius: '1rem',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              border: '2px solid',
                              transition: 'all 0.2s ease',
                              background: formData.available_days.includes(day) ? '#0d9488' : 'white',
                              borderColor: formData.available_days.includes(day) ? '#0d9488' : '#e2e8f0',
                              color: formData.available_days.includes(day) ? 'white' : '#64748b',
                              boxShadow: formData.available_days.includes(day) ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                            }}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                   </div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Operating Time Slot</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8' }}>FROM</span>
                              <input 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)} 
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: '700', fontSize: '1rem', color: '#1e293b' }} 
                              />
                           </div>
                           <ArrowRight size={16} color="#0d9488" />
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8' }}>TO</span>
                              <input 
                                type="time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)} 
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: '700', fontSize: '1rem', color: '#1e293b' }} 
                              />
                           </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Channeling Fee (LKR)</label>
                        <div style={{ position: 'relative' }}>
                          <CreditCard style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                          <input type="number" className="form-input" style={{ background: '#f8fafc', paddingLeft: '3rem' }} value={formData.channeling_fee} onChange={e => setFormData({...formData, channeling_fee: e.target.value})} required />
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '64px', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: '800', boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.4)' }}>
                  {isEditing ? 'Update Specialist Profile' : 'Commit Registry Entry'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-outline" style={{ flex: 1, height: '64px', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: '700', color: '#64748b' }}>
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageDoctors;

