import pool from "../../config/database"
import { selectByEmail, selectPassword, selectSingleEmail, selectUserByNickname, selectUserScrapFirst, selectUserScrapNext } from "./userDao"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import privateInfo from "../../config/privateInfo"

export const checkExistEmail = async(email)=>{
    
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectSingleEmail(connection, email);

    connection.release()
    return result
}

export const checkExistNickname = async(nickname) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectUserByNickname(connection, nickname);
    return result
}

export const login = async(email, password) =>{
    const connection = await pool.getConnection(async conn => conn)

    const emailCheck = await selectByEmail(connection, email);
    if (!emailCheck){
        return {
            status : "email",
            success : false
        }
    }
    const result = await selectPassword(connection, email)
    
    const passwordCheck = await bcrypt.compare(password,result.password)
    if (!passwordCheck){
        return{
            status : "password",
            success : false
        }
    }
    else{
        console.log(result)
        let token = await jwt.sign({
            userId : result.Id,
            userEmail : email
        },
        privateInfo.JWT_SECRET,
        {
            expiresIn : "30d",
            subject : "userInfo"
        });
        return{
            status : "success",
            success : true,
            token
        }
    }
}

export const getMyScrap = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await selectUserScrapFirst(connection, userId);
    return result
}

export const getNextScrap = async(userId, recipeId) => {
    const connection = await pool.getConnection(async conn => conn);
    const result = await selectUserScrapNext(connection, userId, recipeId)
    return result
}