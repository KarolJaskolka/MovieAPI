## Movie REST API

### Technologies: 

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (Database)
- JsonWebToken

### Requests:

#### Movie:

- GET api/movies
- GET api/movies/:name
- GET api/movies/:name/comments
- GET api/movies/:name/ratings
- POST api/movies
- PUT api/movies/:id
- DELETE api/movies/:id

#### User:

- GET api/users
- GET api/users/:login
- GET api/users/:login/comments
- GET api/users/:login/ratings
- GET api/users/:userid/ratings/:movieid
- POST api/users/avatars
- PUT api/users/:id
- DELETE api/users/:id

#### Comment: 

- GET api/comments
- GET api/comments/:id
- POST api/comments
- PATCH api/comments/:id
- DELETE api/comments/:id

#### Rating:

- GET api/ratings
- GET api/ratings/:id
- POST api/ratings
- PATCH api/ratings/:id
- DELETE api/ratings/:id

#### Authorization

- POST api/auth/login
- POST api/auth/register
- POST api/auth/token