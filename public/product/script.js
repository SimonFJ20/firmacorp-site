const productImage = document.getElementById('product-img');
const productTitle = document.getElementById('product-title');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const productBuy = document.getElementById('product-buy');

const getProductInformation = async () => {
    const id = window.location.href.match(/\/(\w+)$/);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await (await fetch('/api/products/getone/' + id[1])).json();

    if (response.success) {
        const product = response.product;
        productTitle.innerText = product.title;
        productDescription.innerText = product.description;
        productPrice.innerText = product.price;
        productImage.src = product.images[0];
    };
}

getProductInformation();