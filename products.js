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
        .filter((product) => product.variants.some((variant) => variant.available && product.images.length > 0))
        .map((product) => {
          const imageLink = product.images[0].src;

          return new Product(
            product.title,
            product.variants[0].price,
            imageLink,
            productsUrl.split('/')[2],
            `${storeUrl}/products/${product.handle}`
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

async function fetchActiveProducts() {
  const memberstack = window.$memberstackDom;
  response = await memberstack.getMemberJSON();
  try{
    activeProducts = response.data.activeproducts;
    return activeProducts;  
  }
  catch{}
  return [];
}

// Save button
async function saveActiveProducts(activeProducts) {  
  const memberstack = window.$memberstackDom;
  let output = await memberstack.updateMemberJSON({
    json: {
      activeproducts: activeProducts
    }
  })
  console.log(output);
}

// Fetch and log available products
//fetchProductsFromStores().then((products) => console.log(products));  