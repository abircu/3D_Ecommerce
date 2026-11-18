import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/cart-context'

export default function Toast() {
  const { toast, setOpen } = useCart()

  return (
    <div className="toast-dock">
      <AnimatePresence>
        {toast && (
          <motion.button
            key={toast.id}
            type="button"
            className="toast"
            onClick={() => setOpen(true)}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            Added — {toast.name}
            <span>Open bag</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
