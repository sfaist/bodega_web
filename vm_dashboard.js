
$(document).ready(async function () {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const activeProducts = await fetchActiveProducts();
  const $activeTemplate = $("#activeTemplate");
  const $activeContainer = $("#activeProducts");

  function renderProducts(productsToRender, container, template) {
    container.empty();
    productsToRender.forEach((product, index) => {
      let $productItem;
      $productItem = template.clone().removeAttr('id');
      container.append($productItem);
      $productItem.find(".p_title").text(product.title);
      $productItem.find(".p_image-link").attr("src", product.imageLink);
      $productItem.find(".p_store").html(product.store);
      $productItem.find(".p_link").attr("href", product.url);
      $productItem.show();
    });
    
  }
  function displayActiveProducts() {
    renderProducts(activeProducts, $activeContainer, $activeTemplate);
  }
  displayActiveProducts();
});