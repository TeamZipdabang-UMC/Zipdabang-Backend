import express from "express"
import cors from "cors"
import userRouter from "../src/User/userRouter";
import recipeRouter from "../src/Recipe/recipeRouter";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//app.use('/users', userRouter);
app.use('/recipes',recipeRouter);


export default app;