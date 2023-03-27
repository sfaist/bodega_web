$(document).ready(()=>{
    $("#styleresult").hide();
    const $producttemplate = $("#pl_template");
    const $productContainer = $("#productgrid");


    const fakeUpdates = [
        "Analyzing Instagram profile...",
        "Scraping pictures...",
        "Understanding their style...",
        "Generating product suggestions...",
        "Fetching coffee...",
    ];
    let updateIndex = 0;
    function displayFakeUpdates() {
        $('#status').text(fakeUpdates[updateIndex]);
        updateIndex = (updateIndex + 1) % fakeUpdates.length;
    }
    function askAPI(handle, onSuccess){
        const dataToSend = {
            handle: handle
        };
        const fakeUpdateInterval = setInterval(displayFakeUpdates, 5000);
        displayFakeUpdates();
        $.ajax({
            url: 'https://api.onbodega.com/request',
            type: 'POST',
            data: JSON.stringify(dataToSend),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                clearInterval(fakeUpdateInterval);
                console.log(response);
                onSuccess(response);
            },
            error: function (error) {
                clearInterval(fakeUpdateInterval);
                $('#error').text('It seems like we are at capacity for now. Sign up to get unlimited suggestions.');
                $('#error').show();
                $("#styleresult").hide();
                console.error('Error:', error);
            }
        });
    }
    function renderProducts(productsToRender, container, template) {
        container.empty();
        productsToRender.forEach((product, index) => {
        let $productItem;
        $productItem = template.clone().removeAttr('id');
        container.append($productItem);
        $productItem.find(".lp_title").text(product['title']);
        $productItem.find(".lp_price").text(`$${product['price']}`);
        $productItem.find(".lp_image").attr("src", product['image']);
        $productItem.find(".lp_description").text(product['description']);
        $productItem.find(".lp_link").attr("href", product['url']);
        $productItem.show();
        });
    }

    function getStyle(){
        const handle = $('#creatorsource').val();
        if (!handle) {
            return;
        }
        $('#styleresult').show();
        askAPI(handle, (response)=>{
            renderProducts(response["products"],$productContainer,$producttemplate);
            $('#styleresult').text(response["style"]);
            $('#productheadertext').show();
        });
    }
    $('#getrecs').on('click', getStyle);



    // Typed.js implementation
    var typed4 = new Typed('#creatortext', {
        strings: ['iskra', 'karenwazen', 'gracyvillarreal', 'blaireadiebee', 'ariellecharnas', 'flaviapavanelli'],
        typeSpeed: 100,
        backSpeed: 25,
        bindInputFocusEvents: true,
        loop: true,
        cursorChar: '',
        backDelay: 1500,
        startDelay: 1500,
    });
    $("#creatorsource").focus(()=>$("#creatortext").hide())
    $("#creatorsource").focusout(()=>{if($("#creatorsource").val=="") $("#creatortext").show()})
    /*var typed5 = new Typed('#creatoraction', {
        strings: ['shine.', 'build.', 'profit.'],
        typeSpeed: 75,
        backSpeed: 25,
        bindInputFocusEvents: true,
        loop: true,
        cursorChar: '',
        backDelay: 2000,
        startDelay: 2000
        });*/
});

