
const express=require('express');
const app=express();
app.use(express.static(__dirname+'/styles'));
var bodyParser = require('body-parser');
app.set('view engine', 'ejs')
const mysql=require("mysql2/promise")

let alert = require('alert'); 
var USERNAME;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}));


function connection(){
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "library_dbms"
    });
}


    


app.get("/",function(req,res) {
    res.sendFile(__dirname+'/views/homepage.html');
})

app.get("/homepage.html",function(req,res) {
    res.sendFile(__dirname+'/views/homepage.html');
})
app.get("/loginPage.html",function(req,res) {
    res.sendFile(__dirname+'/views/loginPage.html');
})
app.post("/loginPage",async function(req,res){
    
    var con=await connection();
    var role = (req.body.role);
    var username = (req.body.username);
    var password = (req.body.password);
    var sql1="SELECT type FROM users WHERE user_id=(?)"
    var sql2="SELECT password FROM login_details WHERE login_id=(?)"
    var type_in_db,password_in_db;
    console.log(role,username,password);
    var type_in_db= await con.query(sql1,[username],function(err,result){
        if(err) throw err;
        
        return result;
        
        
    })
    var password_in_db=await con.query(sql2,[username],function(err,result){
        if(err) throw err;
        return result;
       
    })
    
    type_in_db=JSON.stringify(type_in_db[0][0].type)
    password_in_db=JSON.stringify(password_in_db[0][0].password)
    password=JSON.stringify(password)
    role=JSON.stringify(role)
    
    if(type_in_db===role && password_in_db===password && role===JSON.stringify("student")){
        USERNAME=username;
        res.redirect("/studentPage.ejs");
        
    }
    else if(type_in_db===role && password_in_db===password && role===JSON.stringify("admin")){
        USERNAME=username;
        res.redirect("/adminPage.ejs");
        
    }
    else if(type_in_db===role && password_in_db===password && role===JSON.stringify("teacher")){
        USERNAME=username;
        res.redirect("/teacherPage.ejs");
        
    }
    else{ 
        alert("Invalid Password");
        res.redirect("/loginPage.html");
        
        
    }
    con.end();
    
})



app.get("/AboutPage.html",function(req,res) {
    res.sendFile(__dirname+'/views/AboutPage.html');
})
app.get("/addBookPage.html",function(req,res) {
    res.sendFile(__dirname+'/views/addBookPage.html');
})
app.post("/addBookPage",async function(req,res){
    var con=await connection();
    var book_id = (req.body.book_id);
    var book_name = (req.body.book_name);
    var author_name = (req.body.author_name);
    var sql1="INSERT INTO books (book_id,book_name,author) VALUES(?,?,?)"
    console.log(book_id,book_name,author_name);
    
    await con.query(sql1,[book_id,book_name,author_name],function(err,result){
        if(err) throw err ;
        con.end();
    })
    console.log("Done");
    res.redirect("/adminPage.ejs");
   
})
app.get("/adminPage.ejs",async function(req,res) {
    var con=await connection();
    var sql="SELECT * FROM users WHERE user_id=(?)"
    
    var user= await con.query(sql,[USERNAME],function(err,result){
        if(err) throw err;        
        return result;    
    })
   
    var data=user[0][0]
    var user_id=data.user_id;
    var name=data.name;
    var email=data.email;
    var phone=data.phone;
    var address=data.address;
    var type=data.type;
    res.render('adminPage',
    {"user_id":user_id,"user_name":name,"type":type,"email":email,"phone":phone,"address":address});
   
    con.end();
})
app.get("/addStudentPage.html",function(req,res) {
    res.sendFile(__dirname+'/views/addStudentPage.html');
})
app.post("/addStudentPage",async function(req,res){
    var con=await connection();
    var user_id = (req.body.user_id);
    var user_name = (req.body.user_name);
    var email = (req.body.email);
    var phone = (req.body.phone);
    var address = (req.body.address);
    var type = (req.body.type_of_user);
    var sql1="INSERT INTO users (user_id,name,email,phone,address,type) VALUES(?,?,?,?,?,?)"
    console.log(user_id,user_name,email,phone,address,type);
    
    await con.query(sql1,[user_id,user_name,email,phone,address,type],function(err,result){
      if (err) throw err;
      
    })
    
    
    var password=user_name+phone
    var sql2="INSERT INTO login_details (login_id,password) VALUES(?,?)"
    await con.query(sql2,[user_id,password],function(err,result){
        if(err) throw err ;
        con.end();
    })
    console.log("Done");
    res.redirect("/adminPage.ejs");
   
})
app.get("/deleteBook.html",function(req,res) {
    res.sendFile(__dirname+'/views/deleteBook.html');
})
app.post("/deleteBook",async function(req,res){
    var con=await connection();
    var book_id = (req.body.delete_book_id);
    
    var sql1="DELETE FROM books WHERE book_id=(?)";
   
    
    await con.query(sql1,[book_id],function(err,result){
        if(err) throw err ;
        con.end();
    })
    console.log("Done");
    res.redirect("/adminPage.ejs");
})
app.get("/deleteStudent.html",function(req,res) {
    res.sendFile(__dirname+'/views/deleteStudent.html');
})
app.post("/deleteStudent",async function(req,res){
    var con=await connection();
    var user_id = (req.body.delete_student_id);
    
    var sql1="DELETE FROM users WHERE user_id=(?)";
   
    
    await con.query(sql1,[user_id],function(err,result){
        if(err){
            throw err;
        }  ;
        con.end();
    })
    console.log("Done user deletion");
    res.redirect("/adminPage.ejs");
})
app.get("/feedback.html",function(req,res) {
    res.sendFile(__dirname+'/views/feedback.html');
})
app.get("/forget_password.html",function(req,res) {
    res.sendFile(__dirname+'/views/forget_password.html');
})


app.get("/studentPage.ejs",async function(req,res) {
    var con=await connection();
    var sql="SELECT * FROM users WHERE user_id=(?)"
    var sql2="SELECT book_id,book_name FROM books WHERE book_id IN (SELECT book_id FROM takes_book WHERE user_id=(?))";
    var user= await con.query(sql,[USERNAME],function(err,result){
        if(err) throw err;        
        return result;    
    })
    var books= await con.query(sql2,[USERNAME],function(err,result){
        if(err) throw err;        
        return result;    
    })
    var data=user[0][0]
    var user_id=data.user_id;
    var name=data.name;
    var email=data.email;
    var phone=data.phone;
    var address=data.address;
    var type=data.type;
    var bookData=books[0]
    while(bookData.length<4){
        bookData.push({"book_id": "None", "book_name": 'None'})
    }

    console.log(bookData[1]);
    res.render('studentPage',
    {"user_id":user_id,"user_name":name,"type":type,"email":email,"phone":phone,"address":address,
    "bookId1":bookData[0].book_id,"bookName1":bookData[0].book_name,
    "bookId2":bookData[1].book_id,"bookName2":bookData[1].book_name,
    "bookId3":bookData[2].book_id,"bookName3":bookData[2].book_name,
    "bookId4":bookData[3].book_id,"bookName4":bookData[3].book_name
    });
    con.end();
})
app.get("/teacherPage.ejs",async function(req,res) {
    var con=await connection();
    var sql="SELECT * FROM users WHERE user_id=(?)"
    var sql2="SELECT book_id,book_name FROM books WHERE book_id IN (SELECT book_id FROM takes_book WHERE user_id=(?))";
    var user= await con.query(sql,[USERNAME],function(err,result){
        if(err) throw err;        
        return result;    
    })
    var books= await con.query(sql2,[USERNAME],function(err,result){
        if(err) throw err;        
        return result;    
    })
    var data=user[0][0]
    var user_id=data.user_id;
    var name=data.name;
    var email=data.email;
    var phone=data.phone;
    var address=data.address;
    var type=data.type;
    var bookData=books[0]
    while(bookData.length<4){
        bookData.push({"book_id": "None", "book_name": 'None'})
    }

    console.log(bookData[1]);
    res.render('teacherPage',
    {"user_id":user_id,"user_name":name,"type":type,"email":email,"phone":phone,"address":address,
    "bookId1":bookData[0].book_id,"bookName1":bookData[0].book_name,
    "bookId2":bookData[1].book_id,"bookName2":bookData[1].book_name,
    "bookId3":bookData[2].book_id,"bookName3":bookData[2].book_name,
    "bookId4":bookData[3].book_id,"bookName4":bookData[3].book_name
    });
    con.end();
})

app.get("/manageBookPage.html",function(req,res){
    res.sendFile(__dirname+'/views/manageBookPage.html')
})
app.post("/manageBookPage",async function(req,res){
    var con=await connection();
    var user_id = (req.body.student_id_manage);
    var book_id = (req.body.book_id_manage);
    
    
    var sql1="SELECT max(issue_id) as mi FROM takes_book";
    var sql2="INSERT INTO takes_book (user_id,book_id,issue_id) VALUES(?,?,?)";
   
    
    var max_issue_id=await con.query(sql1,[],function(err,result){
        if(err) throw err ;
        return result ;   
    })
    
    max_issue_id=max_issue_id[0][0].mi;
    
    await con.query(sql2,[user_id,book_id,max_issue_id+1],function(err,result){
        if(err) throw err ; 
        console.log("Done");
    })
    con.end();
    
    res.redirect("/adminPage.ejs");
})

app.get("/issues.ejs",async function(req,res){
    var con=await connection();
  
    var sql1="SELECT * FROM takes_book";
    
    var data=await con.query(sql1,[],function(err,result){
        if(err) throw err ;
        return result ;   
    })
    var data1=data[0]
    con.end();
    
    res.render("issues",{data:(data1)} );
})
app.get("/books.ejs",async function(req,res){
    var con=await connection();
  
    var sql1="SELECT * FROM books";
    
    var data=await con.query(sql1,[],function(err,result){
        if(err) throw err ;
        return result ;   
    })
    var data1=data[0]
    con.end();
    
    res.render("books",{data:(data1)} );
})
app.get("/users.ejs",async function(req,res){
    var con=await connection();
  
    var sql1="SELECT * FROM users";
    
    var data=await con.query(sql1,[],function(err,result){
        if(err) throw err ;
        return result ;   
    })
    var data1=data[0]
    con.end();
    
    res.render("users",{data:(data1)} );
})

app.get("/deleteIssue.html",function(req,res) {
    res.sendFile(__dirname+'/views/deleteIssue.html');
})
app.post("/deleteIssue",async function(req,res){
    var con=await connection();
    var book_id = (req.body.delete_issue_id);
    
    var sql1="DELETE FROM takes_book WHERE issue_id=(?)";
   
    
    await con.query(sql1,[book_id],function(err,result){
        if(err) throw err ;
        con.end();
    })
    console.log("Done");
    res.redirect("/adminPage.ejs");
})


app.listen(3000,function(){
    console.log("Server started on port 3000");
});