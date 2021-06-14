
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

const getProducts = async () => {
    const url = '/api/products/search/';
    const result = await (await fetch(url)).json();

    if(!result.success) alert('An error occurred:\n' + result.response);

    return result.products;
}

const displayInput = async () => {

    page.innerHTML = /*html*/`
        <h1>Velkommen til Intra</h1>

        <div id="product-list">
            <table id="product-list-table">

            </table>
        </div>

        <h2 ><button form="logout"> - </button> /users/logout</h2>
        <div class="form" id="logout">
            <button id="logout-submit">Logout</button>
        </div>
        <h2><button form="register"> - </button> /users/register</h2>
        <div class="form" id="register">
            <label for="register-username">Brugernavn</label>
            <input id="register-username">

            <label for="register-password">Adgangskode</label>
            <input id="register-password" type="password">
            <button id="register-submit">Register</button>
        </div>
        <h2><button form="product-create"> - </button> /products/create</h2>
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
        <h2><button form="product-delete"> - </button> /products/delete</h2>
        <div class="form" id="product-delete">
        
            <label for="product-delete-id">Produkt Id</label>
            <input id="product-delete-id">

            <button id="product-delete-submit">Delete Product</button>
        </div>
        <h2><button form="carousel-set"> - </button> /carousel/set</h2>
        <div class="form" id="carousel-set">

            <label for="carousel-set-products">Produkter</label>
            <textarea id="carousel-set-products"></textarea>

            <button id="carousel-set-submit">Set Carousel Products</button>
        </div>
    `

    document.querySelectorAll('button[form]').forEach( (element) => {
        element.addEventListener('click', () => {
            if (element.innerText === '-') {
                element.innerText = '+'
                document.getElementById(element.attributes.form.value).hidden = true;
            } else {
                document.getElementById(element.attributes.form.value).hidden = false;
                element.innerText = '-'
            }
        })
    })
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
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({username, password});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
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
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({token, title, description, price, images});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    if(result.success) alert('Product created:\n' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const productDeleteHandler = async () => {
    const token = sessionStorage.getItem('token');
    const id = document.getElementById('product-delete-id').value;
    if(!id) return alert('Malformed input');
    const url = '/api/products/delete';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({token, id});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    if(result.success) alert('Product deleted:\n' + JSON.stringify(result.product, null, 4));
    else alert('An error occurred:\n' + result.response);
}

const carouselSetHandler = async () => {
    const token = sessionStorage.getItem('token');
    const products = document.getElementById('carousel-set-products').value.split('\n');
    if(!products) return alert('Malformed input');
    const url = '/api/carousel/set';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({token, products});
    const method = 'POST';
    const result = await (await fetch(url, {headers, body, method})).json();
    console.log(result)
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

const makeProductList = async () => {
    document.getElementById('product-list-table').innerHTML = /*html*/`
    <tr>
        <th>Titel</th>
        <th>Pris</th>
        <th>Id</th>
        <th>Slet</th>
    </tr>
    `;
    const products = await getProducts();
    for(let i in products) {
        document.getElementById('product-list-table').innerHTML += /*html*/ `
            <tr>
                <td><p>${products[i].title}</p></td>
                <td><p>${products[i].price}</p></td>
                <td><p>${products[i].id}</p></td>
                <td><button id="product-list-delete-${i}">Delete</button></td>
            </tr>
        `;
        setTimeout(() => {
            document.getElementById(`product-list-delete-${i}`).addEventListener('click', async () => {
                const token = sessionStorage.getItem('token');
                const id = products[i].id;
                if(!id) return alert('Malformed input');
                const url = '/api/products/delete';
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                const body = JSON.stringify({token, id});
                const method = 'POST';
                const result = await (await fetch(url, {headers, body, method})).json();
                console.log(result)
                if(result.success) alert('Product deleted:\n' + JSON.stringify(result.product, null, 4));
                else alert('An error occurred:\n' + result.response);
                makeProductList();
            });
        }, 100);
    }
}

const main = async () => {
    if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';
    await checkToken();
    await displayInput();
    setEventHandlers();
    makeProductList();
}

main();

