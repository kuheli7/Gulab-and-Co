import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { bySweetId } from '../data/sweets'
import { shop } from '../config/shop'

const CartContext = createContext(null)
const KEY = 'gc:dabba'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [qty, setQty] = useState(load) // { sweetId: boxes }

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(qty))
    } catch {
      /* storage blocked: cart still works in memory */
    }
  }, [qty])

  const change = useCallback((id, delta) => {
    setQty((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }
      if (!next[id]) delete next[id]
      return next
    })
  }, [])

  const addMany = useCallback((items) => {
    setQty((prev) => {
      const next = { ...prev }
      for (const [id, n] of Object.entries(items)) next[id] = (next[id] ?? 0) + n
      return next
    })
  }, [])

  const clear = useCallback(() => setQty({}), [])

  const value = useMemo(() => {
    const items = Object.entries(qty)
      .filter(([id]) => bySweetId[id])
      .map(([id, n]) => ({ ...bySweetId[id], qty: n }))
    const count = items.reduce((s, i) => s + i.qty, 0)
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
    const freeDelivery = subtotal >= shop.freeDeliveryAbove
    return { qty, items, count, subtotal, freeDelivery, change, addMany, clear }
  }, [qty, change, addMany, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
