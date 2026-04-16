'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
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
      const role = data.user?.role
      const approved = data.user?.approved
      if (role === 'seller') {
        // Always go to seller dashboard — dashboard handles approval gate
        router.push('/dashboard')
      } else if (role === 'consultant') {
        // Always go to consultant dashboard — it handles approval gate
        router.push('/consultant-dashboard')
      } else if (role === 'buyer') {
        router.push('/catalogue')
      } else {
        // Fallback — don't expose admin URL here
        router.push('/')
      }
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.svg" alt="MachiNet" className="h-10 w-auto" />
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Connexion</h1>
          <p className="text-gray-500">Accédez à votre espace MachiNet</p>
        </div>

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

        <p className="text-center text-gray-500 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300">Créer un compte gratuit</Link>
        </p>
      </div>
    </div>
  )
}
