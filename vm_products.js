
$(document).ready(async function () {
  const availableProducts = await fetchProductsFromStores();
  const activeProducts = await fetchActiveProducts();
  const itemsPerPage = 20;
  let currentPage = 1;

  const $availableTemplate = $("#availabletemplate");
  const $activeTemplate = $("#activetemplate");
  const $availableContainer = $("#availableProducts");
  const $activeContainer = $("#activeProducts");
  const $searchInput = $("#ProductSearch");

  function renderProducts(productsToRender, container, template) {
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
    if(productsToRender.length==0)
      container.find(".nothinghere").show();
    else 
      container.find(".nothinghere").hide();
  }

  function toggleProductActivation($productItem, product) {
    product.active = !product.active;
    $productItem.fadeOut(300, () => {
      if(product.active){
        activeProducts.splice(activeProducts.indexOf(product),1);
        availableProducts.push(product);
      }
      else{
        availableProducts.splice(availableProducts.indexOf(product),1);
        activeProducts.push(product);
      }
      displayActiveProducts();
      displayAvailableProducts();    
      $productItem.fadeIn(300);
    });
  }

  function displayAvailableProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const slicedProducts = availableProducts.slice(start, end);

    renderProducts(slicedProducts, $availableContainer, $availableTemplate);
    currentPage++;
  }

  function displayActiveProducts() {
    renderProducts(activeProducts, $activeContainer, $activeTemplate);
  }
  function isScrollNearBottom() {
    const threshold = 100;
    return ($(window).scrollTop() + $(window).height() > $(document).height() - threshold);
  }
  function onScroll() {
    if (isScrollNearBottom()) {
      displayAvailableProducts();
    }
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

    $availableContainer.empty();
    $activeContainer.empty();
    currentPage = 1;

    renderProducts(filteredAvailableProducts, $availableContainer,$availableTemplate);
    renderProducts(filteredActiveProducts, $activeContainer, $activeTemplate);
  }

  $searchInput.on("input", function () {
    const searchString = $(this).val();
    if (searchString.trim() === "") {
      $availableContainer.empty();
      $activeContainer.empty();
      displayAvailableProducts();
    } else {
      filterProducts(searchString);
    }
  });
  
  $(window).on("scroll", onScroll);
  $("#savebutton").on("click", ()=>saveActiveProducts(activeProducts));
  displayAvailableProducts();
  displayActiveProducts();
});