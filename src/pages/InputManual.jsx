// src/pages/InputManual.jsx

import { useState } from 'react'
import { supabase } from '../supabase'

function InputManual() {
  const [amount, setAmount]   = useState('')
  const [desc, setDesc]       = useState('')
  const [jenis, setJenis]     = useState('masuk')
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('transaksi').insert([
      {
        tanggal,
        keterangan: desc,
        jenis,
        jumlah: parseInt(amount),
      }
    ])

    setLoading(false)

    if (err) {
      setError('Gagal menyimpan: ' + err.message)
    } else {
      setSuccess(true)
      setDesc('')
      setAmount('')
      setJenis('masuk')
      setTanggal(new Date().toISOString().split('T')[0])
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const formatPreview = (val) => {
    const num = parseInt(val)
    if (!val || isNaN(num)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(num)
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>✏️ Input Transaksi</h1>
          <p style={styles.subtitle}>Catat pemasukan atau pengeluaran kas baru</p>
        </div>
        <a href="/" style={styles.backBtn}>← Dashboard</a>
      </div>

      {/* Card Form */}
      <div style={styles.card}>
        {/* Toggle Jenis */}
        <div style={styles.toggleGroup}>
          <button
            type="button"
            onClick={() => setJenis('masuk')}
            style={{
              ...styles.toggleBtn,
              background: jenis === 'masuk' ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.05)',
              color:      jenis === 'masuk' ? '#2ecc71' : 'rgba(255,255,255,0.4)',
              border:     jenis === 'masuk' ? '1px solid rgba(46,204,113,0.4)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            ▲ Pemasukan
          </button>
          <button
            type="button"
            onClick={() => setJenis('keluar')}
            style={{
              ...styles.toggleBtn,
              background: jenis === 'keluar' ? 'rgba(231,76,60,0.2)' : 'rgba(255,255,255,0.05)',
              color:      jenis === 'keluar' ? '#e74c3c' : 'rgba(255,255,255,0.4)',
              border:     jenis === 'keluar' ? '1px solid rgba(231,76,60,0.4)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            ▼ Pengeluaran
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Keterangan */}
          <div style={styles.field}>
            <label style={styles.label}>Keterangan</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Contoh: Gaji, Beli ATK, dll"
              style={styles.input}
              required
            />
          </div>

          {/* Jumlah */}
          <div style={styles.field}>
            <label style={styles.label}>Jumlah</label>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              type="number"
              min="0"
              style={styles.input}
              required
            />
            {amount && (
              <p style={{ ...styles.preview, color: jenis === 'masuk' ? '#2ecc71' : '#e74c3c' }}>
                {jenis === 'masuk' ? '+ ' : '- '}{formatPreview(amount)}
              </p>
            )}
          </div>

          {/* Tanggal */}
          <div style={styles.field}>
            <label style={styles.label}>Tanggal</label>
            <input
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              type="date"
              style={styles.inputDate}
              required
            />
          </div>

          {/* Notif */}
          {success && (
            <div style={styles.successBox}>✅ Transaksi berhasil disimpan!</div>
          )}
          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          {/* Tombol */}
          <div style={styles.btnGroup}>
            <a href="/transaksi" style={styles.btnCancel}>Lihat Transaksi</a>
            <button type="submit" style={{
              ...styles.btnSave,
              background: jenis === 'masuk'
                ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            }} disabled={loading}>
              {loading ? 'Menyimpan...' : '💾 Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '32px 24px',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: { margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700' },
  subtitle: { margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  backBtn: {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '520px',
    backdropFilter: 'blur(20px)',
  },
  toggleGroup: { display: 'flex', gap: '12px', marginBottom: '28px' },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.2s',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.4px' },
  input: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  inputDate: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    colorScheme: 'dark',
  },
  preview: { margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700' },
  successBox: {
    background: 'rgba(46,204,113,0.15)',
    border: '1px solid rgba(46,204,113,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#2ecc71',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBox: {
    background: 'rgba(231,76,60,0.15)',
    border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#e74c3c',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  btnGroup: { display: 'flex', gap: '12px', marginTop: '4px' },
  btnCancel: {
    flex: 1,
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    padding: '13px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  btnSave: {
    flex: 2,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
  },
}

export default InputManual
