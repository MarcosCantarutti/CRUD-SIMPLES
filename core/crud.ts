// const fs = require('fs'); -- CommnoJS
import fs from "fs";
import { v4 as uuid } from 'uuid';
const DB_FILE_PATH = './core/db'; // banco falso

// console.log('CRUD');

type UUID = string;

interface Todo {
  id: UUID,
  date: string,
  content: string,
  done: boolean,
}

// CREATE
function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };
  const todos: Array<Todo> = [
    ...read(),
    todo,
  ];
  // salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos,
    dogs: [],
  }, null, 2)); //salvando como json
  return todo;
}

//READ
function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) { // Fail Fast Validations
    return [];
  }
  return db.todos
}

//UPDATE
function update(id: UUID, partialTodo: Partial<Todo>): Todo { // PARTIAL -> recebendo alguma coisa parcial de Todo
  let updatedTodo;

  const todos = read();
  todos.forEach((currenTodo) => {
    // console.log(currenTodo)
    const isToUpdate = currenTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currenTodo, partialTodo) // recebe um objeto e atribui/muda o seu valor com o segundo argumento
    }
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos, }, null, 2))

  if (!updatedTodo) {
    throw new Error('Please, provide another ID!');
  }

  return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
  return update(id, { content })
}

function deleteById(id: UUID) {
  const todos = read(); // pegar todas as todos

  const filteredTodos = todos.filter((todo) => {
    if (todo.id === id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos: filteredTodos, }, null, 2))

}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

CLEAR_DB(); // LIMPAR BD ANTES DE GRAVAR, EVITAR LOOP
create('primeira todo!');
const segundaTodo = create('segunda todo!');
deleteById(segundaTodo.id);
const terceiraTodo = create('terceira todo!');
// update(terceiraTodo.id, { content: "terceira todo com o novo conteudo", done: true }); multiplas
updateContentById(terceiraTodo.id, "terceira todo com o novo conteudo"); // somente uma
console.log(read());
