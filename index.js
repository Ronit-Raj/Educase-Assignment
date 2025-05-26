import express from "express"
import 'dotenv/config'
import * as fs from 'fs'
import mysql from "mysql2/promise"
import { addSchoolHandler } from "./handlers/addSchoolHandlers.js"
import { listSchool } from "./handlers/listSchoolsHandler.js"

const app =express()
app.use(express.json())
let connection=null


app.listen(process.env.PORT,async ()=>{
    console.log(`listening on port no ${process.env.PORT}`);

    try {
        connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT, 
        ssl: {
            rejectUnauthorized: true, 
            ca:fs.readFileSync('./ca.pem') 
        }
        });

        console.log('Connected to MySQL');
    
  } catch (err) {
        console.error('Connection failed:', err);
  }
})


app.post('/addSchool', async(req,res)=>{
    await addSchoolHandler(req,res,connection)
})

app.get('/listSchools', async(req,res)=>{
    await listSchool(req,res,connection)
})
