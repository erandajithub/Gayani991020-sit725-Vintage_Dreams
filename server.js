require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifySession = require('./middleware/verifySession');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// file upload middleware
app.use(fileUpload());

app.use(session({
    key: 'user_sid',
    secret: 'asdjbb38r7tfgiewbfv38f7uig328uifvbiewhvfbiwakfjvbiwe',
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 86400000 }
}));

// load template engine
app.set('view engine', 'ejs');
app.set('views', path.join('views'));

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));

app.use(verifySession);
app.use('/user', require('./routes/api/user'));
app.use('/admin', require('./routes/api/admin'));
app.use('/products', require('./routes/api/products'));
app.use('/cart', require('./routes/api/cart'));
app.use('/order', require('./routes/api/order'));
app.use('/wishlist', require('./routes/api/wishlist'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});