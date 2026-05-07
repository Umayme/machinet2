import { PrismaClient } from './app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Find or create a test seller
  let seller = await prisma.user.findFirst({
    where: { role: 'seller', approved: true }
  })

  if (!seller) {
    const bcrypt = await import('bcryptjs')
    seller = await prisma.user.create({
      data: {
        email: 'test-vendeur@machinet.dz',
        password: await bcrypt.default.hash('Test1234!', 10),
        name: 'Vendeur Test',
        phone: '0550000001',
        company: 'SARL Test Machines',
        wilaya: 'Alger',
        sector: 'Industrie générale',
        role: 'seller',
        approved: true,
      }
    })
    console.log('✅ Seller created:', seller.email)
  } else {
    console.log('✅ Using existing seller:', seller.email)
  }

  // 2. Create 3 test machines
  const machines = [
    {
      name: 'Compresseur à vis Atlas Copco GA 37',
      category: 'Industrie générale',
      price: 850000,
      condition: 'Occasion',
      wilaya: 'Alger',
      description: 'Compresseur à vis 37 kW, 2018, 4 200 heures de fonctionnement. Très bon état général, révisé en 2023. Idéal pour atelier de production.',
      specs: JSON.stringify({
        'Puissance': '37 kW',
        'Débit': '220 l/min',
        'Pression': '10 bar',
        'Année': '2018',
        'Heures': '4 200 h',
        'Marque': 'Atlas Copco',
        'Modèle': 'GA 37',
      }),
      photos: JSON.stringify(['/placeholder-machine.jpg']),
      sellerId: seller.id,
      verified: true,
    },
    {
      name: 'Tracteur agricole John Deere 5075E',
      category: 'Agriculture',
      price: 3200000,
      condition: 'Vente neuf',
      wilaya: 'Sétif',
      description: 'Tracteur neuf 75 ch, boîte synchronisée 12AV/4AR. Livraison possible dans les wilayas limitrophes. Stock disponible.',
      specs: JSON.stringify({
        'Puissance': '75 ch',
        'Transmission': '12AV / 4AR',
        'Prise de force': '540/1000 tr/min',
        'Levage': '2 800 kg',
        'Marque': 'John Deere',
        'Modèle': '5075E',
        'État': 'Neuf',
      }),
      photos: JSON.stringify(['/placeholder-machine.jpg']),
      sellerId: seller.id,
      verified: true,
    },
    {
      name: 'Excavatrice Caterpillar 320D',
      category: 'Bâtiment & Travaux Publics',
      price: 9500000,
      condition: 'Occasion',
      wilaya: 'Oran',
      description: 'Pelle hydraulique 20 tonnes, 2019, 6 800 heures. Godet 1 m³ inclus. Bon état de marche, disponible immédiatement.',
      specs: JSON.stringify({
        'Poids opérationnel': '20 300 kg',
        'Puissance nette': '103 kW',
        'Profondeur de fouille': '6 700 mm',
        'Année': '2019',
        'Heures': '6 800 h',
        'Marque': 'Caterpillar',
        'Modèle': '320D',
      }),
      photos: JSON.stringify(['/placeholder-machine.jpg']),
      sellerId: seller.id,
      verified: true,
    },
  ]

  for (const m of machines) {
    const created = await prisma.machine.create({ data: m })
    console.log(`✅ Machine créée: ${created.name} — ${created.price.toLocaleString('fr-DZ')} DZD`)
  }

  console.log('\n🎉 3 annonces test ajoutées avec succès !')
}

main()
  .catch(e => { console.error('❌ Erreur:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
