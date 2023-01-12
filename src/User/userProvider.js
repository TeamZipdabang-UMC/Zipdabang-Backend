import pool from "../../config/database"
import { selectSingleEmail } from "./userDao"

export const checkExistEmail = async(email)=>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectSingleEmail(connection, email);

    connection.release()
    return result
}