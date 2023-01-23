import { postQuestionData } from "./noticeDao";
import pool from "../../config/database"
export const postQuestion = async(userId, email, text)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await postQuestionData(connection,userId, email, text);
    connection.release();
    return result
}