const express = require("express");
const app = express();

app.use("/",(req,res) =>{
    res.send("Hello from the server.")
})

app.listen(3000, ()=>{
    console.log("App is listening in port 3000")
});