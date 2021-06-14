if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';

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

const displayInput = async () => {
    page.innerHTML = `
        <h1>Velkommen til Intra</h1>
        <h2>Create Product</h2>

        <h2>
        
        </h2>
    `
}

checkToken();
displayInput();