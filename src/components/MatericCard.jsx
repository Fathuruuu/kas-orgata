// src/components/MatericCard.jsx

function MetricCard({ label, value, isPositive, icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={styles.icon}>{icon}</span>
        <span style={{
          ...styles.badge,
          background: isPositive ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
          color: isPositive ? '#2ecc71' : '#e74c3c',
        }}>
          {isPositive ? '▲' : '▼'}
        </span>
      </div>
      <p style={styles.label}>{label}</p>
      <p style={{
        ...styles.value,
        color: isPositive ? '#2ecc71' : '#e74c3c',
      }}>
        {value}
      </p>
    </div>
  )
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '28px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  label: {
    margin: '0 0 8px 0',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  value: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
}

export default MetricCard