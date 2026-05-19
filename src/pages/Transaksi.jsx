// src/pages/Transaksi.jsx

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([])
  const [filter, setFilter]       = useState('semua')
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [hapusId, setHapusId]     = useState(null)

  // Ambil data dari Supabase
  useEffect(() => {
    fetchTransaksi()
  }, [])

  async function fetchTransaksi() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transaksi')
      .select('*')
      .order('tanggal', { ascending: false })

    if (!error) setTransaksi(data)
    setLoading(false)
  }

  const totalMasuk  = transaksi.filter(t => t.jenis === 'masuk').reduce((acc, t) => acc + t.jumlah, 0)
  const totalKeluar = transaksi.filter(t => t.jenis === 'keluar').reduce((acc, t) => acc + t.jumlah, 0)
  const saldo       = totalMasuk - totalKeluar

  const filtered = transaksi.filter(t => {
    const cocokFilter = filter === 'semua' || t.jenis === filter
    const cocokSearch = t.keterangan.toLowerCase().includes(search.toLowerCase())
    return cocokFilter && cocokSearch
  })

  const konfirmasiHapus = (id) => { setHapusId(id); setShowModal(true) }

  async function hapusTransaksi() {
    await supabase.from('transaksi').delete().eq('id', hapusId)
    setTransaksi(transaksi.filter(t => t.id !== hapusId))
    setShowModal(false)
    setHapusId(null)
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Riwayat Transaksi</h1>
          <p style={styles.subtitle}>Semua catatan pemasukan dan pengeluaran kas</p>
        </div>
        <a href="/input" style={styles.btnTambah}>+ Tambah</a>
      </div>

      {/* Ringkasan */}
      <div style={styles.summary}>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #2ecc71' }}>
          <p style={styles.summaryLabel}>Total Masuk</p>
          <p style={{ ...styles.summaryValue, color: '#2ecc71' }}>{formatRupiah(totalMasuk)}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #e74c3c' }}>
          <p style={styles.summaryLabel}>Total Keluar</p>
          <p style={{ ...styles.summaryValue, color: '#e74c3c' }}>{formatRupiah(totalKeluar)}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #3498db' }}>
          <p style={styles.summaryLabel}>Saldo Kas</p>
          <p style={{ ...styles.summaryValue, color: '#3498db' }}>{formatRupiah(saldo)}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="🔍 Cari keterangan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
        <div style={styles.filterGroup}>
          {['semua', 'masuk', 'keluar'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              ...styles.filterBtn,
              background: filter === f ? '#3498db' : 'rgba(255,255,255,0.08)',
              color:      filter === f ? '#fff' : 'rgba(255,255,255,0.6)',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Tanggal</th>
              <th style={styles.th}>Keterangan</th>
              <th style={styles.th}>Jenis</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Jumlah</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={styles.empty}>
                <div style={styles.emptyInner}>
                  <span style={styles.emptyIcon}>⏳</span>
                  <p style={styles.emptyText}>Memuat data...</p>
                </div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={styles.empty}>
                <div style={styles.emptyInner}>
                  <span style={styles.emptyIcon}>🗂️</span>
                  <p style={styles.emptyText}>Belum ada transaksi</p>
                  <p style={styles.emptyHint}>Klik <strong>+ Tambah</strong> untuk mencatat transaksi baru</p>
                </div>
              </td></tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.td}>{t.tanggal}</td>
                  <td style={styles.td}>{t.keterangan}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: t.jenis === 'masuk' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                      color:      t.jenis === 'masuk' ? '#2ecc71' : '#e74c3c',
                    }}>
                      {t.jenis === 'masuk' ? '▲ Masuk' : '▼ Keluar'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600',
                    color: t.jenis === 'masuk' ? '#2ecc71' : '#e74c3c' }}>
                    {formatRupiah(t.jumlah)}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => konfirmasiHapus(t.id)} style={styles.btnHapus}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.modalText}>⚠️ Yakin ingin menghapus transaksi ini?</p>
            <div style={styles.modalActions}>
              <button onClick={() => setShowModal(false)} style={styles.btnBatal}>Batal</button>
              <button onClick={hapusTransaksi} style={styles.btnHapusModal}>Hapus</button>
            </div>
          </div>
        </div>
      )}
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
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
  },
  title: { margin: 0, fontSize: '24px', fontWeight: '700' },
  subtitle: { margin: '4px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  btnTambah: {
    background: 'linear-gradient(135deg, #e94560, #c23152)',
    color: '#fff', textDecoration: 'none', padding: '10px 20px',
    borderRadius: '10px', fontWeight: '600', fontSize: '14px',
  },
  summary: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  summaryCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '16px 20px',
  },
  summaryLabel: { margin: '0 0 6px 0', color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  summaryValue: { margin: 0, fontSize: '20px', fontWeight: '700' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  search: {
    flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    padding: '10px 16px', color: '#fff', fontSize: '14px', outline: 'none',
  },
  filterGroup: { display: 'flex', gap: '8px' },
  filterBtn: {
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
    padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
  },
  tableWrapper: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(255,255,255,0.06)' },
  th: {
    padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700',
    color: 'rgba(255,255,255,0.5)', letterSpacing: '0.8px', textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.85)' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  btnHapus: {
    background: 'rgba(231,76,60,0.15)', color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.3)', borderRadius: '6px',
    padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
  },
  empty: { padding: 0 },
  emptyInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: '8px' },
  emptyIcon: { fontSize: '48px', marginBottom: '8px' },
  emptyText: { margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '16px', fontWeight: '600' },
  emptyHint: { margin: 0, color: 'rgba(255,255,255,0.25)', fontSize: '13px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px', maxWidth: '320px', width: '90%', textAlign: 'center' },
  modalText: { fontSize: '16px', marginBottom: '20px', color: '#fff' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
  btnBatal: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600' },
  btnHapusModal: { background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600' },
}
