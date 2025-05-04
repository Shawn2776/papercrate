// lib/functions/url/getProductIdFromUrl.js

export default function getProductIdFromUrl(req) {
  const segments = req.nextUrl.pathname.split("/");
  const productsIndex = segments.indexOf("products");

  if (productsIndex !== -1 && segments.length > productsIndex + 1) {
    return segments[productsIndex + 1];
  }

  return null;
}

export function getServiceIdFromUrl(req) {
  const segments = req.nextUrl.pathname.split("/");
  const servicesIndex = segments.indexOf("services");

  if (servicesIndex !== -1 && segments.length > servicesIndex + 1) {
    return segments[servicesIndex + 1];
  }

  return null;
}

export function getCustomerIdFromUrl(req) {
  const segments = req.nextUrl.pathname.split("/");
  const customersIndex = segments.indexOf("customers");

  if (customersIndex !== -1 && segments.length > customersIndex + 1) {
    return segments[customersIndex + 1];
  }

  return null;
}
