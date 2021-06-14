
const page = document.getElementById('main')

const checkToken = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = await fetch('/api/users/checktoken/' + sessionStorage.getItem('token'));

    const response = await raw.json();

    if (!response.success) {
        sessionStorage.removeItem('token');
        location.pathname = '/intra/login';
    }
}

const displayInput = () => {
    page.innerHTML = /*html*/`
        <h1>Velkommen til Intra</h1>
        <h2>↓ /users/logout</h2>
        <div class="form" id="logout">
            <button id="logout-submit">Logout</button>
        </div>
        <h2>↓ /users/register</h2>
        <div class="form" id="register">
            <label for="register-username">Brugernavn</label>
            <input id="register-username">

            <label for="register-password">Adgangskode</label>
            <input id="register-password" type="password">
            <button id="register-submit">Register</button>
        </div>
        <h2>↓ /products/create</h2>
        <div class="form" id="product-create">
            <label for="product-create-title">Produkt Titel</label>
            <input id="product-create-title">

            <label for="product-create-description">Produkt Description</label>
            <textarea id="product-create-description"></textarea>

            <label for="product-create-price">Produkt Pris</label>
            <input id="product-create-price" type="number" min="0" value="0">

            <label for="product-create-images">Produkt Billeder</label>
            <textarea id="product-create-images"></textarea>

            <button id="product-create-submit">Create Product</button>
        </div>
        <h2>↓ /products/delete</h2>
        <div class="form" id="product-delete">
        
            <label for="product-delete-id">Produkt Id</label>
            <input id="product-delete-id">

            <button id="product-delete-submit">Delete Product</button>
        </div>
        <h2>→ /carousel/set</h2>
        <div class="form">
            <label for="carousel-set-products">Produkts</label>
            <textarea id="carousel-set-products"></textarea>

            <button id="product-delete-submit">Set Carousel Products</button>
        </div>
    `
}

const logoutHandler = () => {
    sessionStorage.removeItem('token');
    location.pathname = '/';
}

const registerHandler = async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    if(!username || !password) return alert('Virkelig fuck dig!');
    const url = '/api/users/register';
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({username, password});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    if(result.success) alert('User created: ' + result.user);
    else alert('An error occurred:\n' + result.response);
}

const productCreateHandler = async () => {
    const token = sessionStorage.getItem('token');
    const title = document.getElementById('product-create-title').value;
    const description = document.getElementById('product-create-description').value;
    const price = document.getElementById('product-create-price').value;
    const images = document.getElementById('product-create-images').value.split('\n');
    if(!(title && description && price && images)) return alert('Malformed input');
    const url = '/api/products/create';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({token, title, description, price, images});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    if(result.success) alert('Product created: ' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const productDeleteHandler = async () => {
    const token = sessionStorage.getItem('token');
    const id = document.getElementById('product-delete-id').value;
    if(!id) return alert('Virkelig fuck dig!');
    const url = '/api/products/delete';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({token, id});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    if(result.success) alert('LOL det virkede, røvhul\nDeleted Product: ' + JSON.stringify(result.product, null, 4));
    else alert('Hold kæft du lort\n' + result.response);
}

const setEventHandlers = () => {
    document.getElementById('logout-submit').addEventListener('click', () => logoutHandler());
    document.getElementById('register-submit').addEventListener('click', () => registerHandler());
    document.getElementById('product-create-submit').addEventListener('click', () => productCreateHandler());
    document.getElementById('product-delete-submit').addEventListener('click', () => productDeleteHandler());
}

const main = async () => {
    if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';
    await checkToken();
    displayInput();
    setEventHandlers();
}

main();

