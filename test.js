const text = "달콤힌 카페라떼.";

const findString = "라떼";

const splited = text.split(" ");
console.log(splited);
console.log(splited.length);
i=0;
while(i<splited.length){
    
    i++;
}

if(text.indexOf(findString) != -1) {
    console.log("성공");
}
else {
    console.log("실패");
}

console.log(text.indexOf(findString))