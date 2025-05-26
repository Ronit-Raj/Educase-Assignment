import express from "express"
import 'dotenv/config'
import * as fs from 'fs'
import mysql from "mysql2/promise"

const app =express()

app.listen(process.PORT,async ()=>{
    console.log(`listening on port no ${process.env.PORT}`);

    try {
        const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT, // optional
        ssl: {
            rejectUnauthorized: true, // depends on provider; some require SSL
            ca:fs.readFileSync('./ca.pem') 
        }
        });

        console.log('Connected to MySQL');
    
  } catch (err) {
        console.error('Connection failed:', err);
  }
})


