export function countDiscount(price: number, discount: number): number {
  const discountPrice = price * (discount / 100);

  return price - discountPrice;
}