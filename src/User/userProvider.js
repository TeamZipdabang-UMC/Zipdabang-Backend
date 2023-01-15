import pool from "../../config/database"
import { selectSingleEmail, selectUserByNickname } from "./userDao"

export const checkExistEmail = async(email)=>{
    
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectSingleEmail(connection, email);

    connection.release()
    return result
}

export const checkExistNickname = async(nickname) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectUserByNickname(connection, nickname);
    
}