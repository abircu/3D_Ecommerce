import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import Page from './components/Page'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Atelier from './pages/Atelier'
import Landing from './landing/Landing'

function pageClass(path) {
  if (path.startsWith('/product')) return 'product-page'
  if (path.startsWith('/shop')) return 'shop-page'
  if (path.startsWith('/atelier')) return 'atelier-page'
  return 'home-page'
}

function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={bar} className="progress" />
}

function Frame() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (location.pathname === '/') {
    return (
      <>
        <Landing />
        <CartDrawer />
        <Toast />
      </>
    )
  }

  return (
    <>
      <ScrollProgress />
      <div className="spotlight" />
      <div className="grain" />
      <Cursor />
      <Navbar />
      <CartDrawer />
      <Toast />
      <AnimatePresence mode="wait">
        <Page key={location.pathname} className={pageClass(location.pathname)}>
          <Routes location={location}>
            <Route path="/old" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route
              path="*"
              element={
                <header className="page-head wrap">
                  <p className="kicker">404</p>
                  <h1>Off the ring.</h1>
                </header>
              }
            />
          </Routes>
          <Footer />
        </Page>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Frame />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
