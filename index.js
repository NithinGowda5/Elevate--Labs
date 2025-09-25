
import express from 'express'


const app = express();

app.use(express.json())

let books = [
    {id: 1, title: 'One Piece', author: 'Echiro Oda'},
    { id: 2, title: "Death Note", author: "Tsugumi Ohba"}
]

app.get('/books', (req, res)=>{
    res.json(books)
})

app.post('/books', (req, res)=>{
    const newBook = {id: books.length+1, ...req.body}
    books.push(newBook)
    res.status(201).json(newBook)
})

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id)
  const index = books.findIndex((b) => b.id === bookId)

  if (index === -1) return res.status(404).json({ msg: "Book not found" })

  books[index] = { id: bookId, ...req.body }
  res.json(books[index]);
})

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((b) => b.id !== bookId);
  res.json({ msg: "Book deleted" });
});

app.listen(3000,()=>{
    console.log('Listening at the port 3000.\nOpen postman to do operation!!')
})
