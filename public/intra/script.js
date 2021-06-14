
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
        <!--title, description, price, images-->
        <div class="form" id="product-create">
            <label for="product-create-title">Produkt Titel</label>
            <input id="product-create-title">

            <label for="product-create-description">Produkt Description</label>
            <textarea id="product-create-description"></textarea>

            <label for="product-create-price">Produkt Pris</label>
            <input id="product-create-price" type="number">

            <label for="product-create-links">Produkt Billeder</label>
            <textarea id="product-create-links" placeholder='[ image.com/image0, image.com/image1 ]'></textarea>

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
            <p>jeg ved ik hvordan den fungerer lol</p>
        </div>
    `
}

const logoutHandler = () => {
    sessionStorage.removeItem('token');
    location.pathname = '/';
}

const setEventHandlers = () => {
    document.getElementById('logout-submit').addEventListener('click', () => logoutHandler());
    document.getElementById('register-submit').addEventListener('click', () => {});
    document.getElementById('product-create-submit').addEventListener('click', () => {});
    document.getElementById('product-delete-submit').addEventListener('click', () => {});
}

const main = async () => {
    if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';
    await checkToken();
    displayInput();
    setEventHandlers();
}

main();

