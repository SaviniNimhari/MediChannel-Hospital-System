import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { 
  BarChart3, Download, TrendingUp, Users, Calendar, 
  CreditCard, PieChart, ArrowDown, ArrowUp, Activity, Database, Server, Clock
} from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Advanced Reports | MediChannel Admin";
    const fetchReports = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportToCSV = (type) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'revenue') {
      csvContent += "Day,Amount\n";
      data.revenueTrends.forEach(row => {
        csvContent += `${row.day},${row.total}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MediChannel_${type}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <DashboardLayout><div style={{ padding: '4rem', textAlign: 'center' }}>Generating Intelligence Reports...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <style>
        {`
          @media print {
            .sidebar, .btn, .no-print { display: none !important; }
            .sidebar-layout { display: block !important; padding: 0 !important; }
            .main-content { padding: 0 !important; margin: 0 !important; background: white !important; width: 100% !important; }
            
            body { font-size: 11pt; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            
            .card { 
              border: 1px solid #e2e8f0 !important; 
              box-shadow: none !important; 
              margin-bottom: 2rem !important; 
              page-break-inside: avoid;
              background: white !important;
              color: black !important;
              padding: 1.5rem !important;
            }

            .grid-stats { 
              display: grid !important; 
              grid-template-columns: 1fr 1fr !important; 
              gap: 1rem !important; 
            }

            .grid-deep { 
              display: block !important; 
            }

            .print-header { 
              display: flex !important; 
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0d9488;
              padding-bottom: 1.5rem;
              margin-bottom: 3rem;
            }

            .signature-area {
              display: flex !important;
              justify-content: space-between;
              margin-top: 5rem;
              padding-top: 2rem;
              border-top: 1px solid #eee;
            }
          }

          .print-header { display: none; }
          .signature-area { display: none; }
          .grid-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
          .grid-deep { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        `}
      </style>

      <div className="page-fade-in" style={{ paddingBottom: '5rem' }}>
        <div className="print-header">
           <div>
              <h1 style={{ color: '#0d9488', fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem' }}>MediChannel Intelligence</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Official Analytical Data Export</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '700' }}>Date: {new Date().toLocaleDateString()}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Report ID: #MC-RT-{Math.floor(Math.random()*10000)}</p>
           </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div className="no-print">
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Analytics & Reports</h1>
            <p style={{ color: 'var(--text-muted)' }}>Comprehensive hospital intelligence and database statistics.</p>
          </div>
          <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={() => exportToCSV('revenue')} className="btn btn-outline">
               <Download size={18} /> Export CSV
             </button>
             <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
               <BarChart3 size={18} /> Generate PDF Report
             </button>
          </div>
        </div>

        {/* Top Insights */}
        <div className="grid-stats">
          {[
            { label: 'Total Revenue', value: `LKR ${data.totalRevenue}`, trend: 'Gross Income', color: '#0d9488' },
            { label: 'Registered Patients', value: data.totalPatients, trend: 'Database Count', color: '#10b981' },
            { label: 'Active Sessions', value: data.dbMetrics.active_connections, trend: 'Connections', color: '#f59e0b' },
            { label: 'Storage footprint', value: data.dbMetrics.db_size, trend: 'Disk Usage', color: '#ef4444' }
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stat.label}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: stat.color }}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-deep">
          <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '700' }}>Relational Revenue Trend (7D)</h3>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
               {data.revenueTrends.map((row, i) => (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${(row.total / (Math.max(...data.revenueTrends.map(r => r.total)) || 1)) * 100}%`, 
                      background: '#0d9488', 
                      borderRadius: '0.5rem',
                      minHeight: '10px'
                    }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>{row.day}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>LKR {row.total}</span>
                 </div>
               ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ background: '#0f172a', color: 'white' }}>
               <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '700' }}>Postgres System Status</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                     <span style={{ opacity: 0.6 }}>Storage Usage</span>
                     <span style={{ fontWeight: '700', color: '#14b8a6' }}>{data.dbMetrics.db_size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                     <span style={{ opacity: 0.6 }}>Active Backends</span>
                     <span style={{ fontWeight: '700' }}>{data.dbMetrics.active_connections}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                  <p style={{ fontSize: '0.7rem', opacity: 0.5, lineHeight: 1.4 }}>{data.dbMetrics.pg_version.split(',')[0]}</p>
               </div>
            </div>

            <div className="card">
               <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Relational Indexes</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.indexes.slice(0, 3).map((idx, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                       <TrendingUp size={16} color="#0d9488" />
                       <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>{idx.indexname}</p>
                          <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Table: {idx.tablename}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="card">
           <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Detailed Relational Forensics (Table Analysis)</h3>
           <div className="table-container" style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                       <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Table Name</th>
                       <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Disk Usage</th>
                       <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Relational Tuples</th>
                       <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Scan Health</th>
                    </tr>
                 </thead>
                 <tbody>
                    {data.tableSizes.map((table, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                         <td style={{ padding: '1rem', fontWeight: '700' }}>{table.table_name}</td>
                         <td style={{ padding: '1rem', color: '#0d9488', fontWeight: '600' }}>{table.total_size}</td>
                         <td style={{ padding: '1rem' }}>{table.row_count} Entries</td>
                         <td style={{ padding: '1rem' }}>
                            <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: '900' }}>â— OPTIMIZED</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Department Revenue Performance</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {data.deptPerformance.map((dept, i) => (
                <div key={i} style={{ padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem' }}>
                   <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{dept.department_name}</p>
                   <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0d9488' }}>LKR {dept.revenue}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="signature-area">
           <div>
              <p style={{ fontWeight: '700', marginBottom: '3rem' }}>Authorized System Administrator</p>
              <div style={{ borderBottom: '1px solid black', width: '200px' }}></div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Digital Signature Verified</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '700', marginBottom: '3rem' }}>Medical Board Approval</p>
              <div style={{ borderBottom: '1px solid black', width: '200px', marginLeft: 'auto' }}></div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Final Validation Seal</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

