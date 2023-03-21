$(document).ready(async function () {
  const products = await fetchProductsFromStores();
  const itemsPerPage = 10;
  let currentPage = 1;

  const $template = $(".availabletemplate");
  const $parent = $template.parent();

  function renderProducts(products, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    products.slice(startIndex, endIndex).forEach((product) => {
      const $productItem = $template.clone().removeClass("availabletemplate");

      $productItem.find(".p_title").text(product.title);
      $productItem.find(".p_price").text(`$${product.price}`);
      $productItem.find(".p_image-link").attr("src", product.imageLink);
      $productItem.find(".p_store").html(product.store);

      $parent.append($productItem);
    });
  }

  function isScrolledToBottom() {
    let container =$("#availableProducts");
    console.log($("#availableProducts").scrollTop());
    console.log($("#availableProducts").height());
    console.log(container.prop("scrollHeight"));
    return container.scrollTop() + container.height() >= container.prop("scrollHeight");
  }

  function hasMorePages() {
    return currentPage * itemsPerPage < products.length;
  }

  function handleScroll() {
    if (isScrolledToBottom() && hasMorePages()) {
      currentPage++;
      renderProducts(products, currentPage);
    }
  }

  renderProducts(products, currentPage);
  $template.hide();

  $("#availableProducts").on("scroll", handleScroll);
});
