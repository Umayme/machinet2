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
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      if (next) {
        router.push(next)
        return
      }
      const role = data.user?.role
      if (role === 'seller') router.push('/dashboard')
      else if (role === 'consultant') router.push('/consultant-dashboard')
      else if (role === 'admin') router.push('/machinetdz-admin-2026')
      else router.push('/catalogue')
    } else {
      setError(data.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Email</label>
        <input required type="email" className="input-dark h-12" placeholder="votre@email.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-gray-400 text-sm">Mot de passe</label>
          <Link href="/contact" className="text-purple-400 text-xs hover:text-purple-300">Mot de passe oublié ?</Link>
        </div>
        <input required type="password" className="input-dark h-12" placeholder="••••••••"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base disabled:opacity-50">
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="logo-text text-3xl"><span className="text-white">MACHI</span><span className="text-purple-400">NET</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Connexion</h1>
          <p className="text-gray-500">Accédez à votre espace MachiNet</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-gray-500">Chargement...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-gray-500 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
