const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = (process.env.PORT || 5000);

require('dotenv').config()//new: does this do anything useful?
console.log("with dotenvconfig")//apparently not?

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render("pages/index");
   
})
app.get('/exp', function (req, res) {
    res.render("pages/exp");
   
})

app.get('/done', function (req, res) {
    res.render("pages/outro");
   
})

app.get("/dbtest", async (req, res)=>{
    console.log("hit dbtest")
    const result =  await db.query('select * from demographics;')
    console.log("got result")
    res.json({status:'success',
	      value:result})
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
//to test:
// curl --data "time=now&demoobj=imbob" http://localhost:3000/putdemo
//heroku addons:open papertrail
