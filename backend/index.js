const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors = require('cors')
const jwt = require("jsonwebtoken");

 
// parse application/json
app.use(bodyParser.json());
app.use(cors());

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'product_db'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//show all products
app.get('/products',(req, res, next) => {
  authenticateToken(req, res, (user, err)=>{
    if (err) return res.sendStatus(403);
    let sql = "SELECT * FROM product WHERE owner = "+ user.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
  });
});
 
//show single product
app.get('/products/:id',(req, res) => {
  authenticateToken(req, res, (user, err)=>{
    if (err) return res.sendStatus(403);  
    let sql = "SELECT * FROM product WHERE id="+req.params.id + " AND owner = " + user.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
  });
});
 
//add new product
app.post('/products',(req, res) => {
  authenticateToken(req, res, (user, err)=>{
    if (err) return res.sendStatus(403);
    let data = {name: req.body.name, price: req.body.price, quantity: req.body.quantity, description: req.body.description, owner: user.id};
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200}));
    });
  });
});
 
//update product
app.put('/products/:id',(req, res) => {
  authenticateToken(req, res, (user, err)=>{
    if (err) return res.sendStatus(403);
    let sql = "UPDATE product SET name='"+req.body.name+"', price='"+req.body.price+"', quantity='"+req.body.quantity+"', description='"+req.body.description+"' WHERE id="+req.params.id + " AND owner = "+user.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send({"status": 200});
    });
  });
});
 
//Delete product
app.delete('/products/:id',(req, res) => {
  authenticateToken(req, res, (user, err)=>{  
    if (err) return res.sendStatus(403);
    let sql = "DELETE FROM product WHERE id="+req.params.id+" AND owner = "+user.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.send(JSON.stringify({"status": 200}));
    });
  });
});
 

app.post('/users/authenticate',(req, res) => {
    let sql = "SELECT id, token FROM users WHERE username='"+req.body.username + "' AND password='"+req.body.password+"'";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
}); 
//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});

function authenticateToken(req, res, f) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const userId = req.query.userId;
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null || !userId) return res.sendStatus(401) // if there isn't any token

  let sql = "SELECT id, token, token_value FROM users WHERE id='"+ userId + "' AND token='"+token+"'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    const v = JSON.parse(JSON.stringify(results[0]))
    jwt.verify(token, v.token_value, { algorithms: ['HS512'] }, function(err, user) {   
      f(v, err);
    });
  });
}