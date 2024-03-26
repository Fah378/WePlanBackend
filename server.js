require('./config/db');

const express = require('express');
const app = express();
const port = 3000;

const UserRouter = require('./api/User');
const PlansRouter = require('./api/Plans');
const DetailsRouter = require('./api/Details');
const WishlistRouter = require('./api/Wishlist');

// For accepting post form data
app.use(express.json());

app.use('/user', UserRouter)
app.use('/plans', PlansRouter)
app.use('/details', DetailsRouter)
app.use('/wishlist', WishlistRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
