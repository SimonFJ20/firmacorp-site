
curl localhost/api/users/register -X POST -d '{"username": "admin", "password": "admin"}'

curl localhost/api/users/login -X POST -d '{"username": "admin", "password": "admin"}'

curl localhost/api/products/create -X POST -d '{"token": "", "title": "pTitle", "description": "pDesc", "price": "pPrice", images: [""]}'

