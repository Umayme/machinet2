'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const wilayas = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa']
const secteurs = ['Industrie Agroalimentaire','Bâtiment & Travaux Publics','Agriculture','Textile','Industrie générale','Pharma','Mining','Énergie','Import/Export','Autre']
const roleOptions = [
  { v: 'buyer', label: 'Acheteur', icon: 'A', desc: 'Je cherche des machines' },
  { v: 'seller', label: 'Vendeur', icon: 'V', desc: 'Je vends des machines' },
  { v: 'consultant', label: 'Expert', icon: 'E', desc: 'Je propose des services industriels' },
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
    if (roleParam && roleOptions.find(r => r.v === roleParam)) { setRole(roleParam); setStep(2) }
  }, [])

  const selectedRole = roleOptions.find(r => r.v === role)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    })
    const data = await res.json(); setLoading(false)
    if (res.ok) { setUserName(form.name.split(' ')[0]); setStep(3) }
    else setError(data.error)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — dark brand panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#141313] flex-col justify-between p-12">
        <div>
          <span className="text-white font-bold text-xl font-['Barlow_Condensed'] tracking-wide">Machi<span style={{color:'#e46a33'}}>Net</span></span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white font-['Barlow_Condensed'] mb-4 leading-tight">
            Rejoignez le réseau<br/>des industriels<br/><span style={{color:'#e46a33'}}>algériens</span>
          </h2>
          <p className="text-[#8c8b8b] text-sm mb-8">Des milliers d'acheteurs, vendeurs et experts connectés sur une seule plateforme.</p>
          <div className="space-y-3">
            {[
              { icon: 'A', label: 'Acheteur', desc: 'Trouvez la machine idéale au meilleur prix', color: '#e46a33' },
              { icon: 'V', label: 'Vendeur', desc: 'Publiez vos annonces et trouvez des acheteurs', color: '#10b981' },
              { icon: 'E', label: 'Expert', desc: 'Proposez vos services de consulting industriel', color: '#6366f1' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{backgroundColor: r.color + '30', border: `1px solid ${r.color}40`}}>
                  <span style={{color: r.color}}>{r.icon}</span>
                </span>
                <div>
                  <span className="text-white text-sm font-semibold">{r.label}</span>
                  <span className="text-[#8c8b8b] text-xs"> — {r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[#8c8b8b] text-xs">© 2026 MachiNet · Imama, Tlemcen — Algérie</p>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-12 bg-[#f9f9f8]">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <span className="text-[#141313] font-bold text-2xl font-['Barlow_Condensed']">Machi<span style={{color:'#e46a33'}}>Net</span></span>
        </div>
        <div className="mb-8">
          {step < 3 && (
            <>
              <h1 className="text-3xl font-bold text-[#141313] font-['Barlow_Condensed'] mb-3">Créer un compte</h1>
              <div className="flex gap-2">
                {[1,2].map(n => (
                  <div key={n} className={`h-1 w-14 rounded-full transition-all ${step >= n ? 'bg-[#e46a33]' : 'bg-[#e9e9e9]'}`}></div>
                ))}
              </div>
            </>
          )}
        </div>

        {step === 1 && (
          <div className="card p-7">
            <h2 className="text-[#141313] font-bold text-lg mb-5">Vous êtes...</h2>
            <div className="space-y-3 mb-6">
              {roleOptions.map(opt => (
                <button key={opt.v} onClick={() => setRole(opt.v)}
                  className={`w-full border rounded-xl p-4 text-left transition-all flex items-center gap-4 ${
                    role === opt.v ? 'border-[#141313] bg-[#f9f9f8]' : 'border-[#e9e9e9] hover:border-[#8c8b8b] bg-white'
                  }`}>
                  <div className="w-10 h-10 rounded-lg bg-[#141313] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#141313] font-semibold text-sm">{opt.label}</p>
                    <p className="text-[#8c8b8b] text-xs mt-0.5">{opt.desc}</p>
                  </div>
                  {role === opt.v && (
                    <div className="w-5 h-5 rounded-full bg-[#e46a33] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => role && setStep(2)} disabled={!role}
              className="btn-primary w-full justify-center h-12 disabled:opacity-40 disabled:cursor-not-allowed">
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="card p-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f9f8] border border-[#e9e9e9] rounded-full mb-2">
              <span className="w-2 h-2 rounded-full bg-[#e46a33]"></span>
              <span className="text-[#434042] text-xs font-medium">{selectedRole?.label}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#434042] text-sm mb-1.5 font-medium">Nom complet *</label>
                <input required className="input-dark h-11 text-sm" placeholder="Votre nom"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-[#434042] text-sm mb-1.5 font-medium">Téléphone</label>
                <input className="input-dark h-11 text-sm" placeholder="+213 XX XX XX XX"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-[#434042] text-sm mb-1.5 font-medium">Email *</label>
              <input required type="email" className="input-dark h-11 text-sm" placeholder="votre@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-[#434042] text-sm mb-1.5 font-medium">Entreprise</label>
              <input className="input-dark h-11 text-sm" placeholder="SARL Votre Entreprise"
                value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#434042] text-sm mb-1.5 font-medium">Wilaya</label>
                <select className="input-dark h-11 text-sm" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {wilayas.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#434042] text-sm mb-1.5 font-medium">Secteur</label>
                <select className="input-dark h-11 text-sm" value={form.sector} onChange={e => set('sector', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {secteurs.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[#434042] text-sm mb-1.5 font-medium">Mot de passe *</label>
              <input required type="password" className="input-dark h-11 text-sm" placeholder="8 caractères minimum"
                minLength={8} value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline h-12 px-5">←</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center h-12 disabled:opacity-50">
                {loading ? 'Création...' : 'Créer mon compte →'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 mx-auto mb-5 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="section-title mb-2">
              {role === 'buyer' ? 'Compte créé !' : 'Demande envoyée !'}
            </h2>
            <p className="text-[#8c8b8b] mb-6 text-sm">
              {role === 'buyer'
                ? `Bienvenue sur MachiNet, ${userName}.`
                : `Merci ${userName}. Notre équipe examinera votre demande dans les 24-48h.`}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={role === 'buyer' ? '/catalogue' : '/login'} className="btn-primary text-sm">
                {role === 'buyer' ? 'Explorer le catalogue →' : 'Se connecter'}
              </Link>
            </div>
          </div>
        )}

        {step < 3 && (
          <p className="text-center text-[#8c8b8b] text-sm mt-5">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#141313] font-semibold hover:text-[#e46a33] transition-colors">Se connecter</Link>
          </p>
        )}
      </div>
      </div>{/* close right panel */}
    </div>
  )
}
