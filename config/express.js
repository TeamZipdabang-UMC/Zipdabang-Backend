import express from "express"
import cors from "cors"
import userRouter from "../src/User/userRouter";
import noticeRouter from "../src/notice/noticeRouter";
import recipeRouter from "../src/Recipe/recipeRouter";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/users', userRouter);
app.use('/notice', noticeRouter);

export default app;
