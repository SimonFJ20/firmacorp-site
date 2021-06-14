
const updateCarouselInfo = (products, i) => {
    document.getElementById('carousel-title').innerHTML = products[i].title;
    document.getElementById('carousel-description').innerHTML = products[i].description;
    document.getElementById('carousel-buy').href = '/product/' + products[i].id;
    document.getElementById('carousel-img').src = products[i].images[0];
    if(products.length > 1) document.getElementById(`radio-button-${i}`).checked = true;
}

const refreshRadioButtons = () => {
    document.getElementById('carousel-switch').innerHTML = '';
    for(let i in products) {
        const radioButton = document.createElement('input');
        radioButton.name = 'carousel';
        radioButton.type = 'radio';
        radioButton.id = `radio-button-${i}`;
        radioButton.addEventListener('click', () => updateCarouselInfo(products, i));
        document.getElementById('carousel-switch').appendChild(radioButton);
    }  
}

const makeCarousel = async () => {
    const response = await (await fetch('/api/carousel/get')).json();
    if (!response.success) return;
    if (response.products.length > 1) refreshRadioButtons(response.products);
    updateCarouselInfo(response.products, 0);
}

makeCarousel();
