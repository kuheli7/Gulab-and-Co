// Everything shop-specific lives here (plus data/sweets.js, public/images and the @theme block in index.css).
// Swap these values to re-skin the site for another mithai shop.
export const shop = {
  name: 'Gulab & Co.',
  nameHindi: 'मिठाई घर',
  tagline: 'Sweetness, the way Bengaluru remembers it.',
  since: 1974,
  phone: '+91 98450 00000',
  whatsapp: '919845000000', // country code + number, no + or spaces
  email: 'contact@gulabandco.example',
  address: '42, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru 560004',
  hours: [
    { days: 'Mon – Sun', time: '8 am – 10 pm' },
    { days: 'Diwali', time: 'Open till late (closed in the afternoon, obviously)' },
  ],
  openHour: 8,
  closeHour: 22,
  mapQuery: 'Gandhi Bazaar, Basavanagudi, Bengaluru',
  mapEmbed: 'https://www.google.com/maps?q=Gandhi+Bazaar,+Basavanagudi,+Bengaluru&output=embed',
  instagram: '#',
  currency: '₹',
  freeDeliveryAbove: 999,
  deliveryFee: 80,
  sameDayCutoff: '2 pm',
  announcement: 'Free delivery across Bengaluru on dabbas above ₹999 · Same-day if you order before 2 pm',
  // Shown on the site and the footer. Set to false for a real client.
  demoMode: true,
}
