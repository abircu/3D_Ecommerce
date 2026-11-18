import { Link } from 'react-router-dom'
import { money } from '../data/products'
import Tilt from './Tilt'

export default function ProductCard({ product, large = false }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className={`pcard ${large ? 'is-large' : ''}`}
      data-cursor="view"
    >
      <Tilt max={11}>
        <div className="pcard-media">
          <img src={product.images[0]} alt={product.name} draggable="false" />
          <span className="pcard-tag">{product.tag}</span>
        <span className="lvl">LV {Math.max(1, Math.round(product.price / 400))}</span>
        </div>
        <div className="pcard-meta">
          <span>{product.category}</span>
          <h3>{product.name}</h3>
          <b>{money(product.price)}</b>
        </div>
      </Tilt>
    </Link>
  )
}
