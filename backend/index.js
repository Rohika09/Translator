const express = require('express');
const cors = require('cors');
const translateRouter = require('./routes/translate');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/translate', translateRouter);

const PORT =  5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
