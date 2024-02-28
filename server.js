// //mongodb
// require('./config/db');

// const app = require('express')();
// const port = 3000;
// const express = require('express');


// //For accepting post from data
// const bodyParser = ('express').json;
// app.use(express.json());

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// })
//mongodb
require('./config/db');

const express = require('express');
const app = express();
const port = 3000;

const UserRouter = require('./api/User');
const PlansRouter = require('./api/Plans');

// For accepting post form data
app.use(express.json());

app.use('/user', UserRouter)
app.use('/plans', PlansRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
