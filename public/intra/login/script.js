
const username = document.getElementById('username');
const password = document.getElementById('password');
const submit = document.getElementById('submit');
const text = document.getElementById('error');

submit.addEventListener('click', async () => {
    if (username.value !== '' && password.value !== '') {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const toSend = {
            username: username.value,
            password: password.value
        }
        const body = JSON.stringify(toSend)

        const raw = await fetch('/api/users/login', {headers, body, method: 'POST'});

        const response = await raw.json();
    
        if (response.success) {
            sessionStorage.setItem('token', response.token)
            location.pathname = '/intra';
        };
    } else {
        text.innerText = 'Username or password must not be blank.'
    }
})