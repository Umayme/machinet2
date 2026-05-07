import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'MachiNet',
  description: 'Trouvez, comparez et sourcez vos machines industrielles en Algérie.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white text-[#141313] min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}