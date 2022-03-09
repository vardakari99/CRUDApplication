var mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
var express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3309,
  user: 'root',
  password: '',
  database: 'typing_test'
});
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'varda.kari99@gmail.com',
      pass: 'izmmxolpqksvlcxd'
    }
});
// point to the template folder
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected!');
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
    // console.log(email);
    //insert from landing page
    // find email
    // if(email){
    //     getID
    // }else{
    //     insert email
    // }
    const findEmail = "SELECT email from user_details WHERE email = (?)";
        connection.query(findEmail,[email], function (err, result) {
            if(result.length === 0){
                //when no email found
                const insertEmail = "INSERT INTO user_details(email) VALUES(?)";
                connection.query(insertEmail,[email], function (err, result) {
                    if (err){
                        console.log("error has come");
                        return res.status(404).send('Unable to find the requested resource!');
                    }
                    // console.log(result);
                    user_id = result.insertId;
                    // console.log(user_id);
                })
            }else{
                // console.log(result[0].id);
                user_id = result[0].id;
            }

            res.status(200).json({
                status: 'succes'
            })
    })
    res.header("Access-Control-Allow-Origin", "*")
})
app.post("/api/insert/user/report", (req, res)=>{
    const accuracy = req.body.accuracy;
    const wpmScore = req.body.wpmScore;
    const timeSpan = req.body.timeSpan;
    const email = req.body.email;
    console.log(accuracy);
    // console.log(accuracy, wpmScore, timeSpan);
    //insert from landing page
    //make userid and reportid dynamic
    const time = new Date();
    const findId = "SELECT id FROM user_details WHERE email = (?)";
        connection.query(findId,[email], function (err, result) {
            console.log(result);
            if(result === null){
                //when no email found
                return res.status(404).json({
                    status: 'error',
                    data: req.body,
                }) 
            }else{
                user_id = result[0].id;
                const sql = "INSERT INTO test_record(user_id, time_mode, accuracy, wpm_score, test_time) VALUES (?,?,?,?,?)";
                connection.query(sql,[user_id, timeSpan, accuracy, wpmScore, time], function (err, result) {
                    if (err){
                        console.log(err)
                    };
                    console.log(result);
                })
                console.log("id found")
            }
    })
    res.header("Access-Control-Allow-Origin", "*")
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };
    
    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    var mailOptions = {
        from: 'varda.kari99@gmail.com', //domain email
        to: req.body.email, //req.body.email
        subject: 'Typing Test Report', //otp for email verification
        template: 'reportEmail',
        text: `That was easy!\n Your Accuracy is ${accuracy}`, //req.body.accuracy
        context:{
            email: email,
            accuracy: accuracy, // replace {{name}} with Adebola
            wpm: wpmScore, // replace {{company}} with My Company
            level: timeSpan,
            time: time
        }
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(404).send('Unable to find the requested resource!');
        } else {
          console.log('Email sent: ' + info.response);
            return res.status(200).json({
                status: 'succes',
                data: req.body,
            }) 
        }
      }); 
});

  function generateOTP() {
    // Declare a string variable 
    // which stores all string
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var OTP = '';
    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 6; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
  }
app.post("/api/insert/user/verify", (req, res) => {
    const email = req.body.email;
    const verifycode = generateOTP();
    const findCode = "SELECT email FROM user_verification WHERE email = (?)";
        connection.query(findCode,[email], function (err, result) {
            console.log(result);
            if(result.length == 0){
                //when no email found
                const insertCode = "INSERT INTO user_verification(email, verifycode) VALUES(?,?)";
                connection.query(insertCode,[email, verifycode], function (err, result) {
                    if (err){
                        console.log(err);
                    }
                })
            }else{
                const updateCode = "UPDATE user_verification SET verifycode = (?) WHERE email = (?)";
                connection.query(updateCode,[verifycode, email], function (err, result) {
                    if (err){
                        console.log(err);
                    }
                })
            }
    })
    var mailOptions = {
        from: 'varda.kari99@gmail.com', //domain email
        to: req.body.email, //req.body.email
        subject: 'OTP Verification Typing Test', //otp for email verification
        html: `<p>You are one step behind of taking the test!<b>Your OTP is <h2>${verifycode}</h2><b></p>` //req.body.otp
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(404).send('Unable to find the requested resource!');
        } else {
          console.log('Email sent: ' + info.response);
            return res.status(200).json({
                status: 'succes',
                data: req.body,
            }) 
        }
      }); 
    // res.status(404).send('Unable to find the requested resource!');
    res.header("Access-Control-Allow-Origin", "*")
})
app.post("/api/insert/user/verify/email", (req, res)=>{
    let postHeader = [
        'Access-Control-Allow-Origin', '*',
        'Access-Control-Allow-Methods', 'POST',
        'Access-Control-Allow-Headers', 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials', 'true',
        'Content-Type', 'application/json'
      ]
    const email = req.body.email;
    const usercode = req.body.verifycode;
    const sql = "SELECT verifycode FROM user_verification WHERE email = (?)";
    connection.query(sql,[email], function (err, result) {
        if (err) throw err;
        let isMatched = usercode.localeCompare(result[0].verifycode);
        console.log(usercode);
        console.log(result);
        console.log(result[0].verifycode);
        res.header(postHeader);
        console.log(isMatched);
        if (isMatched === 0) {
            res.status(200).json({
                status: 'succes',
                data: {"loggedIn": "true"},
            })
        }else{
            return res.status(400).json({
                status: 'error',
                error: 'OTP do not match',
            });
        }
    });
    // res.end();
})


app.listen(3001, ()=>{
    console.log("running on port 3001");
})