const API_KEY = "AIzaSyD_rrjNxH9LfmKB0Y0uy7nSfz0zHvvM_Iw"
const ROOT_URI  = "https://bestiebackend.herokuapp.com"
// console.log()
var quizId =  window.location.href.split( '?=' )[1]//'urVMq'
var header = {
    "Authorization": "Bearer "
}
let BearerToken = ''
var dataBearer = '{"grant_type": "refresh_token", "refresh_token": "AFxQ4_oInJWjggzirbMzbXdpPGo9HrjozXZMkC36DP44hLBOn297JYI21mDzaWYEKGMNvjRrD_AM9Jxf00KF5nNuNkLMJUbS_SbepigWVP3r4Y9p0Gb_6iz7qe57-oDu_edxeg43kdGbNY6tVw0swU7xXFKgJNqW63VEGQRR11HlAXwCnX0KtZg"}'
const nameField = document.querySelector('.quizOwner')
const leader = document.querySelectorAll('.competitor')
let tempArrHolder = {}
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
const colorArray = ['background-color: rgb(255, 86, 111);', 'background-color: rgb(255, 127, 80);', 
                    'background-color: rgb(255, 204, 0);', 'background-color: rgb(41, 231, 120);',
                    'background-color: rgb(153, 223, 255);', 'background-color: rgb(86, 126, 255);',
                    'background-color: rgb(197, 108, 240);', 'background-color: rgb(87, 96, 111);']
function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return (y-x);
 });
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
async function submitQuiz() {
    const leader = document.querySelectorAll('.competitor')
    const quizOwner = document.querySelector('.quizOwner').textContent.trim()
    const questions = document.querySelectorAll('.questionsCompos')
    var questionsArr = {
        "questions": []
    }
    var answerersArr = {
        "answerers": []
    }
    
    leader.forEach(el => {
        let compId = el.querySelector('.id').textContent.trim()
        let compName = el.querySelector('.name').textContent.trim()
        let compScore = el.querySelector('.score').textContent.trim()
        let obj = {
            "uid": compId,
            "name": compName,
            "score": parseInt(compScore)
     }
     compName.isEmpty() == false || compScore.isEmpty() == false ? answerersArr['answerers'].push(obj) : null

    })
    questions.forEach(el => {
        let header = el.querySelector('#question').textContent.trim()
        let color = el.querySelector('#color').textContent
        let allAnswers = el.querySelectorAll('#option')
        let correctAns = parseInt(el.querySelector('.correct').textContent.trim())
        let tempAnsObj = []
        allAnswers.forEach(ans => {
            tempAnsObj.push(ans.textContent.trim())
        })
        let obj = {
            "question": header,
            "options": tempAnsObj,
            "color": colorArray.indexOf(color),
            "answer": correctAns
        }
        questionsArr['questions'].push(obj);
        
    })
    tempArrHolder.quiz.answerers = answerersArr.answerers
    tempArrHolder.quiz.questions = questionsArr.questions
    tempArrHolder.quiz.name = quizOwner
    console.log(tempArrHolder.quiz.answerers)
    console.log(tempArrHolder.quiz.questions)
    console.log(tempArrHolder.quiz)
    var xhr = new XMLHttpRequest();
    let urlPHP = ROOT_URI + "/api/quizzes/" 
    // + quizId
    xhr.open("POST", './api/submit.php');
    xhr.onreadystatechange = function () {
       if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
       }};
    // var formData = new FormData();
	// formData.append("url", urlPHP);
	// formData.append("data", JSON.stringify(tempArrHolder.quiz));
	// formData.append("bearerToken", BearerToken);
    tempArrHolder['bearerToken'] = BearerToken
    tempArrHolder['quizId'] = quizId
    tempArrHolder['url'] = urlPHP
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(tempArrHolder))
}
function syncLeaderboard(id, name, score) {
    var answerersArr = {
        "answerers": []
    }
    answerersArr['answerers'].push({
        "uid": id,
        "name": name,
        "score": parseInt(score)
    })
    const leader = document.querySelectorAll('.competitor')
    leader.forEach(el => {
        let compId = el.querySelector('.id').textContent.trim()
        let compName = el.querySelector('.name').textContent.trim()
        let compScore = el.querySelector('.score').textContent.trim()
        let obj = {
                "uid": compId,
                "name": compName,
                "score": parseInt(compScore)
        }
        compName.isEmpty() == false || compScore.isEmpty() == false ? answerersArr['answerers'].push(obj) : null
        tempArrHolder.quiz.answerers = answerersArr.answerers
        updateLeaderFront(tempArrHolder)
        console.log(tempArrHolder.quiz.answerers)
    })
}
function addToLeader(){
    let id = makeid(28) //"EVVJQ3EQzhQN6j5TEHm7bjD48m12"//
    let score = document.querySelector('.scoreUser').value.trim();
    let name = document.querySelector('.nameUser').value.trim();
    syncLeaderboard(id, name, score)
}

let getAuthHeader = new Promise((resolve , reject) => {
    let itk_root = "https://securetoken.googleapis.com/v1"
	var request = new XMLHttpRequest();
	request.open("POST", itk_root + "/token?key=" + API_KEY);
	request.send(dataBearer);
    if (request.status == 502) reject('err')
    request.onload = function(){
        data = JSON.parse(this.responseText)
        console.log(data);
        resolve(data.id_token);
	};
    });
    
function updateLeaderFront(json){
    let scoreboard = document.querySelector(".scoreboardside")
    let quizContent = document.querySelector(".quizContent")
    let markup = `
    <tr>
    <th id="name_page_name">
       Name
    </th>
    <th id="name_page_score">
       Score
    </th>
 </tr>`

 if(json.quiz.answerers.length !== 0){
    sort_by_key(json.quiz.answerers, 'score')
    delete json.quiz.answerers.null
    console.log(json.quiz)
    json.quiz.answerers.forEach(el => {
        if(el !== null){
        markup += `
        <tr class="competitor rank${el.score > 10 ? 10 : el.score < 0 ? 0 : el.score}">
            <td class="id" style="display: none">${el.uid}</td>
            <td class="name" contenteditable="">${el.name}</td>
            <td class="score" contenteditable="">${el.score}</td>
        </tr>
        `}
    })
 }
 let markupQuestion = ``;
 if(json.quiz.questions.length !== 0){
    delete json.quiz.questions.null
    json.quiz.questions.forEach((el, index) => {
        markupAnswers = ``;
        if(el.options !== 0){
            delete el.options.null
            el.options.forEach((option, index) => {
                if(option !== null){
                    if(el.answer !== index){ //style="background-color: #7B0D1E;"
                        markupAnswers += `               
                        <div id="option_enclosure" class="option_bg answered_wrong">
                        <span id="option" class="option_text" contenteditable> ${option} </span>
                      </div>`
                    }
                    else{ //style="background-color: #ABFAA9;"
                        markupAnswers += `               
                        <div id="option_enclosure" class="option_bg answered_right" >
                        <span id="option" class="option_text" contenteditable> ${option} </span>
                        <span class="correct" style="display: none;"> ${index} </span>
                      </div>`
                    }

                }
            })
        }
        if(el !== null){
         markupQuestion += `            
         <div class="compos questionsCompos">
         <div id="compos">
           <div id="page_give_poll" class="container">
             <div class="ad5-container"></div>
             <div id="question_block_id_3" class="box question_block">
               <div id="question" class="question_bg" style="${colorArray[el.color]}" contenteditable> ${el.question} </div>
               <div id="color" style="display: none">${colorArray[el.color]}</div>
               ${markupAnswers}
               <div class="notice_text_container">
                 <i class="fas fa-fingerprint"></i>
                 <span id="give_page_note" class="notice_text"> Tap on a box to edit the answers </span>
               </div>
             </div>
           </div>
         </div>
        </div>`}
    })
}
    quizContent.innerHTML = markupQuestion 
    scoreboard.innerHTML = markup 
}
    getAuthHeader.then(v => {
        BearerToken = v
        fetch(ROOT_URI + "/api/quizzes/" + quizId, {
            headers: {
                'Authorization': `Bearer ${v}`
            }}).then(function(response) {
                return response.text().then(function(text) {
                    let json = JSON.parse(text)
                    delete json.quiz.__v;
                    delete json.quiz._id;
                    tempArrHolder = json
                    updateLeaderFront(json)
                    nameField.textContent = json.quiz.name
                })
                
            })
            
    });