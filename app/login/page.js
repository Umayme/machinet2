'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || ''
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      if (next) { router.push(next); return }
      const role = data.user?.role
      if (role === 'seller') router.push('/dashboard')
      else if (role === 'consultant') router.push('/consultant-dashboard')
      else if (role === 'admin') router.push('/machinetdz-admin-2026')
      else router.push('/catalogue')
    } else { setError(data.error) }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
      <div>
        <label className="block text-[#434042] text-sm mb-2 font-medium">Email</label>
        <input required type="email" className="input-dark h-12" placeholder="votre@email.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-[#434042] text-sm font-medium">Mot de passe</label>
          <Link href="/contact" className="text-[#e46a33] text-xs hover:underline">Mot de passe oublié ?</Link>
        </div>
        <input required type="password" className="input-dark h-12" placeholder="••••••••"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base disabled:opacity-50">
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f8] pt-16 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="section-title mb-2">Connexion</h1>
          <p className="text-[#8c8b8b]">Accédez à votre espace MachiNet</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-[#8c8b8b]">Chargement...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-[#8c8b8b] text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-[#141313] font-semibold hover:text-[#e46a33] transition-colors">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
