import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { Building2, Plus, Trash2, Edit, X, Info } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ department_name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    document.title = "Departments | MediChannel Admin";
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/departments/${editingId}`, formData);
      } else {
        await API.post('/departments', formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ department_name: '', description: '' });
      fetchDepartments();
    } catch (err) {
      alert('Error saving department');
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.department_id);
    setFormData({ department_name: dept.department_name, description: dept.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will affect doctors assigned to this department.')) {
      await API.delete(`/departments/${id}`);
      fetchDepartments();
    }
  };

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Medical Departments</h1>
            <p style={{ color: 'var(--text-muted)' }}>Configure hospital wings and clinical specializations.</p>
          </div>
          <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({department_name: '', description: ''}); }} className="btn btn-primary">
            <Plus size={20} /> New Department
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {departments.map((dept) => (
            <div key={dept.department_id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '1rem', borderRadius: '1.25rem' }}>
                  <Building2 size={32} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button onClick={() => handleEdit(dept)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}><Edit size={18} /></button>
                   <button onClick={() => handleDelete(dept.department_id)} style={{ color: 'var(--danger)', background: 'none', border: 'none' }}><Trash2 size={18} /></button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>{dept.department_name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1, marginBottom: '2rem', lineHeight: '1.7' }}>
                {dept.description || 'Dedicated medical facility providing specialized care and innovative treatments.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '700' }}>
                <Info size={16} /> {dept.doctor_count || 0} Active Specialists
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card page-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{editingId ? 'Edit Department' : 'New Department'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ height: '54px' }}
                  value={formData.department_name} 
                  onChange={e => setFormData({...formData, department_name: e.target.value})} 
                  required 
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows="4"
                  placeholder="Briefly describe the clinical focus..."
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '54px' }}>Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1, height: '54px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageDepartments;
