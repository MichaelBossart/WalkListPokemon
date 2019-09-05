const bcrypt = require("bcrypt");
const axios = require("axios")
module.exports = {
  addToWalkList: async (req, res) => {
    const db = req.app.get("db"); //always do this. this is getting the database for the endpoint

    try {
      req.body.user_id = req.session.user.id; // trying to connect user and pokemon
      await db.walklist.insert(req.body);
      res.send("it worked ");
    } catch (error) {
      console.log(error);
    }
  },
  sendToWalkCard: async (req, res) => {
    const db = req.app.get("db");
    try {
      const walkList = await db.walklist.find({user_id: req.session.user.id}); //this is a sql quere
      res.send(walkList);
    } catch (error) {
      console.log(error);

    }
  },

  deleteOffWalkList: async (req, res) => {
    const db = req.app.get("db");
    try {
      const id = req.params.id;
      await db.walklist.destroy({ id: id });
      const walkList = await db.walklist.find({user_id: req.session.user.id});
      res.send(walkList);
    } catch (error) {
      console.log(error);
    }
  },

  signUserUp: async (req, res) => {
    try {
      const db = req.app.get("db");
      const hash = await bcrypt.hash(req.body.password, 10);
      const username = req.body.username.trim();
      const SignUserUp = await db.users.insert({
        user_name: req.body.username,
        user_password: hash
      });

      delete SignUserUp.password;
      res.send(SignUserUp);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
 

  logInUser: async (req, res) => {
    try {
      const db = req.app.get("db");
      const username = req.body.username.trim();
      const password = req.body.password;

      const [user] = await db.users.find({ user_name: username });
      if (!user) return res.status(400).send("no");
      console.log(user);
      const authenticated = await bcrypt.compare(password, user.user_password);
      if (!authenticated) return res.status(400)("also no");

      delete user.user_password;
      req.session.user = user;
      console.log(req.session.user)
      res.send(user);
      
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  fetchUser: (req, res) => {
    console.log(req.session.user)
    res.send(req.session.user);
  },

  logOut: (req, res )=>{
    req.session.destroy();
    res.send('logged out')
  },

  getCandy: async (req, res)=>{
    const candyUrl= 'https://pokemon-go1.p.rapidapi.com/pokemon_buddy_distances.json'; // needs the api keys to make work 
    let candyDistance= [];
    const body={ headers:{
      'X-RapidAPI-Key':'cd6e73f4fbmsha7fc6987d88f20dp1639a1jsnd733540e97d4',
      'X-RapidAPI-Host':'pokemon-go1.p.rapidapi.com'
    }}
    const resCandy = await axios.get(candyUrl, body); // can i have to componentDidMount? i dont think so 
    for( const candy  in resCandy.data) {
      candyDistance = [...candyDistance, ... resCandy.data[candy]]
    }
    res.send(candyDistance)
  }
  

};

//button needs to make an axios call that hits this endpoint. format state on component to match data base columns.
// axios call is going to send the formated state as the body.

//walk list when it loads needs to grab the walk list from the data base and display it.
