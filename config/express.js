import express from "express"
import cors from "cors"
import userRouter from "../src/User/userRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/users', userRouter);



export default app;