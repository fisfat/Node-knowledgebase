## Node Knowlegebase
This is an app built with nodeJS and Express which also shares resources via API endpoints

### Features
1. `Authentication` (using passport and bcryptjs)
2. `Access Controls and custom middlewares`
3. `Full crud functionalities via API endpoints`

### Technical notes
1. Template engine: Pug
2. Files and folders created manually

### Dependencies
1. `NodeJs`
2. `EpressJs`
3. `MongoDB`

### Get it running on your local machine
1. `git clone https://github.com/fisfat/Node-knowledgebase.git`
2. `cd node-knowlwdgebase`
3. `npm install`
4. `npm start` or `nodemon` if you have nodemon installed


### API endponts
Most endpoints require a token for authentication. The API call should have the token in Authorization header.

Example:

```authentication: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjViZjkxYTExMjNlOTQ4MmZhYzdlNmJjYiIsIm5hbWUiOiJGYXRveWluYm8gT2x1d2FmaXNheW8iLCJlbWFpbCI6IkZhdG95aW5ib29sdXdhZmlzYXlvQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZmlzZmF0Iiw3dZaFdNRFpxUHdVZVNGcXFDc21KMkhhTWlneS9HMkd1RDZJUjNiLlNvazIiLCJfX3YiOjB9LCJpYXQiOjE1NDM2NTI5NTR9.i9zJEMBWv6H4hXyOVr8MKNCRauAiFam03jO3CPmhjRc" 
```

| EndPoint                                |   Functionality                      | Requires token   |
| --------------------------------------- | ------------------------------------:|------------------|
| POST /api/signup                        | Signup a user                        |  No              |
| POST /api/articles/add                  | Create a new todo                    |  Yes             |
| GET /api/articles                       | List all article                     |  Yes             |
| GET /api/articles/:id                   | Get single article                   |  Yes             |
| PUT /api/articles/:id                   | Update this article                  |  Yes             |
| DELETE /api/articles/:id                | Delete this single article           |  Yes             |

### Inputs and Responses
The API accepts only JSON data.
The API responds with JSON data by default.

### License
This project is licensed under the MIT License - see the [LICENSE.md](https://opensource.org/licenses/MIT) file for details