
# NodePop

[Demo](/anuncios) of the methods (this link works only if you run the project)

Api for the iOS/Android apps.

## Deploy

### Install dependencies
    
    npm install

### Configure  

Review lib/connectMongoose.js to set database configuration

### Init database

    npm run installDB

## Start

To start a single instance:
    
    npm start

To start in development mode:

    npm run dev (including nodemon & debug log)

## Test

    npm test (pending to create, the client specified not to do now)

## JSHint & JSCS

    npm run hints

## API v1 info


### Base Path

The API can be used with the path:
[API V1](/apiv1/anuncios)

### Error example

    {
      "ok": false,
      "error": {
        "code": 401,
        "message": "This is the error message."
      }
    }

### GET /anuncios

**Input Query**:

start: {int} skip records
limit: {int} limit to records
sort: {string} field name to sort by
includeTotal: {bool} whether to include the count of total records without filters
tag: {string} tag name to filter
venta: {bool} filter by venta or not
precio: {range} filter by price range, examples 10-90, -90, 10-
nombre: {string} filter names beginning with the string

Input query example: ?start=0&limit=2&sort=precio&includeTotal=true&tag=mobile&venta=true&precio=-90&nombre=bi

**Result:** 

    {
      "ok": true,
      "result": {
        "rows": [
          {
            "_id": "55fd9abda8cd1d9a240c8230",
            "nombre": "iPhone 3GS",
            "venta": false,
            "precio": 50,
            "foto": "/images/anuncios/iphone.png",
            "__v": 0,
            "tags": [
              "lifestyle",
              "mobile"
            ]
          }
        ],
        "total": 1
      }
    }


### GET /anuncios/tags

Return the list of available tags for the resource anuncios.

**Result:** 

    {
      "ok": true,
      "allowed_tags": [
        "work",
        "lifestyle",
        "motor",
        "mobile"
      ]
    }
	
		
### Autentication
	Mini-guide: 
	1. POST / api / authenticate to login and return a JWT token 
	2. GET / api / announcements including the JWT in a header or query-string will make the correct request (200 OK) 
	3. GET / api / ads without token will respond with an HTTP 401 status code and a json with info from error 
	4. GET / api / ads with an expired token will respond with an HTTP 
	401 status code and a json with info from the error
 
The API  have  one user with email user@example.com and password 1234

### Internationalization
NodePop multi-language, with English and Spanish language selector.

### Image upload with background task
Image upload with homework in background
The API needs an end-point to create ads.
 
 POST / api / ads, allow the API client to upload an image and it will be saved on the server, so that when we make GET / api / ads requests, the routes to these images are returned to us and these routes work.

Every image that is uploaded must have a thumbnail!
