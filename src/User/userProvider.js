import pool from "../../config/database"
import { selectAllChallenging, selectAllComplete, selectAllScrap, selectByEmail, selectPassword, selectSingleEmail, selectUserByNickname, selectUserChallenging, selectUserComplete, selectUserScrapNext, selectUserScrapOverView } from "./userDao"
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
    console.log("in provider", nickname)
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectUserByNickname(connection, nickname);
    connection.release()
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
    connection.release()
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

export const getMyScrapOverView = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await selectUserScrapOverView(connection, userId);
    connection.release()
    return result
}

export const getMyChallengingOverView = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectUserChallenging(connection, userId);
    connection.release()
    return result
}

export const getMyCompleteOverView = async(userId) => {
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectUserComplete(connection, userId);
    connection.release()
    return result
}

export const getMyScrapAll = async(userId) => {
    const connection = await pool.getConnection(async conn => conn);
    const result = await selectAllScrap(connection, userId);
    connection.release()
    return result
}

export const getMyChallengingAll = async(userId) => {
    const connection = await pool.getConnection(async conn => conn);
    const result = await selectAllChallenging(connection, userId);
    connection.release()
    return result
}

export const getMyCompleteAll = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectAllComplete(connection, userId)
    connection.release()
    return result
}
