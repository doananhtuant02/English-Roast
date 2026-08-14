const lessons=[
{word:"comfortable",hint:"COMF-tuh-buhl",meaning:"thoải mái"},
{word:"vegetable",hint:"VEJ-tuh-buhl",meaning:"rau củ"},
{word:"world",hint:"wurld",meaning:"thế giới"},
{word:"three",hint:"three",meaning:"số ba"},
{word:"think",hint:"think",meaning:"suy nghĩ"},
{word:"usually",hint:"YOO-zhoo-uh-lee",meaning:"thường xuyên"},
{word:"restaurant",hint:"RES-tuh-ront",meaning:"nhà hàng"},
{word:"clothes",hint:"klohz",meaning:"quần áo"},
{word:"schedule",hint:"SKED-jool",meaning:"lịch trình"},
{word:"development",hint:"di-VEL-up-ment",meaning:"sự phát triển"},
{word:"environment",hint:"en-VY-run-ment",meaning:"môi trường"},
{word:"especially",hint:"es-PESH-uh-lee",meaning:"đặc biệt"}];

const roasts=[
"Ôi trời ơi 😭 Từ này mà ông cũng bẻ lái được nữa à?",
"Đọc lại đi cha nội 💀 Tiếng Anh chứ không phải thần chú gọi hồn.",
"Ủa alo? Từ gốc một đường, ông đọc một nẻo vậy 😭",
"Không phải vậy đâu ông cố ơi 😭 Nghe mẫu lại giùm cái.",
"Phát âm kiểu này người Anh nghe xong xin nghỉ phép luôn đó 💀",
"Trời đất ơi, cái miệng phản chủ dữ vậy 😭 Đọc lại!",
"Từ này bị ông hành tới mức nó muốn đổi quốc tịch luôn rồi.",
"Sai rồi má ơi 😭 Bình tĩnh, nghe lại rồi đọc cho tử tế.",
"Ủa mình đang học tiếng Anh hay sáng tạo ngôn ngữ mới vậy?",
"Cú phát âm này hơi báo nha 💀 Làm lại lần nữa đi."
];

const praise=[
"Được đó! 🔥 Nghe ra tiếng Anh rồi đấy.",
"Chuẩn bài 😎 Qua từ tiếp theo!",
"Ngon! Cái miệng hôm nay hợp tác ghê.",
"Yes! 🔥 Phát âm ổn áp.",
"Đúng rồi! Không cần chửi nữa, tiếc ghê 😌"
];

let current=0,score=0,recognition=null;
const $=id=>document.getElementById(id);
const wordEl=$("word"),hintEl=$("hint"),meaningEl=$("meaning"),heardEl=$("heard"),micBtn=$("micBtn"),listenBtn=$("listenBtn"),skipBtn=$("skipBtn"),scoreEl=$("score"),grid=$("wordGrid"),mascot=$("mascot"),statusEl=$("status");

function renderGrid(){
 grid.innerHTML=lessons.map((x,i)=>`<button class="word-item ${i===current?'active':''}" data-index="${i}"><strong>${x.word}</strong><small>${x.meaning}</small></button>`).join("");
 grid.querySelectorAll(".word-item").forEach(btn=>btn.addEventListener("click",()=>{current=Number(btn.dataset.index);showLesson();window.scrollTo({top:0,behavior:"smooth"});}));
}
function showLesson(){const item=lessons[current];wordEl.textContent=item.word;hintEl.textContent=item.hint;meaningEl.textContent=item.meaning;heardEl.className="heard";heardEl.textContent="Bấm micro và đọc từ phía trên.";mascot.className="mascot";renderGrid();}
function nextWord(){current=(current+1)%lessons.length;showLesson();}
function normalize(t){return(t||"").toLowerCase().replace(/[.,!?;:'"]/g,"").replace(/\s+/g," ").trim();}
function similarity(a,b){a=normalize(a);b=normalize(b);if(a===b)return 1;const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)dp[i][0]=i;for(let j=0;j<=b.length;j++)dp[0][j]=j;for(let i=1;i<=a.length;i++){for(let j=1;j<=b.length;j++){dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));}}return 1-dp[a.length][b.length]/Math.max(a.length,b.length,1);}
const randomOf=a=>a[Math.floor(Math.random()*a.length)];
function speakWord(){if(!("speechSynthesis"in window)){statusEl.textContent="Trình duyệt này không hỗ trợ phát âm mẫu.";return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lessons[current].word);u.lang="en-US";u.rate=.72;speechSynthesis.speak(u);}
function setupRecognition(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){statusEl.textContent="Trình duyệt chưa hỗ trợ Speech Recognition. Hãy thử Chrome hoặc Edge.";micBtn.disabled=true;micBtn.style.opacity=.45;return;}
 recognition=new SR();recognition.lang="en-US";recognition.interimResults=false;recognition.maxAlternatives=3;
 recognition.onstart=()=>{micBtn.classList.add("listening");heardEl.className="heard";heardEl.textContent="🎧 Đang nghe... đọc ngay đi!";mascot.className="mascot";};
 recognition.onend=()=>micBtn.classList.remove("listening");
 recognition.onerror=e=>{micBtn.classList.remove("listening");heardEl.className="heard bad";heardEl.textContent=e.error==="not-allowed"?"Cho phép micro đi cha nội 😭 Không mic thì tôi chấm kiểu gì?":"Micro vừa dở chứng. Bấm lại thử nhé.";};
 recognition.onresult=e=>{const alternatives=[];for(let i=0;i<e.results[0].length;i++)alternatives.push(e.results[0][i].transcript);const target=lessons[current].word;const best=alternatives.map(t=>({text:t,score:similarity(t,target)})).sort((a,b)=>b.score-a.score)[0];
 if(best.score>=.72){score+=10;scoreEl.textContent=score;heardEl.className="heard good";heardEl.innerHTML=`✅ Tôi nghe thành: <strong>${best.text}</strong><br>${randomOf(praise)}`;mascot.className="mascot happy";setTimeout(nextWord,1800);}
 else{heardEl.className="heard bad";heardEl.innerHTML=`❌ Tôi nghe thành: <strong>${best.text||"???"}</strong><br>${randomOf(roasts)}`;mascot.className="mascot angry";}};
}
micBtn.addEventListener("click",()=>{if(!recognition)return;try{recognition.start();}catch(e){}});
listenBtn.addEventListener("click",speakWord);skipBtn.addEventListener("click",nextWord);
setupRecognition();showLesson();
