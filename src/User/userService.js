import { checkExistEmail } from "./userProvider"
import pool from "../../config/database"
import { createUserEmail } from "./userDao";



export const startWithKakao = async(userProfile, userEmail)=>{

    const isLogin = await checkExistEmail(userEmail)
    // 1차 회원가입 프로세스
    if (!isLogin){
        const connection = await pool.getConnection(async conn => conn);
        const result = await createUserEmail(connection, userEmail, userProfile);
        if (result > 0)
            return "join"
    }

}