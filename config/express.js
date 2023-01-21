import express from "express"
import cors from "cors"
import userRouter from "../src/User/userRouter";
import commentRouter from "../src/Comment/commentRouter";
import noticeRouter from "../src/notice/noticeRouter";
import recipeRouter from "../src/Recipe/recipeRouter";
import rootRouter from "../src/Root/rootRouter";
import morgan from "morgan";

const app = express();
const logger = morgan("dev")

app.use(logger)
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

app.use('/users', userRouter);
app.use('/recipes', recipeRouter);
app.use('/comments', commentRouter);
app.use('/root', rootRouter);
app.use('/notice', noticeRouter);


export default app;
