const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const existsUserAccount = users.some(user => user.username === username);

  if (!existsUserAccount) {
    return response.status(400).json({error: 'User not found'})
  }

  request.username = username;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  })

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const { title, deadline } = request.body;

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline, 
    created_at: new Date()
  }

  username.todos.push(todo);
  
  return response.status(201).json({message: 'Success!!'})
});
 
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;