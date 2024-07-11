const express = require('express');
const app = express();
const cors = require('cors');

const port = 8383;
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const fcmRoute = require('./routes/FCMTokenRoutes');

// Configuração do CORS
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/fcm', fcmRoute);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
