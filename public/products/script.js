
(async () => {
    const search = document.getElementById('search').value;
    const fetched = await fetch('/api/products/search/' + search);
    const data = await fetched.json();
    
    console.log(data);
    //document.getElementById('product-list').innerHTML = '';
    for(let i in data.products) {
        const product = data.products[i];
        document.getElementById('product-list').innerHTML += /*html*/ `
            <div class="item">
                <img class="item-img" src="${product.images[0]}">
                <h1 class="item-title">${product.title}</h1>
                <p class="item-description">${product.description}</p>
                <div class="item-footer">                
                    <h2 class="item-price">${product.price}</h2>
                    <a href="https://www.google.com">Se mere</a>
                </div>
            </div>
        `;
    }
})()
