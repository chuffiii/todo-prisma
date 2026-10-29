import { PrismaClient } from "./generated/prisma/client.js";
import express from "express"
import cors from "cors"

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors())

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

//get todo
app.get('/todos/:id',async(req,res)=>{
    const id = Number(req.params.id);
    const todo = await prisma.todo.findUnique({
        where:{
            id
        }
    })
    return res.status(200).json({
        message:"success",
        todo
    })
})

//update todo
app.put('/todos/:id',async(req,res)=>{
    const id = Number(req.params.id);
    const {title,description} = req.body;
    console.log({title,description})
    const todo = await prisma.todo.update({
        where:{
            id
        },
        data:{
            title,
            description
        }
    })
    console.log(todo)
    return res.status(200).json({
        message:"success",
        todo
    })
})


//mark as complete
app.patch('/todos/:id/complete',async(req,res)=>{
    const id = Number(req.params.id)
    const todo = await prisma.todo.update({
        where:{
            id
        },
        data:{
            completed:true,
        }
    })

    return res.status(200).json({
        message:"success",
        todo
    })
})

//delete the todo
app.delete('/todos/:id',async(req,res)=>{
    const id = Number(req.params.id)
    const todo = await prisma.todo.delete({
        where:{
            id
        }
    })

    return res.status(200).json({
        message:"success",
        todo
    })
})

app.listen(3000);