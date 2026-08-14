/**
 * The backend ProductResponse has no image field yet, so we derive a
 * representative food photo from the product name via LoremFlickr.
 * Swap this out once the API returns a real `imageUrl`.
 */
export function getFoodImageUrl(productName: string): string {
  const query = encodeURIComponent(productName.split(' ')[0] || 'food')
  return `https://loremflickr.com/400/300/${query},food`
}
