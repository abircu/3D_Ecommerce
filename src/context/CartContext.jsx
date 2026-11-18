import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CartContext } from './cart-context'

const STORAGE = 'aether-cart'

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [order, setOrder] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(items))
  }, [items])

  useEffect(() => () => clearTimeout(timer.current), [])

  const add = useCallback((product, size = 'OS', qty = 1) => {
    const key = `${product.id}-${size}`
    setItems((prev) => {
      const found = prev.find((item) => item.key === key)
      if (found) {
        return prev.map((item) => (item.key === key ? { ...item, qty: item.qty + qty } : item))
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          qty,
        },
      ]
    })
    setToast({ id: Date.now(), name: product.name })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 1700)
  }, [])

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((item) => item.key !== key)
      return prev.map((item) => (item.key === key ? { ...item, qty } : item))
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const placeOrder = useCallback(() => {
    if (!itemsRef.current.length) return
    setOrder(`AE-${Math.floor(1000 + Math.random() * 9000)}`)
    setItems([])
  }, [])

  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      toast,
      order,
      setOrder,
      count,
      total,
      add,
      remove,
      setQty,
      clear,
      placeOrder,
    }),
    [items, open, toast, order, count, total, add, remove, setQty, clear, placeOrder],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
