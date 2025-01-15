const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/users/:id', (req, res) => {
  res.send(`Hello World! User ID: ${req.params.id}`)
})

app.get('/api/users/:id/posts', (req, res) => {
  res.send(`Hello World! User ID: ${req.params.id}, Posts`)
})  
app.get('/api/users/:id/posts/:postId', (req, res) => {
  res.send(`Hello World! User ID: ${req.params.id}, Post ID: ${req.params.postId}`)
})

app.post('/api/users', (req, res) => {
  res.send('User created!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})