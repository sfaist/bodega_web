// Product class
class Product {
  constructor(title, price, imageLink, store, url) {
    this.title = title;
    this.price = price;
    this.imageLink = imageLink;
    this.store = store;
    this.url = url;
  }
}

// Function to fetch available products from a Shopify store with pagination
async function fetchAvailableProducts(storeUrl) {
  const placeholderImage = "https://via.placeholder.com/150";
  let page = 1;
  let hasNextPage = true;
  let availableProducts = [];

  while (hasNextPage) {
    try {
      const productsUrl = `${storeUrl}/products.json?page=${page}`;
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
            productsUrl.split('/')[2],
            productsUrl
          );
        });

      availableProducts = [...availableProducts, ...products];
      page = page+1;
    } catch (error) {
      console.error("Error fetching products:", error);
      hasNextPage = false;
    }
  }

  return availableProducts;
}

// Main function to fetch available products from all Shopify stores in products.json
async function fetchProductsFromStores() {
  //requires stores.js to be loaded
  const stores = storesData.stores;

  const allProducts = [];

  for (const store of stores) {
    const products = await fetchAvailableProducts(store);
    allProducts.push(...products);
  }

  return allProducts;
}

// Fetch and log available products
//fetchProductsFromStores().then((products) => console.log(products));  