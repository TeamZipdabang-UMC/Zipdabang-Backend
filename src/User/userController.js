
import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { kakaoLogin, startWithKakao } from "./userService";

export const startKakaoRedirect = async(req,res)=>{
    const nextUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${privateInfo.KAKAO_API_KEY}&redirect_uri=${privateInfo.KAKAO_REDIRECT}&response_type=code`;
    res.redirect(nextUrl);
}

export const finishKakaoRedirect = async(req,res) =>{
    const {code} = req.query
    const tokenApiUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${privateInfo.KAKAO_API_KEY}&redirect_uri=${privateInfo.KAKAO_REDIRECT}&code=${code}`;
    
    const getFinalTokenApi = await fetch(tokenApiUrl,
        {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            }
        })
    const kakaoToken = await getFinalTokenApi.json();

    const getUserApi = `https://kapi.kakao.com/v2/user/me`

    const userData = await fetch(getUserApi,{
        method : "POST",
        headers:{
            "Authorization" : `Bearer ${kakaoToken.access_token}`,
            "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
        }
    });

    
    const {kakao_account : {profile : {profile_image_url:userProfile}, email:userEmail },} =  await userData.json();

    const result = await startWithKakao(userProfile, userEmail)
    if(result === "join")
        res.send("join 1st process success!")
}