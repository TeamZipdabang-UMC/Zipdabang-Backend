import express from "express"
import cors from "cors"
import userRouter from "../src/User/userRouter";
import commentRouter from "../src/Comment/commentRouter";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

app.use('/users', userRouter);
app.use('/comments', commentRouter);

export default app;