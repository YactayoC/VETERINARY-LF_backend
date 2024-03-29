const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { dbConnection } = require('./database/config');

const app = express();
dbConnection();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/testimonial', require('./routes/testimonial'));
app.use('/api/appointment', require('./routes/appointment'));
app.use('/api/employee', require('./routes/employee'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
