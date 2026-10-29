import { PrismaClient } from "./generated/prisma/client.js";
import express from "express"

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

//todo creation
app.post('/todos',async(req,res)=>{
    const {title,description} = req.body;

    const todo = await prisma.todo.create({
        data:{
            title,
            description
        }
    })
    //console.log(todo)
    return res.status(200).json({
        message:"success",
        todo
    })
})

//get all todos
app.get('/todos',async(req,res)=>{
    const todos = await prisma.todo.findMany();
    return res.status(200).json({
        message:"success",
        todos
    })
})

app.listen(3000);