import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Search, User, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorsListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get(search ? `/doctors/search?specialization=${search}` : '/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [search]);

  return (
    <div className="main-content">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Find Your Specialist</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Quality care from verified doctors across all departments.</p>
        
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '48px', height: '60px', fontSize: '1.1rem', boxShadow: 'var(--shadow-lg)' }}
            placeholder="Search by specialization or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading doctors...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {doctors.map((doctor) => (
            <div key={doctor.doctor_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: '#f1f5f9', width: '100px', height: '100px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <User size={50} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Dr. {doctor.full_name}</h3>
                  <span style={{ background: '#eff6ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                    {doctor.specialization}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <Calendar size={16} /> {doctor.available_days}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <Clock size={16} /> {doctor.available_time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <DollarSign size={16} /> Fee: LKR {doctor.channeling_fee}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <MapPin size={16} /> {doctor.department_name}
                </div>
              </div>

              <Link to={`/patient/book?doctor_id=${doctor.doctor_id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {doctors.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No doctors found for your search.
        </div>
      )}
    </div>
  );
};

export default DoctorsListing;
