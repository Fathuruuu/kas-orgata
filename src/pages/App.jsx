// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard   from './Dashboard'
import InputManual from './InputManual'
import Transaksi   from './Transaksi'
import Login       from './Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/input"     element={<InputManual />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/login"     element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App