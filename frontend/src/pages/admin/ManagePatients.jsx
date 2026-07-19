import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { UserPlus, Search, Mail, Phone, Trash2, Edit, X, Activity } from 'lucide-react';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', age: '', gender: 'Male', phone: '', address: '', medical_history: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    document.title = "Patients | MediChannel Admin";
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/patients/${currentId}`, formData);
      } else {
        await API.post('/patients', formData);
      }
      closeModal();
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing request');
    }
  };

  const handleEdit = (patient) => {
    setIsEditing(true);
    setCurrentId(patient.patient_id);
    setFormData({
      full_name: patient.full_name,
      email: patient.email,
      password: '',
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      medical_history: patient.medical_history
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('This will permanently delete the patient record and their account. Continue?')) {
      await API.delete(`/patients/${id}`);
      fetchPatients();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ full_name: '', email: '', password: '', age: '', gender: 'Male', phone: '', address: '', medical_history: '' });
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) || 
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Patient Directory</h1>
            <p style={{ color: 'var(--text-muted)' }}>Overview of all registered patients in the system.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <UserPlus size={20} /> Register Patient
          </button>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '52px', height: '56px' }} 
              placeholder="Search by patient name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Contact Information</th>
                  <th>History</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p.patient_id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{p.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #PA-{p.patient_id}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.95rem' }}>{p.age} Yrs</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.gender}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <Mail size={14} color="var(--text-muted)" /> {p.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <Phone size={14} color="var(--text-muted)" /> {p.phone}
                      </div>
                    </td>
                    <td>
                       <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                         {p.medical_history ? `${p.medical_history.substring(0, 30)}...` : 'No history'}
                       </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(p)} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none', background: '#f1f5f9' }}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.patient_id)} className="btn" style={{ padding: '0.5rem', background: '#fef2f2', color: 'var(--danger)' }}>
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

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card page-fade-in" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{isEditing ? 'Edit Patient File' : 'New Patient Intake'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Legal Name</label>
                <input type="text" className="form-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password {isEditing && '(Leave blank)'}</label>
                <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditing} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Medical History Summary</label>
                <textarea className="form-input" rows="4" value={formData.medical_history} onChange={e => setFormData({...formData, medical_history: e.target.value})} placeholder="Known allergies, conditions, etc."></textarea>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '54px' }}>{isEditing ? 'Save Changes' : 'Register Patient'}</button>
                <button type="button" onClick={closeModal} className="btn btn-outline" style={{ flex: 1, height: '54px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManagePatients;
