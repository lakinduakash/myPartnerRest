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
    res.locals.connection.query('SELECT * from user WHERE username =?',[req.body.username],function (error,result) {
        if(error) {
            res.status(400);
            res.send(JSON.stringify({"loggedIn":false}));
            res.end();
        }
        else {
            if (result.length === 1 && result[0].password === req.body.password) {
                res.send(JSON.stringify({"loggedIn": true, "username": req.body.username, "id":result[0].id}));
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
    let sql="INSERT INTO `user` (`username`, `password`, `city`, `age`, `gender`, `religion`, `cast`, `height`, `other`, `name`, `contact`) VALUES (?)";
    let b=req.body;
    let value=[b.username,b.password,b.city,b.age,b.gender,b.religion,b.cast,b.height,b.other,b.name,b.contact];
    res.locals.connection.query(sql,[value],function (error,result) {
        if(error){
            res.status(400);
            res.send(JSON.stringify({"loggedIn":false,"success":false}))
        }
        else
            res.send(JSON.stringify({"loggedIn":true,"success":true,"username":b.username}))
    });

});

app.get("/api/userlist",(req,res)=>
{
    let sql="SELECT `id`,`gender`,`city` from `user`"
    res.locals.connection.query(sql,null,function (error,result) {
        res.send(JSON.stringify(result));
        
    })
});

app.get("/api/details/:id",(req,res)=>{

    const  id=req.params.id

    let sql ="SELECT * from `user` WHERE id ="+id;

    res.locals.connection.query(sql,null,(error,result)=>
    {
        res.send(JSON.stringify(result));
    })
})