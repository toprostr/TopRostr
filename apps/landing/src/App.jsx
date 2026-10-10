import Footer from './components/Footer.jsx'
import Founders from './components/Founders.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import JoinCta from './components/JoinCta.jsx'
import Preview from './components/Preview.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-charcoal font-body text-off-white">
      <Header />
      <main>
        <Hero />
        <Founders />
        <Preview />
        <JoinCta />
      </main>
      <Footer />
    </div>
  )
}
