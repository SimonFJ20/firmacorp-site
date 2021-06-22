
const htmlFormTitleAndCollapseButton = (id, text) => /*html*/ `
    <h2><button form="${id}"> - </button> ${text}</h2>
`;

const htmlTitle = () => /*html*/ `
    <h1>Velkommen til Intra</h1>
`;

const htmlProductList = () => /*html*/ `
    <div id="product-list">
        <table id="product-list-table"></table>
    </div>
`;

const htmlLogoutForm = () => /*html*/ `
    ${htmlFormTitleAndCollapseButton('logout', '/users/logout')}
    <div class="form" id="logout">
        <button id="logout-submit">Logout</button>
    </div>
`;

const htmlRegisterForm = () => /*html*/ `
    ${htmlFormTitleAndCollapseButton('register', '/users/register')}
    <div class="form" id="register">
        <label for="register-username">Brugernavn</label>
        <input id="register-username">

        <label for="register-password">Adgangskode</label>
        <input id="register-password" type="password">
        <button id="register-submit">Register</button>
    </div>
`;

const htmlProductCreateForm = () => /*html*/ `
    ${htmlFormTitleAndCollapseButton('product-create', '/products/create')}
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
`;

const htmlProductDeleteForm = () => /*html*/ `
    ${htmlFormTitleAndCollapseButton('product-delete', '/products/delete')}
    <div class="form" id="product-delete">

        <label for="product-delete-id">Produkt Id</label>
        <input id="product-delete-id">

        <button id="product-delete-submit">Delete Product</button>
    </div>
`;

const htmlCarouselSetForm = () => /*html*/ `
    ${htmlFormTitleAndCollapseButton('carousel-set', '/carousel/set')}
    <div class="form" id="carousel-set">

        <label for="carousel-set-products">Produkter</label>
        <textarea id="carousel-set-products"></textarea>

        <button id="carousel-set-submit">Set Carousel Products</button>
    </div>
`;

const html = () => /*html*/ `
    ${htmlTitle()}
    ${htmlLogoutForm()}
    ${htmlRegisterForm()}
    ${htmlProductList()}
    ${htmlProductCreateForm()}
    ${htmlProductDeleteForm()}
    ${htmlCarouselSetForm()}
`;

const htmlProductListTableHeaders = () => /*html*/`
    <tr>
        <th>Titel</th>
        <th>Pris</th>
        <th>Id</th>
        <th>Slet</th>
    </tr>
`;

const execGetRequest = async (url) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const raw = await fetch(url);
    const data = await raw.json();
    return data;
}

const execPostRequest = async (url, body) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const jsonBody = JSON.stringify(body);
    const method = 'POST';
    const raw = await fetch(url, {headers, body: jsonBody, method});
    const data = await raw.json();
    return data;
}

const checkToken = async () => {
    if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';
    const response = await execGetRequest('/api/users/checktoken/' + sessionStorage.getItem('token'))
    if (!response.success) {
        sessionStorage.removeItem('token');
        location.pathname = '/intra/login';
    }
}

const getProducts = async () => {
    const url = '/api/products/search/';
    const result = await execGetRequest(url);
    if(!result.success) alert('An error occurred:\n' + result.response);
    return result.products;
}

const collapseHandler = (element) => {
    const buttonId = element.attributes.form.value;
    const button = document.getElementById(buttonId);
    if (element.innerText === '-') {
        button.hidden = true;
        element.innerText = '+';
    } else {
        button.hidden = false;
        element.innerText = '-';
    }
}

const makeCollapseButtons = () =>  {
    const elements = document.querySelectorAll('button[form]');
    elements.forEach((element) => element.addEventListener('click', () => collapseHandler(element)));
}


const displayInput = async () => {
    document.getElementById('main').innerHTML = html();
}

const logoutHandler = () => {
    sessionStorage.removeItem('token');
    location.pathname = '/';
}

const registerHandler = async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if(!username || !password) return alert('Malformed inputs');
    const url = '/api/users/register';
    const result = await execPostRequest(url, {username, password});

    if(result.success) alert('User created:\n' + result.user);
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
    const result = await execPostRequest(url, {token, title, description, price, images});

    if(result.success) alert('Product created:\n' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const productDeleteHandler = async () => {
    const token = sessionStorage.getItem('token');
    const id = document.getElementById('product-delete-id').value;

    if(!id) return alert('Malformed input');
    const url = '/api/products/delete';
    const result = await execPostRequest(url, {token, id});

    if(result.success) alert('Product deleted:\n' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const carouselSetHandler = async () => {
    const token = sessionStorage.getItem('token');
    const products = document.getElementById('carousel-set-products').value.split('\n');

    if(!products) return alert('Malformed input');
    const url = '/api/carousel/set';
    const result = await execPostRequest(url, {token, products});
    
    if(result.success) alert('Carousel set:\n' + JSON.stringify(result.carousel, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const setEventHandlers = () => {
    document.getElementById('logout-submit').addEventListener('click', () => logoutHandler());
    document.getElementById('register-submit').addEventListener('click', () => registerHandler());
    document.getElementById('product-create-submit').addEventListener('click', () => productCreateHandler());
    document.getElementById('product-delete-submit').addEventListener('click', () => productDeleteHandler());
    document.getElementById('carousel-set-submit').addEventListener('click', () => carouselSetHandler());
}

const makeProductListElementTitle = (product) => {
    const tdTitle = document.createElement('td');
    tdTitle.innerText = product.title;
    return tdTitle;
}

const makeProductListElementPrice = (product) => {
    const tdPrice = document.createElement('td');
    tdPrice.innerText = product.price;
    return tdPrice;
}

const makeProductListElementId = (product) => {
    const tdId = document.createElement('td');
    tdId.innerText = product.id;
    return tdId;
}

const productListElementDeleteHandler = async (product) => {
    const token = sessionStorage.getItem('token');
    const id = product.id;
    if(!id) return alert('Malformed input');
    const url = '/api/products/delete';
    const result = await execPostRequest(url, {token, id})
    if(result.success) alert('Product deleted:\n' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
    makeProductList();
}

const makeProductListElementDeleteButton = (product) => {
    const tdButton = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    tdButton.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => productListElementDeleteHandler(product));
    return tdButton;
}

const makeProductListElementTr = (tdTitle, tdPrice, tdId, tdButton) => {
    const tr = document.createElement('tr');
    tr.appendChild(tdTitle);
    tr.appendChild(tdPrice);
    tr.appendChild(tdId);
    tr.appendChild(tdButton);
    return tr;
}

const makeProductListElement = (product) => {
    const tdTitle = makeProductListElementTitle(product);
    const tdPrice = makeProductListElementPrice(product);
    const tdId = makeProductListElementId(product);
    const tdButton = makeProductListElementDeleteButton(product);
    const tr = makeProductListElementTr(tdTitle, tdPrice, tdId, tdButton);
    document.getElementById('product-list-table').appendChild(tr);
}

const makeProductList = async () => {
    document.getElementById('product-list-table').innerHTML = htmlProductListTableHeaders();
    const products = await getProducts();
    for(let i in products) makeProductListElement(products[i]);
}

const main = async () => {
    await checkToken();
    displayInput();
    makeCollapseButtons();
    setEventHandlers();
    makeProductList();
}

main();


