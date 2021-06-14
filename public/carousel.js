
const updateCarouselInfo = (products, i) => {
    document.getElementById('carousel-title').innerHTML = products[i].title;
    document.getElementById('carousel-description').innerHTML = products[i].description;
    document.getElementById('carousel-buy').href = '/product/' + products[i].id;
    document.getElementById('carousel-img').src = products[i].images[0];
    document.getElementById(`radio-button-${i}`).checked = true;
}

(async () => {
    
    const response = await (await fetch('/api/carousel/get')).json()

    if (!response.success) return;
    
    document.getElementById('carousel-switch').innerHTML = '';
    if (response.products.length > 1) {
        for(let i in response.products) {
            const radioButton = document.createElement('input');
            radioButton.name = 'carousel';
            radioButton.type = 'radio';
            radioButton.id = `radio-button-${i}`;
            radioButton.addEventListener('click', () => updateCarouselInfo(response.products, i));
            document.getElementById('carousel-switch').appendChild(radioButton);
        }    
    }
    
    updateCarouselInfo(response.products, 0);
    
})()


