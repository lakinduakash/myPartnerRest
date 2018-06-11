const express =require('express');
const mysql =require('mysql');

const app =express();

const port = 8000;

app.listen(port, ()=> {
console.log("we are live on" + port);
});

app.use(express.json());

app.use(function(req, res, next){
    res.locals.connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root@123',
        database : 'MyTest'
    });
    res.locals.connection.connect();
    next();
});



app.get("/",(req,res) =>
{
    res.json({"response":"hello world!"})
});


app.post("/api/login",(req,res)=>
{
    res.locals.connection.query('SELECT * from user WHERE email =?',[req.body.email],function (error,result) {
        if(error)
            throw error;
        if(result.length === 1 && result[0].password===req.body.password)
            res.send(JSON.stringify({"status":200,"value":"ok","email":req.body.email}));
        else
            res.send(JSON.stringify({"status":403,"value":"denied"}));
    });

});

app.post("/api/signup",(req,res)=>
{
    res.locals.connection.query('INSERT INTO user (email,password) VALUES (?)',[[req.body.email,req.body.password]],function (error,result) {
        if(error){
            res.status(400);
            res.send(JSON.stringify({'error':error}))
        }
        else
            res.send(JSON.stringify({"result":result}))
    });

});