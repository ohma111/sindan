function toQuery(obj){
  const p = new URLSearchParams();
  for(const [k,v] of Object.entries(obj)) p.set(k, String(v));
  return p.toString();
}

const QUIZZES = {
  love: {
    title: "恋愛タイプ診断",
    questions: [
      {A:"G", text:"恋人に求めるのは？", Atext:"安心感", Btext:"刺激"},
      {A:"H", text:"ケンカしたら？", Atext:"話し合う", Btext:"時間を置く"},
      {A:"K", text:"デートは？", Atext:"計画して行きたい", Btext:"ノリで決めたい"},
      {A:"W", text:"愛情表現は？", Atext:"言葉で伝える", Btext:"行動で示す"}
    ],
    build(score){
      return (score.G >= 1) ? "安心重視タイプ" : "刺激重視タイプ";
    },
    describe(type){
      return (type.includes("安心"))
        ? ["安定した関係が好き", "不安が少ない恋愛で力を発揮", "相手には安心材料をこまめに共有すると◎"]
        : ["刺激や新鮮さが大事", "マンネリ回避が鍵", "変化を一緒に作れる相手だと◎"];
    }
  },


 personality: {
   title: "性格タイプ診断",
   questions: [
     {A:"E", text:"休日は？", Atext:"人と過ごす", Btext:"一人で過ごす"},
     {A:"E", text:"初対面の人は？", Atext:"話せる", Btext:"様子を見る"},
     {A:"T", text:"判断は？", Atext:"論理", Btext:"感情"},
     {A:"J", text:"予定は？", Atext:"決めたい", Btext:"流れで"}
   ],
   build(score){
     return (score.E >= 1) ? "外向タイプ" : "内向タイプ";
   },
   describe(type){
     return (type.includes("外向"))
       ? ["人と関わるとエネルギーが出る"]
       : ["一人の時間で回復するタイプ"];
   }
 },


 job: {
   title: "適職診断",
   questions: [
     {A:"C", text:"働き方は？", Atext:"挑戦したい", Btext:"安定したい"},
     {A:"C", text:"評価は？", Atext:"成果", Btext:"貢献"},
     {A:"C", text:"仕事は？", Atext:"変化あり", Btext:"ルーティン"}
   ],
   build(score){
     return (score.C >= 1) ? "チャレンジ型" : "安定型";
   },
   describe(type){
     return (type.includes("チャレンジ"))
       ? ["成長環境で力を発揮"]
       : ["安定環境で力を発揮"];
   }
 },

 mental: {
   title: "メンタル診断",
   questions: [
     {A:"R", text:"失敗したら？", Atext:"切り替える", Btext:"落ち込む"},
     {A:"R", text:"ストレス時は？", Atext:"相談", Btext:"抱え込む"},
     {A:"R", text:"環境変化は？", Atext:"平気", Btext:"苦手"}
   ],
   build(score){
     return (score.R >= 1) ? "回復力高め" : "繊細タイプ";
   },
   describe(type){
     return (type.includes("回復"))
       ? ["ストレスからの回復が早い"]
       : ["環境の影響を受けやすい"];
   }
 }
};


function startQuiz(key, mount){
  const quiz = QUIZZES[key];
  if(!quiz){ mount.innerHTML = "<p>診断が見つかりません。</p>"; return; }

  let i = 0;
  const score = {};

  function addPoint(letter){
    score[letter] = (score[letter] || 0) + 1;
  }

  function render(){
    if(i >= quiz.questions.length){
      const type = quiz.build(score);
      location.href = "./result.html?" + toQuery({
        q: key,
        type,
        score: JSON.stringify(score)
      });
      return;
    }

    const q = quiz.questions[i];
    mount.innerHTML = `
      <div class="muted">質問 ${i+1} / ${quiz.questions.length}</div>
      <h3 style="margin:10px 0">${q.text}</h3>
      <div class="heroRow">
        <button class="btn primary" id="aBtn">A. ${q.Atext}</button>
        <button class="btn" id="bBtn">B. ${q.Btext}</button>
      </div>
    `;
    document.getElementById("aBtn").onclick = () => { addPoint(q.A); i++; render(); };
    document.getElementById("bBtn").onclick = () => { i++; render(); };
  }

  render();
}

function renderResult(mount){
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const type = params.get("type");
  const quiz = QUIZZES[q];

  if(!quiz || !type){
    mount.innerHTML = `<p>結果が見つかりません。<a class="btn" href="./index.html">トップへ</a></p>`;
    return;
  }

  const tips = quiz.describe(type);
  mount.innerHTML = `
    <div class="hero">
      <h2>${quiz.title}</h2>
      <p>あなたの結果：<strong style="font-size:22px">${type}</strong></p>
    </div>

    <div style="margin-top:12px">
      <h3>ポイント</h3>
      <ul style="color:var(--muted); line-height:1.8">
        ${tips.map(t=>`<li>${t}</li>`).join("")}
      </ul>

      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn primary" href="./love.html">もう一回</a>
        <a class="btn" href="./index.html">別の診断へ</a>
        <button class="btn" id="copyBtn">結果をコピー</button>
      </div>
    </div>
  `;

  document.getElementById("copyBtn").onclick = async () => {
    try{
      await navigator.clipboard.writeText(`恋愛タイプ診断：${type}`);
      alert("コピーしました！");
    }catch(e){
      alert("コピーできませんでした");
    }
  };
}
