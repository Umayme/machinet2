import Link from 'next/link'

export default function MachineCard({ machine }) {
    const {
        id = '1',
        nom = 'Machine Industrielle',
        fournisseur = 'SARL Pro Machines',
        wilaya = 'Alger',
        prix = '4500000',
        type = 'Vente neuf',
        secteur = 'IAA',
        verifie = true,
    } = machine || {}

    const secteurColors = {
        'IAA': 'bg-green-900/30 text-green-400 border-green-800/40',
        'BTP': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
        'Agricole': 'bg-lime-900/30 text-lime-400 border-lime-800/40',
        'Pharma': 'bg-blue-900/30 text-blue-400 border-blue-800/40',
        'Textile': 'bg-pink-900/30 text-pink-400 border-pink-800/40',
        'Mining': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    }

    return (
        <div className="card group cursor-pointer overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-black overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-purple-800/30 flex items-center justify-center opacity-40">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                </div>
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {verifie && <span className="badge-verified">Vérifié</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${secteurColors[secteur] || 'bg-purple-900/30 text-purple-400 border-purple-800/40'}`}>
                        {secteur}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="bg-black/60 text-gray-300 text-xs px-2 py-1 rounded-md">{type}</span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-semibold text-white text-base mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {nom}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{fournisseur}</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                    <span>{wilaya}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Prix indicatif</p>
                        <p className="text-purple-400 font-bold text-lg">
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