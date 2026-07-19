import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';

const PatientPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get(`/payments/patient/${user.profile_id}`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user.profile_id]);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>My Payments</h1>
        <p style={{ color: 'var(--text-muted)' }}>History of your transactions and channeling fees</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {payments.map(payment => (
          <div key={payment.payment_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#f0fdf4', color: '#10b981', padding: '1rem', borderRadius: '1rem' }}>
                <CreditCard size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Channeling Fee</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> {new Date(payment.payment_date).toLocaleDateString()}
                  </span>
                  <span>Method: {payment.payment_method}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                LKR {payment.amount}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.85rem', fontWeight: '700' }}>
                <CheckCircle size={16} /> Paid Successfully
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <CreditCard size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No payment history</h3>
            <p style={{ color: 'var(--text-muted)' }}>Your transactions will appear here after booking an appointment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientPayments;
