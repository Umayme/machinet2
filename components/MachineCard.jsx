'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MachineCard({ machine, onCompare, compareList = [] }) {
  const {
    id = '1',
    nom = 'Machine Industrielle',
    fournisseur = 'SARL Pro Machines',
    wilaya = 'Alger',
    prix = '4500000',
    type = 'Vente neuf',
    secteur = 'IAA',
    verifie = true,
    photos,
  } = machine || {}

  let photoUrls = []
  if (photos) {
    try {
      const parsed = typeof photos === 'string' ? JSON.parse(photos) : photos
      photoUrls = Array.isArray(parsed) ? parsed : []
    } catch {}
  }

  const [imgIdx, setImgIdx] = useState(0)
  const isSelected = compareList.some(m => m.id === id)

  const secteurColors = {
    'IAA': 'bg-green-50 text-green-700 border-green-200',
    'BTP': 'bg-orange-50 text-orange-700 border-orange-200',
    'Agricole': 'bg-lime-50 text-lime-700 border-lime-200',
    'Pharma': 'bg-blue-50 text-blue-700 border-blue-200',
    'Textile': 'bg-pink-50 text-pink-700 border-pink-200',
    'Mining': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Énergie': 'bg-amber-50 text-amber-700 border-amber-200',
    'Bois': 'bg-stone-50 text-stone-700 border-stone-200',
  }

  return (
    <div className={`card group cursor-pointer overflow-hidden ${isSelected ? 'ring-2 ring-[#e46a33]' : ''}`}>
      {/* Image carousel */}
      <div className="relative h-52 bg-[#f9f9f8] overflow-hidden">
        {photoUrls.length > 0 ? (
          <>
            <img
              src={photoUrls[imgIdx]}
              alt={nom}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {photoUrls.length > 1 && (
              <>
                <button
                  onClick={e => { e.preventDefault(); setImgIdx(i => (i - 1 + photoUrls.length) % photoUrls.length) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow text-[#141313] hover:bg-white transition-colors z-10"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={e => { e.preventDefault(); setImgIdx(i => (i + 1) % photoUrls.length) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow text-[#141313] hover:bg-white transition-colors z-10"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photoUrls.map((_, i) => (
                    <button key={i} onClick={e => { e.preventDefault(); setImgIdx(i) }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#e9e9e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
        {/* Badges top */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">{type === 'Vente neuf' ? 'NEUF' : 'OCCASION'}</span>
          {verifie && <span className="bg-white text-[#141313] text-xs px-2 py-0.5 rounded font-semibold border border-[#e9e9e9]">✓ Vérifié</span>}
        </div>
        {/* Compare button */}
        {onCompare && (
          <button
            onClick={e => { e.preventDefault(); onCompare(machine) }}
            className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow ${isSelected ? 'bg-[#e46a33] text-white' : 'bg-white/90 text-[#141313] hover:bg-[#e46a33] hover:text-white'}`}
            title={isSelected ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
          >
            {isSelected ? '✓' : '+'}
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#141313] text-sm leading-snug line-clamp-2 flex-1">{nom}</h3>
          <span className={`tag flex-shrink-0 text-xs border ${secteurColors[secteur] || 'bg-[#f9f9f8] text-[#434042] border-[#e9e9e9]'}`}>{secteur}</span>
        </div>
        <p className="text-[#8c8b8b] text-xs mb-2">{fournisseur}</p>
        <div className="flex items-center gap-1 text-[#8c8b8b] text-xs mb-3">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{wilaya}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#e9e9e9]">
          <div>
            <p className="text-xs text-[#8c8b8b]">Prix indicatif</p>
            <p className="font-bold text-[#141313] text-base" style={{fontFamily:'Barlow Condensed,sans-serif'}}>
              {parseInt(prix).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DZD
            </p>
          </div>
          <Link href={`/machines/${id}`} className="btn-primary text-xs py-2 px-4">
            Voir →
          </Link>
        </div>
      </div>
    </div>
  )
}
