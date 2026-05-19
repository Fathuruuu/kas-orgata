// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import MetricCard from '../components/MatericCard'

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

function Dashboard() {
  const [totalSaldo,        setTotalSaldo]        = useState(0)
  const [totalPengeluaran,  setTotalPengeluaran]  = useState(0)
  const [pemasukanBulanIni, setPemasukanBulanIni] = useState(0)
  const [loading,           setLoading]           = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase.from('transaksi').select('*')

    if (!error && data) {
      const masuk  = data.filter(t => t.jenis === 'masuk').reduce((acc, t) => acc + t.jumlah, 0)
      const keluar = data.filter(t => t.jenis === 'keluar').reduce((acc, t) => acc + t.jumlah, 0)

      // Pemasukan bulan ini
      const bulanIni = new Date().getMonth()
      const tahunIni = new Date().getFullYear()
      const masukBulanIni = data
        .filter(t => {
          const d = new Date(t.tanggal)
          return t.jenis === 'masuk' && d.getMonth() === bulanIni && d.getFullYear() === tahunIni
        })
        .reduce((acc, t) => acc + t.jumlah, 0)

      setTotalSaldo(masuk - keluar)
      setTotalPengeluaran(keluar)
      setPemasukanBulanIni(masukBulanIni)
    }
    setLoading(false)
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 KasKu</h1>
          <p style={styles.subtitle}>Selamat datang kembali! Berikut ringkasan kas hari ini.</p>
        </div>
        <div style={styles.navLinks}>
          <a href="/input"     style={styles.navBtn}>+ Input</a>
          <a href="/transaksi" style={styles.navBtn}>📋 Transaksi</a>
          <a href="/login"     style={styles.navBtnOutline}>Keluar</a>
        </div>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <div style={styles.loadingBox}>⏳ Memuat data...</div>
      ) : (
        <div style={styles.grid}>
          <MetricCard label="Total Saldo"         value={formatRupiah(totalSaldo)}        isPositive={true}  icon="💵" />
          <MetricCard label="Total Pengeluaran"   value={formatRupiah(totalPengeluaran)}  isPositive={false} icon="📤" />
          <MetricCard label="Pemasukan Bulan Ini" value={formatRupiah(pemasukanBulanIni)} isPositive={true}  icon="📥" />
        </div>
      )}

      {/* Shortcut */}
      <div style={styles.shortcuts}>
        <a href="/input" style={styles.shortcutCard}>
          <span style={styles.shortcutIcon}>✏️</span>
          <div>
            <p style={styles.shortcutTitle}>Input Transaksi</p>
            <p style={styles.shortcutDesc}>Catat pemasukan atau pengeluaran baru</p>
          </div>
        </a>
        <a href="/transaksi" style={styles.shortcutCard}>
          <span style={styles.shortcutIcon}>📋</span>
          <div>
            <p style={styles.shortcutTitle}>Riwayat Transaksi</p>
            <p style={styles.shortcutDesc}>Lihat semua catatan transaksi</p>
          </div>
        </a>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <p style={styles.infoText}>📅 Data diperbarui hari ini</p>
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
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '36px', flexWrap: 'wrap', gap: '16px',
  },
  title: { margin: '0 0 6px 0', fontSize: '28px', fontWeight: '700', letterSpacing: '0.5px' },
  subtitle: { margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  navLinks: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  navBtn: {
    background: 'linear-gradient(135deg, #e94560, #c23152)',
    color: '#fff', textDecoration: 'none', padding: '10px 18px',
    borderRadius: '10px', fontWeight: '600', fontSize: '14px',
  },
  navBtnOutline: {
    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none', padding: '10px 18px', borderRadius: '10px',
    fontWeight: '600', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)',
  },
  loadingBox: {
    color: 'rgba(255,255,255,0.4)', fontSize: '14px', padding: '20px 0', marginBottom: '24px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px', marginBottom: '24px',
  },
  shortcuts: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  shortcutCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '20px', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  shortcutIcon: { fontSize: '32px' },
  shortcutTitle: { margin: '0 0 4px 0', color: '#fff', fontSize: '15px', fontWeight: '600' },
  shortcutDesc: { margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '13px' },
  info: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '14px 20px',
  },
  infoText: { margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '13px' },
}

export default Dashboard
