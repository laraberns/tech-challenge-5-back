const express = require('express');
const app = express();
const port = 8383;
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');

app.use(bodyParser.json());
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
