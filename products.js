class ProductManager {
  constructor() {
    this.products = [];
  }

  waitForMemberstack() {
    return new Promise((resolve) => {
      const checkMemberstack = () => {
        if (typeof window.$memberstackDom !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkMemberstack, 50);
        }
      };
      checkMemberstack();
    });
  }

  async init() {
    await this.waitForMemberstack();
    const response = await window.$memberstackDom.getCurrentMember();
    const creator_handle = response.data.customFields.handle;

    const fetchedProducts = await this.fetchAvailableProducts(creator_handle);
    const activeProductIds = await this.fetchActiveProducts();
    
    this.products = fetchedProducts.map((product) => ({
      ...product,
      active: activeProductIds.includes(product.id),
    }));

    return this;
  }

  async fetchAvailableProducts(creator_handle) {
    const apiUrl = `https://api.onbodega.com/products/${creator_handle}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const products = data.map((product) => {
      return new Product(
        product.id,
        product.title,
        product.price,
        product.image,
        product.store,
        product.url
      );
    });

    return products;
  }

  async fetchActiveProducts() {
    const memberstack = window.$memberstackDom;
    const response = await memberstack.getMemberJSON();

    if (response.data == null || JSON.stringify(response.data) == '{}') {
      return [];
    }
    return response.data.activeproducts;
  }

  async saveActiveProducts() {
    const memberstack = window.$memberstackDom;
    const activeProductIds = this.products
      .filter((product) => product.active)
      .map((product) => product.id);

    const output = await memberstack.updateMemberJSON({
      json: {
        activeproducts: activeProductIds,
      },
    });

    console.log(output);
    return output;
  }
}

// Product class
class Product {
  constructor(id, title, price, image, store, url) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.store = store;
    this.url = url;
    this.active = false;
  }
}
