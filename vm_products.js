$(document).ready(async function () {
  const $availableTemplate = $("#availableTemplate");
  const $activeTemplate = $("#activeTemplate");
  const $availableContainer = $("#availableProducts");
  const $activeContainer = $("#activeProducts");
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

  availableProducts = productManager.availableProducts;
  activeProducts = productManager.activeProducts;


  // Set up drag-and-drop functionality
  $(".product-list").sortable({
    connectWith: ".connectedsortable",
    handle: ".product-dragger",
    start: function (event, ui) {
      ui.item.addClass("dragging");
    },
    stop: function (event, ui) {
      ui.item.removeClass("dragging");
    },
    over: function (event, ui) {
      $(this).addClass("highlight");
    },
    out: function (event, ui) {
      $(this).removeClass("highlight");
    },
    receive: function (event, ui) {
      const product = ui.item.data("product");
      const isActive = $(this).hasClass("active-products");

      if (isActive) {
        availableProducts.splice(availableProducts.indexOf(product), 1);
        activeProducts.push(product);
      } else {
        activeProducts.splice(activeProducts.indexOf(product), 1);
        availableProducts.push(product);
      }

      product.active = isActive;
    },
  });
  

  // Display user
  function displayUserInfo() {
    $userhandle.text(`@${creator.handle}`);
    $profilepic.attr("src", creator.profile_picture);
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
      $productItem.show();
    });
  }

  // Display products
  function displayProducts() {
    renderProducts(availableProducts, $availableContainer, $availableTemplate);
    renderProducts(activeProducts, $activeContainer, $activeTemplate);
  }

  // Search, sort, and filter products
  function updateProductDisplay() {
    const searchString = $searchInput.val().toLowerCase();
    const sortValue = $sortSelect.val();
    const filterValue = $filterSelect.val();

    let filteredAvailableProducts = availableProducts;
    let filteredActiveProducts = activeProducts;

    if (searchString.trim() !== "") {
      filteredAvailableProducts = filterProducts(filteredAvailableProducts, searchString);
      filteredActiveProducts = filterProducts(filteredActiveProducts, searchString);
    }

    if (sortValue !== "default") {
      filteredAvailableProducts = sortProducts(filteredAvailableProducts, sortValue);
      filteredActiveProducts = sortProducts(filteredActiveProducts, sortValue);
    }

    if (filterValue !== "all") {
      filteredAvailableProducts = filterProductsByCategory(filteredAvailableProducts, filterValue);
      filteredActiveProducts = filterProductsByCategory(filteredActiveProducts, filterValue);
    }

    renderProducts(filteredAvailableProducts, $availableContainer, $availableTemplate);
    renderProducts(filteredActiveProducts, $activeContainer, $activeTemplate);
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
  $("#savebutton").on("click", async () => {
    result = await productManager.saveActiveProducts();
    if (result) {
      originalButtonText = $("#savebutton").textContent
      $("#savebutton").html = "Successful!";
      setTimeout((originalButtonText) => {
        $("#savebutton").html = originalButtonText;
      }, 5000); // Revert the button text back to the original after 5 seconds
    } 
    else{
      $("#savebutton").html = "Something went wrong";
      $("#savebutton").color = "#DD2222";
      setTimeout(() => {
        $("#savebutton").html = originalButtonText;
      }, 5000); // Revert the button text back to the original after 5 seconds
    }
  
  });

  // Initial display
  displayProducts();
});
