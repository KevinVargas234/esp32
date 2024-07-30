const express = require('express')
const app = express()
const fs = require('fs');
const port = process.env.PORT||8000
const path = require('path');
const PlayerIO=require("./pio")
const bodyParser = require('body-parser');
var UglifyJS = require("uglify-js");
app.use(bodyParser.json());
app.use(express.static('public'));




PlayerIO.authenticate(
    'esp32-6zcecyhrgeolz15gxqwxmw',
    "dcfdgteynoifyek",
    {
        username:'__admin345__fzfqmmt0woxqmamv86fa',password:"fzfqmmt0woxqmamv86faj2912994nn",
        //register: true
    },
    null,
    function(client) {
        console.log("inicio")




        app.get('/:query/:name',(req,res)=>{
            client.bigDB.loadOrCreate("code", req.params.name, function(obj) {
                if(!obj||!obj[req.params.query]){
                    res.send("")
                }
                res.send(""+obj[req.params.query])
            }, function(error) { console.log(error);res.send("") });
        })
        app.post('/save/:name',(req,res)=>{
            client.bigDB.loadOrCreate("code", req.params.name, function(obj) {
                if(!obj.version){
                    obj.version=0
                }
                obj.version++

                var result = UglifyJS.minify(req.body.code);
                obj.code=result.code

                obj.save()
                res.send(result.error||"ok")
            }, function(error) {res.send(error) });
        })
        




    },
    function(error) {
        if (error.code == PlayerIOErrorCode.UnknownGame) {
        } else {
            console.log(error);
        }
    }
);





app.get('/', (req, res) => {
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})