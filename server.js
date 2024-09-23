const express = require('express')
const app = express()
const sqlite3  =require("sqlite3")
const {open} = require("sqlite")
const path = require("path")
const dbPath = path.join(__dirname,"emarket.db")
const bcrypt = require("bcrypt")

app.use(express.json())
let db=null


const intializeDBAndServer =async () =>{

    try{
        db=await open({
        filename:dbPath,
        driver:sqlite3.Database
    })
        app.listen(3000,()=>{
            console.log("app listening")
    })
    }
    catch(e){
        console.log(`DB error ${e.message}`)
        process.exit(1)
}


}

intializeDBAndServer()

app.post('/admin/signup',async (req,res)=>{
    const {email,adminName,password} = req.body 
    

    const existAdminQuery = `SELECT * FROM Admin WHERE email=?`
    const existAdmin = await db.get(existAdminQuery,[email])

    if (existAdmin===undefined){
        const hashedPassword = await bcrypt.hash(password,10)
        const createAdminQuery = `INSERT INTO Admin (adminName,email,password) VALUES (?,?,?)`
        const createAdmin = await db.run(createAdminQuery,[adminName,email,hashedPassword])
        res.status(201).json({message:"user created"})
    }
    else{
        res.status(400).json({message:"user already existed"})
    }

})