## Simple REST API

### Technologies: 

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (Database)

### Requests:

##### Movie:

- GET api/movies
- GET api/movies/:name
- GET api/movies/:name/comments
- GET api/movies/:name/ratings
- POST api/movies
- PUT api/movies/:id
- DELETE api/movies/:id

##### User:

- GET api/users
- GET api/users/:login
- GET api/users/:login/comments
- GET api/users/:login/ratings
- POST api/users
- PUT api/users/:id
- DELETE api/users/:id

##### Comment: 

- GET api/comments
- POST api/comments
- PATCH api/comments/:id
- DELETE api/comments/:id

##### Rating:

- GET api/ratings
- POST api/ratings
- PATCH api/ratings/:id
- DELETE api/ratings/:id