const express = require("express");

const bodyParser = require("body-parser");

const htpps = require("https");

const app = express();

require("dotenv").config();

const  PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status:  "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url ="https://us9.api.mailchimp.com/3.0/lists/9d0b88a5a5";

    const options = {
        method: "POST",
        auth: "ANii:" + process.env.API_KEY
    }

    const request = htpps.request(url, options, function (response) {
        response.on("data", function (data) {
        processData(data);
        });
        function processData(data) {
            if (JSON.parse(data).error_count>=1) {
                res.sendFile(__dirname + "/mailfail.html");
            } else if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
    request.write(jsonData);
    request.end();
    
});

app.post("/failure" , function(req,res){
    res.redirect("/");
});

app.listen(PORT , function(){
    console.log(`server started at port ${PORT}`);
});


