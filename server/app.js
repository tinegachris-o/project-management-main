import express from 'express'
import dotenv from 'dotenv'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
dotenv.config()
import cors from "cors"
const port=process.env.PORT
import { clerkMiddleware } from '@clerk/express'

const app = express()
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//routes
app.get("/",(req,res)=>{
    res.send("Server is live")
})
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(port,()=>{
    console.log(`server listning on port ${port}`)
})