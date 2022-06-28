var key = document.getElementById("key"); // 쓰일 키
var str = document.getElementById("str"); // 문자열
var arr = document.getElementById("a"); // 암호화할 문자열
var enc = document.getElementById("encryption");
var dec = document.getElementById("decryption");
var alphabetBoard = Array(Array(5), Array(5), Array(5), Array(5), Array(5));
var keyForSet = "";
var blankCheck = "";
var zCheck = "";
var oddFlag = false;
var enc_result = ""; // 결과

function init() {
    dataPreprocessing();
    setBoard();
    setStr();
    setArr();
    strEncryption(key.value, str.value);
    removeElements();
}

function decry(){
    strDecryption(key.value, enc_result, zCheck);
}

function dataPreprocessing() {
    document.getElementById("key1").value = key.value;
    document.getElementById("str1").value = str.value;

    key.value = (key.value).toLowerCase();
    str.value = (str.value).toLowerCase();
}

function removeElements() {
    $('div').remove('.header');
    $('.footer').css("display", "block");
}

function home() {
    location.reload();
}

function setArr(){
    for(let i=0; i < alphabetBoard.length; i++){
        
        for(let j=0; j < alphabetBoard[i].length; j++){
            arr.innerHTML += alphabetBoard[i][j]+"  ";
        }
        arr.innerHTML += "<br>";
    }
}

// 배열에 중복없이
function setBoard() {
    key.value = (key.value).replace(/ /g, "");
    str.value = (str.value).replace(/ /g, "");
    key.value = (key.value).toLowerCase();

    var duplicationFlag = false; // 중복 검사
    var keyLengthCount = 0;

    key.value += "abcdefghijklmnopqrstuvwxyz";

    // 중복 처리 (key.value) 사용
    for (let i = 0; i < (key.value).length; i++) {
        for (let j = 0; j < keyForSet.length; j++) {
            if ((key.value).charAt(i) === keyForSet.charAt(j)) {
                duplicationFlag = true;
                break;
            }
        }
        if (!(duplicationFlag)) keyForSet += (key.value).charAt(i);
        duplicationFlag = false;
    }
    key.value = keyForSet;

    // 배열에 대입
    for (let i = 0; i < alphabetBoard.length; i++) {
        for (let j = 0; j < alphabetBoard[i].length; j++) {
            alphabetBoard[i][j] = keyForSet.charAt(keyLengthCount++);
        }
    }
}

function setStr() {
    for (let i = 0; i < (str.value).length; i++) {
        if ((str.value).charAt(i) == 'z') //z를 q로 바꿔줘서 처리
        {
            str.value = (str.value).substring(0, i) + 'q' + (str.value).substring(i + 1, (str.value).length);
            zCheck += 1;
        }
        else {
            zCheck += 0;
        }
    }
}

function strEncryption(key, str) {
    var playFair = ""; // 바꾸기 전 쌍자암호를 저장
    var encPlayFair = ""; // 바꾼 후 쌍자암호를 저장
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; // 두 글자의 각각의 행, 열 값
    var encStr = "";

    for (let i = 0; i < str.length; i+= 2) // arraylist 세팅
    {
        var tmpArr = new Array(2);                                                                                                                                                                
        tmpArr[0] = str.charAt(i);
        for (let j = 0; j < str.length; j++) {                             
            if (str.charAt(i) === str.charAt(i + 1)) //글이 반복되면 x추가
            {
                if(zCheck.charAt(i,1) === '1' ^ zCheck.charAt(i+1,1) === '1'){
                    console.log("둘이 xor");
                    tmpArr = str.charAt(i+1,1);
                }
                else{
                    tmpArr += 'x';
                    i--;
                }
            }
            else {
                tmpArr[1] = str.charAt(i + 1);
            }                                                                                                                      
        }
        playFair += tmpArr;
        playFair = playFair.replace(/,/gi, "");
        console.log("1playFair : ",playFair);
    }

    if (playFair.length % 2 === 1) {
        playFair += 'x';
        oddFlag = true;
    }

    for (let i = 0; i < playFair.length; i+= 2) {
        var tmpArr = new Array(2);
        if(playFair[i] === playFair[i+1]){
            if(zCheck.charAt(i, 1) === '1'){
                tmpArr[0] = 'q';
                tmpArr[1] = 'z';
            }
            else {
                tmpArr[0] = 'z';
                tmpArr[1] = 'q';
            }
            for (let j = 0; j < tmpArr.length; j++) {
                encPlayFair += tmpArr[j];
            }
            continue;
        }

        console.log("2playFair : ",playFair);

        for (let j = 0; j < alphabetBoard.length; j++) //쌍자암호의 각각 위치
        {
            for (let k = 0; k < alphabetBoard[j].length; k++) {
                if (alphabetBoard[j][k] === playFair[i]) {
                    x1 = j;
                    y1 = k;
                }
                if (alphabetBoard[j][k] === playFair[i + 1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }

        if (x1 == x2) //행이 같은경우
       {
            tmpArr[0] = alphabetBoard[x1][(y1 + 1) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 1) % 5];
        }
        else if (y1 == y2) //열이 같은 경우
        {
            tmpArr[0] = alphabetBoard[(x1 + 1) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 1) % 5][y2];
        }
        else //행, 열 모두 다른경우
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        for (let i = 0; i < tmpArr.length; i++) {
            encPlayFair += tmpArr[i];
        }
        encPlayFair += " "; 
    }

    for (let i = 0; i < encPlayFair.length; i++) {
        encStr += encPlayFair[i][0] + "" + encPlayFair[i][1] + " ";
    }
    enc.value = encPlayFair;
    enc_result = encPlayFair.replace(/ /gi, "");
}

function strDecryption(key, str, zChk) {
    var playFair = new Array(); // 바꾸기 전 쌍자암호를 저장
    var decPlayFair = new Array(); // 바꾼 후 쌍자암호를 저장
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; // 두 글자의 각각의 행, 열 값
    var decStr = "";

    for (let i = 0; i < str.length; i += 2) {
        var tmpArr = new Array();
        tmpArr[0] = str.charAt(i);
        tmpArr[1] = str.charAt(i + 1);
        playFair.push(tmpArr);
    }
    for (let i = 0; i < playFair.length; i++) {
        var tmpArr = new Array();
        for (let j = 0; j < alphabetBoard.length; j++) //쌍자암호의 각각 위치
        {
            for (let k = 0; k < alphabetBoard[j].length; k++) {
                if (alphabetBoard[j][k] === playFair[i][0]) {
                    x1 = j;
                    y1 = k;
                }
                if (alphabetBoard[j][k] === playFair[i][1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }

        if (x1 === x2) //행이 같은경우
        {
            tmpArr[0] = alphabetBoard[x1][(y1 + 4) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 4) % 5];
        }
        else if (y1 === y2) //열이 같은 경우
        {
            tmpArr[0] = alphabetBoard[(x1 + 4) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 4) % 5][y2];
        }
        else //행, 열 모두 다른경우
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        decPlayFair.push(tmpArr);
    }

    for (let i = 0; i < decPlayFair.length; i++) //중복 문자열 돌려놓음
    {
        if (i != decPlayFair.length - 1 && decPlayFair[i][1] == 'x' && decPlayFair[i][0] == decPlayFair[i + 1][0]) {
            decStr +=  decPlayFair[i][0] ;
        }
        else {
            decStr += decPlayFair[i][0] + decPlayFair[i][1];
        }
    }

    for (let i = 0; i < zChk.length; i++)//z위치 찾아서 q로 돌려놓음
    {
        if (zChk.charAt(i) == '1') {
            decStr = decStr.substring(0, i) + 'z' + decStr.substring(i + 1, decStr.length);
        }
    }
    if(decStr.slice(decStr.length-1,decStr.length) === 'x'){
        decStr = decStr.slice(0,length-1);
    }
    dec.value = decStr;
}