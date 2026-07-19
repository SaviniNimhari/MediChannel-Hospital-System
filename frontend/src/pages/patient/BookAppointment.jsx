import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Clock, MessageSquare, CreditCard, User, 
  Stethoscope, MapPin, ChevronRight, CheckCircle2, 
  Search, ShieldCheck, Heart, AlertCircle, Info, Lock, XCircle, CalendarDays
} from 'lucide-react';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctor_id');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    doctor_id: doctorIdParam || '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    payment_method: 'Card'
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get('/doctors');
        setDoctors(res.data);
        if (doctorIdParam) {
          const doc = res.data.find(d => d.doctor_id == doctorIdParam);
          setSelectedDoctor(doc);
          setStep(2);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [doctorIdParam]);

  // Validation for Available Days
  useEffect(() => {
    if (formData.appointment_date && selectedDoctor) {
      const selectedDate = new Date(formData.appointment_date);
      const dayNameFull = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNameShort = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      const isAvailable = selectedDoctor.available_days.toLowerCase().includes(dayNameShort.toLowerCase());
      
      if (!isAvailable) {
        setDateError(`Dr. ${selectedDoctor.full_name} is not available on ${dayNameFull}s. Available days: ${selectedDoctor.available_days}`);
        setAvailableSlots([]);
      } else {
        setDateError('');
        fetchBookedSlots();
        generateAvailableSlots();
      }
    }
  }, [formData.appointment_date, selectedDoctor]);

  const fetchBookedSlots = async () => {
    setSlotsLoading(true);
    try {
      const res = await API.get(`/appointments/booked-slots/${selectedDoctor.doctor_id}`, {
        params: { date: formData.appointment_date }
      });
      setBookedSlots(res.data);
    } catch (err) {
      console.error('Error fetching booked slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const generateAvailableSlots = () => {
    if (!selectedDoctor?.available_time) return;
    try {
      const [startStr, endStr] = selectedDoctor.available_time.split(' - ');
      const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return new Date(2000, 0, 1, hours, minutes);
      };
      const start = parseTime(startStr);
      const end = parseTime(endStr);
      const slots = [];
      let current = new Date(start);
      while (current < end) {
        const timeString = current.toTimeString().substring(0, 5);
        slots.push(timeString);
        current.setMinutes(current.getMinutes() + 15);
      }
      setAvailableSlots(slots);
    } catch (e) {
      setAvailableSlots([]);
    }
  };

  const validatePayment = () => {
    if (!paymentDetails.cardName.trim()) return 'Cardholder name is required.';
    if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) return 'Invalid Card Number (16 digits required).';
    if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) return 'Invalid Expiry (MM/YY required).';
    if (!/^\d{3}$/.test(paymentDetails.cvv)) return 'Invalid CVV (3 digits required).';
    return null;
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setFormData({ ...formData, doctor_id: doc.doctor_id, appointment_date: '', appointment_time: '' });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePayment();
    if (validationError) {
        setError(validationError);
        return;
    }
    setLoading(true);
    setError('');
    try {
      const appRes = await API.post('/appointments', {
        patient_id: user.profile_id,
        doctor_id: formData.doctor_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason
      });
      await API.post('/payments', {
        appointment_id: appRes.data.appointment_id,
        patient_id: user.profile_id,
        amount: selectedDoctor.channeling_fee,
        payment_method: formData.payment_method,
        payment_details: `Verified Transaction (Ending in ${paymentDetails.cardNumber.slice(-4)})`
      });
      setSuccess(true);
      setTimeout(() => navigate('/patient/appointments'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction declined.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.full_name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (success) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '600px', margin: '10vh auto', textAlign: 'center' }} className="page-fade-in">
          <div className="card" style={{ padding: '4rem' }}>
            <div style={{ background: '#ecfdf5', color: '#10b981', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <CheckCircle2 size={50} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>Booking Secured!</h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>Your consultation is confirmed. Redirecting...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="page-fade-in">
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#1e293b' }}>Secure Booking Portal</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Finalize your appointment with our secure payment gateway.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {[ { n: 1, label: 'Doctor' }, { n: 2, label: 'Schedule' }, { n: 3, label: 'Payment' } ].map(s => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s.n ? '#0d9488' : '#f1f5f9',
                  color: step >= s.n ? 'white' : '#94a3b8',
                  fontWeight: '800', fontSize: '0.9rem'
                }}>{step > s.n ? <CheckCircle2 size={18} /> : s.n}</div>
                <span style={{ fontWeight: step >= s.n ? '700' : '500', color: step >= s.n ? '#1e293b' : '#94a3b8', fontSize: '0.9rem' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {(error || dateError) && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '1.25rem', borderRadius: '1rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
            <XCircle size={22} /> {error || dateError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}>
          <main>
            {step === 1 && (
              <div className="page-fade-in">
                <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                  <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={22} />
                  <input type="text" className="form-input" placeholder="Find your specialist..." style={{ paddingLeft: '3.5rem', height: '64px', borderRadius: '1.25rem', fontSize: '1.1rem' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {filteredDoctors.map(doc => (
                    <div key={doc.doctor_id} onClick={() => handleSelectDoctor(doc)} className="card card-hover" style={{ cursor: 'pointer', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: '#eff6ff', color: '#0d9488', width: '56px', height: '56px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '900' }}>{doc.full_name.charAt(0)}</div>
                        <div><h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Dr. {doc.full_name}</h3><p style={{ color: '#0d9488', fontWeight: '700', fontSize: '0.8rem' }}>{doc.specialization}</p></div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <CalendarDays size={16} color="#0d9488" /> {doc.available_days}
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <Clock size={16} color="#0d9488" /> {doc.available_time}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="page-fade-in">
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#0d9488', fontWeight: '700', cursor: 'pointer', marginBottom: '2rem' }}>â† Change Specialist</button>
                <div className="card" style={{ padding: '3rem' }}>
                   <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>1. Select Consultation Date</label>
                      <input 
                        type="date" className="form-input" style={{ height: '60px', borderRadius: '1rem', background: '#f8fafc', borderColor: dateError ? '#dc2626' : '#e2e8f0' }}
                        value={formData.appointment_date} onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]} required
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', color: '#0d9488' }}>
                         <Info size={14} />
                         <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Schedule: {selectedDoctor.available_days}</span>
                      </div>
                   </div>

                   {!dateError && formData.appointment_date && (
                     <div className="page-fade-in">
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.25rem', display: 'block' }}>2. Pick an Available 15-Min Slot</label>
                        {slotsLoading ? <p>Syncing Clinic Schedule...</p> : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {availableSlots.map(time => {
                              const isBooked = bookedSlots.some(bs => bs.trim() === time.trim());
                              return (
                                <button
                                  key={time} type="button" disabled={isBooked}
                                  onClick={() => setFormData({...formData, appointment_time: time})}
                                  style={{
                                    padding: '0.85rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: '800', cursor: isBooked ? 'not-allowed' : 'pointer', border: '2px solid', transition: '0.2s', position: 'relative',
                                    background: isBooked ? '#f1f5f9' : (formData.appointment_time === time ? '#0d9488' : 'white'),
                                    borderColor: isBooked ? '#f1f5f9' : (formData.appointment_time === time ? '#0d9488' : '#e2e8f0'),
                                    color: isBooked ? '#cbd5e1' : (formData.appointment_time === time ? 'white' : '#475569')
                                  }}
                                >
                                  {time}
                                  {isBooked && <span style={{ position: 'absolute', top: '-8px', right: '-4px', background: '#94a3b8', color: 'white', fontSize: '0.5rem', padding: '2px 4px', borderRadius: '4px' }}>TAKEN</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <div className="form-group">
                           <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>3. Reason for visit</label>
                           <textarea className="form-input" style={{ background: '#f8fafc', padding: '1rem' }} rows="3" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Describe symptoms..."></textarea>
                        </div>
                        <button onClick={() => { if(!formData.appointment_time) return alert('Select a time slot'); setStep(3); }} className="btn btn-primary" style={{ width: '100%', height: '64px', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: '800', marginTop: '2.5rem' }}>Continue to Secure Payment</button>
                     </div>
                   )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="page-fade-in card" style={{ padding: '3.5rem' }}>
                 <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: '#eff6ff', color: '#0d9488', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                       <Lock size={30} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.5rem' }}>Secure Checkout</h2>
                    <p style={{ color: '#64748b' }}>Your transaction is encrypted with 256-bit SSL security.</p>
                 </div>
                 <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="form-group"><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Cardholder Name</label><input type="text" className="form-input" style={{ background: '#f8fafc' }} placeholder="Full name" value={paymentDetails.cardName} onChange={e => setPaymentDetails({...paymentDetails, cardName: e.target.value})} /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Card Number</label><div style={{ position: 'relative' }}><CreditCard style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} /><input type="text" className="form-input" style={{ background: '#f8fafc', paddingLeft: '3rem' }} placeholder="16-digit card number" maxLength="16" value={paymentDetails.cardNumber} onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '')})} /></div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                       <div className="form-group"><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Expiry</label><input type="text" className="form-input" style={{ background: '#f8fafc' }} placeholder="MM/YY" maxLength="5" value={paymentDetails.expiry} onChange={e => { let val = e.target.value.replace(/\D/g, ''); if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4); setPaymentDetails({...paymentDetails, expiry: val}); }} /></div>
                       <div className="form-group"><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>CVV</label><input type="password" className="form-input" style={{ background: '#f8fafc' }} placeholder="3 digits" maxLength="3" value={paymentDetails.cvv} onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, '')})} /></div>
                    </div>
                 </div>
                 <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '64px', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: '900' }}>{loading ? 'Processing Transaction...' : `Pay LKR ${selectedDoctor.channeling_fee} & Secure Slot`}</button>
              </div>
            )}
          </main>

          <aside>
             {selectedDoctor && (
               <div className="card" style={{ padding: '2.25rem', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: 'white', width: '80px', height: '80px', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', margin: '0 auto 1.5rem' }}>{selectedDoctor.full_name.charAt(0)}</div>
                    <h3 style={{ fontWeight: '800', fontSize: '1.25rem' }}>Dr. {selectedDoctor.full_name}</h3>
                    <p style={{ color: '#0d9488', fontWeight: '700', fontSize: '0.85rem' }}>{selectedDoctor.specialization}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}><span style={{ fontWeight: '800' }}>Payable Total</span><span style={{ fontWeight: '900', color: '#0d9488', fontSize: '1.25rem' }}>LKR {selectedDoctor.channeling_fee}</span></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#475569' }}><CalendarIcon size={16} color="#0d9488" /> {formData.appointment_date || 'Date not selected'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#475569' }}><Clock size={16} color="#0d9488" /> {formData.appointment_time || 'Slot not selected'}</div>
                  </div>
               </div>
             )}
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;

