import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, FileText, Save, Activity, Heart, ShieldAlert } from 'lucide-react';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/patients/${user.profile_id}`);
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.profile_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/patients/${user.profile_id}`, formData);
      setProfile(res.data);
      setEditing(false);
      alert('Profile & Medical History updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (loading) return <DashboardLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Syncing medical profile...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal and medical information</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '700' }}>
            Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: editing ? '1fr' : '1.2fr 0.8fr', gap: '2.5rem' }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--accent)' }}>
             <User size={24} />
             <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Personal Information</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px', background: editing ? 'white' : '#f8fafc' }}
                  value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input 
                type="number" className="form-input" style={{ background: editing ? 'white' : '#f8fafc' }}
                value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                className="form-input" style={{ background: editing ? 'white' : '#f8fafc' }}
                value={formData.gender || 'Male'} onChange={e => setFormData({...formData, gender: e.target.value})}
                disabled={!editing}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px', background: editing ? 'white' : '#f8fafc' }}
                  value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={18} />
                <textarea 
                  className="form-input" style={{ paddingLeft: '40px', background: editing ? 'white' : '#f8fafc' }} rows="3"
                  value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})}
                  disabled={!editing}
                ></textarea>
              </div>
            </div>

            {editing && (
              <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#dc2626' }}>
                   <ShieldAlert size={20} />
                   <label className="form-label" style={{ marginBottom: 0, fontWeight: '900' }}>MEDICAL HISTORY & ALLERGIES</label>
                </div>
                <textarea 
                  className="form-input" style={{ minHeight: '150px', borderColor: '#fecaca', background: '#fff1f1' }} 
                  placeholder="List any chronic conditions, allergies, or past surgeries..."
                  value={formData.medical_history || ''} onChange={e => setFormData({...formData, medical_history: e.target.value})}
                ></textarea>
              </div>
            )}
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '56px', borderRadius: '1rem', fontWeight: '800' }}>
                <Save size={20} /> Save Everything
              </button>
              <button type="button" onClick={() => { setEditing(false); setFormData(profile); }} className="btn btn-outline" style={{ flex: 1, height: '56px', borderRadius: '1rem', fontWeight: '800' }}>
                Cancel
              </button>
            </div>
          )}
        </form>

        {!editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                <FileText size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Clinical Background</h3>
              </div>
              <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', minHeight: '220px', color: '#475569', lineHeight: '1.6' }}>
                {profile.medical_history ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{profile.medical_history}</div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
                    <Activity size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No medical history recorded yet.</p>
                  </div>
                )}
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={14} color="#dc2626" /> Last clinical update: {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
               <h4 style={{ fontWeight: '800', color: '#0369a1', marginBottom: '0.5rem' }}>Digital Health ID</h4>
               <p style={{ fontSize: '0.85rem', color: '#0c4a6e' }}>This information is shared with your consulting specialists to provide accurate care.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
