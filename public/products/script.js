

(async () => {
    const data = await (await fetch('/api/products/search/' + document.getElementById('search').value)).json();
    document.getElementById('product-list').innerHTML = data.products.map(product => /*html*/ `
        <div class="item">
            <img class="item-img" src="${product.images[0]}">
            <h1 class="item-title">${product.title}</h1>
            <p class="item-description">${product.description}</p>
            <div class="item-footer">                
                <h2 class="item-price">${product.price} DKK</h2>
                <a href="/product/${product.id}">Se mere</a>
            </div>
        </div>
    `).join();
})()
