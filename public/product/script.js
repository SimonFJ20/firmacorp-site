const productImage = document.getElementById('product-img');
const productTitle = document.getElementById('product-title');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const productBuy = document.getElementById('product-buy');

const getProductInformation = async () => {
    const id = window.location.href.match(/\/(\w+)$/);

    const response = await (await fetch('/api/products/getone/' + id[1])).json();

    if (response.success) {
        const product = response.product;
        productTitle.innerText = product.title;
        productDescription.innerText = product.description;
        productPrice.innerText = product.price + ' DKK';
        productImage.src = product.images[0];

        document.getElementById('carousel-switch').innerHTML = '';
        if (product.images.length !== 1) {
            for(let i in product.images) {
                const radioButton = document.createElement('input');
                radioButton.name = 'carousel';
                radioButton.type = 'radio';
                radioButton.id = 'radio-button-' + i;
                radioButton.addEventListener('click', () => {
                    productImage.src = product.images[i];
                });
                document.getElementById('carousel-switch').appendChild(radioButton);
            }
            document.getElementById('radio-button-0').checked = true;
        }
    };
}

getProductInformation();