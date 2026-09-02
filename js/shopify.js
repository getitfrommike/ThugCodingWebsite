
/* =========================================================

const SHOPIFY_DOMAIN = "end47d-gg.myshopify.com";

const STOREFRONT_ACCESS_TOKEN =
  "a4aa6196e6d7a4a21938d6ce574aa4b5";

const endpoint =
  `https://${SHOPIFY_DOMAIN}/api/2026-04/graphql.json`;

export async function shopifyFetch(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();

  return data;
}

========================================================= */
