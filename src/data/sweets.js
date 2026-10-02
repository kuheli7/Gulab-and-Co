// Prices are per 500 g box, in ₹. `image` paths live in /public/images.
export const categories = ['Barfi & Katli', 'Laddoo', 'Syrup Soaked', 'Kulfi & Malai']

export const sweets = [
  { id: 'kaju-katli', name: 'Kaju Katli', hindi: 'काजू कतली', category: 'Barfi & Katli', price: 560, tag: 'Bestseller', note: 'Silver-leafed cashew fudge that melts on the tongue.', ingredients: 'Cashew, sugar, desi ghee, chandi varq', image: '/images/kaju-katli.jpg' },
  { id: 'pista-barfi', name: 'Pista Barfi', hindi: 'पिस्ता बर्फी', category: 'Barfi & Katli', price: 520, tag: 'New', note: 'Slow-roasted pistachio, finished with rose.', ingredients: 'Pistachio, khoya, sugar, rose water', image: '/images/pista-barfi.jpg' },
  { id: 'motichoor', name: 'Motichoor Laddoo', hindi: 'मोतीचूर लड्डू', category: 'Laddoo', price: 260, tag: 'Festive pick', note: 'Fine boondi pearls, saffron, pistachio slivers.', ingredients: 'Besan, sugar syrup, desi ghee, kesar, pista', image: '/images/motichoor-laddoo.jpg' },
  { id: 'besan-laddoo', name: 'Besan Laddoo', hindi: 'बेसन लड्डू', category: 'Laddoo', price: 240, note: 'Gram flour roasted slow in ghee, cardamom warm.', ingredients: 'Besan, desi ghee, sugar, elaichi', image: '/images/besan-laddoo.jpg' },
  { id: 'gulab-jamun', name: 'Gulab Jamun', hindi: 'गुलाब जामुन', category: 'Syrup Soaked', price: 210, tag: 'Our namesake', note: 'Khoya hearts soaked in rose-cardamom syrup.', ingredients: 'Khoya, sugar syrup, rose, elaichi', image: '/images/gulab-jamun.jpg' },
  { id: 'jalebi', name: 'Kesar Jalebi', hindi: 'केसर जलेबी', category: 'Syrup Soaked', price: 190, tag: 'Best warm', note: 'Crisp coils dipped in saffron syrup, still warm.', ingredients: 'Maida, desi ghee, kesar, sugar syrup', image: '/images/jalebi.jpg' },
  { id: 'kulfi', name: 'Kesaria Kulfi', hindi: 'केसरिया कुल्फी', category: 'Kulfi & Malai', price: 280, note: 'Dense saffron kulfi, churned by hand overnight.', ingredients: 'Full-cream milk, kesar, pista, sugar', image: '/images/kulfi.jpg' },
  { id: 'rabri', name: 'Malai Rabri', hindi: 'मलाई रबड़ी', category: 'Kulfi & Malai', price: 320, note: 'Milk reduced for hours, layered with pista.', ingredients: 'Full-cream milk, sugar, pista, kesar', image: '/images/rabri.jpg' },
]

// Ready-made gift boxes: quantities are boxes of 500 g.
export const hampers = [
  { id: 'classic', name: 'The Classic Dabba', hindi: 'क्लासिक डिब्बा', blurb: 'Kaju katli, motichoor and besan laddoo. The safe, loved-by-all box.', items: { 'kaju-katli': 1, motichoor: 1, 'besan-laddoo': 1 } },
  { id: 'shahi', name: 'The Shahi Dabba', hindi: 'शाही डिब्बा', blurb: 'Katli, pista barfi, gulab jamun and jalebi for a proper feast.', items: { 'kaju-katli': 1, 'pista-barfi': 1, 'gulab-jamun': 1, jalebi: 1 } },
  { id: 'diwali', name: 'The Diwali Dabba', hindi: 'दिवाली डिब्बा', blurb: 'Two katli, motichoor, pista barfi and rabri. Gold box, red thread.', items: { 'kaju-katli': 2, motichoor: 1, 'pista-barfi': 1, rabri: 1 } },
]

export const bySweetId = Object.fromEntries(sweets.map((s) => [s.id, s]))
