
const dostuff = (products, i) => {
    document.getElementById('maintainerLLLL').innerHTML = products[i].title;
    document.getElementById('fuckdigmaintainer').innerHTML = products[i].description;
    document.getElementById('sutpikmaintainer').href = '/product/' + products[i].id;
    document.getElementById('hahahaLLL').src = products[i].images[0];
    document.getElementById('killyourself' + i).checked = true;
}

(async () => {
    
    const response = await (await fetch('/api/carousel/get')).json()

    if (!response.success) return;
    
    document.getElementById('dulortLLL').innerHTML = '';
    for(let i in response.products) {
        const radioButton = document.createElement('input');
        radioButton.name = 'carousel';
        radioButton.type = 'radio';
        radioButton.id = 'killyourself' + i;
        radioButton.addEventListener('click', () => dostuff(response.products, i));
        document.getElementById('dulortLLL').appendChild(radioButton);
    }
    
    dostuff(response.products, 0);
    
})()


