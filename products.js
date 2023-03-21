const storesData = {
  "stores": [
    "https://mybacs.com",
    "https://www.on-vacation.club"
  ]
}

// Product class
class Product {
  constructor(title, price, imageLink, description) {
    this.title = title;
    this.price = price;
    this.imageLink = imageLink;
    this.description = description;
  }
}

// Function to fetch available products from a Shopify store with pagination
async function fetchAvailableProducts(storeUrl) {
  const placeholderImage = "https://via.placeholder.com/150";
  let sinceId = 0;
  let hasNextPage = true;
  let availableProducts = [];

  while (hasNextPage) {
    try {
      const productsUrl = sinceId==0?
          `${storeUrl}/products.json`:
          `${storeUrl}/products.json?since_id=${sinceId}`;
      const response = await fetch(productsUrl);
      const data = await response.json();

      if (data.products.length === 0) {
        hasNextPage = false;
        continue;
      }

      const products = data.products
        .filter((product) => product.variants.some((variant) => variant.available))
        .map((product) => {
          const imageLink = product.images.length > 0 ? product.images[0].src : placeholderImage;

          return new Product(
            product.title,
            product.variants[0].price,
            imageLink,
            product.body_html
          );
        });

      availableProducts = [...availableProducts, ...products];
      sinceId = data.products[data.products.length - 1].id;
    } catch (error) {
      console.error("Error fetching products:", error);
      hasNextPage = false;
    }
  }

  return availableProducts;
}

// Main function to fetch available products from all Shopify stores in products.json
async function fetchProductsFromStores() {
  //const storesResponse = await fetch("https://cdn.jsdelivr.net/gh/sfaist/bodega_web@main/products.json");
  //const storesData = await storesResponse.json();
  const stores = storesData.stores;

  const allProducts = [];

  for (const store of stores) {
    const products = await fetchAvailableProducts(store);
    allProducts.push(...products);
  }

  return allProducts;
}

// Fetch and log available products
fetchProductsFromStores().then((products) => console.log(products));  