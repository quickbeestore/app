// ─── Shopify Storefront API Client ────────────────────────────────────────────

const SHOPIFY_DOMAIN  = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN    = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION     = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01';

const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch({ query, variables = {} }) {
  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }
  return json.data;
}

// ─── Helper: flatten edges ─────────────────────────────────────────────────
export function flattenEdges(connection) {
  return connection?.edges?.map((e) => e.node) ?? [];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts({ first = 20, sortKey = 'BEST_SELLING', query = '' } = {}) {
  const data = await shopifyFetch({
    query: `
      query GetProducts($first: Int!, $sortKey: ProductSortKeys, $query: String) {
        products(first: $first, sortKey: $sortKey, query: $query) {
          edges {
            node {
              id
              title
              handle
              productType
              tags
              priceRange {
                minVariantPrice { amount currencyCode }
              }
              compareAtPriceRange {
                minVariantPrice { amount currencyCode }
              }
              images(first: 3) {
                edges { node { url altText } }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                    quantityAvailable
                    priceV2 { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { first, sortKey, query },
  });

  return flattenEdges(data.products).map(normalizeProduct);
}

export async function getProductByHandle(handle) {
  const data = await shopifyFetch({
    query: `
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id title handle productType description
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id title availableForSale quantityAvailable
                priceV2 { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    `,
    variables: { handle },
  });

  return data.productByHandle ? normalizeProduct(data.productByHandle) : null;
}

// ─── Collections (Categories) ─────────────────────────────────────────────────

export async function getCollections(first = 30) {
  const data = await shopifyFetch({
    query: `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id title handle description
              image { url altText }
              products(first: 1) { edges { node { id } } }
            }
          }
        }
      }
    `,
    variables: { first },
  });

  return flattenEdges(data.collections);
}

export async function getCollectionProducts(handle, first = 20) {
  const data = await shopifyFetch({
    query: `
      query GetCollectionProducts($handle: String!, $first: Int!) {
        collectionByHandle(handle: $handle) {
          id title description
          image { url altText }
          products(first: $first) {
            edges {
              node {
                id title handle productType
                priceRange { minVariantPrice { amount currencyCode } }
                compareAtPriceRange { minVariantPrice { amount currencyCode } }
                images(first: 3) { edges { node { url altText } } }
                variants(first: 1) {
                  edges {
                    node {
                      id availableForSale quantityAvailable
                      priceV2 { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { handle, first },
  });

  const col = data.collectionByHandle;
  if (!col) return null;
  return {
    ...col,
    products: flattenEdges(col.products).map(normalizeProduct),
  };
}

// ─── Best Sellers (grouped by productType) ────────────────────────────────────

export async function getBestSellers(first = 50) {
  const products = await getProducts({ first, sortKey: 'BEST_SELLING' });
  // Group by productType (mirrors Android BestSeller model)
  const groups = {};
  products.forEach((p) => {
    const type = p.productType || 'Other';
    if (!groups[type]) groups[type] = { id: type, productType: type, products: [] };
    groups[type].products.push(p);
  });
  return Object.values(groups);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(searchQuery, first = 20) {
  return getProducts({ first, query: searchQuery });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(lines = []) {
  const data = await shopifyFetch({
    query: `
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id checkoutUrl
            lines(first: 50) { edges { node { ...CartLineFields } } }
            cost { totalAmount { amount currencyCode } }
          }
          userErrors { field message }
        }
      }
      ${CART_LINE_FRAGMENT}
    `,
    variables: { lines },
  });
  return data.cartCreate.cart;
}

export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id checkoutUrl
            lines(first: 50) { edges { node { ...CartLineFields } } }
            cost { totalAmount { amount currencyCode } }
          }
          userErrors { field message }
        }
      }
      ${CART_LINE_FRAGMENT}
    `,
    variables: { cartId, lines },
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId, lines) {
  const data = await shopifyFetch({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id checkoutUrl
            lines(first: 50) { edges { node { ...CartLineFields } } }
            cost { totalAmount { amount currencyCode } }
          }
        }
      }
      ${CART_LINE_FRAGMENT}
    `,
    variables: { cartId, lines },
  });
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await shopifyFetch({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id checkoutUrl
            lines(first: 50) { edges { node { ...CartLineFields } } }
            cost { totalAmount { amount currencyCode } }
          }
        }
      }
      ${CART_LINE_FRAGMENT}
    `,
    variables: { cartId, lineIds },
  });
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId) {
  const data = await shopifyFetch({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          id checkoutUrl
          lines(first: 50) { edges { node { ...CartLineFields } } }
          cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
        }
      }
      ${CART_LINE_FRAGMENT}
    `,
    variables: { cartId },
  });
  return data.cart;
}

const CART_LINE_FRAGMENT = `
  fragment CartLineFields on CartLine {
    id quantity
    merchandise {
      ... on ProductVariant {
        id title availableForSale quantityAvailable
        priceV2 { amount currencyCode }
        product {
          id title handle
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
    cost { totalAmount { amount currencyCode } }
  }
`;

// ─── Customer Auth ─────────────────────────────────────────────────────────────

export async function customerLogin(email, password) {
  const data = await shopifyFetch({
    query: `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { field message code }
        }
      }
    `,
    variables: { input: { email, password } },
  });
  return data.customerAccessTokenCreate;
}

export async function customerRegister(firstName, lastName, email, password) {
  const data = await shopifyFetch({
    query: `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id email firstName lastName }
          customerUserErrors { field message code }
        }
      }
    `,
    variables: { input: { firstName, lastName, email, password } },
  });
  return data.customerCreate;
}

export async function getCustomer(accessToken) {
  const data = await shopifyFetch({
    query: `
      query GetCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id firstName lastName email phone
          defaultAddress {
            id address1 address2 city province country zip
          }
          orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id name processedAt financialStatus fulfillmentStatus
                currentTotalPrice { amount currencyCode }
                lineItems(first: 10) {
                  edges {
                    node {
                      title quantity
                      variant {
                        priceV2 { amount currencyCode }
                        image { url altText }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { accessToken },
  });
  return data.customer;
}

export async function customerLogout(accessToken) {
  const data = await shopifyFetch({
    query: `
      mutation CustomerAccessTokenDelete($accessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $accessToken) {
          deletedAccessToken
          userErrors { field message }
        }
      }
    `,
    variables: { accessToken },
  });
  return data.customerAccessTokenDelete;
}

// ─── Normalize helpers ────────────────────────────────────────────────────────

function normalizeProduct(p) {
  const images = flattenEdges(p.images).map((img) => img.url);
  const firstVariant = flattenEdges(p.variants)[0];
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    productType: p.productType || '',
    tags: p.tags || [],
    price: firstVariant?.priceV2?.amount || p.priceRange?.minVariantPrice?.amount || '0',
    currencyCode: firstVariant?.priceV2?.currencyCode || 'INR',
    compareAtPrice: p.compareAtPriceRange?.minVariantPrice?.amount || null,
    available: firstVariant?.availableForSale ?? true,
    stock: firstVariant?.quantityAvailable ?? 99,
    variantId: firstVariant?.id,
    images,
    image: images[0] || null,
  };
}
