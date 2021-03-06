const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = (process.env.PORT || 5000);

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

app.post('/writedemo', db.writeDemographics)
app.post('/writeresponse', db.writeResponse)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
//to test:
// curl --data "time=now&demoobj=imbob" http://localhost:3000/putdemo
