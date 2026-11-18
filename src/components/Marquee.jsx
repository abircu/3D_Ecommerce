const WORDS = ['Horology', 'Footwear', 'Audio', 'Imaging', 'Eyewear', 'Leather', 'Apparel', 'Scent', 'Limited']

function Group() {
  return (
    <div className="marquee-group">
      {WORDS.map((word) => (
        <span key={word}>
          {word}
          <i />
        </span>
      ))}
    </div>
  )
}

export default function Marquee({ reverse = false }) {
  return (
    <div className={`marquee ${reverse ? 'is-reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  )
}
