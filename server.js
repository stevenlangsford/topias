require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const port = (process.env.PORT || 5000);
const db = require("./db");

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));//??
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// app.get('/', function (req, res) {
//     res.render("index.ejs");
   
// })
// app.get('exp', function (req, res) {
//     res.render("index.ejs");
   
// })


app.get('/', function (req, res) {
    res.render("index");
   
})
app.get('/exp', function (req, res) {
    res.render("exp");
   
})

app.get('/done', function (req, res) {
    res.render("outro");
   
})
// app.get("/runme", async (req, res)=>{
//     const result =  await db.query('select * from demographics;')
//     res.json({status:'success',
// 	      value:result})
// })


app.post("/writedemo", async (req, res) => {
    try{
    const results = await db.query("INSERT INTO demographics (time, demoobj) values ($1, $2);",[req.body.time, req.body.value])
    }catch(err){
	console.log(err)
    }
});//end post

app.post("/writeresponse", async (req, res) => {
    try{
    const results = await db.query("INSERT INTO responses (time, response) values ($1, $2);",[req.body.time, req.body.value])
    }catch(err){
	console.log(err)
    }
});//end post

//how the javascript hits this post route:
//$.post( "mypost",{time: Date.now(), value: JSON.stringify(some_js_object) } );


app.listen(port, ()=>{console.log(`server is running on port ${port}`)})