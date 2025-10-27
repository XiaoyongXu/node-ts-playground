import express from 'express'
import itemRoutes from './routes/itemRoutes'
import recipeRoutes from './routes/recipeRoutes'
import messageRoutes from './routes/messageRoutes'
import movieRoutes from './routes/movieRoutes'
import testRoutes from './routes/itemRoutes'
import { errorHandler } from './middlewares/errorHandler'
import cors from 'cors';


const app = express()
const PORT = 3000
app.use(cors());
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript!')
})


app.use('/items', itemRoutes)
app.use('/recipes', recipeRoutes)
app.use('/messages', messageRoutes)
app.use('/movies', movieRoutes)
app.use('/test', testRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`)
});









// example fetch code
// import { fetchData, postData } from './utils/fetch'
// import { Todo } from './models/types'

// export const getUserTodo = async () : Promise<Todo> => {
//   const todo_result = await fetchData<Todo>('https://jsonplaceholder.typicode.com/todos/1');
//   return todo_result;
// }

// export const postUserTodo = async (todo: Todo): Promise<Todo> => {
//   const post_result = await postData<Todo, Todo>('https://jsonplaceholder.typicode.com/posts', todo);
//   return post_result;
// };

// export const main = async (message: string = 'Example fetch'): Promise<string> => {
//   console.log(message)
//   const todoResult = await getUserTodo()
//   console.log("ToDoResult: ", todoResult)
//   const postTodoResult = await postUserTodo(todoResult)
//   console.log("PostResult: ", postTodoResult)

//   return message
// }

// main()