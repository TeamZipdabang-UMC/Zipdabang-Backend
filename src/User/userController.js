import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { addUser, finishSocialLogin, startWithGoogle, startWithKakao } from "./userService";
import { checkExistNickname, getMyScrap, getNextScrap, login } from "./userProvider";


// export const startKakaoRedirect = async(req,res)=>{
//     const nextUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${privateInfo.KAKAO_API_KEY}&redirect_uri=${privateInfo.KAKAO_REDIRECT}&response_type=code`;
//     res.redirect(nextUrl);
// }

export const kakaoLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    const result = await startWithKakao(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

export const googleLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    const result = await startWithGoogle(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

// export const finishKakaoRedirect = async(req,res) =>{
//     const {code} = req.query
//     const tokenApiUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${privateInfo.KAKAO_API_KEY}&redirect_uri=${privateInfo.KAKAO_REDIRECT}&code=${code}`;
    
//     const getFinalTokenApi = await fetch(tokenApiUrl,
//         {
//             method: "POST",
//             headers:{
//                 "Content-type": "application/json"
//             }
//         })
//     const kakaoToken = await getFinalTokenApi.json();

//     const getUserApi = `https://kapi.kakao.com/v2/user/me`

//     const userData = await fetch(getUserApi,{
//         method : "POST",
//         headers:{
//             "Authorization" : `Bearer ${kakaoToken.access_token}`,
//             "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
//         }
//     });

    
//     const {kakao_account : {profile : {profile_image_url:userProfile}, email:userEmail },} =  await userData.json();

//     const result = await startWithKakao(userProfile, userEmail)
//     res.send(JSON.stringify(result))
// }

export const startGoogleRedirect = async(req, res) =>{
    const nextUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${privateInfo.GOOGLE_CLIENT_ID}&redirect_uri=${privateInfo.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;
    res.redirect(nextUrl);
}

export const finishGoogleRedirect = async(req, res) =>{
    const code = req.query.code
    const apiUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${privateInfo.GOOGLE_CLIENT_ID}&client_secret=${privateInfo.GOOGLE_CLENT_PASS}&redirect_uri=${privateInfo.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`;

    const getGoolgeApi = await fetch(apiUrl,{
        method : "POST",
        headers: {
            "Content-type" : "application/json"
        }
    });
    const googleToken = await getGoolgeApi.json();

    const getUserUri = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleToken.access_token}`
    const userData = await fetch(getUserUri,{
        method : "GET",
        headers: {
            Authrization : `Bearer ${googleToken.access_token}`
        }
    });

    const User = await userData.json();
    
    const result = await startWithGoogle(User.picture, User.email);

    res.send(JSON.stringify(result));

}

export const findExistNickname = async(req,res)=>{
    const {nickname} = req.query
    
    const result = await checkExistNickname(nickname);
    if (result){
        const responseObj = {
            exist : true,
            nickname
        }
        res.send(JSON.stringify(responseObj))
    }
    else{
        const responseObj = {
            exist : false,
        }
        res.send(JSON.stringify(responseObj))
    }
}

export const postUserDataSocial = async(req,res) =>{
    const {name, nickname, phoneNum, birth, email} = req.body

    const expressionErrorObj = {
        status : "expression error",
        type : ``
    }

    const existErrorObj = {
        status : "data exist error",
        type : ``
    }

    if (!name)
    {
        existErrorObj.type = `name`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!nickname){
        existErrorObj.type = `nickname`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!phoneNum){
        existErrorObj.type = `phoneNum`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!birth){
        existErrorObj.type = `birth`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!email){
        existErrorObj.type = `email`
        res.send(JSON.stringify(existErrorObj))
    }

    if (!regexEmail.test(email))
    {
        expressionErrorObj.type = `email`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (name.length <= 0 || name.length > 10)
    {
        expressionErrorObj.type = `name`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (nickname.length <= 1 || nickname.length > 10)
    {
        expressionErrorObj.type = `nickname`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (phoneNum.length != 11)
    {
        expressionErrorObj.type = `phone number`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (birth.length != 8 || birth[6] != '-'){
        expressionErrorObj.type = `birth`
        res.send(JSON.stringify(expressionErrorObj))
    }

    const dataObj = req.body
    const result = finishSocialLogin(dataObj);
    if (result)
    {
        const responseObj = {
            success: true,
            name : dataObj.name,
            nickname : dataObj.nickname,
            phoneNum : dataObj.phoneNum
        }

        res.send(JSON.stringify(responseObj));
    }
}

export const postUser = async(req, res) =>{

    const {email, name, nickname, birth, password, passwordCheck, phoneNum} = req.body

    const expressionErrorObj = {
        status : "expression error",
        type : ``
    }

    const existErrorObj = {
        status : "data exist error",
        type : ``
    }

    if (!name)
    {
        existErrorObj.type = `name`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!nickname){
        existErrorObj.type = `nickname`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!phoneNum){
        existErrorObj.type = `phoneNum`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!birth){
        existErrorObj.type = `birth`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!email){
        existErrorObj.type = `email`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!password){
        existErrorObj.type = `password`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!passwordCheck){
        existErrorObj.type = `password check`
        res.send(JSON.stringify(existErrorObj))
    }

    if (!regexEmail.test(email))
    {
        expressionErrorObj.type = `email`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (name.length <= 0 || name.length > 10)
    {
        expressionErrorObj.type = `name`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (nickname.length <= 1 || nickname.length > 10)
    {
        expressionErrorObj.type = `nickname`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (phoneNum.length != 11)
    {
        expressionErrorObj.type = `phone number`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (birth.length != 8 || birth[6] != '-'){
        expressionErrorObj.type = `birth`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (password != passwordCheck){
        expressionErrorObj.type = `password do not match with password check`
        res.send(JSON.stringify(expressionErrorObj))
    }

    const dataObj = req.body;
    const result = await addUser(dataObj);

    if (result){
        const responseObj = {
            status : "joined!",
            success : true,
            info : {
                name : dataObj.name,
                nickname : dataObj.nickname,
                email : dataObj.email
            }
        }
        
        res.send(JSON.stringify(responseObj))
    }
}

// export const signIn = async(req, res) =>{
//     const {email, password} = req.body
//     const expressionErrorObj = {
//         status : "expression error",
//         type : ``
//     }

//     const existErrorObj = {
//         status : "data exist error",
//         type : ``
//     }

//     if (!email){
//         existErrorObj.type = `email`
//         res.send(JSON.stringify(existErrorObj))
//     }
//     else if (!password){
//         existErrorObj.type = `password`
//         res.send(JSON.stringify(existErrorObj))
//     }

//     if (!regexEmail.test(email)){
//         expressionErrorObj.type = 'email',
//         res.send(JSON.stringify(expressionErrorObj))
//     }

//     const result = await login(email, password);
//     console.log(result)
//     if (!result.success && result.status == 'email')
//     {
//         const responseObj = {
//             status : "login fail",
//             error : "such user that have email not exist"
//         }

//         res.send(JSON.stringify(responseObj))
//     }
//     else if (!result.success && result.status == 'password'){
//         const responseObj = {
//             status : "login fail",
//             error : "password is wrong"
//         }

//         res.send(JSON.stringify(responseObj))
//     }
//     else{
//         const responseObj = result
//         res.send(JSON.stringify(responseObj))
//     }
// }

export const getMyPageFirst = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken;
    
    const myScrapResult = await getMyScrap(userId);
    const myPageResponse = 
    {
        myScrap : myScrapResult,
    }

    res.send(JSON.stringify(myPageResponse))
}

export const getMyScrapUpdate = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken
    const {recipeId} = req.query
    const myNextScrapResult = await getNextScrap(userId, recipeId)
    
    const myPageResponse = {
        myScrap : myNextScrapResult
    }
    res.send(JSON.stringify(myPageResponse))
}