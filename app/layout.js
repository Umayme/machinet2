import './globals.css'
import Navbar from '../components/Navbar'
import ConditionalFooter from '../components/ConditionalFooter'

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
        <ConditionalFooter />
      </body>
    </html>
  )
}