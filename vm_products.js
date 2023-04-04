$(document).ready(async function () {
  const $productTemplate = $("#productTemplate");
  const $productContainer = $("#products");
  const $searchInput = $("#ProductSearch");
  const $sortSelect = $("#ProductSort");
  const $filterSelect = $("#ProductFilter");
  const $username = $("#username");
  const $profilepic = $("#profilepic");
  const $userhandle = $("#userhandle");

  creator = new Creator();
  await creator.init();
  displayUserInfo();
  productManager = new ProductManager()
  await productManager.init();

  products = productManager.products;

  // Display user
  function displayUserInfo() {
    $userhandle.text(`@${creator.handle}`);
    $profilepic.attr("src", 'https://api.onbodega.com/'+creator.profile_picture["name"].replace("\\","/"));
    $profilepic.attr("srcset", "");
    $username.text(creator.name);
  }

  // Render products
  function renderProducts(productsToRender, container, template) {
    container.empty();
    productsToRender.forEach((product, index) => {
      let $productItem;
      $productItem = template.clone().removeAttr('id');
      container.append($productItem);
      $productItem.data("product", product);
      $productItem.find(".p_title").text(product.title);
      $productItem.find(".p_price").text(`$${product.price}`);
      $productItem.find(".p_image-link").attr("src", product.image);
      $productItem.find(".p_store").html(product.store);
      $productItem.find(".p_link").attr("href", product.url);
      $productItem.toggleClass("active", product.active);
      $productItem.show();
    });
  }

  // Display products
  function displayProducts() {
    renderProducts(products, $productContainer, $productTemplate);
  }

  // Search, sort, and filter products
  function updateProductDisplay() {
    const searchString = $searchInput.val().toLowerCase();
    const sortValue = $sortSelect.val();
    const filterValue = $filterSelect.val();

    let filteredProducts = products;

    if (searchString.trim() !== "") {
      filteredProducts = filterProducts(filteredProducts, searchString);
    }

    if (sortValue !== "default") {
      filteredProducts = sortProducts(filteredProducts, sortValue);
    }

    if (filterValue !== "all") {
      filteredProducts = filterProductsByCategory(filteredProducts, filterValue);
    }

    renderProducts(filteredProducts, $productContainer, $productTemplate);
  }

  function filterProducts(products, searchString) {
    return products.filter(product => {
      return product.title.toLowerCase().includes(searchString) ||
            product.url.toLowerCase().includes(searchString);
    });
  }

  function sortProducts(products, sortValue) {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (sortValue === "price_asc") {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortValue === "price_desc") {
        return parseFloat(b.price) - parseFloat(a.price);
      } else if (sortValue === "title_asc") {
        return a.title.localeCompare(b.title);
      } else if (sortValue === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return sortedProducts;
  }

  function filterProductsByCategory(products, filterValue) {
    return products.filter(product => product.store === filterValue);
  }
  // Event listeners
  $searchInput.on("input", updateProductDisplay);
  $sortSelect.on("change", updateProductDisplay);
  $filterSelect.on("change", updateProductDisplay);
  $productContainer.on("click", ".product-toggle", function () {
    const $productItem = $(this).closest(".product-item");
    const product = $productItem.data("product");

    product.active = !product.active;
    $productItem.toggleClass("active", product.active);
  });

  $("#savebutton").on("click", async () => {
    result = await productManager.saveActiveProducts();
    if (result) {
      originalButtonText = $("#savebutton").textContent;
      $("#savebutton").text("Successful!");
      setTimeout(() => {
        $("#savebutton").text(originalButtonText);
      }, 5000); // Revert the button text back to the original after 5 seconds
    } else {
      $("#savebutton").text("Something went wrong");
      $("#savebutton").css("color", "#DD2222");
      setTimeout(() => {
        $("#savebutton").text(originalButtonText);
        $("#savebutton").css("color", "");
      }, 5000); // Revert the button text and color back to the original after 5 seconds
    }
  });

  // Initial display
  displayProducts();
});