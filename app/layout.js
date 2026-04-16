import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'MachiNet — 1ère Plateforme B2B Machines en Algérie',
  description: 'Trouvez, comparez et sourcez vos machines industrielles en Algérie.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white min-h-screen grid-bg">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}