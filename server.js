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
  secret: 'not_the_actual_secret',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


function requireLogin (request, response, next) {
    console.log("in req login");
    if (request.session.authtoken) {
	console.log("got authtoken")
	next();
    } else {
	console.log("req login auth notyet")
	response.render('dashboard',{auth:"notyet"});
    }
};

app.post('/login',function(req,res){
    console.log("hit login with"+req.body.token)
    if(req.body.token=="keys"){
	req.session.authtoken=true; //set session token
	res.render("dashboard",{auth:"true"})
	console.log("session auth true")
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
    res.render("dashboard",{auth:"notyet"})
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



// app.get("/getdemographics",requireLogin,function(req,res){
//     var pool = new pg.Pool({connectionString:process.env.DATABASE_URL});
//     pool.connect(function(err,client,done){
// 	client.query('select * from demographics',function(err,result){
// 	    if(err){
// 		{console.error(err); res.send("Error "+err);}
// 		}else{
// 		    //TODO do something sensible if there are no results!
// 		    var fields = Object.keys(JSON.parse(result.rows[0].demoobj));
// 		    var responses = [];
// 		    	   for(var i=0;i<result.rowCount;i++){
// 			       responses.push(JSON.parse(result.rows[i].demoobj));
// 			   }
// 		    var response_csv = json2csv({data: responses, fields:fields});
// 		    res.attachment("demographicsdata.csv");
// 		    res.send(response_csv);
// 		}
// 	});//end query
//     });
//     pool.end();    
// });


app.listen(port, ()=>{console.log(`server is running on port ${port}`)})
