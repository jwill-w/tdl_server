const express = require('express')
const app = express();
const PORT = process.env.PORT || 5000;
const taskRoutes = require('./taskRoutes');


// middleware
app.use(express.json());

//routes
app.use('/api', taskRoutes)
//app.get('/', (req, res) => {
//    res.send('Hello World!');
//});

// start server
app.listen(PORT, () => {
    console.log('Server is running on port:');
    console.log(PORT);
});
