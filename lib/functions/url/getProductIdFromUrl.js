// lib/functions/url/getProductIdFromUrl.js

export default function getProductIdFromUrl(req) {
  const segments = req.nextUrl.pathname.split("/");
  const productsIndex = segments.indexOf("products");

  if (productsIndex !== -1 && segments.length > productsIndex + 1) {
    return segments[productsIndex + 1];
  }

  return null;
}
