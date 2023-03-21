// Placeholder image in case none is available
const placeholderimg = 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg';
// Product class
class Product {
    constructor(title, price, imageLink, description) {
      this.title = title;
      this.price = price;
      this.imageLink = imageLink;
      this.description = description;
    }
  }
  
  // Function to fetch available products from a Shopify store
  async function fetchAvailableProducts(storeUrl) {
    try {
      const productsUrl = `${storeUrl}/products.json`;
        
      const response = await fetch(productsUrl);
      const data = await response.json();
  
      const availableProducts = data.products
        .filter((product) => product.available)
        .map(
          (product) =>
            new Product(
              product.title,
              product.variants[0].price,
              (product.images[0]??'').src??placeholderimg,
              product.body_html
            )
        );
  
      return availableProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  
  // Main function to fetch available products from all Shopify stores in products.json
  async function fetchProductsFromStores() {
    const storesResponse = await fetch("products.json");
    const storesData = await storesResponse.json();
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
  