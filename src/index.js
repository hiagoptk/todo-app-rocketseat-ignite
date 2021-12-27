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

  const user = users.find(user => user.username === username);
  request.user = user;

  return next();
}



app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usernameAlreadyExistis = users.some(user => user.username === username);

  if(usernameAlreadyExistis) {
    return response.status(400).json({error: 'User already existis!'})
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  })

  const user = users.find(user => user.username === username)

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;


  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);
  
  return response.status(201).json({message: 'Success!!'})
});
 
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  todo.done = true;

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  user.todos.splice(user.todos.indexOf(todo), 1)

  return response.status(200).json(user.todos);
});

module.exports = app;