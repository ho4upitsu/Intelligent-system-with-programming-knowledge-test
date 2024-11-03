const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT;

app.use('/users', userRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
