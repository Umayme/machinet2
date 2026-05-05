// Normalize a machine record from the API to the shape expected by MachineCard.
// Handles both real DB format and legacy demo format.
export function normalizeMachine(m) {
  return {
    id: m.id,
    nom: m.nom || m.name || 'Machine industrielle',
    fournisseur: m.fournisseur || m.seller?.name || m.seller?.company || 'Vendeur',
    wilaya: m.wilaya,
    prix: String(m.prix || m.price || 0),
    type: m.type || m.condition || 'Vente neuf',
    secteur: m.secteur || m.category || 'Industrie',
    verifie: m.verifie ?? m.verified ?? false,
    photos: m.photos,
  }
}
