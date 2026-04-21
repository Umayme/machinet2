'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const wilayas = ['Alger','Oran','Constantine','Blida','Sétif','Annaba','Tlemcen','Batna','Béjaïa','Skikda','Tiaret','Chlef','Médéa','Tipaza','Boumerdès','Jijel','Guelma','Mila','Biskra','Ouargla','Autre']
const secteurs = ['IAA & Agroalimentaire','BTP & Construction','Agriculture','Textile','Industrie générale','Pharma','Mining','Énergie','Import/Export','Autre']

const roleOptions = [
  {
    v: 'buyer',
    label: 'Acheteur',
    icon: 'A',
    desc: 'Je cherche des machines',
    requiresApproval: false,
  },
  {
    v: 'seller',
    label: 'Vendeur',
    icon: 'V',
    desc: 'Je vends des machines',
    requiresApproval: true,
  },
  {
    v: 'consultant',
    label: 'Consultant',
    icon: 'C',
    desc: 'Je propose du conseil industriel',
    requiresApproval: true,
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', wilaya: '', sector: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    if (roleParam && roleOptions.find(r => r.v === roleParam)) {
      setRole(roleParam)
      setStep(2)
    }
  }, [])

  const selectedRole = roleOptions.find(r => r.v === role)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setUserName(form.name.split(' ')[0])
      setStep(3)
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.svg" alt="MachiNet" className="h-10 w-auto" />
          </Link>
          {step < 3 && (
            <>
              <h1 className="text-3xl font-black text-white mb-2">Créer un compte</h1>
              <div className="flex justify-center gap-2 mt-4">
                {[1,2].map(n => (
                  <div key={n} className={`h-1.5 w-12 rounded-full transition-all ${step >= n ? 'bg-purple-600' : 'bg-white/10'}`}></div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* STEP 1: Choose role */}
        {step === 1 && (
          <div className="card p-8">
            <h2 className="text-white font-bold text-xl mb-6 text-center">Vous êtes...</h2>
            <div className="space-y-3 mb-6">
              {roleOptions.map(opt => (
                <button key={opt.v} onClick={() => setRole(opt.v)}
                  className={`w-full card p-4 text-left transition-all flex items-center gap-4 ${role === opt.v ? 'border-purple-500 bg-purple-900/20' : 'hover:border-purple-700/40'}`}>
                  <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg ${
                    opt.v === 'buyer' ? 'bg-blue-900/30 border border-blue-700/30 text-blue-400' :
                    opt.v === 'seller' ? 'bg-purple-900/30 border border-purple-700/30 text-purple-400' :
                    'bg-cyan-900/30 border border-cyan-700/30 text-cyan-400'
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">{opt.label}</p>
                      {opt.requiresApproval && (
                        <span className="text-xs text-yellow-500 bg-yellow-900/20 border border-yellow-800/30 px-1.5 py-0.5 rounded">
                          Approbation requise
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                  </div>
                  {role === opt.v && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {role && selectedRole?.requiresApproval && (
              <div className="bg-yellow-900/10 border border-yellow-800/20 rounded-xl p-3 mb-4 text-xs text-yellow-600">
                Ce type de compte nécessite une approbation de notre équipe avant d'accéder au dashboard.
              </div>
            )}
            <button onClick={() => role && setStep(2)} disabled={!role}
              className="btn-primary w-full justify-center h-12 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuer →
            </button>
          </div>
        )}

        {/* STEP 2: Fill form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="card p-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                role === 'buyer' ? 'bg-blue-900/30 text-blue-400' :
                role === 'seller' ? 'bg-purple-900/30 text-purple-400' :
                'bg-cyan-900/30 text-cyan-400'
              }`}>{selectedRole?.label}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nom complet *</label>
                <input required className="input-dark h-11 text-sm" placeholder="Votre nom"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Téléphone</label>
                <input className="input-dark h-11 text-sm" placeholder="+213 XX XX XX XX"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email *</label>
              <input required type="email" className="input-dark h-11 text-sm" placeholder="votre@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Entreprise</label>
              <input className="input-dark h-11 text-sm" placeholder="SARL Votre Entreprise"
                value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Wilaya</label>
                <select className="input-dark h-11 text-sm" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {wilayas.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Secteur</label>
                <select className="input-dark h-11 text-sm" value={form.sector} onChange={e => set('sector', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {secteurs.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mot de passe *</label>
              <input required type="password" className="input-dark h-11 text-sm" placeholder="8 caractères minimum"
                minLength={8} value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline h-12 px-6">←</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center h-12 disabled:opacity-50">
                {loading ? 'Création...' : 'Créer mon compte →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="card p-12 text-center">
            {role === 'buyer' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/40 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-white font-black text-2xl mb-2">Compte créé !</h2>
                <p className="text-gray-400 mb-8">Bienvenue sur MachiNet, {userName}.</p>
                <Link href="/catalogue" className="btn-primary">
                  Chercher des machines →
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-yellow-900/30 border border-yellow-700/40 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-white font-black text-2xl mb-2">Demande envoyée !</h2>
                <p className="text-gray-400 mb-2">
                  Merci, <strong className="text-white">{userName}</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Votre demande d'accès en tant que <strong className="text-white">{selectedRole?.label.toLowerCase()}</strong> est en cours d'examen.
                  Notre équipe vous contactera dans les 24-48h.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/login" className="btn-primary text-sm py-2.5 px-5">
                    Se connecter
                  </Link>
                  <Link href="/catalogue" className="btn-outline text-sm py-2.5 px-5">
                    Explorer le catalogue
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {step < 3 && (
          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">Se connecter</Link>
          </p>
        )}
      </div>
    </div>
  )
}
