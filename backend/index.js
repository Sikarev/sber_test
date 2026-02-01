const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const OPTIONS_ASCENDING = Array.from({ length: 1000 }, (_, i) => ({
  name: String(i + 1),
  value: String(i + 1)
}));

app.get('/options/for/select', (req, res) => {
  res.status(200).json(OPTIONS_ASCENDING);
});

app.post('/selected/option', (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ 
      error: 'Значение опции не передано' 
    });
  }

  res.status(200).json({ 
    message: `Выбранная опция ${value} успешно принята.` 
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`GET  http://localhost:${PORT}/options/for/select`);
  console.log(`POST http://localhost:${PORT}/selected/option`);
});
