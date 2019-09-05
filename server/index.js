const cors = require ('cors');
const express = require ('express');
const app = express();
const massive = require ('massive');
const pokemonController =require("./controllers/pokemon_controller");
const session = require('express-session');
const path = require('path');

const bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use(cors({
    credentials: true
}))
app.use(bodyParser.json());
app.use(session({
    secret: 'pokemon',
    resave: false,
    saveUninitialized: true
}));


massive({
    host: 'localhost',
    port: 5432,
    database: 'pokemon',
    user: 'michaelbossart',
    password: ''
}).then(db => {
    console.log('postgres connected');
    app.set('db', db);
}).catch(error => console.log(error))

app.post('/walkList', pokemonController.addToWalkList)

app.get('/walkList',pokemonController.sendToWalkCard)
//end point go in to data base, grab all of them and send them to front end 
app.delete('/walkList/:id',pokemonController.deleteOffWalkList)

app.get('/login', pokemonController.logOut)

app.get('/user', pokemonController.fetchUser)

app.get('/getCandy', pokemonController.getCandy)

app.post('/login', pokemonController.logInUser)

app.post('/CreateAccount', pokemonController.signUserUp)


const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`listening on ${port}`)
});