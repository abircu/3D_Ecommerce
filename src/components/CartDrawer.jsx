import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/cart-context'
import { money } from '../data/products'

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, total, placeOrder, order, setOrder } = useCart()
  const closeRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="backdrop"
            aria-label="Close bag"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="drawer-head">
              <div>
                <p className="kicker">Bag</p>
                <h2>{order ? 'Order noted' : 'Your objects'}</h2>
              </div>
              <button ref={closeRef} type="button" className="icon-btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </header>

            {order ? (
              <div className="order-note">
                <p className="kicker">Preview checkout</p>
                <strong>{order}</strong>
                <p>
                  Nothing was charged. This store has no backend — the reference lives only in this
                  session.
                </p>
                <button
                  type="button"
                  className="btn btn-acid"
                  onClick={() => {
                    setOrder(null)
                    setOpen(false)
                  }}
                >
                  Back to the floor
                </button>
              </div>
            ) : items.length === 0 ? (
              <p className="drawer-empty">The bag is empty. Pull something out of orbit.</p>
            ) : (
              <>
                <ul className="bag-list">
                  {items.map((item) => (
                    <li key={item.key}>
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.size} · {money(item.price)}
                        </span>
                        <div className="qty">
                          <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease">
                            −
                          </button>
                          <em>{item.qty}</em>
                          <button type="button" onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase">
                            +
                          </button>
                        </div>
                      </div>
                      <button type="button" className="text-btn" onClick={() => remove(item.key)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <footer className="drawer-foot">
                  <div>
                    <span>Total</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <button type="button" className="btn btn-acid" onClick={placeOrder}>
                    Place preview order
                  </button>
                  <p>Demo only. No payment, no account, no shipment.</p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
