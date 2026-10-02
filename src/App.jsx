import { usePath } from './lib/router'
import { CartProvider } from './state/CartContext'
import { Header, BottomBar, Footer, WhatsAppFab } from './components/Layout'
import HomePage from './pages/Home'
import SweetsPage from './pages/Sweets'
import GiftingPage from './pages/Gifting'
import StoryPage from './pages/Story'
import ContactPage from './pages/Contact'
import DabbaPage from './pages/Dabba'

const routes = {
  '/': HomePage,
  '/sweets': SweetsPage,
  '/gifting': GiftingPage,
  '/story': StoryPage,
  '/contact': ContactPage,
  '/dabba': DabbaPage,
}

const titles = {
  '/': 'Gulab & Co. | Handmade Mithai, Basavanagudi, Bengaluru',
  '/sweets': 'The Counter | Gulab & Co.',
  '/gifting': 'Festive & Wedding Gifting | Gulab & Co.',
  '/story': 'Our Story | Gulab & Co.',
  '/contact': 'Visit & Contact | Gulab & Co.',
  '/dabba': 'Your Dabba | Gulab & Co.',
}

export default function App() {
  const raw = usePath()
  const path = raw.length > 1 ? raw.replace(/\/$/, '') : raw
  const Page = routes[path] ?? HomePage
  document.title = titles[path] ?? titles['/']

  return (
    <CartProvider>
      <Header path={path} />
      <main id="top" key={path}>
        <Page />
      </main>
      <Footer />
      <WhatsAppFab />
      <BottomBar path={path} />
    </CartProvider>
  )
}
