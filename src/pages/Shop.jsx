import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { categories, products } from '../data/products'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All'
  const active = categories.includes(category) ? category : 'All'
  const list = useMemo(
    () => (active === 'All' ? products : products.filter((item) => item.category === active)),
    [active],
  )

  return (
    <>
      <header className="page-head wrap">
        <p className="kicker">Catalog / {String(list.length).padStart(2, '0')}</p>
        <h1>{active === 'All' ? 'All objects.' : active}</h1>
      </header>
      <div className="filters wrap">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={item === active ? 'is-on' : ''}
            onClick={() => {
              if (item === 'All') setParams({})
              else setParams({ category: item })
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="catalog wrap">
        <AnimatePresence mode="popLayout">
          {list.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 28, rotateX: 16 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: -8, scale: 0.96 }}
              style={{ transformPerspective: 900 }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
