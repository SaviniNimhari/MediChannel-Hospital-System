import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Briefcase, Award, Phone, Mail, Clock, Calendar, Save } from 'lucide-react';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/doctors/${user.profile_id}`);
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
      await API.put(`/doctors/${user.profile_id}`, formData);
      setProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Professional Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your specializations and availability</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-outline">
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px' }}
                  value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <div style={{ position: 'relative' }}>
                <Briefcase style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px' }}
                  value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Qualification</label>
              <div style={{ position: 'relative' }}>
                <Award style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px' }}
                  value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Availability Days</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Mon, Wed, Fri"
                  value={formData.available_days} onChange={e => setFormData({...formData, available_days: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Time</label>
              <div style={{ position: 'relative' }}>
                <Clock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" className="form-input" style={{ paddingLeft: '40px' }}
                  placeholder="e.g. 09:00 AM - 05:00 PM"
                  value={formData.available_time} onChange={e => setFormData({...formData, available_time: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input 
                type="number" className="form-input"
                value={formData.channeling_fee} onChange={e => setFormData({...formData, channeling_fee: e.target.value})}
                disabled={!editing}
              />
            </div>
          </div>
        </div>

        {editing && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Save size={20} /> Save Professional Details
            </button>
            <button type="button" onClick={() => { setEditing(false); setFormData(profile); }} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </DashboardLayout>
  );
};

export default DoctorProfile;
