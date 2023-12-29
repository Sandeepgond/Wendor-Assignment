const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, todos) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(todos);
    }
  });
});


app.post('/todos', async (req, res) => {
  const { title } = req.body;

  try {
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, false]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    await db.run('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.run('DELETE FROM todos WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
