var mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
var express = require('express');
const e = require('cors');
const app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3309,
  user: 'root',
  password: '12345',
  database: 'typing_test'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected!');
  

    //getting the id of user previously registered to db
    //const sql = "SELECT id FROM user WHERE name = 'Gaurav'";
    //connection.query(sql, function (err, result) {
    //if (err) throw err;
    //console.log(result[0].id); //store inside a variable
    //});

    // const sql = "INSERT INTO report(id, reportId,accuracy, wpmScore, timeSpan) VALUES(1, 1, 80, 30, 1)";
    // connection.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
    // });
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.send("hello varda");
})

app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
// app.get("/")

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
var user_id = null;
app.post("/api/insert/user", (req, res)=>{
    const email = req.body.email;
    console.log(email);
    //insert from landing page
    // find email
    // if(email){
    //     getID
    // }else{
    //     insert email
    // }
    const findEmail = "SELECT email from user_details WHERE email = (?)";
        connection.query(findEmail,[email], function (err, result) {
            if(result.length == 0){
                //when no email found
                const insertEmail = "INSERT INTO user_details(email) VALUES(?)";
                connection.query(insertEmail,[email], function (err, result) {
                    if (err){
                        console.log("error has come");
                    }
                    // console.log(result);
                    user_id = result.insertId;
                    console.log(user_id);
                })
            }else{
                console.log(result[0].id);
                user_id = result[0].id;
            }
    })
    res.header("Access-Control-Allow-Origin", "*")
})
app.post("/api/insert/user/report", (req, res)=>{
    const accuracy = req.body.accuracy;
    const wpmScore = req.body.wpmScore;
    const timeSpan = req.body.timeSpan;
    console.log(accuracy, wpmScore, timeSpan);
    //insert from landing page
    //make userid and reportid dynamic
    const time = new Date();
    console.log(time);
    const sql = "INSERT INTO test_record(user_id, time_mode, accuracy, wpm_score, test_time) VALUES (?,?,?,?,?)";
    connection.query(sql,[user_id, timeSpan, accuracy, wpmScore, time], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    res.status(404).send('Unable to find the requested resource!');
    res.header("Access-Control-Allow-Origin", "*")
})

app.listen(3001, ()=>{
    console.log("running on port 3001");
})


//routing