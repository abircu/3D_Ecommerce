const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const products = [
  {
    id: 'helios',
    name: 'Helios Chrono',
    category: 'Horology',
    price: 2480,
    tag: 'Limited',
    edition: '08 / 40',
    materials: 'Grade-5 titanium, sapphire crystal',
    sizes: ['OS'],
    blurb:
      'A 41mm chronograph built to be watched from every angle. Brushed titanium, an acid second hand, and a 72-hour reserve.',
    images: [
      img('photo-1523275335684-37898b6baf30'),
      img('photo-1524592094714-0f0654e20314'),
    ],
  },
  {
    id: 'vanta',
    name: 'Vanta Runner',
    category: 'Footwear',
    price: 420,
    tag: 'New',
    edition: '01 / 200',
    materials: 'Engineered knit, carbon plate',
    sizes: ['40', '41', '42', '43', '44', '45'],
    blurb:
      'A race last pulled into street volume. The plate is stiff, the collar is quiet, the color hits once and stops.',
    images: [
      img('photo-1542291026-7eec264c27ff'),
      img('photo-1460353581641-37baddab0fa2'),
    ],
  },
  {
    id: 'halo',
    name: 'Halo Cans',
    category: 'Audio',
    price: 890,
    tag: 'Edition',
    edition: 'Closed cup',
    materials: 'Machined aluminum, 40mm drivers',
    sizes: ['OS'],
    blurb:
      'Closed cups with a heavy hinge and a low, physical bass. Designed to look like an instrument, not a gadget.',
    images: [
      img('photo-1505740420928-5e560c06d30e'),
      img('photo-1484704849700-f032a568e944'),
    ],
  },
  {
    id: 'noir',
    name: 'Noir 35',
    category: 'Imaging',
    price: 3200,
    tag: 'Archive',
    edition: 'Brass top',
    materials: 'Brass, leatherette, glass',
    sizes: ['Body'],
    blurb:
      'A compact rangefinder body with a brass top plate that will mark with use. The shutter is mechanical and loud on purpose.',
    images: [
      img('photo-1516035069371-29a1b244cc32'),
      img('photo-1452780212940-6f5c0d14d848'),
    ],
  },
  {
    id: 'eclipse',
    name: 'Eclipse Frame',
    category: 'Eyewear',
    price: 340,
    tag: 'Core',
    edition: 'Mineral lens',
    materials: 'Acetate, mineral glass',
    sizes: ['OS'],
    blurb:
      'A sharp acetate frame and dark mineral lenses. Light enough to forget, precise enough to notice in profile.',
    images: [
      img('photo-1511499767150-a48a237f0083'),
      img('photo-1572635196237-14b3f281503f'),
    ],
  },
  {
    id: 'arc',
    name: 'Arc Satchel',
    category: 'Leather',
    price: 1150,
    tag: 'Limited',
    edition: 'Hide 19',
    materials: 'Vegetable-tanned leather, brass',
    sizes: ['OS'],
    blurb:
      'One compartment, a wrapped handle, and hardware that is allowed to tarnish. It holds a camera, a book, nothing else.',
    images: [
      img('photo-1548036328-c9fa89d128fa'),
      img('photo-1590874103328-eac38a683ce7'),
    ],
  },
  {
    id: 'ion',
    name: 'Ion Parka',
    category: 'Apparel',
    price: 760,
    tag: 'Season',
    edition: 'Waxed',
    materials: 'Waxed cotton, recycled insulation',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    blurb:
      'A short parka with a hard waxed shell and a quiet lining. Cut to move, not to balloon.',
    images: [
      img('photo-1591047139829-d91aecb6caea'),
      img('photo-1539533018447-63fcce2678e3'),
    ],
  },
  {
    id: 'sable',
    name: 'Sable Extract',
    category: 'Scent',
    price: 220,
    tag: 'Core',
    edition: 'Extrait',
    materials: 'Bergamot, smoke, amber',
    sizes: ['50 ml', '100 ml'],
    blurb:
      'Citrus first, then a dry smoke, then amber that stays on wool. Mixed to read the same at noon and at midnight.',
    images: [
      img('photo-1541643600914-78b084683601'),
      img('photo-1594035910387-fea47794261f'),
    ],
  },
]

export const categories = ['All', ...new Set(products.map((p) => p.category))]

export function getProduct(id) {
  return products.find((p) => p.id === id)
}

export function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

export const atelierImage = img('photo-1441986300917-64674bd600d8', 1800)
