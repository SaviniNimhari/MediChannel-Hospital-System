import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { CreditCard, Search, Download, TrendingUp, DollarSign, Calendar, User } from 'lucide-react';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = "Revenue | MediChannel Admin";
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const filtered = payments.filter(p => 
    p.patient_name.toLowerCase().includes(search.toLowerCase()) || 
    p.doctor_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Financial Audit</h1>
            <p style={{ color: 'var(--text-muted)' }}>Tracking revenue and channeling transactions.</p>
          </div>
          <div className="card" style={{ padding: '1.25rem 2rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--shadow)' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '600', textTransform: 'uppercase' }}>Gross Revenue</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>LKR {totalRevenue.toLocaleString()}</h3>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '1rem' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '52px', height: '56px' }} 
              placeholder="Filter by patient or doctor name..." 
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
                  <th>Transaction</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.payment_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                          <CreditCard size={18} />
                        </div>
                        <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>#TXN-{p.payment_id}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '500' }}>{p.patient_name}</td>
                    <td>Dr. {p.doctor_name}</td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                         <Calendar size={14} color="var(--text-muted)" /> {new Date(p.payment_date).toLocaleDateString()}
                       </div>
                    </td>
                    <td>
                       <span style={{ background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600' }}>
                         {p.payment_method}
                       </span>
                    </td>
                    <td style={{ fontWeight: '800', color: 'var(--primary)' }}>LKR {p.amount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                        Paid
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePayments;
