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
        if(error) {
            res.status(400);
            res.send(JSON.stringify({"loggedIn":false}));
            res.end();
        }
        else {
            if (result.length === 1 && result[0].password === req.body.password) {
                res.send(JSON.stringify({"loggedIn": true, "email": req.body.email, "id":result[0].id}));
                res.end();
            }
            else {
                res.status(403);
                res.send(JSON.stringify({"loggedIn": false}))

            }
        }
    });

});


app.post("/api/signup",(req,res)=>
{
    let sql="INSERT INTO `user` (`email`, `password`, `city`, `age`, `gender`, `religion`, `cast`, `height`, `other`) VALUES (?)";
    let b=req.body;
    let value=[b.email,b.password,b.city,b.age,b.gender,b.religion,b.cast,b.height,b.other];
    res.locals.connection.query(sql,[value],function (error,result) {
        if(error){
            console.log(error)
            res.status(400);
            res.send(JSON.stringify({"loggedIn":false,"success":false}))
        }
        else
            res.send(JSON.stringify({"loggedIn":true,"success":true,"email":b.email}))
    });

});

app.get("/api/userlist",(req,res)=>
{
    let sql="SELECT `id`,`gender`,`city` from `user`";
    res.locals.connection.query(sql,null,function (error,result) {
        res.send(JSON.stringify(result));
        
    })
});

app.get("/api/details/:id",(req,res)=>{

    const  id=req.params.id;

    let sql ="SELECT * from `user` WHERE id ="+id;

    res.locals.connection.query(sql,null,(error,result)=>
    {
        res.send(JSON.stringify(result));
    })
});