
$(document).ready(async function () {
  availableProducts = await fetchProductsFromStores();
  activeProducts = await fetchActiveProducts();
  availableProducts=availableProducts.filter((p)=>!(p in activeProducts));

  const $availableTemplate = $("#availableTemplate");
  const $activeTemplate = $("#activeTemplate");
  const $availableContainer = $("#availableProducts");
  const $activeContainer = $("#activeProducts");
  const $searchInput = $("#ProductSearch");

  function renderProducts(productsToRender, container, template) {
    container.empty();
    productsToRender.forEach((product, index) => {
      let $productItem;
      $productItem = template.clone().removeAttr('id');
      container.append($productItem);
      $productItem.find(".p_title").text(product.title);
      $productItem.find(".p_price").text(`$${product.price}`);
      $productItem.find(".p_image-link").attr("src", product.imageLink);
      $productItem.find(".p_store").html(product.store);
      $productItem.find(".p_link").attr("href", product.url);
      $productItem.find(".toggleproduct").on("click", function () {
        toggleProductActivation($productItem, product);
      });
      $productItem.show();
    });
  }

  function toggleProductActivation($productItem, product) {
    $productItem.fadeOut(300, () => {
      if(product.active){
        activeProducts.splice(activeProducts.indexOf(product),1);
        availableProducts.push(product);
      }
      else{
        availableProducts.splice(availableProducts.indexOf(product),1);
        activeProducts.push(product);
      }
      product.active = !product.active;
      displayActiveProducts();
      displayAvailableProducts();    
      $productItem.fadeIn(300);
    });
  }

  function displayAvailableProducts() {
    renderProducts(availableProducts, $availableContainer, $availableTemplate);
  }
  function displayActiveProducts() {
    renderProducts(activeProducts, $activeContainer, $activeTemplate);
  }
  function filterProducts(searchString) {
    searchString = searchString.toLowerCase();
    const filteredAvailableProducts = availableProducts.filter(product => {
      return product.title.toLowerCase().includes(searchString) ||
            product.url.toLowerCase().includes(searchString);
    });
    const filteredActiveProducts = activeProducts.filter(product => {
      return product.title.toLowerCase().includes(searchString) ||
            product.url.toLowerCase().includes(searchString);
    });
    renderProducts(filteredAvailableProducts, $availableContainer,$availableTemplate);
    renderProducts(filteredActiveProducts, $activeContainer, $activeTemplate);
  }

  $searchInput.on("input", function () {
    const searchString = $(this).val();
    if (searchString.trim() === "") {
      displayActiveProducts();
      displayAvailableProducts();
    } else {
      filterProducts(searchString);
    }
  });
  $("#savebutton").on("click", ()=>saveActiveProducts(activeProducts));
  displayAvailableProducts();
  displayActiveProducts();
});