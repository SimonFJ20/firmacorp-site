
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
    
}

await checkToken();