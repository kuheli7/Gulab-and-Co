import { shop } from './config/shop'

export const money = (n) => `${shop.currency}${n.toLocaleString('en-IN')}`

export function isOpenNow(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60
  return h >= shop.openHour && h < shop.closeHour
}
