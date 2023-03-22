
$(document).ready(async function () {
  const products = await fetchProductsFromStores();
  const itemsPerPage = 20;
  let currentPage = 1;
  let isLoading = false;

  const memberstack = window.$memberstackDom;
  const $availabletemplate = $(".availabletemplate");
  const $availableContainer = $("#availableProducts");
  const $activeContainer = $("#activeProducts");
  const $searchInput = $("#ProductSearch");

  function renderProducts(products, container) {
    products.forEach((product, index) => {
      let $productItem;
      $productItem = $availabletemplate.clone().removeClass("availabletemplate");
      container.append($productItem);

      $productItem.find(".p_title").text(product.title);
      $productItem.find(".p_price").text(`$${product.price}`);
      $productItem.find(".p_image-link").attr("src", product.imageLink);
      $productItem.find(".p_store").html(product.store);
      $productItem.find(".p_link").attr("href", product.url);
      $productItem.find(".activateproduct").on("click", function () {
        toggleProductActivation($productItem, product);
      });
      $productItem.show();
    });
  }

  function toggleProductActivation($productItem, product) {
    const targetContainer = product.active ? $availableContainer : $activeContainer;
    const buttonText = product.active ? "Add to Store" : "Remove";
    $productItem.fadeOut(300, () => {
      $productItem.detach().appendTo(targetContainer);
      //showEmptyTextIfNoActiveProducts();
      $productItem.find(".activateproduct").text(buttonText);
      $productItem.fadeIn(300);
    });
    product.active= !product.active;
  }

  function loadMoreAvailableProducts() {
    if (isLoading) return;
    isLoading = true;

    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const slicedProducts = products.filter(p=>!p.active).slice(start, end);

    renderProducts(slicedProducts, $availableContainer);
    currentPage++;
    isLoading = false;
  }

  function isScrollNearBottom() {
    const threshold = 100;
    return ($(window).scrollTop() + $(window).height() > $(document).height() - threshold);
  }

  function onScroll() {
    if (isScrollNearBottom()) {
      loadMoreAvailableProducts();
    }
  }
  function filterProducts(searchString) {
    const filteredProducts = products.filter(product => {
      return product.title.toLowerCase().includes(searchString.toLowerCase());
    });

    $availableContainer.empty();
    $activeContainer.empty();
    currentPage = 1;

    renderProducts(filteredProducts.filter(product => !product.active), $availableContainer);
    renderProducts(filteredProducts.filter(product => product.active), $activeContainer);
  }

  $searchInput.on("input", function () {
    const searchString = $(this).val();
    if (searchString.trim() === "") {
      $availableContainer.empty();
      $activeContainer.empty();
      loadMoreAvailableProducts();
    } else {
      filterProducts(searchString);
    }
  });
  
  $(window).on("scroll", onScroll);
  $("savenow").on("scroll", onScroll);
  loadMoreAvailableProducts();

  async function loadActiveProducts() {
    data = await memberstack.getAppAndMember();
    activeProducts = JSON.parse(data.data.member.customFields.activeproducts);
    activeIDs = activeProducts.map(p=>p.id);
    products.forEach((p)=>p.active=(p.id in activeIDs));
    renderProducts(activeProducts, $activeContainer);
  }

  // Save button
  async function saveActiveProducts() {
    const activeProducts = products.filter((product)=>product.active);
    
    await memberstack.updateMember({
      customFields: {
        activeproducts: JSON.stringify(activeProducts)
      }
    })
    alert("Active products saved successfully!");
  }

  $("#savebutton").on("click", saveActiveProducts);
  loadActiveProducts();
});
