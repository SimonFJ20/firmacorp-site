
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
    page.innerHTML = /*html*/`
        <h1>Velkommen til Intra</h1>
        <h2>/users/logout</h2>
        <h2>/users/register</h2>
        <h2>/products/create</h2>
        <h2>/products/delete</h2>
        <h2>/carousel/set</h2>
    `
}

const main = async () => {
    if(!sessionStorage.getItem('token')) location.pathname = '/intra/login';
    await checkToken();
    await displayInput();
}

main();

