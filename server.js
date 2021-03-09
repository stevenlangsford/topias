require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const port = (process.env.PORT || 5000);
const db = require("./db");

const  jcsv = require('json2csv');
const helmet = require('helmet'); //minimal security best practices. Sets HTTP headers to block first-pass vulnerability sniffing and clickjacking stuff.
const session = require('client-sessions');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));//??
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//app.use(helmet()); //default settings
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(session({
  cookieName: 'session',
  secret: process.env.COOKIE_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


function requireLogin (request, response, next) {
    if (request.session.authtoken) {
	next();
    } else {
	response.render('dashboard',{auth:"notyet"});
    }
};

app.post('/login',function(req,res){
    if(req.body.token==process.env.DATA_PWD){
	req.session.authtoken=true; //set session token
	res.status(200).send()
    }
});

app.get('/', function (req, res) {
    res.render("index");
   
})
app.get('/exp', function (req, res) {
    res.render("exp");
   
})

app.get('/done', function (req, res) {
    res.render("outro");
   
})
app.get('/dashboard', function (req, res){
    if(req.session.authtoken==undefined) {
	res.render("dashboard",{auth:"notyet"})
    }else{
	res.render("dashboard",{auth:"true"})
    }
    
})


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

app.get("/readdemo", requireLogin, async function(req,res){
    try{
    const results = await db.query("SELECT * FROM demographics;")
    var fields = Object.keys(JSON.parse(results.rows[0].demoobj));
    var responses = [];
    for(var i=0;i<results.rowCount;i++){
	responses.push(JSON.parse(results.rows[i].demoobj));
    }
	var response_csv = jcsv.parse(responses);
	console.log(response_csv)
	res.attachment("demographicsdata.csv");
    	res.send(response_csv);
    } catch(err) {
	console.log(err)
    }
})//end get readdemo

app.get("/readresponses", requireLogin, async function(req,res){
    try{
    const results = await db.query("SELECT * FROM responses;")
    var fields = Object.keys(JSON.parse(results.rows[0].response));
    var responses = [];
    for(var i=0;i<results.rowCount;i++){
	responses.push(JSON.parse(results.rows[i].response));
    }
	var response_csv = jcsv.parse(responses);
	console.log(response_csv)
	res.attachment("responsedata.csv");
    	res.send(response_csv);
    } catch(err) {
	console.log(err)
    }
})//end get readresponses. 

app.listen(port, ()=>{console.log(`server is running on port ${port}`)})
