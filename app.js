// MoodSpace - Step-by-step wizard version
const translations = {
  zh: {
    homeTitle: "免費練習室",
    homeSub: "有些事情想不清楚、說不出口，或不知道從哪開始？這裡有免費練習工具，幫你釐清感受、準備一段對話，或先做一件小事，不需要註冊。有些工具可以填寫，再自行複製或列印帶走；呼吸與三分鐘五感練習不必寫字，跟著提示就好。",
    back: "返回練習室",
    langBtn: "EN",
    copy: "複製",
    print: "列印",
    copied: "已複製！",
    next: "下一步",
    backStep: "上一步",
    finish: "完成並產生卡片",
    categories: {
      emotions: "整理情緒與想法",
      communication: "練習表達與溝通",
      actions: "開始一個小行動",
      pause: "不想寫字，先停一下",
      help: "準備求助與支持"
    }
  },
  en: {
    homeTitle: "Practice Room",
    homeSub: "Feeling stuck or unsure where to start? Free self-guided tools that walk you through one step at a time. No sign-up.",
    back: "Back to Practice Room",
    langBtn: "中文",
    copy: "Copy",
    print: "Print",
    copied: "Copied!",
    next: "Next",
    backStep: "Back",
    finish: "Finish & Generate Card",
    categories: {
      emotions: "Organize Emotions & Thoughts",
      communication: "Practice Expression & Communication",
      actions: "Start a Small Action",
      pause: "Just Pause (No Writing)",
      help: "Prepare for Help & Support"
    }
  }
};

let lang = localStorage.getItem('moodspace-lang') || 'zh';
let theme = localStorage.getItem('moodspace-theme') || 'light';
let currentTool = null;
let currentStep = 0;
let answers = {};

const tools = [


  { id: 'sayingno', icon: '🚫', cat: 'communication', zh: { name: '拒絕練習', desc: '想拒絕但不知道怎麼說？先想好界線，再練習一句說得出口的話。' }, en: { name: 'Saying No Practice', desc: 'Want to say no but don\'t know how? Clarify the boundary, then practice a phrase.' } },
  { id: 'apology', icon: '🙏', cat: 'communication', zh: { name: '道歉練習', desc: '想道歉但不知道從何說起？先整理發生的事和你的責任，再寫一句話。' }, en: { name: 'Apology Practice', desc: 'Want to apologize but don\'t know where to start? Organize what happened and your part, then write a phrase.' } },
  { id: 'threegood', icon: '✨', cat: 'emotions', zh: { name: '每日三件好事', desc: '記下今天三件還不錯的事，不管大小。' }, en: { name: 'Three Good Things', desc: 'Note three things that went okay today, big or small.' } },
  { id: 'stresscheck', icon: '📉', cat: 'emotions', zh: { name: '壓力源盤點', desc: '列出目前的壓力來源，再挑一個可以先處理的。' }, en: { name: 'Stress Inventory', desc: 'List current stress sources, then pick one you can address first.' } },
  { id: 'energycheck', icon: '⚡', cat: 'actions', zh: { name: '能量檢查', desc: '看看現在的能量在哪，再決定適合做什麼。' }, en: { name: 'Energy Check', desc: 'Check where your energy is, then decide what fits right now.' } },
  { id: 'socialbattery', icon: '🔋', cat: 'emotions', zh: { name: '社交電量', desc: '覺得社交後很累？看看現在的電量，決定要充電還是繼續。' }, en: { name: 'Social Battery', desc: 'Drained after socializing? Check your battery and decide to recharge or continue.' } },
  { id: 'goalreview', icon: '🎯', cat: 'actions', zh: { name: '目標檢視', desc: '有目標但不知道進度？寫下來，看看現在在哪，下一步是什麼。' }, en: { name: 'Goal Review', desc: 'Have a goal but unsure of progress? Write it down, see where you are, and name the next step.' } },
  { id: 'selfaffirm', icon: '💪', cat: 'emotions', zh: { name: '自我肯定', desc: '對自己說一句真實的肯定。不用完美，寫得出來就好。' }, en: { name: 'Self-Affirmation', desc: 'Say one true thing to yourself. Not perfect — just something you can accept.' } },
  { id: 'moodtracker', icon: '📈', cat: 'emotions', zh: { name: '心情紀錄', desc: '每天記下心情，看看這一週的變化。資料只留在你的瀏覽器。' }, en: { name: 'Mood Tracker', desc: 'Log your mood each day and see the week\'s pattern. Data stays in your browser.' } },
  { id: 'feelings', icon: '💭', cat: 'emotions', zh: { name: '情緒與需要整理卡', desc: '不太確定自己在想什麼、感受什麼？選幾個詞，整理此刻可能的需要。' }, en: { name: 'Feelings & Needs Card', desc: 'Name feelings, note what happened, identify needs, then choose one next step' } },
  { id: 'worry', icon: '😰', cat: 'emotions', zh: { name: '擔心整理＋擔心時間', desc: '腦子一直轉、停不下來？先把擔心一件件寫下來，分出現在能做點什麼的，和只能先放著的，再給它們一個固定的時間。' }, en: { name: 'Worry Sorter', desc: 'List your worries, then sort what you can act on' } },
  { id: 'compassion', icon: '💚', cat: 'emotions', zh: { name: '對自己換一句話', desc: '常常責備自己？試著找到一種比較能接受的方式回應自己。' }, en: { name: 'Self-Compassion Response', desc: 'Write a harsh self-talk, then rephrase it as if talking to a friend' } },
  { id: 'gratitude', icon: '🙏', cat: 'emotions', zh: { name: '感恩日記', desc: '記下今天值得感謝，或讓你覺得還不錯的一件小事。' }, en: { name: 'Gratitude Journal', desc: 'Note things you appreciate, one at a time' } },
  { id: 'thoughtcheck', icon: '🔍', cat: 'emotions', zh: { name: '想法核對練習', desc: '一個想法讓你很難受？整理有哪些線索支持它，還有哪些可能的看法。' }, en: { name: 'Thought Check', desc: 'Write the thought, find evidence for and against, then write a balanced version' } },
  { id: 'boundary', icon: '🚧', cat: 'communication', zh: { name: '界線表達練習', desc: '有些話很難開口，可以先在這裡練習。整理你的需求，找到比較像自己會說的方式。' }, en: { name: 'Boundary Expression', desc: 'Clarify the boundary, then practice a short phrase to express it' } },
  { id: 'convo', icon: '💬', cat: 'communication', zh: { name: '對話前整理紙', desc: '有件事想談，怕一開口就亂了？先寫下要談的重點與自己的需求。' }, en: { name: 'Conversation Prep', desc: 'Clarify who, what outcome you want, and key points before talking' } },
  { id: 'smallstep', icon: '👣', cat: 'actions', zh: { name: '把事情拆成第一小步', desc: '一件事拖了很久還沒開始？試著找出現在做得到的第一步。' }, en: { name: 'First Small Step', desc: 'Write the bigger goal, then name the smallest step you can take today' } },
  { id: 'decision', icon: '⚖️', cat: 'actions', zh: { name: '選擇比較', desc: '先寫出兩個選項，再分別列出好處與風險' }, en: { name: 'Decision Comparer', desc: 'Name two options, then list pros and cons for each' } },
  { id: 'values', icon: '⭐', cat: 'actions', zh: { name: '我現在最在意什麼', desc: '事情擠在一起時，先排出目前最在意、最需要處理的事。' }, en: { name: 'Values Sort', desc: 'Select the three values that matter most to you right now' } },
  { id: 'breathing', icon: '🌬️', cat: 'pause', zh: { name: '呼吸練習', desc: '不想填寫文字時，可以跟著畫面輕輕呼吸，或照自己的速度進行。' }, en: { name: 'Breathing Exercise', desc: 'Follow a calm breathing rhythm' } },
  { id: 'fivesenses', icon: '👁️', cat: 'pause', zh: { name: '三分鐘五感練習', desc: '跟著提示留意周圍看見、聽見的事物；任何一步都可以跳過。' }, en: { name: 'Five Senses Practice', desc: 'Ground yourself one sense at a time' } },
  { id: 'anger', icon: '⏸️', cat: 'pause', zh: { name: '生氣時的情緒暫停器', desc: '正在生氣、怕一開口就後悔時，先暫停一下再決定。' }, en: { name: 'Anger Pause', desc: 'Pause for 60 seconds before responding' } },
  { id: 'supportcard', icon: '🤝', cat: 'help', zh: { name: '我的支持資源卡', desc: '把遇到困難時可以聯絡的人、機構和聯絡方式整理在一起。' }, en: { name: 'Support Resource Card', desc: 'List people you can reach and other support resources' } },
  { id: 'tasksep', icon: '📋', cat: 'emotions', zh: { name: '課題分離整理器', desc: '有件事牽涉別人的決定？分清自己能做的事，以及需要一起討論的部分。' }, en: { name: 'What is Mine to Handle', desc: 'Describe the situation, then separate what you can handle from what you cannot' } },
  { id: 'repair', icon: '🔧', cat: 'communication', zh: { name: '衝突後關係修復卡', desc: '吵完架不知道該不該聯絡？先整理發生的事、自己願意負責的部分和想採取的修復方式。' }, en: { name: 'Conflict Repair', desc: 'Decide one first step after a conflict, then practice how to say it' } },
  { id: 'goodenough', icon: '✅', cat: 'actions', zh: { name: '夠好就好標準卡', desc: '常因為擔心不夠好而做個不停？先決定做到哪裡可以暫時停下。' }, en: { name: 'Good-Enough Standard', desc: 'Define what good enough looks like for a task, and when you can stop' } },
  { id: 'phone', icon: '📱', cat: 'actions', zh: { name: '手機滑不停暫停計畫', desc: '一拿起手機就停不下來？選這次原本想做什麼、想在哪裡先停、放下後的第一個動作。' }, en: { name: 'Phone Pause Plan', desc: 'Identify when you scroll mindlessly, then set a pause rule and alternative' } },
  { id: 'problemsolve', icon: '🧩', cat: 'actions', zh: { name: '問題解決五步驟', desc: '有件事卡住了？說清楚問題、列出方法，選一個先試。' }, en: { name: 'Problem Solving', desc: 'Define the problem, list solutions, pick one to try, and set a time' } },
  { id: 'selfbreak', icon: '🌸', cat: 'emotions', zh: { name: '自我同理休息', desc: '用三句話給自己一點空間：承認困難、看到共同性、給自己溫柔' }, en: { name: 'Self-Compassion Break', desc: 'Offer yourself three phrases: acknowledge difficulty, note shared experience, be kind' } },
  { id: 'bodycheck', icon: '🧘', cat: 'emotions', zh: { name: '身體覺察地圖', desc: '想看看現在身體哪裡緊、哪裡有感覺？選部位，記下感覺，整理成一張覺察卡。' }, en: { name: 'Body Awareness', desc: 'Quickly scan your body, mark where you notice sensation, then describe it' } },
  { id: 'sleep', icon: '🌙', cat: 'pause', zh: { name: '睡前放鬆流程產生器', desc: '睡前腦袋停不下來時，選想做的活動，排出一份今晚的睡前流程。' }, en: { name: 'Bedtime Wind-Down', desc: 'Choose 2–3 simple wind-down steps for tonight' } },

  { id: 'tasksorter', icon: '📊', cat: 'emotions', zh: { name: '腦中待辦整理器', desc: '待辦事情太多？先分成四類，再挑出今天想處理的一件事。' }, en: { name: 'Task Sorter', desc: 'Too many tasks? Sort into four categories, then pick one for today.' } },
  { id: 'askhelp', icon: '🙋', cat: 'communication', zh: { name: '開口求助練習', desc: '想請別人幫忙，卻不知道怎麼開口？先整理一段可以修改的訊息。' }, en: { name: 'Asking for Help', desc: 'Want to ask for help but don\'t know how? Draft a message you can edit.' } },
  { id: 'careguide', icon: '📖', cat: 'communication', zh: { name: '我的陪伴說明書', desc: '想讓身邊的人知道你低落時需要什麼？整理適合自己的陪伴方式。' }, en: { name: 'My Care Guide', desc: 'Want others to know how to support you when you are low? Write your care preferences.' } },
  { id: 'lowenergy', icon: '🔋', cat: 'actions', zh: { name: '低能量活動菜單', desc: '提不起勁時，從負擔較小的活動中挑一件目前做得到的事。' }, en: { name: 'Low Energy Menu', desc: 'When energy is low, pick one small activity you can do right now.' } },
  { id: 'docprep', icon: '🏥', cat: 'help', zh: { name: '看診前準備單', desc: '準備看身心科或回診？先記下近期變化、用藥情況和要問醫師的事。' }, en: { name: 'Doctor Visit Prep', desc: 'Preparing for a doctor visit? Note recent changes, medications, and questions.' } },
  { id: 'breakup', icon: '💔', cat: 'emotions', zh: { name: '分手後這一週', desc: '剛結束一段關係？找出最難熬的時段，替每一段先準備一件小事。' }, en: { name: 'After a Breakup', desc: 'Just ended a relationship? Identify hard moments and prepare one small thing for each.' } },
  { id: 'transition', icon: '🔄', cat: 'emotions', zh: { name: '生活變動適應卡', desc: '搬家、轉職、畢業或家裡有變化？把想保留、可以調整和還不確定的事分開寫。' }, en: { name: 'Life Transition Card', desc: 'Moving, changing jobs, graduating? Sort what to keep, adjust, and what is still unclear.' } },
  { id: 'relpause', icon: '⏳', cat: 'communication', zh: { name: '關係不安時的暫停卡', desc: '訊息還沒回，心裡有些不安？先整理感受，再決定如何回應。' }, en: { name: 'Relationship Pause Card', desc: 'Message not replied, feeling uneasy? Organize feelings, then decide how to respond.' } },
  { id: 'examprep', icon: '📚', cat: 'actions', zh: { name: '考試、面試前準備清單', desc: '考試或面試快到了？依還有幾天整理出要確認的事。' }, en: { name: 'Exam / Interview Prep', desc: 'Exam or interview coming up? Organize what to check based on days remaining.' } },

  { id: 'relatives', icon: '👨‍👩‍👧‍👦', cat: 'communication', zh: { name: '過年親戚問題應答卡', desc: '擔心聚會被問收入、感情或婚育？先準備幾句想使用的回應。' }, en: { name: 'Family Gathering Responses', desc: 'Worried about questions on income, relationships, or kids? Prepare a few responses.' } },
  { id: 'parenttalk', icon: '👶', cat: 'communication', zh: { name: '親子溝通接話練習', desc: '孩子不想說話或一開口就吵？比較三種說法，寫下一句你自己的接話。' }, en: { name: 'Parent-Child Response Practice', desc: 'Child not talking or arguing? Compare three approaches and write your own response.' } },
  { id: 'mindfulreply', icon: '🎯', cat: 'communication', zh: { name: '正念接話練習', desc: '被一句話刺到、很想回嘴？先看見衝動，再擬一句想說的回覆。' }, en: { name: 'Mindful Reply', desc: 'Triggered by a comment and want to snap back? Notice the urge, then draft a reply.' } },
  { id: 'twoperson', icon: '👥', cat: 'communication', zh: { name: '三分鐘雙人對話練習', desc: '兩個人都願意的時候，輪流當說話者和聆聽者。不適合高衝突關係。' }, en: { name: 'Three-Minute Dialogue', desc: 'When both are willing, take turns speaking and listening. Not for high-conflict situations.' } },
  { id: 'screentime', icon: '📺', cat: 'actions', zh: { name: '家庭 3C 使用約定表', desc: '想和孩子一起訂手機、平板或電玩的規則？逐項寫下做法和例外。' }, en: { name: 'Family Screen Time Agreement', desc: 'Want to set rules for phones, tablets, or games with your child? Write the rules and exceptions.' } },
  { id: 'visualcard', icon: '🖼️', cat: 'actions', zh: { name: '情境轉換視覺提示卡', desc: '孩子換活動時常卡住？選「現在、接下來、完成後」的步驟，做成提示卡。' }, en: { name: 'Transition Visual Card', desc: 'Child gets stuck switching activities? Create a now-next-done visual prompt.' } },
  { id: 'sleepdiary', icon: '📔', cat: 'emotions', zh: { name: '一週睡眠日記', desc: '想看清楚自己這一週怎麼睡？每天記下上床、睡著、醒來的時間。' }, en: { name: 'Weekly Sleep Diary', desc: 'Want to see your sleep pattern this week? Note bedtime, sleep time, and wake time each day.' } },
  { id: 'workplace', icon: '🏢', cat: 'help', zh: { name: '職場事件紀錄表', desc: '遇到不舒服的職場事件？把時間、聽到的話和自己的推測分開記下。' }, en: { name: 'Workplace Incident Log', desc: 'Uncomfortable workplace incident? Separate what you heard, what was told to you, and your interpretation.' } },
  { id: 'breathspace', icon: '🌌', cat: 'pause', zh: { name: '三分鐘呼吸空間練習', desc: '心裡很亂時，跟著覺察、集中、擴展三個階段停下來看看自己。' }, en: { name: 'Three-Minute Breathing Space', desc: 'Mind racing? Pause with awareness, focus, and expansion. No need to control the breath.' } },
  { id: 'pmr', icon: '💪', cat: 'pause', zh: { name: '漸進式肌肉放鬆', desc: '身體一直很緊時，跟著提示一組一組收緊再放開。不舒服的部位隨時跳過。' }, en: { name: 'Progressive Muscle Relaxation', desc: 'Body tense? Follow prompts to tense and release muscle groups. Skip any that feel uncomfortable.' } },
  { id: 'counselprep', icon: '📝', cat: 'help', zh: { name: '第一次諮商準備包', desc: '正在考慮心理諮商？先整理想談的內容和想問的問題。' }, en: { name: 'Counseling Prep', desc: 'Organize topics, main concern, and anything you want the counselor to know' } },
];

function t(key) { return translations[lang][key] || key; }

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('moodspace-theme', theme);
  applyTheme();
}

function renderHome() {
  document.getElementById('homeTitle').textContent = t('homeTitle');
  document.getElementById('homeSub').textContent = t('homeSub');
  document.getElementById('backText').textContent = t('back');
  document.getElementById('langBtn').textContent = t('langBtn');

  const cats = translations[lang].categories;
  const container = document.getElementById('categories');
  container.innerHTML = '';
  const order = ['emotions', 'communication', 'actions', 'pause', 'help'];
  order.forEach(catId => {
    const catTools = tools.filter(tool => tool.cat === catId);
    if (!catTools.length) return;
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `<h2>${cats[catId]}</h2><div class="tools"></div>`;
    const toolsDiv = div.querySelector('.tools');
    catTools.forEach(tool => {
      const card = document.createElement('a');
      card.className = 'tool-card';
      card.href = '#';
      card.onclick = (e) => { e.preventDefault(); openTool(tool.id); };
      card.innerHTML = `<h3>${tool.icon || ''} ${tool[lang].name}</h3><p>${tool[lang].desc}</p>`;
      toolsDiv.appendChild(card);
    });
    container.appendChild(div);
  });
}

function showHome() {
  document.getElementById('home-view').classList.remove('hidden');
  document.getElementById('tool-view').classList.remove('active');
  history.replaceState(null, '', '#');
  currentTool = null;
}

function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('moodspace-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  renderHome();
  if (currentTool) openTool(currentTool);
}

function openTool(id) {
  currentTool = id;
  currentStep = 0;
  answers = {};
  document.getElementById('home-view').classList.add('hidden');
  document.getElementById('tool-view').classList.add('active');
  document.getElementById('tool-view').scrollTop = 0;
  history.replaceState(null, '', '#' + id);
  renderWizard();
}

function getSteps(id) {
  const isZh = lang === 'zh';
  if (id === 'feelings') return [
    { key: 'feelings', type: 'multi', explain: isZh ? '選最接近的就好，不用全部都選。不同感受可以同時存在。' : 'Pick the closest ones. Different feelings can exist at the same time.', max: 5, hint: isZh ? '不用全部都選，選最接近的就好' : 'No need to pick all — just the closest ones', title: isZh ? '選接近的感受詞（最多 5 個）' : 'Pick feeling words (up to 5)', options: isZh ? ['開心','放鬆','感謝','期待','難過','失望','生氣','挫折','緊張','擔心','孤單','尷尬','困惑','麻木','好幾種感受混在一起','還不確定'] : ['Happy','Relaxed','Grateful','Hopeful','Sad','Disappointed','Angry','Frustrated','Nervous','Worried','Lonely','Awkward','Confused','Numb','Mixed feelings','Not sure yet'] },
    { key: 'what', type: 'text', explain: isZh ? '只寫你願意記下的部分，不需要完整描述。' : 'Only write what you want to note. No need for a full description.', title: isZh ? '剛才發生了什麼？（選填）' : 'What happened? (optional)', placeholder: isZh ? '只寫你願意記下的部分' : 'Only write what you want to note' },
    { key: 'needs', type: 'multi', explain: isZh ? '選現在可能需要的，最多三個。不確定也沒關係。' : 'Pick what you might need right now, up to three. Not sure is okay.', max: 3, title: isZh ? '現在可能需要什麼？（最多 3 個）' : 'What might you need? (up to 3)', options: isZh ? ['休息','一點空間','有人陪伴','被聽見','更清楚的資訊','實際協助','釐清下一步','還不知道'] : ['Rest','Some space','Company','To be heard','Clearer information','Practical help','Clarity on next step','Not sure'] },
    { key: 'try', type: 'single', explain: isZh ? '選一件你願意先試的事。先不決定也可以。' : 'Pick one thing you are willing to try. Deciding later is okay.', title: isZh ? '我願意先試的一件事' : 'One thing I\'m willing to try first', options: isZh ? ['先停一下','找個人聽我說','查一項需要的資訊','先不決定'] : ['Just pause','Talk to someone','Look up one piece of info','Decide later'] }
  ];
  if (id === 'worry') return [
    { key: 'type', type: 'multi', max: 3, explain: isZh ? '擔心的事比較像哪些？' : 'Worries are more like?', title: isZh ? '1. 擔心的類型' : '1. Worry type', options: isZh ? ['工作／學業','健康','人際關係','金錢','未來','家人','其他'] : ['Work/Study','Health','Relationships','Money','Future','Family','Other'] },
    { key: 'canact', type: 'single', explain: isZh ? '現在能做點什麼嗎？' : 'Can you do something now?', title: isZh ? '2. 能採取行動嗎？' : '2. Can you act?', options: isZh ? ['可以，我知道下一步','可能可以，需要想一下','大部分先放著','還不確定'] : ['Yes, I know the next step','Maybe, need to think','Mostly park for now','Not sure'] },
    { key: 'action', type: 'single', explain: isZh ? '如果能做，下一步是？' : 'If you can act, next step?', title: isZh ? '3. 下一步（如適用）' : '3. Next step (if applicable)', options: isZh ? ['查資料','問人','安排時間','先寫下來','先放著'] : ['Look up info','Ask someone','Schedule time','Write it down','Park for now'] }
  ];
  if (id === 'compassion') return [
    { key: 'harsh', type: 'single', explain: isZh ? '腦中那句話比較像？' : 'The harsh thought is more like?', title: isZh ? '1. 責備自己的話' : '1. Harsh thought', options: isZh ? ['我又搞砸了','我很沒用','我應該做得更好','都是我的錯','我不夠好','其他'] : ['I messed up again','I am useless','I should do better','It is all my fault','I am not good enough','Other'] },
    { key: 'need', type: 'multi', max: 2, explain: isZh ? '現在需要什麼？' : 'What do you need?', title: isZh ? '2. 我需要' : '2. I need', options: isZh ? ['休息','多一點時間','被理解','實際協助','其他'] : ['Rest','More time','To be understood','Practical help','Other'] },
    { key: 'kind', type: 'single', explain: isZh ? '比較能接受的說法是？' : 'A more acceptable phrase?', title: isZh ? '3. 新的說法' : '3. New phrase', options: isZh ? ['我已經盡力了','這次真的很多','我需要喘口氣','一次沒做好不代表我不行','還在學習'] : ['I did my best','This was a lot','I need a break','One time does not define me','Still learning'] }
  ];
  if (id === 'gratitude') return [
    { key: 'thing', type: 'text', explain: isZh ? '今天想留下的一件小事。' : 'One small thing to note today.', title: isZh ? '今天想留下的一件事' : 'One thing to note today', placeholder: isZh ? '例：午餐很好吃' : 'e.g. lunch was good' },
    { key: 'meaning', type: 'text', explain: isZh ? '這件事對我有什麼意義？選填。' : 'What does this mean to me? Optional.', title: isZh ? '這件事的意義（選填）' : 'Meaning (optional)', placeholder: isZh ? '例：提醒我還是有小事值得開心' : 'e.g. reminds me small things can still be good' },
    { key: 'feeling', type: 'text', explain: isZh ? '我注意到的感受。選填。' : 'Feelings I noticed. Optional.', title: isZh ? '我注意到的感受（選填）' : 'Feelings noticed (optional)', placeholder: isZh ? '例：滿足、平靜' : 'e.g. content, calm' }
  ];
  if (id === 'thoughtcheck') return [
    { key: 'event', type: 'single', explain: isZh ? '發生了什麼類型的事？' : 'What type of event?', title: isZh ? '1. 發生了什麼？' : '1. What happened?', options: isZh ? ['工作上的事','人際關係','家庭','健康','其他'] : ['Work','Relationships','Family','Health','Other'] },
    { key: 'thought', type: 'single', explain: isZh ? '當下冒出來的想法比較像？' : 'The thought was more like?', title: isZh ? '2. 當下的想法' : '2. The thought', options: isZh ? ['我搞砸了','別人覺得我不好','事情會變很糟','都是我的錯','我不夠好','其他'] : ['I messed up','Others think poorly of me','Things will go badly','It is all my fault','I am not good enough','Other'] },
    { key: 'pattern', type: 'multi', max: 2, explain: isZh ? '這個想法比較接近哪種模式？' : 'Which pattern?', title: isZh ? '3. 思考模式' : '3. Thinking pattern', options: isZh ? ['全有或全無','過度概括','讀心術','災難化','應該思考','個人化','忽略正面','情緒推理'] : ['All-or-nothing','Overgeneralizing','Mind reading','Catastrophizing','Should statements','Personalizing','Discounting positive','Emotional reasoning'] },
    { key: 'balanced', type: 'single', explain: isZh ? '比較完整的看法可能是？' : 'A more complete view?', title: isZh ? '4. 比較完整的看法' : '4. More complete view', options: isZh ? ['這次沒做好，不代表我不行','別人的反應有很多可能','最壞的情況不一定會發生','我已經盡力了','還不確定'] : ['One time does not define me','Others may react differently','Worst case may not happen','I did my best','Not sure'] }
  ];
  if (id === 'boundary') {
    const situations = {
      '職場': ['下班後收到非緊急訊息','臨時增加工作','被問不想回答的私事'],
      '家人': ['反覆詢問感情或婚育安排','希望我答應每次聚會','未先詢問就動用我的物品'],
      '伴侶': ['要求立刻回訊息','爭執時想先暫停','需要獨處時間'],
      '朋友': ['借錢但我不願意','我沒有餘力繼續聽對方傾訴','不想接受邀約']
    };
    const rel = answers.relation || '職場';
    const sitOptions = situations[rel] || situations['職場'];
    return [
      { key: 'relation', type: 'single', explain: isZh ? '選一種關係。' : 'Select a relationship.', title: isZh ? '1. 關係類型' : '1. Relationship', options: isZh ? ['職場','家人','伴侶','朋友'] : ['Work','Family','Partner','Friend'] },
      { key: 'situation', type: 'single', explain: isZh ? '選一個適合這個關係的情境。' : 'Select a situation for this relationship.', title: isZh ? '2. 情境' : '2. Situation', options: sitOptions },
      { key: 'style', type: 'single', explain: isZh ? '選一種說法風格。' : 'Pick a style.', title: isZh ? '3. 說法風格' : '3. Style', options: isZh ? ['溫和說明','簡短直接','再次重申'] : ['Gentle','Direct','Restate'] }
    ];
  }
  if (id === 'convo') return [
    { key: 'topic', type: 'text', explain: isZh ? '這次想談的主題。' : 'The topic for this conversation.', title: isZh ? '1. 這次想談的主題' : '1. Topic', placeholder: isZh ? '例：家事分工' : 'e.g. household chores' },
    { key: 'notice', type: 'text', explain: isZh ? '我具體注意到什麼？先描述事件或行為，避免推斷動機。' : 'What did I specifically notice? Describe the event, avoid inferring motives.', title: isZh ? '我具體注意到什麼？' : 'What did I notice?', placeholder: isZh ? '例：這週有幾次用完的餐具留在桌上' : 'e.g. dishes left on the table several times this week' },
    { key: 'impact', type: 'text', explain: isZh ? '這件事對我有什麼影響或感受？' : 'How does this affect me or how do I feel?', title: isZh ? '2. 對我的影響或感受' : '2. Impact or feelings', placeholder: isZh ? '例：想用桌子前要先整理，有點累' : 'e.g. have to clear the table first, a bit tired' },
    { key: 'discuss', type: 'text', explain: isZh ? '我希望一起討論什麼？' : 'What do I want to discuss together?', title: isZh ? '我希望一起討論什麼？' : 'What I want to discuss', placeholder: isZh ? '例：能不能約定一個收拾時間' : 'e.g. can we agree on a cleanup time' },
    { key: 'opening', type: 'text', explain: isZh ? '我想怎麼開頭？選填。' : 'How do I want to start? Optional.', title: isZh ? '4. 我想怎麼開頭？（選填）' : '4. How to start (optional)', placeholder: isZh ? '例：有件事想跟你聊聊' : 'e.g. There is something I want to talk about' }
  ];
  if (id === 'smallstep') return [
    { key: 'type', type: 'single', explain: isZh ? '想處理的事比較像？' : 'What kind of thing?', title: isZh ? '1. 想處理的事' : '1. The thing', options: isZh ? ['家事／整理','工作／學習','健康／運動','人際／聯絡','其他'] : ['Housework','Work/Study','Health/Exercise','Relationships','Other'] },
    { key: 'stuck', type: 'single', explain: isZh ? '現在卡在哪裡？' : 'Where are you stuck?', title: isZh ? '2. 卡在哪裡？' : '2. Where stuck?', options: isZh ? ['太大了','不知道第一步','缺資訊或資源','現在沒力氣','擔心做不好','還不確定'] : ['Too big','Don\'t know first step','Missing info','No energy','Afraid of doing poorly','Not sure'] },
    { key: 'first', type: 'single', explain: isZh ? '第一小步可以是？' : 'First small step could be?', title: isZh ? '3. 第一小步' : '3. First step', options: isZh ? ['先做五分鐘','先整理一個小角落','先查一個資料','先跟一個人說','先寫下來','今天先不開始'] : ['Do five minutes','Tidy one corner','Look up one thing','Tell one person','Write it down','Not start today'] }
  ];
  if (id === 'decision') return [
    { key: 'optA', type: 'text', explain: isZh ? '用一句話描述選項 A。' : 'Describe Option A in one sentence.', hint: isZh ? '用一句話描述就好' : 'One sentence is enough', title: isZh ? '選項 A 是什麼？' : 'What is Option A?' },
    { key: 'optB', type: 'text', explain: isZh ? '用一句話描述選項 B。' : 'Describe Option B in one sentence.', title: isZh ? '選項 B 是什麼？' : 'What is Option B?' },
    { key: 'aPros', type: 'text', explain: isZh ? '寫下選項 A 的好處和風險。不用想完整。' : 'Write the pros and cons of Option A. No need to be complete.', title: isZh ? '選項 A 的好處與風險' : 'Pros and cons of Option A' },
    { key: 'bPros', type: 'text', explain: isZh ? '寫下選項 B 的好處和風險。不用想完整。' : 'Write the pros and cons of Option B. No need to be complete.', title: isZh ? '選項 B 的好處與風險' : 'Pros and cons of Option B' }
  ];
  if (id === 'values') return [
    { key: 'values', type: 'multi', max: 3, hint: isZh ? '選少一點比較容易排出先後' : 'Fewer choices make it easier to prioritize', title: isZh ? '選出目前最重要的 3 個價值' : 'Select the 3 values that matter most right now', options: isZh ? ['身體健康','休息與放鬆','家人','伴侶關係','朋友','工作表現','學習與成長','經濟穩定','自由與選擇','創作與興趣','幫助別人','誠實做自己','內心平靜','好玩與新鮮','社群與歸屬','接近自然'] : ['Health','Relationships','Growth','Freedom','Contribution','Achievement','Calm','Creativity','Safety','Fun'] },
    { key: 'action', type: 'text', explain: isZh ? '挑一個方向，寫一件這週做得到的小事。' : 'Pick one direction and write one small action for this week.', hint: isZh ? '越小越好，這週做得到的就好' : 'Smaller is better — something doable this week', title: isZh ? '這週想多照顧哪個？寫一件小事' : 'Which one do you want to care for more this week? Write one small action', placeholder: isZh ? '例：這週有兩個晚上十一點前關電腦睡覺' : 'e.g. Two nights this week, close the laptop before 11' }
  ];
  if (id === 'supportcard') return [
    { key: 'name', type: 'text', explain: isZh ? '稱呼。' : 'Name.', title: isZh ? '稱呼' : 'Name', placeholder: isZh ? '例：媽媽、朋友小明' : 'e.g. Mom, friend Ming' },
    { key: 'contact', type: 'text', explain: isZh ? '聯絡方式。' : 'Contact method.', title: isZh ? '聯絡方式' : 'Contact', placeholder: isZh ? '例：電話、WhatsApp' : 'e.g. phone, WhatsApp' },
    { key: 'help', type: 'text', explain: isZh ? '可以請對方協助什麼？' : 'What can I ask them for?', title: isZh ? '可以請對方協助什麼' : 'What they can help with', placeholder: isZh ? '例：聽我說、陪我去' : 'e.g. listen, accompany me' },
    { key: 'time', type: 'text', explain: isZh ? '我知道的方便時段。選填。' : 'Convenient times I know. Optional.', title: isZh ? '方便時段（選填）' : 'Convenient times (optional)', placeholder: isZh ? '例：晚上、週末' : 'e.g. evenings, weekends' },
    { key: 'resource', type: 'text', explain: isZh ? '機構或資源名稱。選填。' : 'Organization or resource name. Optional.', title: isZh ? '機構或資源（選填）' : 'Organization (optional)', placeholder: isZh ? '例：情緒通 18111' : 'e.g. Emotional Support 18111' }
  ];

  if (id === 'tasksep') return [
    { key: 'situation', type: 'text', explain: isZh ? '寫下一件你現在在意的事。' : 'Write one thing you care about right now.', title: isZh ? '我現在在意的一件事' : 'One thing I care about', placeholder: isZh ? '例：家人希望我每週末都回家' : 'e.g. Family wants me home every weekend' },
    { key: 'parts', type: 'text', explain: isZh ? '這件事裡有哪些要決定的部分？一項寫一件。' : 'What parts need decisions? One per line.', title: isZh ? '要決定的部分' : 'Parts that need decisions', placeholder: isZh ? '例：週末怎麼安排、要不要提出我的需要' : 'e.g. how to arrange weekends, whether to state my needs' },
    { key: 'mine', type: 'text', explain: isZh ? '我能決定：我的時間安排、要不要提出需求、我願意採取的行動。' : 'I can decide: my schedule, whether to state needs, actions I am willing to take.', title: isZh ? '我能決定的' : 'What I can decide', placeholder: isZh ? '例：我的時間安排' : 'e.g. my schedule' },
    { key: 'theirs', type: 'text', explain: isZh ? '由對方決定：對方如何看待事情、是否接受我的提議。' : 'They decide: how they see things, whether they accept my proposal.', title: isZh ? '由對方決定的' : 'What they decide', placeholder: isZh ? '例：對方是否接受' : 'e.g. whether they accept' },
    { key: 'together', type: 'text', explain: isZh ? '需要一起協商：共同空間、分工、雙方約定。' : 'Need to negotiate: shared space, division of tasks, mutual agreements.', title: isZh ? '需要一起協商的' : 'Need to negotiate', placeholder: isZh ? '例：週末的安排' : 'e.g. weekend arrangements' },
    { key: 'action', type: 'text', explain: isZh ? '我願意負責或先做的一件事。選填。' : 'One thing I am willing to do first. Optional.', title: isZh ? '我願意先做的（選填）' : 'What I will do first (optional)', placeholder: isZh ? '例：這週先跟家人說我需要一個週末休息' : 'e.g. tell family I need one weekend off' }
  ];
  if (id === 'repair') return [
    { key: 'what', type: 'text', explain: isZh ? '用看得到、聽得到的事實寫下發生的事。' : 'Write what happened in observable facts.', title: isZh ? '我記得發生的事' : 'What I remember', placeholder: isZh ? '例：我們為了週末安排起爭執' : 'e.g. we argued about weekend plans' },
    { key: 'impact', type: 'text', explain: isZh ? '這件事帶來的影響。' : 'The impact of this.', title: isZh ? '這件事帶來的影響' : 'Impact', placeholder: isZh ? '例：之後沒再說話' : 'e.g. we stopped talking after' },
    { key: 'mypart', type: 'text', explain: isZh ? '我願意負責的具體言行。' : 'Specific actions I am willing to own.', title: isZh ? '我願意負責的部分' : 'My part', placeholder: isZh ? '例：我提高了音量' : 'e.g. I raised my voice' },
    { key: 'notmine', type: 'text', explain: isZh ? '不由我單方面決定的事。' : 'Things not mine alone to decide.', title: isZh ? '不由我決定的' : 'Not mine to decide', placeholder: isZh ? '例：對方的感受' : 'e.g. their feelings' },
    { key: 'step', type: 'text', explain: isZh ? '我能做的一步。' : 'One step I can take.', title: isZh ? '我能做的一步' : 'One step I can take', placeholder: isZh ? '例：傳一句訊息問對方還好嗎' : 'e.g. send a message asking if they are okay' }
  ];
  if (id === 'goodenough') return [
    { key: 'task', type: 'text', explain: isZh ? '是哪一件事？' : 'Which task?', title: isZh ? '1. 是哪一件事？' : '1. Which task?', placeholder: isZh ? '例：週五要交的企劃簡報' : 'e.g. Friday presentation' },
    { key: 'purpose', type: 'text', explain: isZh ? '這件事主要是為了什麼？' : 'What is this mainly for?', title: isZh ? '2. 這件事是為了什麼？' : '2. What is this for?', placeholder: isZh ? '例：讓團隊了解進度' : 'e.g. Let the team know the progress' },
    { key: 'must', type: 'text', explain: isZh ? '一定要有的，最多 3 項。' : 'Must-haves, up to 3.', title: isZh ? '一定要有的' : 'Must have', placeholder: isZh ? '例：目標、進度、下一步' : 'e.g. goal, progress, next step' },
    { key: 'nice', type: 'text', explain: isZh ? '有很好，沒有也可以的。選填。' : 'Nice to have, but okay without. Optional.', title: isZh ? '有很好，沒有也可以（選填）' : 'Nice to have (optional)', placeholder: isZh ? '例：精美的圖表' : 'e.g. polished charts' },
    { key: 'stop', type: 'single', explain: isZh ? '什麼時候停手？' : 'When to stop?', title: isZh ? '3. 什麼時候停手？' : '3. When to stop?', options: isZh ? ['到一個時間就停','檢查固定次數就停','花固定時間就停'] : ['Stop at a set time','Stop after a set number of checks','Stop after a set duration'] }
  ];
  if (id === 'phone') return [
    { key: 'situation', type: 'single', explain: isZh ? '先想一下現在是哪種情況。' : 'What is the situation?', title: isZh ? '1. 現在是哪種情況？' : '1. What is the situation?', options: isZh ? ['睡前滑不停','工作中一直拿手機','一直刷新訊息','有正當用途但常滑過頭','其他'] : ['Scroll before bed','Keep picking up phone at work','Keep refreshing messages','Have a reason but often over-scroll','Other'] },
    { key: 'intent', type: 'text', explain: isZh ? '這次拿起手機，原本是想做什麼？想不起來也沒關係。' : 'What did you originally want to do? Not remembering is okay.', title: isZh ? '2. 原本想做什麼？' : '2. What did you want to do?', placeholder: isZh ? '例：查一個資料、不知道怎麼就打開了' : 'e.g. look something up, not sure how I opened it' },
    { key: 'stop', type: 'single', explain: isZh ? '選一個這次想停下的提示。' : 'Pick a cue to stop this time.', title: isZh ? '3. 我想停下的提示' : '3. Cue to stop', options: isZh ? ['做完一件事','看完這一則','某個時間點','先停一下再決定'] : ['After finishing one thing','After this one','At a certain time','Pause and decide'] },
    { key: 'after', type: 'text', explain: isZh ? '放下手機後的第一個動作。' : 'First action after putting the phone down.', title: isZh ? '4. 放下手機後' : '4. After putting phone down', placeholder: isZh ? '例：把手機背面朝上放在桌上' : 'e.g. place phone face down on the table' }
  ];
  if (id === 'problemsolve') return [
    { key: 'type', type: 'single', explain: isZh ? '這件事比較像哪一種？' : 'What kind of situation?', title: isZh ? '1. 這件事比較像' : '1. This is more like', options: isZh ? ['我能做一些事','需要和別人共同決定','主要是我不能掌控的','有安全上的擔心'] : ['I can do something','Need to decide together','Mostly outside my control','Safety concern'] },
    { key: 'problem', type: 'text', explain: isZh ? '想處理的問題。' : 'The problem.', title: isZh ? '2. 我想處理的問題' : '2. The problem', placeholder: isZh ? '例：工作量太大，來不及完成' : 'e.g. too much work, cannot finish' },
    { key: 'solutions', type: 'text', explain: isZh ? '列出方法。1–5 個。' : 'List solutions. 1–5.', title: isZh ? '3. 我想得到的方法' : '3. Solutions', placeholder: isZh ? '例：跟主管談、延後部分、請人幫忙' : 'e.g. talk to manager, delay some, ask for help' },
    { key: 'first', type: 'text', explain: isZh ? '選一個先試。' : 'Pick one to try first.', title: isZh ? '4. 我想先試' : '4. Try first', placeholder: isZh ? '例：跟主管談優先順序' : 'e.g. talk to manager about priorities' },
    { key: 'review', type: 'text', explain: isZh ? '什麼時候回顧？怎樣算有改善？' : 'When to review? What counts as improvement?', title: isZh ? '5. 回顧' : '5. Review', placeholder: isZh ? '例：下週五，工作量有減少' : 'e.g. next Friday, workload reduced' }
  ];
  if (id === 'selfbreak') return [
    { key: 'p1', type: 'text', explain: isZh ? '可以沿用例子，或改寫成自己的話。承認困難是第一步。' : 'Use the example or rewrite it. Acknowledging difficulty is the first step.', hint: isZh ? '可以沿用例子，或改寫成自己的話' : 'You can use the example or rewrite it in your own words', title: isZh ? '第一句：承認這是困難的時刻' : 'Phrase 1: Acknowledge this is a difficult moment', placeholder: isZh ? '例：這是一個困難的時刻' : 'e.g. This is a moment of difficulty' },
    { key: 'p2', type: 'text', explain: isZh ? '困難是共同的經驗。寫一句提醒自己的話。' : 'Difficulty is a shared experience. Write a reminder for yourself.', title: isZh ? '第二句：困難是共同的經驗' : 'Phrase 2: Difficulty is a shared human experience', placeholder: isZh ? '例：困難是人生的一部分' : 'e.g. Difficulty is part of life' },
    { key: 'p3', type: 'text', explain: isZh ? '給自己一句溫柔的話。可以沿用例子或改寫。' : 'Offer yourself a kind phrase. Use the example or rewrite it.', title: isZh ? '第三句：給自己一句溫柔的話' : 'Phrase 3: Offer yourself a kind phrase', placeholder: isZh ? '例：願我對自己溫柔一點' : 'e.g. May I be kind to myself' }
  ];
  if (id === 'bodycheck') return [
    { key: 'areas', type: 'multi', max: 8, explain: isZh ? '選出現在注意到的身體部位。最多 8 個。說不清楚可以選「其他」。' : 'Select body areas you notice. Up to 8. Choose "Other" if unclear.', title: isZh ? '1. 哪個部位有感覺？' : '1. Where do you notice sensation?', options: isZh ? ['頭部','臉部與下顎','頸部','肩膀與上背','胸前','腹部','下背','左手與手臂','右手與手臂','左腿','右腿','雙腳','其他／說不清楚'] : ['Head','Face and jaw','Neck','Shoulders and upper back','Chest','Abdomen','Lower back','Left hand and arm','Right hand and arm','Left leg','Right leg','Feet','Other / unclear'] },
    { key: 'sensation', type: 'multi', max: 3, explain: isZh ? '替每個部位選 1–3 個描述。不確定也是一種答案。' : 'Pick 1–3 descriptions for each area. Not sure is also an answer.', title: isZh ? '2. 感覺像什麼？' : '2. What does it feel like?', options: isZh ? ['緊繃','痠','疼痛','刺麻','溫熱','冰冷','舒服','沒什麼感覺','不確定'] : ['Tight','Sore','Pain','Tingling','Warm','Cold','Comfortable','Not much','Not sure'] },
    { key: 'intensity', type: 'single', explain: isZh ? '程度大概是？選填。' : 'How intense? Optional.', title: isZh ? '3. 程度（選填）' : '3. Intensity (optional)', options: isZh ? ['輕微','中等','明顯','很強','不確定'] : ['Mild','Moderate','Noticeable','Strong','Not sure'] },
    { key: 'note', type: 'text', explain: isZh ? '想補充的話。選填。' : 'Anything to add. Optional.', title: isZh ? '4. 補充（選填）' : '4. Note (optional)', placeholder: isZh ? '例：肩膀從早上開始就緊' : 'e.g. shoulders have been tight since morning' },
    { key: 'next', type: 'text', explain: isZh ? '我接下來想做什麼？選填。' : 'What do I want to do next? Optional.', title: isZh ? '接下來想做（選填）' : 'Next (optional)', placeholder: isZh ? '例：起來走走、做個伸展' : 'e.g. get up and walk, do a stretch' }
  ];
  if (id === 'sleep') return [
    { key: 'steps', type: 'multi', explain: isZh ? '選 2–3 個今晚想做的放鬆步驟。不用全部做。' : 'Pick 2–3 wind-down steps for tonight. No need to do all.', max: 3, hint: isZh ? '選 2–3 個就好，不用全部做' : 'Pick 2–3 — no need to do all', title: isZh ? '為今晚選 2–3 個放鬆步驟' : 'Choose 2–3 wind-down steps for tonight', options: isZh ? ['調暗燈光','關掉螢幕','簡單伸展','寫下明天一件事','聽輕柔聲音','喝溫水','深呼吸 5 次'] : ['Dim lights','Turn off screens','Gentle stretch','Write one thing for tomorrow','Listen to soft sound','Drink warm water','5 deep breaths'] },
    { key: 'when', type: 'text', explain: isZh ? '大概什麼時候開始？寫下來提醒自己。' : 'Roughly when will you start? Write it as a reminder.', hint: isZh ? '例：洗完澡後、上床前' : 'e.g. After shower, before bed', title: isZh ? '大概什麼時候開始？' : 'Roughly when will you start?', placeholder: isZh ? '例：晚上十點半' : 'e.g. Around 10:30 pm' }
  ];
  if (id === 'counselprep') return [
    { key: 'stage', type: 'single', explain: isZh ? '目前階段。' : 'Current stage.', title: isZh ? '1. 目前階段' : '1. Stage', options: isZh ? ['還在考慮','正在找機構','已經預約'] : ['Considering','Looking','Booked'] },
    { key: 'questions', type: 'multi', max: 5, explain: isZh ? '想確認的問題。' : 'Questions to ask.', title: isZh ? '2. 想確認的問題' : '2. Questions', options: isZh ? ['單次費用與時間','補助方案','保密方式','第一次流程','線上服務','取消規定','付款方式'] : ['Fee and time','Subsidy','Confidentiality','First session','Online','Cancellation','Payment'] },
    { key: 'note', type: 'text', explain: isZh ? '想帶去的想法。選填。' : 'Thoughts to bring. Optional.', title: isZh ? '想帶去的想法（選填）' : 'Thoughts (optional)', placeholder: isZh ? '例：最近壓力大' : 'e.g. stressed lately' }
  ];


  if (id === 'tasksorter') return [
    { key: 'tasks', type: 'text', explain: isZh ? '把腦中的事情一件件寫下來。最多 12 件。' : 'Write each task. Up to 12.', title: isZh ? '1. 腦中的事情' : '1. Tasks', placeholder: isZh ? '例：回覆訊息、整理房間' : 'e.g. reply to messages, tidy room' },
    { key: 'today', type: 'text', explain: isZh ? '今天想處理：今天有意願也有條件的。' : 'Today: willing and able to handle.', title: isZh ? '2. 今天想處理' : '2. Handle today', placeholder: isZh ? '例：回覆確認時間的信' : 'e.g. reply to confirm time' },
    { key: 'later', type: 'text', explain: isZh ? '可以延後：暫時放下，不代表不重要。' : 'Can wait: set aside, not unimportant.', title: isZh ? '可以延後' : 'Can wait', placeholder: isZh ? '例：整理整個房間' : 'e.g. tidy whole room' },
    { key: 'help', type: 'text', explain: isZh ? '需要協助：需要其他人的資訊或配合。' : 'Need help: requires others.', title: isZh ? '需要協助' : 'Need help', placeholder: isZh ? '例：確認活動交通' : 'e.g. confirm event transport' },
    { key: 'undecided', type: 'text', explain: isZh ? '還沒決定：現在無法決定。' : 'Undecided: cannot decide now.', title: isZh ? '還沒決定' : 'Undecided', placeholder: isZh ? '例：決定週末安排' : 'e.g. decide weekend plans' },
    { key: 'first', type: 'text', explain: isZh ? '從今天想處理挑一件，寫下第一小步。' : 'Pick one from today, write first step.', title: isZh ? '3. 第一小步' : '3. First step', placeholder: isZh ? '例：打開信件' : 'e.g. open the email' }
  ];
  if (id === 'askhelp') return [
    { key: 'type', type: 'single', explain: isZh ? '選你需要的協助類型。' : 'Select the type of help.', title: isZh ? '1. 需要的協助類型' : '1. Type of help', options: isZh ? ['聽我說','具體幫忙','陪同','討論工作量'] : ['Listen to me','Specific help','Accompany me','Discuss workload'] },
    { key: 'who', type: 'text', explain: isZh ? '想請誰幫忙？' : 'Who to ask?', title: isZh ? '對象' : 'Who', placeholder: isZh ? '例：朋友、家人、同事' : 'e.g. friend, family, colleague' },
    { key: 'what', type: 'text', explain: isZh ? '具體內容與希望的時間。' : 'Specifics and preferred time.', title: isZh ? '2. 具體內容' : '2. Specifics', placeholder: isZh ? '例：幫我看一下這份文件' : 'e.g. help me check this document' },
    { key: 'style', type: 'single', explain: isZh ? '選一種說法風格。' : 'Pick a style.', title: isZh ? '3. 說法風格' : '3. Style', options: isZh ? ['溫和說明','簡短直接'] : ['Gentle','Direct'] },
    { key: 'message', type: 'text', explain: isZh ? '改成你的語氣。' : 'Rewrite in your tone.', title: isZh ? '我的說法' : 'My message', placeholder: isZh ? '例：我最近有些事想說' : 'e.g. I have some things I want to talk about' }
  ];
  if (id === 'careguide') return [
    { key: 'signs', type: 'multi', max: 4, explain: isZh ? '低落時別人可能會看到的樣子。' : 'What others might notice when you are low.', title: isZh ? '我狀態不好的時候，你可能會看到' : 'When I am not okay, you might notice', options: isZh ? ['話變少、不太回訊息','一直待在房間或床上','容易煩躁、講話比較衝','一直說「我沒事」','吃很少或吃很多','睡很多或睡不著','一直道歉、覺得自己很糟'] : ['Talk less, reply slowly','Stay in room or bed','Get irritable easily','Keep saying I am fine','Eat very little or a lot','Sleep a lot or not at all','Apologize a lot, feel bad about myself'] },
    { key: 'helpful', type: 'multi', max: 4, explain: isZh ? '選對你有幫助的陪伴方式。' : 'Pick ways of support that help you.', title: isZh ? '這些陪法對我有幫助' : 'These ways of support help me', options: isZh ? ['陪我坐著就好，不用一直說話','傳一句「我在」，不用急著等我回','問我「你現在想要被安慰，還是想被聽就好？」','聽我說完再回應，不用急著給建議','約好一個時間再來看看我','幫我買飯或提醒我吃東西','幫我分擔一件家事或跑腿','約我出去走一小段路','給我一點空間，但讓我知道你在','跟我說「你不用急著好起來」','跟我說「你不是麻煩」'] : ['Just sit with me, no need to talk','Send a message saying you are there','Ask if I want comfort or just listening','Listen fully before responding','Help with food or remind me to eat','Give me space but let me know you are around'] },
    { key: 'note', type: 'text', explain: isZh ? '其他想讓對方知道的。選填。' : 'Anything else you want them to know. Optional.', title: isZh ? '其他想說的（選填）' : 'Anything else (optional)', placeholder: isZh ? '例：這些不代表我在生你的氣' : 'e.g. This does not mean I am angry at you' }
  ];
  if (id === 'lowenergy') return [
    { key: 'time', type: 'single', explain: isZh ? '從三種份量裡挑。' : 'Pick from three durations.', title: isZh ? '1. 現在有多少時間？' : '1. How much time?', options: isZh ? ['2 分鐘','15 分鐘','有力氣的時候'] : ['2 minutes','15 minutes','When I have energy'] },
    { key: 'activity', type: 'single', explain: isZh ? '挑一件做得到的。' : 'Pick one you can do.', title: isZh ? '2. 挑一件活動' : '2. Pick an activity', options: isZh ? ['喝一杯溫水','開窗透氣','伸個懶腰','洗把臉','回一則簡單的訊息','看窗外一分鐘','洗個熱水澡','到樓下走一圈','整理桌面一角','聽一首歌','去公園散步','約朋友喝咖啡'] : ['Drink warm water','Open a window','Stretch','Wash face','Reply to a simple message','Look outside for a minute','Take a hot shower','Walk downstairs','Tidy a corner','Listen to a song','Walk in the park','Meet a friend for coffee'] },
    { key: 'own', type: 'text', explain: isZh ? '補上你自己的。選填。' : 'Add your own. Optional.', title: isZh ? '3. 我自己的（選填）' : '3. My own (optional)', placeholder: isZh ? '例：以前喜歡、後來很久沒做的事' : 'e.g. something I used to enjoy' }
  ];
  if (id === 'docprep') return [
    { key: 'type', type: 'single', explain: isZh ? '這次看診是？' : 'Type of visit?', title: isZh ? '1. 這次看診是？' : '1. Visit type', options: isZh ? ['第一次看身心科','回診，有在用藥','想換醫師','還不確定'] : ['First visit','Follow-up','Second opinion','Not sure'] },
    { key: 'main', type: 'text', explain: isZh ? '最想處理的事。' : 'Main concerns.', title: isZh ? '2. 最想處理的事' : '2. Main concerns', placeholder: isZh ? '例：晚上很難入睡' : 'e.g. hard to fall asleep' },
    { key: 'impact', type: 'multi', max: 4, explain: isZh ? '影響到哪些？' : 'Affects?', title: isZh ? '影響到' : 'Affects', options: isZh ? ['睡眠','食慾','工作','專注','人際','身體感覺','情緒'] : ['Sleep','Appetite','Work','Focus','Relationships','Physical','Mood'] },
    { key: 'meds', type: 'text', explain: isZh ? '目前用藥。選填。' : 'Medications. Optional.', title: isZh ? '3. 目前用藥（選填）' : '3. Meds (optional)', placeholder: isZh ? '例：沒有' : 'e.g. none' },
    { key: 'questions', type: 'multi', max: 3, explain: isZh ? '想問的問題。' : 'Questions.', title: isZh ? '4. 想問的問題' : '4. Questions', options: isZh ? ['可能原因？','處理方式？','多久改善？','副作用？','忘記吃怎麼辦？'] : ['Cause?','Options?','How long?','Side effects?','Missed dose?'] }
  ];
  if (id === 'breakup') return [
    { key: 'hardtime', type: 'text', explain: isZh ? '這一週最難熬的時段是什麼時候？' : 'When is the hardest time this week?', title: isZh ? '最難熬的時段' : 'The hardest time', placeholder: isZh ? '例：晚上獨處時、看到共同朋友時' : 'e.g. evenings alone, seeing mutual friends' },
    { key: 'prepare', type: 'text', explain: isZh ? '為那個時段準備一件小事。' : 'Prepare one small thing for that time.', hint: isZh ? '越小越好' : 'Smaller is better', title: isZh ? '我可以先準備…' : 'I can prepare…', placeholder: isZh ? '例：準備一張播放清單、約朋友吃飯' : 'e.g. prepare a playlist, plan a meal with a friend' }
  ];
  if (id === 'transition') return [
    { key: 'type', type: 'single', explain: isZh ? '變動類型。' : 'Type of change.', title: isZh ? '1. 變動類型' : '1. Type', options: isZh ? ['搬家','轉職、新工作','畢業、升學','成為照顧者','家庭結構變化','其他'] : ['Moving','New job','Graduation','Caregiver','Family change','Other'] },
    { key: 'stage', type: 'single', explain: isZh ? '階段。' : 'Stage.', title: isZh ? '階段' : 'Stage', options: isZh ? ['即將發生','正在發生','剛發生不久','已經一段時間'] : ['About to happen','Happening','Just happened','Been a while'] },
    { key: 'keep', type: 'text', explain: isZh ? '想保留的。' : 'Want to keep.', title: isZh ? '3. 想保留' : '3. Keep', placeholder: isZh ? '例：和朋友的聯絡' : 'e.g. contact with friends' },
    { key: 'adjust', type: 'text', explain: isZh ? '可以慢慢調整的。' : 'Can adjust.', title: isZh ? '可以調整' : 'Can adjust', placeholder: isZh ? '例：作息時間' : 'e.g. sleep schedule' },
    { key: 'unclear', type: 'text', explain: isZh ? '還不確定的。' : 'Unclear.', title: isZh ? '還不確定' : 'Unclear', placeholder: isZh ? '例：新環境人際' : 'e.g. new relationships' },
    { key: 'care', type: 'text', explain: isZh ? '最近想先照顧的。' : 'Care for first.', title: isZh ? '5. 先照顧' : '5. Care first', placeholder: isZh ? '例：先穩定作息' : 'e.g. stabilize sleep first' }
  ];
  if (id === 'relpause') return [
    { key: 'known', type: 'text', explain: isZh ? '我目前真正知道的事。只寫看得到、聽得到的。' : 'What I actually know. Only what I can see or hear.', title: isZh ? '1. 已知的事' : '1. What I know', placeholder: isZh ? '例：晚上九點傳的訊息，到現在還沒回' : 'e.g. sent a message at 9pm, no reply yet' },
    { key: 'guess', type: 'text', explain: isZh ? '我心裡的猜測。猜測不代表事實。' : 'My guesses. Guesses are not facts.', title: isZh ? '2. 我的猜測' : '2. My guesses', placeholder: isZh ? '例：他是不是生氣了' : 'e.g. is he angry' },
    { key: 'urge', type: 'multi', max: 3, explain: isZh ? '現在想做的反應。' : 'Reactions I want to do now.', title: isZh ? '3. 現在想做的反應' : '3. Reactions I want', options: isZh ? ['一直傳訊息','反覆查看對方動態','立刻問清楚','假裝沒事','也不理對方','想直接結束關係'] : ['Keep messaging','Keep checking','Ask immediately','Pretend nothing','Ignore them','Want to end it'] },
    { key: 'alt', type: 'multi', max: 3, explain: isZh ? '其他可選的做法。' : 'Other options.', title: isZh ? '4. 其他可選的做法' : '4. Other options', options: isZh ? ['先等一段時間再看','傳一則簡單的訊息','等雙方都有空時再談','先找信任的朋友聊聊','先做一件照顧自己的事','暫時不回應'] : ['Wait a while','Send a simple message','Talk when both free','Talk to a friend','Care for myself','Not respond for now'] },
    { key: 'decide', type: 'text', explain: isZh ? '我決定的下一步。' : 'My next step.', title: isZh ? '5. 我決定的下一步' : '5. My next step', placeholder: isZh ? '例：先等一小時再看' : 'e.g. wait an hour then check' }
  ];
  if (id === 'examprep') return [
    { key: 'type', type: 'single', explain: isZh ? '是考試還是面試？' : 'Is it an exam or interview?', title: isZh ? '類型' : 'Type', options: isZh ? ['考試','面試','其他'] : ['Exam','Interview','Other'] },
    { key: 'days', type: 'text', explain: isZh ? '還有幾天？' : 'How many days left?', title: isZh ? '還有幾天？' : 'Days remaining?', placeholder: isZh ? '例：3 天' : 'e.g. 3 days' },
    { key: 'check', type: 'text', explain: isZh ? '這幾天要確認的事。' : 'Things to check in the coming days.', title: isZh ? '要確認的事' : 'Things to check', placeholder: isZh ? '例：帶證件、確認地點、準備問題' : 'e.g. bring ID, confirm location, prepare questions' }
  ];
  if (id === 'pmr') return [
    { key: 'start', type: 'single', explain: isZh ? '找一個舒服的姿勢，跟著提示做。不舒服的部位隨時跳過。' : 'Find a comfortable position and follow the prompts. Skip any area that feels uncomfortable.', title: isZh ? '準備好了嗎？' : 'Ready?', options: isZh ? ['開始','先休息一下'] : ['Start','Rest first'] }
  ];

  if (id === 'relatives') return [
    { key: 'question', type: 'single', explain: isZh ? '選最常被問到的問題。' : 'Pick the question you get asked most.', title: isZh ? '最常被問什麼？' : 'What are you asked most?', options: isZh ? ['收入多少','有沒有對象','什麼時候結婚','什麼時候生小孩','工作穩定嗎','其他'] : ['How much do you earn','Are you seeing someone','When will you get married','When will you have kids','Is your job stable','Other'] },
    { key: 'response', type: 'text', explain: isZh ? '準備一句你說得出口的回應。' : 'Prepare a response you can actually say.', hint: isZh ? '可以溫和，也可以直接' : 'Can be gentle or direct', title: isZh ? '我可以這樣回應：' : 'I can respond like this:', placeholder: isZh ? '例：目前還在規劃中，謝謝關心' : 'e.g. Still planning, thanks for asking' },
    { key: 'backup', type: 'text', explain: isZh ? '如果對方繼續追問，我可以…' : 'If they keep asking, I can…', title: isZh ? '如果繼續追問（選填）' : 'If they keep asking (optional)', placeholder: isZh ? '例：轉換話題、找藉口離開' : 'e.g. change topic, find an excuse to leave' }
  ];
  if (id === 'parenttalk') return [
    { key: 'situation', type: 'text', explain: isZh ? '描述孩子的反應或情境。' : 'Describe the child\'s reaction or the situation.', title: isZh ? '發生了什麼？' : 'What happened?', placeholder: isZh ? '例：叫他收玩具，他不理我' : 'e.g. Asked him to put away toys, he ignored me' },
    { key: 'age', type: 'single', explain: isZh ? '孩子大概幾歲？' : 'Roughly how old is the child?', title: isZh ? '孩子年齡' : 'Child\'s age', options: isZh ? ['3歲以下','3–6歲','7–12歲','13歲以上'] : ['Under 3','3–6','7–12','13+'] },
    { key: 'myreply', type: 'text', explain: isZh ? '寫一句你自己的接話。' : 'Write your own response.', hint: isZh ? '不用完美，寫得出來就好' : 'Not perfect — just write something', title: isZh ? '我可以這樣說：' : 'I can say:', placeholder: isZh ? '例：我看到你還想玩，我們先收三個好不好？' : 'e.g. I see you still want to play. Can we put away three first?' }
  ];
  if (id === 'mindfulreply') return [
    { key: 'trigger', type: 'text', explain: isZh ? '對方說了什麼讓你想回嘴？' : 'What did they say that made you want to snap back?', title: isZh ? '那句話是…' : 'The comment was…', placeholder: isZh ? '例：你怎麼又遲到了' : 'e.g. Why are you late again' },
    { key: 'urge', type: 'text', explain: isZh ? '你當下想回什麼？先寫下來，不用傳。' : 'What did you want to reply? Write it down — no need to send.', title: isZh ? '我當下想回…' : 'I wanted to reply…', placeholder: isZh ? '例：你才遲到' : 'e.g. You are the one who is late' },
    { key: 'fact', type: 'text', explain: isZh ? '對方實際說了什麼？和我的解讀分開。' : 'What did they actually say? Separate from my interpretation.', title: isZh ? '對方實際說的是…' : 'What they actually said was…', placeholder: isZh ? '例：問我為什麼遲到' : 'e.g. Asked why I was late' },
    { key: 'reply', type: 'text', explain: isZh ? '擬一句你想說的回覆。可以先不傳。' : 'Draft a reply you want to say. You can hold off sending.', title: isZh ? '我想說的回覆是…' : 'The reply I want to give is…', placeholder: isZh ? '例：抱歉遲到了，路上塞車' : 'e.g. Sorry I was late, traffic was bad' }
  ];
  if (id === 'twoperson') return [
    { key: 'topic', type: 'text', explain: isZh ? '選一件小事來聊。不適合高衝突或有暴力的關係。' : 'Pick a small topic. Not for high-conflict or violent relationships.', title: isZh ? '想聊的一件小事' : 'A small thing to talk about', placeholder: isZh ? '例：今天午餐吃了什麼' : 'e.g. What I had for lunch today' },
    { key: 'role', type: 'single', explain: isZh ? '先決定誰先說。每人約一分半。' : 'Decide who speaks first. About 90 seconds each.', title: isZh ? '誰先說？' : 'Who speaks first?', options: isZh ? ['我先說','對方先說'] : ['I speak first','They speak first'] },
    { key: 'ready', type: 'single', explain: isZh ? '兩個人都願意的時候再開始。' : 'Start only when both are willing.', title: isZh ? '準備好了嗎？' : 'Ready?', options: isZh ? ['開始','先等等'] : ['Start','Wait'] }
  ];
  if (id === 'screentime') return [
    { key: 'device', type: 'multi', max: 3, explain: isZh ? '選要討論的設備。' : 'Select the devices to discuss.', title: isZh ? '哪些設備？' : 'Which devices?', options: isZh ? ['手機','平板','電腦','電玩','電視'] : ['Phone','Tablet','Computer','Games','TV'] },
    { key: 'rule', type: 'text', explain: isZh ? '寫下基本規則。' : 'Write the basic rule.', title: isZh ? '基本規則' : 'Basic rule', placeholder: isZh ? '例：每天最多一小時，做完功課後' : 'e.g. Max one hour a day, after homework' },
    { key: 'exception', type: 'text', explain: isZh ? '有什麼例外？' : 'Any exceptions?', title: isZh ? '例外情況（選填）' : 'Exceptions (optional)', placeholder: isZh ? '例：週末可以多半小時' : 'e.g. Extra 30 minutes on weekends' },
    { key: 'discuss', type: 'text', explain: isZh ? '還要再談的地方。' : 'Things still to discuss.', title: isZh ? '還要再談（選填）' : 'Still to discuss (optional)', placeholder: isZh ? '例：罰則怎麼定' : 'e.g. How to handle breaking the rule' }
  ];
  if (id === 'visualcard') return [
    { key: 'activity', type: 'text', explain: isZh ? '孩子要從什麼活動換到什麼？' : 'What activity is the child switching from and to?', title: isZh ? '轉換的活動' : 'The transition', placeholder: isZh ? '例：從玩玩具到吃飯' : 'e.g. from playing to eating' },
    { key: 'steps', type: 'text', explain: isZh ? '寫下「現在、接下來、完成後」的步驟。' : 'Write the now, next, and done steps.', title: isZh ? '步驟' : 'Steps', placeholder: isZh ? '例：現在收玩具 → 接下來洗手 → 完成後吃飯' : 'e.g. Now: put toys away → Next: wash hands → Done: eat' },
    { key: 'choice', type: 'text', explain: isZh ? '加上一個選擇，如「我需要休息」。' : 'Add a choice, like "I need a break".', title: isZh ? '選擇（選填）' : 'Choice (optional)', placeholder: isZh ? '例：我需要休息' : 'e.g. I need a break' }
  ];
  if (id === 'sleepdiary') return [
    { key: 'bed', type: 'text', explain: isZh ? '幾點上床？' : 'Bedtime?', title: isZh ? '上床時間' : 'Bedtime', placeholder: isZh ? '例：23:30' : 'e.g. 11:30 pm' },
    { key: 'sleep', type: 'text', explain: isZh ? '大概幾點睡著？' : 'Fell asleep around?', title: isZh ? '大概幾點睡著' : 'Fell asleep', placeholder: isZh ? '例：00:15' : 'e.g. 12:15 am' },
    { key: 'wakeNight', type: 'text', explain: isZh ? '半夜醒來約幾分鐘？選填。' : 'Minutes awake at night? Optional.', title: isZh ? '半夜醒來（分鐘）' : 'Awake at night (min)', placeholder: isZh ? '例：15' : 'e.g. 15' },
    { key: 'wake', type: 'text', explain: isZh ? '最後醒來？' : 'Final wake?', title: isZh ? '最後醒來' : 'Final wake', placeholder: isZh ? '例：07:00' : 'e.g. 7:00 am' },
    { key: 'getup', type: 'text', explain: isZh ? '起床離床？' : 'Got out of bed?', title: isZh ? '起床離床' : 'Out of bed', placeholder: isZh ? '例：07:15' : 'e.g. 7:15 am' },
    { key: 'feel', type: 'single', explain: isZh ? '起來後感覺。' : 'Feeling after waking.', title: isZh ? '起來後感覺' : 'Feeling', options: isZh ? ['較有精神','普通','疲累','不確定'] : ['Refreshed','Okay','Tired','Not sure'] },
    { key: 'note', type: 'text', explain: isZh ? '備註。選填。' : 'Notes. Optional.', title: isZh ? '備註（選填）' : 'Notes (optional)', placeholder: isZh ? '例：喝了咖啡' : 'e.g. had coffee' }
  ];
  if (id === 'workplace') return [
    { key: 'when', type: 'text', explain: isZh ? '事件發生的時間。' : 'When did the incident happen?', title: isZh ? '時間' : 'When', placeholder: isZh ? '例：2026年11月10日下午' : 'e.g. Nov 10, 2026, afternoon' },
    { key: 'heard', type: 'text', explain: isZh ? '你親耳聽到的話。用引號記下。' : 'What you heard directly. Use quotes.', title: isZh ? '親耳聽到的' : 'What I heard directly', placeholder: isZh ? '例：「你這個做不好」' : 'e.g. "You cannot do this well"' },
    { key: 'told', type: 'text', explain: isZh ? '別人轉述的。標明是轉述。' : 'What others told you. Mark as secondhand.', title: isZh ? '別人轉述的（選填）' : 'What others told me (optional)', placeholder: isZh ? '例：同事說主管在會議上提到…' : 'e.g. Colleague said the manager mentioned…' },
    { key: 'guess', type: 'text', explain: isZh ? '你自己的推測。和事實分開。' : 'Your own interpretation. Separate from facts.', title: isZh ? '我的推測（選填）' : 'My interpretation (optional)', placeholder: isZh ? '例：我猜他是針對我' : 'e.g. I guess he was targeting me' }
  ];
  if (id === 'breathspace') return [
    { key: 'start', type: 'single', explain: isZh ? '心裡很亂時，跟著三個階段停下來。不控制呼吸節奏。' : 'When your mind is racing, pause with three stages. No need to control the breath.', title: isZh ? '準備好了嗎？' : 'Ready?', options: isZh ? ['開始','先等等'] : ['Start','Wait'] }
  ];

  if (id === 'sayingno') return [
    { key: 'request', type: 'text', explain: isZh ? '對方要求什麼？' : 'What are they asking?', title: isZh ? '1. 對方的要求' : '1. The request', placeholder: isZh ? '例：週末加班、借錢、參加聚會' : 'e.g. overtime, lend money, attend gathering' },
    { key: 'feeling', type: 'text', explain: isZh ? '你的感覺是？' : 'How do you feel?', title: isZh ? '2. 我的感覺' : '2. My feeling', placeholder: isZh ? '例：不想去、沒有餘力、不舒服' : 'e.g. don\'t want to, no capacity, uncomfortable' },
    { key: 'reason', type: 'text', explain: isZh ? '想拒絕的原因。可以只寫給自己看。' : 'Why you want to say no. Can be just for yourself.', title: isZh ? '3. 原因' : '3. Reason', placeholder: isZh ? '例：已經有安排、需要休息' : 'e.g. already have plans, need rest' },
    { key: 'phrase', type: 'text', explain: isZh ? '練習一句說得出口的拒絕。' : 'Practice a refusal you can say.', title: isZh ? '4. 我可以這樣說' : '4. I can say', placeholder: isZh ? '例：這次我沒辦法，謝謝你想到我' : 'e.g. I can\'t this time, thanks for thinking of me' },
    { key: 'backup', type: 'text', explain: isZh ? '如果對方繼續要求？選填。' : 'If they keep asking? Optional.', title: isZh ? '5. 如果繼續要求（選填）' : '5. If they persist (optional)', placeholder: isZh ? '例：轉換話題、找藉口離開' : 'e.g. change topic, find excuse to leave' }
  ];
  if (id === 'apology') return [
    { key: 'what', type: 'text', explain: isZh ? '發生了什麼事？' : 'What happened?', title: isZh ? '1. 發生了什麼' : '1. What happened', placeholder: isZh ? '例：我遲到了，讓大家等' : 'e.g. I was late, made everyone wait' },
    { key: 'impact', type: 'text', explain: isZh ? '這件事的影響？' : 'The impact?', title: isZh ? '2. 影響' : '2. Impact', placeholder: isZh ? '例：大家等了十五分鐘' : 'e.g. everyone waited 15 minutes' },
    { key: 'mypart', type: 'text', explain: isZh ? '你願意負責的部分。' : 'Your part.', title: isZh ? '3. 我的部分' : '3. My part', placeholder: isZh ? '例：我沒有提早出門' : 'e.g. I didn\'t leave early enough' },
    { key: 'phrase', type: 'text', explain: isZh ? '寫一句道歉。' : 'Write an apology.', title: isZh ? '4. 我想說' : '4. I want to say', placeholder: isZh ? '例：抱歉讓你們等，下次我會提早出門' : 'e.g. sorry for making you wait, I\'ll leave earlier' },
    { key: 'next', type: 'text', explain: isZh ? '之後可以做什麼？選填。' : 'What can I do after? Optional.', title: isZh ? '5. 之後（選填）' : '5. After (optional)', placeholder: isZh ? '例：設定提早出門的提醒' : 'e.g. set a reminder to leave earlier' }
  ];
  if (id === 'threegood') return [
    { key: 'g1', type: 'text', explain: isZh ? '第一件。小事也可以。' : 'First one. Small things count.', title: isZh ? '第一件好事' : 'First good thing', placeholder: isZh ? '例：午餐很好吃' : 'e.g. lunch was good' },
    { key: 'g2', type: 'text', explain: isZh ? '第二件。' : 'Second one.', title: isZh ? '第二件好事' : 'Second good thing', placeholder: isZh ? '例：和朋友聊了一下' : 'e.g. chatted with a friend' },
    { key: 'g3', type: 'text', explain: isZh ? '第三件。' : 'Third one.', title: isZh ? '第三件好事' : 'Third good thing', placeholder: isZh ? '例：準時下班' : 'e.g. left work on time' }
  ];
  if (id === 'stresscheck') return [
    { key: 'sources', type: 'text', explain: isZh ? '列出目前的壓力來源。一行一個。' : 'List stress sources. One per line.', title: isZh ? '1. 壓力來源' : '1. Stress sources', placeholder: isZh ? '例：工作截止日期、家裡的事、睡眠不好' : 'e.g. work deadline, family, poor sleep' },
    { key: 'impact', type: 'multi', max: 3, explain: isZh ? '這些壓力影響到什麼？' : 'What do these affect?', title: isZh ? '2. 影響到' : '2. Affects', options: isZh ? ['睡眠','食慾','情緒','專注','人際','身體'] : ['Sleep','Appetite','Mood','Focus','Relationships','Body'] },
    { key: 'control', type: 'single', explain: isZh ? '哪些是我能做點什麼的？' : 'Which can I do something about?', title: isZh ? '3. 我能做點什麼的' : '3. What I can address', options: isZh ? ['大部分可以','只有少數','大部分先擱置','還不確定'] : ['Most','Only a few','Most can wait','Not sure'] },
    { key: 'one', type: 'text', explain: isZh ? '挑一個可以先處理的。' : 'Pick one to address first.', title: isZh ? '4. 我可以先處理' : '4. Address first', placeholder: isZh ? '例：今晚早點睡' : 'e.g. sleep earlier tonight' }
  ];
  if (id === 'energycheck') return [
    { key: 'level', type: 'single', explain: isZh ? '現在的能量大概在哪？' : 'Where is your energy?', title: isZh ? '1. 現在的能量' : '1. Energy now', options: isZh ? ['很高，可以做難的事','普通，可以做簡單的事','偏低，只想做輕鬆的','很低，需要休息'] : ['High','Okay','Low','Very low'] },
    { key: 'body', type: 'text', explain: isZh ? '身體有什麼感覺？選填。' : 'Body sensations? Optional.', title: isZh ? '2. 身體感覺（選填）' : '2. Body (optional)', placeholder: isZh ? '例：肩膀緊、眼睛累' : 'e.g. tight shoulders, tired eyes' },
    { key: 'fit', type: 'text', explain: isZh ? '根據能量，現在適合做什麼？' : 'What fits right now?', title: isZh ? '3. 現在適合做' : '3. What fits', placeholder: isZh ? '例：回幾封簡單的信、休息一下' : 'e.g. reply to simple emails, rest' },
    { key: 'avoid', type: 'text', explain: isZh ? '現在不適合做什麼？選填。' : 'What to avoid? Optional.', title: isZh ? '4. 先不做（選填）' : '4. Avoid (optional)', placeholder: isZh ? '例：重要的決定、長時間會議' : 'e.g. important decisions, long meetings' }
  ];
  if (id === 'socialbattery') return [
    { key: 'level', type: 'single', explain: isZh ? '社交後的感覺？' : 'How do you feel after socializing?', title: isZh ? '1. 現在的社交電量' : '1. Social battery', options: isZh ? ['還有電，可以繼續','有點累，但還可以','很累，想獨處','完全沒電，需要充電'] : ['Still charged','A bit tired','Very tired','Empty'] },
    { key: 'signs', type: 'multi', max: 3, explain: isZh ? '你注意到什麼？' : 'What do you notice?', title: isZh ? '2. 我注意到' : '2. I notice', options: isZh ? ['不想說話','想回家','容易煩躁','頭有點痛','還可以'] : ['Don\'t want to talk','Want to go home','Easily irritated','Slight headache','Still okay'] },
    { key: 'action', type: 'text', explain: isZh ? '根據電量，你想怎麼做？' : 'What do you want to do?', title: isZh ? '3. 我決定' : '3. I decide', placeholder: isZh ? '例：早點回家、約下次再聚' : 'e.g. go home early, meet another time' },
    { key: 'recharge', type: 'text', explain: isZh ? '之後怎麼充電？選填。' : 'How to recharge later? Optional.', title: isZh ? '4. 充電方式（選填）' : '4. Recharge (optional)', placeholder: isZh ? '例：回家休息、聽歌、獨處' : 'e.g. rest at home, listen to music, be alone' }
  ];
  if (id === 'goalreview') return [
    { key: 'goal', type: 'text', explain: isZh ? '你的目標是什麼？' : 'What is your goal?', title: isZh ? '1. 目標' : '1. Goal', placeholder: isZh ? '例：每週運動三次' : 'e.g. exercise three times a week' },
    { key: 'why', type: 'text', explain: isZh ? '為什麼這個目標重要？' : 'Why is this important?', title: isZh ? '2. 為什麼重要' : '2. Why important', placeholder: isZh ? '例：想要更有精神' : 'e.g. want more energy' },
    { key: 'now', type: 'text', explain: isZh ? '現在在哪？' : 'Where are you now?', title: isZh ? '3. 目前進度' : '3. Progress', placeholder: isZh ? '例：這週動了一次' : 'e.g. exercised once this week' },
    { key: 'block', type: 'text', explain: isZh ? '卡在哪裡？選填。' : 'Where are you stuck? Optional.', title: isZh ? '4. 卡點（選填）' : '4. Block (optional)', placeholder: isZh ? '例：下班後太累' : 'e.g. too tired after work' },
    { key: 'next', type: 'text', explain: isZh ? '下一步是什麼？' : 'What is the next step?', title: isZh ? '5. 下一步' : '5. Next step', placeholder: isZh ? '例：明天早上出門前做十分鐘' : 'e.g. do ten minutes before leaving' }
  ];
  if (id === 'selfaffirm') return [
    { key: 'context', type: 'text', explain: isZh ? '最近發生了什麼，讓你想對自己說一句話？' : 'What happened recently that makes you want to say something to yourself?', title: isZh ? '1. 背景' : '1. Context', placeholder: isZh ? '例：工作沒做完、和人起衝突' : 'e.g. didn\'t finish work, had a conflict' },
    { key: 'harsh', type: 'text', explain: isZh ? '你對自己說了什麼？' : 'What did you say to yourself?', title: isZh ? '2. 對自己說的話' : '2. What I said', placeholder: isZh ? '例：我怎麼這麼沒用' : 'e.g. why am I so useless' },
    { key: 'affirm', type: 'text', explain: isZh ? '試著說一句真實的、你能接受的話。' : 'Try saying something true that you can accept.', title: isZh ? '3. 我對自己說' : '3. I say to myself', placeholder: isZh ? '例：我今天有努力、這件事確實很難' : 'e.g. I tried today, this was hard' },
    { key: 'action', type: 'text', explain: isZh ? '一個小行動。選填。' : 'One small action. Optional.', title: isZh ? '4. 小行動（選填）' : '4. Small action (optional)', placeholder: isZh ? '例：休息一下、喝杯水' : 'e.g. rest a bit, drink water' }
  ];
  return [];
}

const boundaryPhrases = {
  '下班後收到非緊急訊息': {
    need: '保留下班後的休息時間',
    gentle: '我看到訊息了。這件事如果不是緊急狀況，我會在下一個工作時段回覆。',
    direct: '非緊急工作訊息，我會在工作時間處理。',
    restate: '我理解你希望盡快確認；我仍會在下一個工作時段處理。緊急情況可以依我們約定的方式聯絡。',
    ifcontinue: '先確認職務與團隊的值班或緊急聯絡約定，再提出可行的回覆時段。'
  },
  '臨時增加工作': {
    need: '先確認優先順序與可負擔的工作量',
    gentle: '我目前正在處理原定工作。如果要加入這一項，想先一起確認哪件事優先、哪些時程可以調整。',
    direct: '目前的工作量無法全部在原期限完成，需要先調整優先順序或時程。',
    restate: '我可以配合討論安排，但無法同時承諾所有項目的原期限。請先確認要優先完成哪一項。',
    ifcontinue: '列出目前任務與預計時間，讓討論回到具體安排，而不是只反覆承諾會更努力。'
  },
  '被問不想回答的私事': {
    need: '保留私人資訊',
    gentle: '謝謝關心，這部分我想先留給自己。我們聊別的吧。',
    direct: '這是我的私事，我不想分享細節。',
    restate: '我知道你有好奇，但我仍不打算談這件事。',
    ifcontinue: '準備一個轉換話題的句子；若持續造成困擾，可考慮向適當的工作支持窗口詢問。'
  },
  '反覆詢問感情或婚育安排': {
    need: '自己決定何時分享個人安排',
    gentle: '我知道你關心我的生活，這部分有想分享的時候，我會主動說。',
    direct: '感情和婚育安排，我目前不想討論。',
    restate: '我的回答沒有改變，今天先不談這個話題。',
    ifcontinue: '可改聊其他話題；若現場適合，也可以暫時離開談話，讓自己喘口氣。'
  },
  '希望我答應每次聚會': {
    need: '自己安排時間與休息',
    gentle: '我很重視和大家相處，但這次需要休息，沒辦法參加。',
    direct: '這次聚會我不參加，請不用替我安排。',
    restate: '我知道你希望我到場，但這次的決定不變。我會在有餘裕時再安排見面。',
    ifcontinue: '如果你願意，可提出另一個可行時間；不需要為了拒絕而承諾做不到的替代方案。'
  },
  '未先詢問就動用我的物品': {
    need: '物品被使用前先徵求同意',
    gentle: '這個東西對我很重要，下次使用前可以先問我嗎？',
    direct: '請先得到我的同意，再使用我的物品。',
    restate: '即使是家人，我仍希望使用前先詢問。這個規則對我很重要。',
    ifcontinue: '在可行範圍內調整物品的收放方式，並再次說明哪些物品不能共用。'
  },
  '要求立刻回訊息': {
    need: '保有不即時回覆的時間',
    gentle: '我有時需要把手機放下，沒辦法立即回覆。等我有空時會再回你。',
    direct: '我不一定能即時回訊息，希望我們不要用回覆速度判斷彼此是否在乎。',
    restate: '我理解你希望快一點收到回覆，但我仍需要自己的時間。我會在方便時回覆。',
    ifcontinue: '若雙方願意，可以另找平靜的時間討論聯絡期待，而不是在催促中承諾隨時待命。'
  },
  '爭執時想先暫停': {
    need: '先平復再繼續討論',
    gentle: '我現在有點難整理想法，想先休息一下，再一起討論。',
    direct: '我需要先暫停這段對話，等狀態穩定後再談。',
    restate: '我不是要忽略這件事，但現在繼續談對我很吃力。我想先停下來，再確認何時繼續。',
    ifcontinue: '若安全且可行，可一起約定重新討論的時間；不要用暫停作為威脅或無限期懲罰。'
  },
  '需要獨處時間': {
    need: '在關係中保留自己的時間',
    gentle: '我喜歡和你相處，也需要一些自己安靜待著的時間。今天想先留一段時間給自己。',
    direct: '今天這段時間我想自己安排，之後再一起確認相處時間。',
    restate: '需要獨處不代表我不重視你；我仍希望保留這段自己的時間。',
    ifcontinue: '想清楚你希望保留的具體時段，讓對方理解安排，但不需要把每一分鐘都交代清楚。'
  },
  '借錢但我不願意': {
    need: '拒絕借款',
    gentle: '我知道你現在有困難，但這次我沒辦法借錢給你。',
    direct: '這筆借款我不會答應。',
    restate: '我理解你還有需要，但我的決定沒有改變，請另找其他方式。',
    ifcontinue: '如果你願意，可以陪對方找公開資源；不需要用金錢承諾證明友誼。'
  },
  '我沒有餘力繼續聽對方傾訴': {
    need: '尊重自己的精神與時間負荷',
    gentle: '我在意你，但今天沒有足夠的心力好好聽，想先休息。',
    direct: '我現在需要停下這段對話，沒辦法繼續聊。',
    restate: '我知道你還想說，但我今天能陪伴的時間到這裡了。',
    ifcontinue: '只有確實有餘裕時才約下一次；若對方需要更多支持，可一起了解其他資源。'
  },
  '不想接受邀約': {
    need: '拒絕這次邀請',
    gentle: '謝謝你想到我，但這次我想保留自己的時間，就不參加了。',
    direct: '這次邀約我不參加。',
    restate: '謝謝你再邀請我，但這次的決定不變，祝你們玩得開心。',
    ifcontinue: '如果願意再見面，可以主動提出其他安排；不必編造理由或答應不想參加的活動。'
  }
};


function renderBoundaryPage() {
  const isZh = lang === 'zh';
  const situations = {
    '職場': ['下班後收到非緊急訊息','臨時增加工作','被問不想回答的私事'],
    '家人': ['反覆詢問感情或婚育安排','希望我答應每次聚會','未先詢問就動用我的物品'],
    '伴侶': ['要求立刻回訊息','爭執時想先暫停','需要獨處時間'],
    '朋友': ['借錢但我不願意','我沒有餘力繼續聽對方傾訴','不想接受邀約']
  };
  
  let html = `<div class="tool-header">
    <button class="back-btn" onclick="showHome()">← ${isZh ? '返回' : 'Back'}</button>
    <h1>🚧 ${isZh ? '界線表達練習' : 'Boundary Expression'}</h1>
    <p class="tool-desc">${isZh ? '有些話很難開口，可以先在這裡練習。整理你的需求，找到比較像自己會說的方式。' : 'Some words are hard to say. Practice here first.'}</p>
  </div>
  <p style="color:var(--text-soft); margin-bottom:1.5rem;">${isZh ? '這是表達練習，不替你判斷誰對誰錯，也不能保證對方接受。你可以決定自己如何回應。' : 'This is practice. It does not judge who is right, and cannot guarantee the other person will accept.'}</p>
  
  <div style="background:var(--accent-light); padding:1rem; border-radius:8px; margin-bottom:1.5rem;">
    <h3 style="margin:0 0 0.5rem;">${isZh ? '怎麼使用' : 'How to use'}</h3>
    <ol style="margin:0; padding-left:1.2rem;">
      <li>${isZh ? '選一種關係與一個情境（也可以直接看全部範例）。' : 'Select a relationship and situation (or see all examples).'}</li>
      <li>${isZh ? '確認你想表達的需求，可以改成自己的話。' : 'Confirm the need you want to express.'}</li>
      <li>${isZh ? '看三種說法：溫和說明、簡短直接、再次重申；改成你的語氣，再複製帶走。' : 'See three styles, adjust to your tone, then copy.'}</li>
    </ol>
  </div>`;
  
  for (const [rel, sits] of Object.entries(situations)) {
    html += `<h2 style="margin-top:2rem; color:var(--accent-dark);">${rel}</h2>`;
    for (const sit of sits) {
      const p = boundaryPhrases[sit];
      if (!p) continue;
      html += `<div style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1rem; margin:1rem 0;">
        <h3 style="margin:0 0 0.5rem;">${sit}</h3>
        <p style="margin:0.5rem 0;"><strong>${isZh ? '需求' : 'Need'}：</strong>${p.need}</p>
        <p style="margin:0.5rem 0;"><strong>${isZh ? '溫和說明' : 'Gentle'}</strong><br>${p.gentle}</p>
        <p style="margin:0.5rem 0;"><strong>${isZh ? '簡短直接' : 'Direct'}</strong><br>${p.direct}</p>
        <p style="margin:0.5rem 0;"><strong>${isZh ? '再次重申' : 'Restate'}</strong><br>${p.restate}</p>
        <p style="margin:0.5rem 0; color:var(--text-soft);"><strong>${isZh ? '如果對方繼續要求，我可以…' : 'If they continue…'}</strong><br>${p.ifcontinue}</p>
      </div>`;
    }
  }
  
  html += `<p style="margin-top:2rem; color:var(--text-soft); font-size:0.9rem;">${isZh ? '表達界線不能保證對方接受。如果你擔心說出口會受到威脅或傷害，可以先暫停練習，尋求可信任的人或適當支持。' : 'Setting boundaries cannot guarantee acceptance. If you worry about safety, pause and seek support.'}</p>`;
  
  html += renderToolFAQ('boundary');
  return html;
}

function renderBoundaryPhrases() {
  const sit = answers.situation;
  if (!sit || !boundaryPhrases[sit]) return '';
  const p = boundaryPhrases[sit];
  return `<div class="boundary-examples" style="background:var(--accent-light); padding:1rem; border-radius:8px; margin:1rem 0;">
    <p style="margin:0 0 0.5rem; font-weight:500;">需求：${p.need}</p>
    <p style="margin:0.5rem 0;"><strong>溫和說明</strong><br>${p.gentle}</p>
    <p style="margin:0.5rem 0;"><strong>簡短直接</strong><br>${p.direct}</p>
    <p style="margin:0.5rem 0;"><strong>再次重申</strong><br>${p.restate}</p>
    <p style="margin:0.5rem 0; color:var(--text-soft);"><strong>如果對方繼續要求，我可以…</strong><br>${p.ifcontinue}</p>
  </div>`;
}

function renderWizard() {
  const tool = tools.find(t => t.id === currentTool);
  const content = document.getElementById('tool-content');
  if (!tool) return;

  if (currentTool === 'moodtracker') {
    content.innerHTML = `<div class="tool-header"><h1>${tool.icon || ''} ${tool[lang].name}</h1><p class="tool-desc">${tool[lang].desc}</p></div>` + renderMoodTracker();
    return;
  }
  if (['breathing','fivesenses','anger'].includes(currentTool)) {
    content.innerHTML = `<div class="tool-header"><h1>${tool.icon || ''} ${tool[lang].name}</h1><p class="tool-desc">${tool[lang].desc}</p></div>` + renderSpecial(currentTool);
    attachSpecial(currentTool);
    return;
  }

  const steps = getSteps(currentTool);
  if (!steps.length) {
    content.innerHTML = '<p>Coming soon</p>';
    return;
  }

  const step = steps[currentStep];
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  let html = showExample(currentTool) + (currentTool === 'boundary' && answers.situation ? renderBoundaryPhrases() : '') + (currentTool === 'bodycheck' && currentStep === 0 ? renderBodyMap() : '') + `
    <div class="tool-header">
      <h1>${tool.icon || ''} ${tool[lang].name}</h1>
      <p class="tool-desc" style="margin-top:0.3rem; color:var(--text-soft);">${tool[lang].desc}</p>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    <p class="step-indicator">${lang === 'zh' ? `第 ${currentStep + 1} / ${steps.length} 步` : `Step ${currentStep + 1} of ${steps.length}`}</p>
    <h2 style="font-size:1.3rem; margin:1rem 0;">${step.title}</h2>
    ${step.explain ? `<p class="explain" style="color:var(--text-soft); font-size:0.95rem; margin:-0.3rem 0 0.5rem; line-height:1.5;">${step.explain}</p>` : ''}
    ${step.hint ? `<p class="hint" style="color:var(--text-soft); font-size:0.9rem; margin:0 0 1rem; font-style:italic;">${step.hint}</p>` : ''}
  `;

  if (step.type === 'text') {
    html += `<textarea id="step-input" rows="4" placeholder="${step.placeholder || ''}">${answers[step.key] || ''}</textarea>`;
  } else if (step.type === 'multi' || step.type === 'single') {
    const selected = answers[step.key] || (step.type === 'multi' ? [] : '');
    html += `<div class="options" id="step-options">`;
    step.options.forEach(opt => {
      const isSel = step.type === 'multi' ? selected.includes(opt) : selected === opt;
      html += `<button type="button" class="option-btn ${isSel ? 'selected' : ''}" data-value="${opt}">${opt}</button>`;
    });
    html += `</div>`;
  }

  html += `<div class="actions" style="margin-top:1.5rem;">`;
  if (currentStep > 0) html += `<button class="btn secondary" onclick="prevStep()">${t('backStep')}</button>`;
  if (currentStep < steps.length - 1) html += `<button class="btn" onclick="nextStep()">${t('next')}</button>`;
  else html += `<button class="btn" onclick="finishWizard()">${t('finish')}</button>`;
  html += `</div><div id="result" class="card-result" style="display:none;"></div>`;

  content.innerHTML = html;

  // Restore selections
  document.querySelectorAll('#step-options .option-btn').forEach(btn => {
    btn.onclick = () => {
      const val = btn.dataset.value;
      if (step.type === 'single') {
        document.querySelectorAll('#step-options .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[step.key] = val;
      } else {
        let arr = answers[step.key] || [];
        if (arr.includes(val)) arr = arr.filter(v => v !== val);
        else if (arr.length < (step.max || 99)) arr.push(val);
        answers[step.key] = arr;
        document.querySelectorAll('#step-options .option-btn').forEach(b => {
          b.classList.toggle('selected', arr.includes(b.dataset.value));
        });
      }
    };
  });
}

function nextStep() {
  const steps = getSteps(currentTool);
  const step = steps[currentStep];
  if (step.type === 'text') {
    answers[step.key] = document.getElementById('step-input').value.trim();
  }
  currentStep++;
  renderWizard();
}

function prevStep() {
  currentStep = Math.max(0, currentStep - 1);
  renderWizard();
}

function finishWizard() {
  const steps = getSteps(currentTool);
  const step = steps[currentStep];
  if (step.type === 'text') {
    answers[step.key] = document.getElementById('step-input').value.trim();
  }
  const text = buildCard(currentTool, answers);
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.textContent = text;
  addCopyPrint(result);
  document.querySelector('.actions').style.display = 'none';
}

function buildCard(id, a) {
  const isZh = lang === 'zh';
  if (id === 'feelings') {
    return (isZh ? '情緒與需要整理卡\n\n' : 'Feelings & Needs Card\n\n') +
      (isZh ? '我記下的事情：' : 'What I noted: ') + (a.what || '—') + '\n' +
      (isZh ? '我注意到的感受：' : 'Feelings: ') + ((a.feelings || []).join('、') || '—') + '\n' +
      (isZh ? '我現在可能需要：' : 'Needs: ') + ((a.needs || []).join('、') || '—') + '\n' +
      (isZh ? '我願意先試的一件事：' : 'One thing to try: ') + (a.try || '—');
  }
  if (id === 'worry') {
    return (isZh ? '擔心整理＋擔心時間\n\n' : 'Worry Sorter\n\n') + (a.worries || '—') + '\n\n' +
      (isZh ? '行動傾向：' : 'Action tendency: ') + (a.action || '—');
  }
  if (id === 'compassion') {
    return (isZh ? '自我同理\n\n' : 'Self-Compassion\n\n') +
      (isZh ? '原本的話：\n' : 'Original:\n') + (a.harsh || '—') + '\n\n' +
      (isZh ? '對朋友會說：\n' : 'To a friend:\n') + (a.kind || '—');
  }
  if (id === 'gratitude') {
    const items = [a.g1, a.g2, a.g3].filter(Boolean);
    return (isZh ? '感恩日記\n\n' : 'Gratitude Journal\n\n') + items.map((it, i) => `${i + 1}. ${it}`).join('\n') || '—';
  }
  if (id === 'thoughtcheck') {
    return (isZh ? '想法核對練習\n\n' : 'Thought Check\n\n') +
      (isZh ? '想法：' : 'Thought: ') + (a.thought || '—') + '\n\n' +
      (isZh ? '支持：\n' : 'Supporting:\n') + (a.for || '—') + '\n\n' +
      (isZh ? '不支持：\n' : 'Against:\n') + (a.against || '—') + '\n\n' +
      (isZh ? '更平衡：' : 'Balanced: ') + (a.balanced || '—');
  }
  if (id === 'boundary') {
    return (isZh ? '界線表達練習\n\n' : 'Boundary Expression\n\n') +
      (isZh ? '界線：' : 'Boundary: ') + (a.boundary || '—') + '\n' +
      (isZh ? '可以這樣說：\n' : 'Phrasing:\n') + (a.phrase || '—');
  }
  if (id === 'convo') {
    return (isZh ? '對話前整理紙\n\n' : 'Conversation Prep\n\n') +
      (isZh ? '對象：' : 'With: ') + (a.who || '—') + '\n' +
      (isZh ? '目的：' : 'Goal: ') + (a.goal || '—') + '\n\n' +
      (isZh ? '重點：\n' : 'Key points:\n') + (a.points || '—');
  }
  if (id === 'smallstep') {
    return (isZh ? '把事情拆成第一小步\n\n' : 'First Small Step\n\n') +
      (isZh ? '大目標：' : 'Bigger goal: ') + (a.big || '—') + '\n' +
      (isZh ? '最小一步：' : 'Smallest step: ') + (a.small || '—');
  }
  if (id === 'decision') {
    return (isZh ? '選擇比較\n\n' : 'Decision Comparison\n\n') +
      `【${a.optA || 'A'}】\n${a.aPros || '—'}\n\n【${a.optB || 'B'}】\n${a.bPros || '—'}`;
  }
  if (id === 'values') {
    return (isZh ? '我現在最在意：\n' : 'What matters most:\n') + ((a.values || []).join('\n') || '—');
  }
  if (id === 'supportcard') {
    return (isZh ? '我的支持資源卡\n\n' : 'Support Resource Card\n\n') +
      (isZh ? '人：\n' : 'People:\n') + (a.people || '—') + '\n\n' +
      (isZh ? '其他資源：\n' : 'Other:\n') + (a.resources || '—');
  }

  if (id === 'tasksep') {
    return (isZh ? '課題分離整理器\n\n' : 'What is Mine to Handle\n\n') +
      (isZh ? '情況：' : 'Situation: ') + (a.situation || '—') + '\n\n' +
      (isZh ? '我的課題：\n' : 'Mine:\n') + (a.mine || '—') + '\n\n' +
      (isZh ? '不是我的：\n' : 'Not mine:\n') + (a.notmine || '—');
  }
  if (id === 'repair') {
    return (isZh ? '衝突後關係修復卡\n\n' : 'Conflict Repair\n\n') +
      (isZh ? '先做的一步：' : 'First step: ') + (a.step || '—') + '\n' +
      (isZh ? '可以這樣說：\n' : 'Phrasing:\n') + (a.phrase || '—');
  }
  if (id === 'goodenough') {
    return (isZh ? '夠好就好標準卡\n\n' : 'Good-Enough Standard\n\n') +
      (isZh ? '任務：' : 'Task: ') + (a.task || '—') + '\n' +
      (isZh ? '夠好的標準：\n' : 'Good enough:\n') + (a.standard || '—') + '\n' +
      (isZh ? '可以停的點：' : 'Stop when: ') + (a.stop || '—');
  }
  if (id === 'phone') {
    return (isZh ? '手機滑不停暫停計畫\n\n' : 'Phone Pause Plan\n\n') +
      (isZh ? '容易滑的時機：' : 'Trigger: ') + (a.trigger || '—') + '\n' +
      (isZh ? '暫停規則：' : 'Rule: ') + (a.rule || '—') + '\n' +
      (isZh ? '替代行動：' : 'Instead: ') + (a.alt || '—');
  }
  if (id === 'problemsolve') {
    return (isZh ? '問題解決五步驟\n\n' : 'Problem Solving\n\n') +
      (isZh ? '問題：' : 'Problem: ') + (a.problem || '—') + '\n\n' +
      (isZh ? '可能解法：\n' : 'Solutions:\n') + (a.solutions || '—') + '\n\n' +
      (isZh ? '先試：' : 'Try first: ') + (a.first || '—') + '\n' +
      (isZh ? '時間：' : 'When: ') + (a.when || '—');
  }
  if (id === 'selfbreak') {
    return (isZh ? '自我同理休息\n\n' : 'Self-Compassion Break\n\n') +
      '1. ' + (a.p1 || '—') + '\n2. ' + (a.p2 || '—') + '\n3. ' + (a.p3 || '—');
  }
  if (id === 'bodycheck') {
    return (isZh ? '身體覺察地圖\n\n' : 'Body Awareness\n\n') +
      (isZh ? '有感覺的部位：' : 'Areas: ') + ((a.areas || []).join('、') || '—') + '\n' +
      (isZh ? '描述：' : 'Description: ') + (a.sensation || '—');
  }
  if (id === 'sleep') {
    const steps = a.steps || [];
    return (isZh ? '今晚睡前流程\n\n' : 'Tonight\'s Wind-Down\n\n') + steps.map((s,i) => `${i+1}. ${s}`).join('\n') || '—';
  }
  if (id === 'counselprep') {
    return (isZh ? '第一次諮商準備包\n\n' : 'Counseling Prep\n\n') +
      (isZh ? '想談的：\n' : 'Topics:\n') + (a.topics || '—') + '\n\n' +
      (isZh ? '最困擾：' : 'Main concern: ') + (a.main || '—') + '\n' +
      (isZh ? '其他：' : 'Other: ') + (a.note || '—');
  }

  return '—';
}

function renderSpecial(id) {
  if (id === 'breathing') {
    return `<p style="text-align:center; color:var(--text-soft); margin-bottom:1rem;">${lang==='zh'?'找一個舒服的姿勢，跟著圓圈和文字慢慢呼吸。':'Find a comfortable position and follow the circle and text.'}</p><div style="text-align:center"><div class="breathing-circle" id="breathCircle">${lang==='zh'?'準備':'Ready'}</div><div class="timer-display" id="breathTimer">4:00</div><div class="actions" style="justify-content:center"><button class="btn" id="startBreath">${lang==='zh'?'開始':'Start'}</button><button class="btn secondary" id="stopBreath">${lang==='zh'?'停止':'Stop'}</button></div><p class="note">${lang==='zh'?'吸氣 4 秒 → 停留 4 秒 → 呼氣 4 秒 → 停留 4 秒':'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s'}</p></div>`;
  }
  if (id === 'fivesenses') {
    return `<p style="text-align:center; color:var(--text-soft); margin-bottom:1rem;">${lang==='zh'?'慢慢來，每一步都可以停一下再繼續。':'Take your time. You can pause between steps.'}</p><div id="senses-steps"><p id="sense-prompt" style="font-size:1.2rem;text-align:center;min-height:4rem;"></p><div class="actions" style="justify-content:center"><button class="btn" id="nextSense">${lang==='zh'?'下一步':'Next'}</button></div></div>`;
  }
  if (id === 'anger') {
    return `<p style="text-align:center; color:var(--text-soft); margin-bottom:1rem;">${lang==='zh'?'這60秒什麼都不用做，只是暫停。':'For these 60 seconds, do nothing. Just pause.'}</p><div style="text-align:center"><div class="timer-display" id="angerTimer">1:00</div><p>${lang==='zh'?'先暫停 60 秒，什麼都先不要做。':'Pause for 60 seconds. Do nothing else.'}</p><div class="actions" style="justify-content:center"><button class="btn" id="startAnger">${lang==='zh'?'開始暫停':'Start Pause'}</button></div></div>`;
  }
  return '';
}

function attachSpecial(id) {
  if (id === 'breathing') {
    let interval, phase = 0, remaining = 240;
    const phases = lang==='zh' ? ['吸氣','停留','呼氣','停留'] : ['Inhale','Hold','Exhale','Hold'];
    const circle = document.getElementById('breathCircle');
    const timerEl = document.getElementById('breathTimer');
    document.getElementById('startBreath').onclick = () => {
      if (interval) clearInterval(interval);
      remaining = 240; phase = 0;
      interval = setInterval(() => {
        remaining--;
        const m = Math.floor(remaining/60), s = remaining%60;
        timerEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
        circle.textContent = phases[phase%4];
        circle.classList.toggle('expand', phase%4===0 || phase%4===2);
        if (remaining%4===0) phase++;
        if (remaining<=0) clearInterval(interval);
      }, 1000);
    };
    document.getElementById('stopBreath').onclick = () => { clearInterval(interval); circle.textContent = lang==='zh'?'已停止':'Stopped'; };
  }
  if (id === 'fivesenses') {
    const steps = lang==='zh'
      ? ['說出 5 個你看到的東西','說出 4 個你摸得到的東西','說出 3 個你聽得到的聲音','說出 2 個你聞得到的氣味','說出 1 個你嚐得到的味道','完成。慢慢回到當下。']
      : ['Name 5 things you can see','Name 4 things you can touch','Name 3 things you can hear','Name 2 things you can smell','Name 1 thing you can taste','Done. Gently return to the present.'];
    let idx = 0;
    const prompt = document.getElementById('sense-prompt');
    prompt.textContent = steps[0];
    document.getElementById('nextSense').onclick = () => {
      idx++;
      if (idx < steps.length) prompt.textContent = steps[idx];
      else document.getElementById('nextSense').style.display = 'none';
    };
  }
  if (id === 'anger') {
    document.getElementById('startAnger').onclick = () => {
      let t = 60;
      const el = document.getElementById('angerTimer');
      const iv = setInterval(() => {
        t--;
        el.textContent = `0:${t.toString().padStart(2,'0')}`;
        if (t<=0) { clearInterval(iv); el.textContent = lang==='zh'?'時間到':'Time\'s up'; }
      }, 1000);
    };
  }
}

function addCopyPrint(resultEl) {
  if (resultEl.nextElementSibling && resultEl.nextElementSibling.classList.contains('actions')) return;
  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `<button class="btn secondary" onclick="copyResult(this)">${t('copy')}</button><button class="btn secondary" onclick="window.print()">${t('print')}</button>`;
  resultEl.after(actions);
}

function copyResult(btn) {
  const text = btn.closest('.actions').previousElementSibling.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = t('copied');
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

// Progress bar styles injected
const style = document.createElement('style');
style.textContent = `
.progress-bar { height: 6px; background: var(--border); border-radius: 3px; margin: 1rem 0; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; }
.step-indicator { color: var(--text-soft); font-size: 0.9rem; margin: 0; }
`;
document.head.appendChild(style);


// Call on init




// Mood Tracker
function renderMoodTracker() {
  const moods = JSON.parse(localStorage.getItem('moodspace-moods') || '[]');
  const today = new Date().toISOString().slice(0, 10);
  const todayMood = moods.find(m => m.date === today);
  
  const moodOptions = [
    { emoji: '😊', label: lang === 'zh' ? '不錯' : 'Good', value: 4 },
    { emoji: '😌', label: lang === 'zh' ? '平靜' : 'Calm', value: 3 },
    { emoji: '😐', label: lang === 'zh' ? '普通' : 'Okay', value: 2 },
    { emoji: '😔', label: lang === 'zh' ? '低落' : 'Low', value: 1 },
    { emoji: '😰', label: lang === 'zh' ? '焦慮' : 'Anxious', value: 1 }
  ];
  
  let html = '<div class="mood-tracker">';
  
  // Today's entry
  html += `<h3 style="margin-bottom:0.8rem;">${lang === 'zh' ? '今天的心情' : 'Today\'s mood'}</h3>`;
  html += '<div class="mood-options" style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">';
  moodOptions.forEach(m => {
    const selected = todayMood && todayMood.value === m.value && todayMood.emoji === m.emoji ? 'selected' : '';
    html += `<button class="option-btn ${selected}" onclick="logMood('${m.emoji}', ${m.value}, '${m.label}')" style="font-size:1.2rem; padding:0.6rem 1rem;">${m.emoji}<br><span style="font-size:0.75rem;">${m.label}</span></button>`;
  });
  html += '</div>';
  
  if (todayMood) {
    html += `<p style="color:var(--accent); font-size:0.9rem;">${lang === 'zh' ? '已記錄：' : 'Logged: '} ${todayMood.emoji} ${todayMood.label}</p>`;
  }
  
  // Week view
  html += `<h3 style="margin:1.5rem 0 0.8rem;">${lang === 'zh' ? '這一週' : 'This week'}</h3>`;
  html += '<div class="week-view" style="display:flex; gap:0.4rem; justify-content:space-between;">';
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayMood = moods.find(m => m.date === dateStr);
    const dayLabel = d.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en', { weekday: 'short' });
    html += `<div style="text-align:center; flex:1;">
      <div style="font-size:0.75rem; color:var(--text-soft);">${dayLabel}</div>
      <div style="font-size:1.5rem; margin:0.3rem 0;">${dayMood ? dayMood.emoji : '·'}</div>
      <div style="font-size:0.7rem; color:var(--text-soft);">${d.getDate()}</div>
    </div>`;
  }
  html += '</div>';
  
  // Note
  html += `<p style="margin-top:1.5rem; font-size:0.85rem; color:var(--text-soft);">${lang === 'zh' ? '資料只存在你的瀏覽器，不會上傳。清除瀏覽器資料會一併清除紀錄。' : 'Data stays in your browser only. Clearing browser data will remove the log.'}</p>`;
  
  html += '</div>';
  return html;
}

function logMood(emoji, value, label) {
  const moods = JSON.parse(localStorage.getItem('moodspace-moods') || '[]');
  const today = new Date().toISOString().slice(0, 10);
  
  // Remove existing entry for today
  const filtered = moods.filter(m => m.date !== today);
  filtered.push({ date: today, emoji, value, label });
  
  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const recent = filtered.filter(m => new Date(m.date) >= cutoff);
  
  localStorage.setItem('moodspace-moods', JSON.stringify(recent));
  renderWizard();
}



// Guided entry
const guidedQuestions = {
  zh: [
    {
      q: '現在最接近的狀態是？',
      options: [
        { text: '情緒有些亂，想整理一下', tags: ['emotions'] },
        { text: '有話想說，但不知道怎麼開口', tags: ['communication'] },
        { text: '事情很多，不知道從哪開始', tags: ['actions'] },
        { text: '只想先停一下，不想寫字', tags: ['pause'] },
        { text: '想準備求助或看診', tags: ['help'] }
      ]
    },
    {
      q: '更具體一點？',
      options: [
        { text: '擔心或想法一直轉', tags: ['worry', 'thoughtcheck'] },
        { text: '對自己很嚴厲', tags: ['compassion', 'selfbreak'] },
        { text: '想設定界線或準備對話', tags: ['boundary', 'convo'] },
        { text: '有件事一直沒開始', tags: ['smallstep', 'tasksorter'] },
        { text: '身體很緊或不舒服', tags: ['bodycheck', 'pmr', 'breathing'] },
        { text: '不確定，讓我看看全部', tags: [] }
      ]
    }
  ],
  en: [
    {
      q: 'What feels closest right now?',
      options: [
        { text: 'Emotions feel messy, want to sort them', tags: ['emotions'] },
        { text: 'Have something to say but don\'t know how', tags: ['communication'] },
        { text: 'Too many things, don\'t know where to start', tags: ['actions'] },
        { text: 'Just want to pause, no writing', tags: ['pause'] },
        { text: 'Want to prepare for help or a visit', tags: ['help'] }
      ]
    },
    {
      q: 'A bit more specific?',
      options: [
        { text: 'Worries or thoughts keep looping', tags: ['worry', 'thoughtcheck'] },
        { text: 'Being hard on myself', tags: ['compassion', 'selfbreak'] },
        { text: 'Want to set a boundary or prepare a talk', tags: ['boundary', 'convo'] },
        { text: 'Something I keep not starting', tags: ['smallstep', 'tasksorter'] },
        { text: 'Body feels tense or uncomfortable', tags: ['bodycheck', 'pmr', 'breathing'] },
        { text: 'Not sure, show me everything', tags: [] }
      ]
    }
  ]
};

let guidedStep = 0;
let guidedTags = [];

function renderGuided() {
  const container = document.getElementById('guided-content');
  if (!container) return;
  
  const questions = guidedQuestions[lang];
  
  if (guidedStep >= questions.length) {
    const recommended = getRecommendedTools();
    let html = `<div class="guided-result"><h3>${lang === 'zh' ? '這些可能適合你：' : 'These might fit:'}</h3>`;
    recommended.forEach(tool => {
      html += `<a href="#" class="tool-link" onclick="event.preventDefault(); openTool('${tool.id}')">${tool.icon || ''} ${tool[lang].name}</a>`;
    });
    html += `<p style="margin-top:0.8rem; font-size:0.9rem;"><a href="#" onclick="event.preventDefault(); resetGuided()" style="color:var(--accent);">${lang === 'zh' ? '重新選擇' : 'Start over'}</a></p></div>`;
    container.innerHTML = html;
    return;
  }
  
  const q = questions[guidedStep];
  let html = `<p style="font-weight:500; margin-bottom:0.8rem;">${q.q}</p><div class="options">`;
  q.options.forEach((opt, i) => {
    html += `<button class="option-btn" onclick="selectGuided(${i})">${opt.text}</button>`;
  });
  html += '</div>';
  if (guidedStep > 0) {
    html += `<p style="margin-top:0.5rem;"><a href="#" onclick="event.preventDefault(); guidedStep--; renderGuided()" style="color:var(--text-soft); font-size:0.9rem;">${lang === 'zh' ? '← 上一步' : '← Back'}</a></p>`;
  }
  container.innerHTML = html;
}

function selectGuided(index) {
  const questions = guidedQuestions[lang];
  const opt = questions[guidedStep].options[index];
  guidedTags = guidedTags.concat(opt.tags);
  guidedStep++;
  renderGuided();
}

function getRecommendedTools() {
  if (guidedTags.length === 0) {
    return tools.filter(t => ['feelings', 'worry', 'smallstep', 'breathing'].includes(t.id)).slice(0, 4);
  }
  
  const scored = tools.map(tool => {
    let score = 0;
    if (guidedTags.includes(tool.cat)) score += 2;
    if (guidedTags.includes(tool.id)) score += 3;
    return { tool, score };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  
  return scored.slice(0, 4).map(s => s.tool);
}

function resetGuided() {
  guidedStep = 0;
  guidedTags = [];
  renderGuided();
}



// Example cards
const examples = {
  thoughtcheck: { zh: '發生的事：週一會議上，主管說報告要重做一部分\n當下的想法：我一定又搞砸了\n支持的線索：報告確實有一段要重寫\n不太支持的線索：主管只點出其中一段；上個月的報告他說做得很清楚\n比較完整的看法：這次有一段需要修改，不代表我整體能力不夠', en: 'Event: Manager said report needs partial rework\nThought: I must have messed up\nSupporting: One section needs rewrite\nAgainst: Manager only pointed out one section; last month he said it was clear\nBalanced: One section needs work, does not mean I am not capable' },
  compassion: { zh: '原本的話：你怎麼又拖到最後一刻，真的很沒用\n遇到的困難：這週有三個截止日，晚上又睡不好\n我需要：休息、多一點時間\n新的說法：這週真的很多，我已經盡力了。拖到現在不代表我沒用\n小行動：今天先完成最急的那一份', en: 'Harsh: Why did you leave it to the last minute\nDifficulty: Three deadlines this week, poor sleep\nNeed: Rest, more time\nNew: This week was a lot, I did my best\nAction: Finish the most urgent one today' },
  goodenough: { zh: '這件事：週五要交的企劃簡報\n目的：讓團隊了解進度\n一定要有：目標、進度、下一步\n有很好沒有也可以：精美的圖表\n停手：到一個時間就停', en: 'Task: Friday presentation\nPurpose: Update the team\nMust have: goal, progress, next step\nNice to have: polished charts\nStop: at a set time' },
  convo: { zh: '主題：共同空間的整理安排\n注意到：這週有幾次餐具留在桌上\n影響：想用桌子前要先整理，覺得有點困擾\n討論：能否約定收拾的時間\n開場：我想和你討論一下桌面的使用，現在方便嗎？', en: 'Topic: shared space cleanup\nNoticed: dishes left several times\nImpact: have to clear table first, a bit bothered\nDiscuss: can we agree on cleanup time\nOpening: I want to discuss the table, is now okay?' },
  askhelp: { zh: '類型：聽我說\n對象：朋友\n內容：最近有些事想說\n溫和說法：我最近有些事想說，想找人聽一聽。你方便找個時間聊一下嗎？', en: 'Type: listen\nWho: friend\nWhat: some things I want to talk about\nGentle: I have some things I want to talk about. Do you have time to chat?' },
  repair: { zh: '發生的事：我們為了週末安排起爭執\n影響：之後沒再說話\n我負責的：我提高了音量\n不由我決定的：對方的感受\n我能做的：傳一句「我需要一點時間」', en: 'What happened: we argued about weekend\nImpact: stopped talking\nMy part: I raised my voice\nNot mine: their feelings\nI can do: send "I need some time"' },
  problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: { zh: '已知：晚上九點傳的訊息，到十一點還沒回\n猜測：他是不是不想理我\n想做的反應：一直傳訊息、反覆查看\n其他做法：先等一小時、先照顧自己\n決定：先去洗澡，明天再看', en: 'Known: sent at 9pm, no reply by 11pm\nGuess: does he not want to talk\nUrge: keep messaging, keep checking\nOther: wait an hour, care for myself\nDecide: shower first, check tomorrow' },
  phone: { zh: '情況：睡前滑不停\n原本想做：查一個資料\n停下提示：看完這一則\n放下後：把手機翻面放桌上', en: 'Situation: scroll before bed\nWanted: look something up\nStop cue: after this one\nAfter: place phone face down' },
  smallstep: { zh: '我想處理：整理房間\n卡在：太大了\n第一小步：先整理桌面的一個角落\n開始時機：晚餐後\n做到這裡先停：桌面清出可以放筆電的空間', en: 'Task: tidy the room\nStuck: too big\nFirst step: tidy one corner of the desk\nWhen: after dinner\nStop: when there is space for laptop' },
  tasksep: { zh: '事件：家人希望我每週末都回家，但我也需要休息\n我能決定：先確認這個月自己有空的週末\n由對方決定：家人是否喜歡我的安排\n需要一起協商：探望頻率與其他聯絡方式\n我願意做的：先提出這個月可以回家的日期', en: 'Event: Family wants me home every weekend, but I need rest\nI can decide: Check which weekends I am free\nThey decide: Whether they like my arrangement\nNegotiate: Visit frequency and other contact\nI will do: Propose dates I can come home' },
  feelings: { zh: '我記下的事情：原本的安排臨時改變\n我注意到的感受：失望、困惑\n我現在可能需要：更清楚的資訊\n我願意先試的一件事：先確認新的安排', en: 'What happened: Plans changed suddenly\nFeelings: disappointed, confused\nNeed: clearer information\nWilling to try: confirm the new arrangement' },
  worry: { zh: '擔心：明天會議會不會出錯\n可以行動：準備議程、提早到\n先放著：如果大家覺得我說得不好\n擔心時間：每天晚上八點，十分鐘', en: 'Worry: What if the meeting goes badly\nCan act: prepare agenda, arrive early\nPark: What if people think I spoke poorly\nWorry time: 8 pm daily, 10 minutes' },
  compassion: { zh: '嚴厲的話：我怎麼又搞砸了\n遇到的困難：工作量突然增加\n對朋友會說：你已經盡力了，這次真的很多', en: 'Harsh: I messed up again\nDifficulty: workload suddenly increased\nTo a friend: You did your best, this was a lot' },
  convo: { zh: '主題：共同空間的整理安排\n注意到：這週有幾次餐具留在桌上\n影響：想用桌子前要先整理，覺得有點困擾\n討論：能否約定收拾的時間\n開場：我想和你討論一下桌面的使用，現在方便嗎？', en: 'Topic: shared space cleanup\nNoticed: dishes left several times\nImpact: have to clear table first, a bit bothered\nDiscuss: can we agree on cleanup time\nOpening: I want to discuss the table, is now okay?' },
  askhelp: { zh: '類型：聽我說\n對象：朋友\n內容：最近有些事想說\n溫和說法：我最近有些事想說，想找人聽一聽。你方便找個時間聊一下嗎？', en: 'Type: listen\nWho: friend\nWhat: some things I want to talk about\nGentle: I have some things I want to talk about. Do you have time to chat?' },
  repair: { zh: '發生的事：我們為了週末安排起爭執\n影響：之後沒再說話\n我負責的：我提高了音量\n不由我決定的：對方的感受\n我能做的：傳一句「我需要一點時間」', en: 'What happened: we argued about weekend\nImpact: stopped talking\nMy part: I raised my voice\nNot mine: their feelings\nI can do: send "I need some time"' },
  problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: { zh: '已知：晚上九點傳的訊息，到十一點還沒回\n猜測：他是不是不想理我\n想做的反應：一直傳訊息、反覆查看\n其他做法：先等一小時、先照顧自己\n決定：先去洗澡，明天再看', en: 'Known: sent at 9pm, no reply by 11pm\nGuess: does he not want to talk\nUrge: keep messaging, keep checking\nOther: wait an hour, care for myself\nDecide: shower first, check tomorrow' },
  phone: { zh: '情況：睡前滑不停\n原本想做：查一個資料\n停下提示：看完這一則\n放下後：把手機翻面放桌上', en: 'Situation: scroll before bed\nWanted: look something up\nStop cue: after this one\nAfter: place phone face down' },
  smallstep: { zh: '想做的事：整理房間\n卡在：太大了不知道從哪開始\n最小一步：先整理桌面的一個角落', en: 'Big thing: tidy the room\nStuck: too big, don\'t know where to start\nSmallest step: just tidy one corner of the desk' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  boundary: { 
    zh: '【職場・下班後收到非緊急訊息】\n需求：保留下班後的休息時間\n\n溫和說明：我看到訊息了。這件事如果不是緊急狀況，我會在下一個工作時段回覆。\n\n簡短直接：非緊急工作訊息，我會在工作時間處理。\n\n再次重申：我理解你希望盡快確認；我仍會在下一個工作時段處理。',
    en: '[Work · Non-urgent messages after work]\nNeed: Keep rest time after work\n\nGentle: I saw the message. If it is not urgent, I will reply during the next work period.\n\nDirect: Non-urgent work messages, I will handle during work hours.\n\nRestate: I understand you want confirmation soon; I will still handle it during the next work period.'
  }
};

function showExample(toolId) {
  const ex = examples[toolId];
  if (!ex) return '';
  const text = ex[lang] || ex.zh;
  return `<details style="margin-top:1rem;"><summary style="cursor:pointer; color:var(--accent); font-size:0.9rem;">${lang === 'zh' ? '查看範例' : 'See example'}</summary><pre style="background:var(--accent-light); padding:0.8rem; border-radius:6px; font-size:0.85rem; white-space:pre-wrap; margin-top:0.5rem;">${text}</pre></details>`;
}



// Boundary expression phrases from original




// Enhanced breathing
let breathInterval = null;
function startBreathing() {
  const inhale = parseInt(document.getElementById('inhale-sec')?.value) || 4;
  const exhale = parseInt(document.getElementById('exhale-sec')?.value) || 4;
  const circle = document.getElementById('breath-circle');
  const status = document.getElementById('breath-status');
  if (!circle) return;
  
  let phase = 'inhale';
  let count = inhale;
  
  function tick() {
    if (phase === 'inhale') {
      circle.textContent = '吸氣';
      circle.style.transform = 'scale(1.2)';
      status.textContent = count + ' 秒';
      count--;
      if (count < 0) { phase = 'exhale'; count = exhale; }
    } else {
      circle.textContent = '吐氣';
      circle.style.transform = 'scale(1)';
      status.textContent = count + ' 秒';
      count--;
      if (count < 0) { phase = 'inhale'; count = inhale; }
    }
  }
  
  tick();
  breathInterval = setInterval(tick, 1000);
}

function stopBreathing() {
  if (breathInterval) clearInterval(breathInterval);
  const circle = document.getElementById('breath-circle');
  const status = document.getElementById('breath-status');
  if (circle) { circle.textContent = '準備'; circle.style.transform = 'scale(1)'; }
  if (status) status.textContent = '已停止';
}

// Five senses navigation
function nextSense() {
  window.senseStep = (window.senseStep || 0) + 1;
  if (window.senseStep >= window.senses.length) {
    document.getElementById('sense-display').innerHTML = '<p style="font-size:1.2rem;">完成了。慢慢回到當下。</p>';
    return;
  }
  const s = window.senses[window.senseStep];
  document.getElementById('sense-display').innerHTML = `
    <div style="font-size:3rem; font-weight:300; color:var(--accent);">${s.n}</div>
    <p style="font-size:1.2rem; margin:0.5rem 0;">${s.label}</p>
    <p style="color:var(--text-soft);">${s.hint}</p>`;
}

function skipSense() { nextSense(); }



// Glossary
const glossary = [
  { term: '認知扭曲', def: '常見的思考習慣，會讓我們對事件做出偏離現實的解讀。例如全有或全無、過度概括、災難化。' },
  { term: '正念', def: '有意識地、不加評判地注意當下的經驗。不是要放空，而是覺察正在發生的事。' },
  { term: '自我同理', def: '對自己的困難給予理解和善意，而不是批評。想像你會怎麼對好朋友說話。' },
  { term: '界線', def: '清楚表達自己的需要和限度。不是要控制別人，而是讓對方知道你的立場。' },
  { term: '課題分離', def: '分辨哪些是自己能決定的，哪些是別人的事。不是冷漠，而是把精力放在能負責的部分。' },
  { term: '焦慮', def: '對未來可能發生的事感到擔心或不安。身體可能會有心跳加速、肌肉緊繃等反應。' },
  { term: '憂鬱', def: '持續的低落、失去興趣、疲倦。如果超過兩週並影響生活，可以考慮尋求專業協助。' },
  { term: '觸發', def: '某些情境、話語或記憶引起強烈情緒反應。不是軟弱，是過去經驗的影響。' },
  { term: '接地', def: '用感官把注意力帶回當下。例如五感練習、感受腳踩在地上的感覺。' },
  { term: '情緒調節', def: '覺察情緒、理解它、並選擇如何回應。不是壓抑，而是給自己空間。' }
];

function renderGlossary() {
  const container = document.getElementById('glossary-content');
  if (!container) return;
  let html = '<div style="display:grid; gap:1rem;">';
  glossary.forEach(g => {
    html += `<div style="background:var(--surface); padding:1rem; border-radius:8px; border:1px solid var(--border);">
      <h3 style="margin:0 0 0.5rem; color:var(--accent-dark);">${g.term}</h3>
      <p style="margin:0; color:var(--text-soft);">${g.def}</p>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// Resources
function renderResources() {
  const container = document.getElementById('resources-content');
  if (!container) return;
  container.innerHTML = `
    <div class="category">
      <h2>緊急與危機支援</h2>
      <ul>
        <li><strong>999</strong> — 緊急求助（警察、救護、消防）</li>
        <li><strong>情緒通 18111</strong> — 24 小時心理支援專線（醫院管理局）</li>
        <li><strong>撒瑪利亞防止自殺會 2896 0000</strong> — 24 小時</li>
        <li><strong>生命熱線 2382 0000</strong> — 24 小時</li>
        <li><strong>明愛向晴軒 18288</strong> — 24 小時</li>
      </ul>
    </div>
    <div class="category" style="margin-top:1rem;">
      <h2>輔導與精神健康服務</h2>
      <ul>
        <li><strong>社會福利署熱線 2343 2255</strong></li>
        <li><strong>醫院管理局精神健康專線 2466 7350</strong></li>
        <li><strong>綜合家庭服務中心</strong> — 各區社署或非政府機構</li>
        <li><strong>私營輔導</strong> — 可向註冊社工、臨床心理學家查詢</li>
      </ul>
    </div>
    <div class="category" style="margin-top:1rem;">
      <h2>補助與支援</h2>
      <ul>
        <li><strong>關愛基金</strong> — 部分輔導服務有資助</li>
        <li><strong>僱員再培訓局</strong> — 部分課程涵蓋心理健康</li>
        <li><strong>學校社工</strong> — 學生可透過學校轉介</li>
      </ul>
      <p style="font-size:0.85rem; color:var(--text-soft); margin-top:0.5rem;">資訊可能變動，申請前請向相關機構確認資格與程序。</p>
    </div>
  `;
}

function showSection(section) {
  document.getElementById('home-view').style.display = section === 'home' ? 'block' : 'none';
  document.getElementById('glossary-view').style.display = section === 'glossary' ? 'block' : 'none';
  document.getElementById('resources-view').style.display = section === 'resources' ? 'block' : 'none';
  document.getElementById('tool-view').classList.remove('active');
  if (section === 'glossary') renderGlossary();
  if (section === 'resources') renderResources();
  window.scrollTo(0, 0);
}



// Body map
function renderBodyMap() {
  window.selectedBodyParts = window.selectedBodyParts || [];
  window.bodyView = window.bodyView || 'front'; // front, back, left, right
  
  const frontParts = [
    { id: 'head', label: '頭部', cx: 100, cy: 28, rx: 20, ry: 22 },
    { id: 'forehead', label: '額頭', cx: 100, cy: 22, rx: 14, ry: 8 },
    { id: 'face', label: '臉部', cx: 100, cy: 38, rx: 12, ry: 10 },
    { id: 'jaw', label: '下顎', cx: 100, cy: 48, rx: 10, ry: 6 },
    { id: 'neck', label: '頸部', x: 92, y: 50, w: 16, h: 14 },
    { id: 'lshoulder', label: '左肩', x: 52, y: 64, w: 28, h: 16, rx: 4 },
    { id: 'rshoulder', label: '右肩', x: 120, y: 64, w: 28, h: 16, rx: 4 },
    { id: 'chest', label: '胸前', x: 72, y: 80, w: 56, h: 28, rx: 4 },
    { id: 'upperabd', label: '上腹', x: 76, y: 108, w: 48, h: 18, rx: 3 },
    { id: 'lowerabd', label: '下腹', x: 78, y: 126, w: 44, h: 20, rx: 3 },
    { id: 'lupperarm', label: '左上臂', x: 30, y: 72, w: 16, h: 32, rx: 6 },
    { id: 'rlowerarm', label: '左前臂', x: 28, y: 104, w: 14, h: 35, rx: 5 },
    { id: 'rupperarm', label: '右上臂', x: 154, y: 72, w: 16, h: 32, rx: 6 },
    { id: 'rlowerarm', label: '右前臂', x: 158, y: 104, w: 14, h: 35, rx: 5 },
    { id: 'lhand', label: '左手', cx: 35, cy: 148, rx: 8, ry: 6 },
    { id: 'rhand', label: '右手', cx: 165, cy: 148, rx: 8, ry: 6 },
    { id: 'lhip', label: '左臀', x: 72, y: 146, w: 22, h: 16, rx: 3 },
    { id: 'rhip', label: '右臀', x: 106, y: 146, w: 22, h: 16, rx: 3 },
    { id: 'lthigh', label: '左大腿', x: 74, y: 162, w: 18, h: 40, rx: 4 },
    { id: 'rthigh', label: '右大腿', x: 108, y: 162, w: 18, h: 40, rx: 4 },
    { id: 'lknee', label: '左膝', cx: 83, cy: 208, rx: 10, ry: 8 },
    { id: 'rknee', label: '右膝', cx: 117, cy: 208, rx: 10, ry: 8 },
    { id: 'lcalf', label: '左小腿', x: 76, y: 216, w: 14, h: 35, rx: 4 },
    { id: 'rcalf', label: '右小腿', x: 110, y: 216, w: 14, h: 35, rx: 4 },
    { id: 'lfoot', label: '左腳', cx: 83, cy: 260, rx: 12, ry: 6 },
    { id: 'rfoot', label: '右腳', cx: 117, cy: 260, rx: 12, ry: 6 }
  ];
  
  const backParts = [
    { id: 'backhead', label: '後腦', cx: 100, cy: 28, rx: 20, ry: 22 },
    { id: 'backneck', label: '後頸', x: 92, y: 50, w: 16, h: 14 },
    { id: 'upperback', label: '上背', x: 58, y: 64, w: 84, h: 22, rx: 4 },
    { id: 'midback', label: '中背', x: 68, y: 86, w: 64, h: 28, rx: 4 },
    { id: 'lowerback', label: '下背', x: 74, y: 114, w: 52, h: 24, rx: 3 },
    { id: 'lscapula', label: '左肩胛', x: 58, y: 70, w: 28, h: 20, rx: 3 },
    { id: 'rscapula', label: '右肩胛', x: 114, y: 70, w: 28, h: 20, rx: 3 },
    { id: 'lbackarm', label: '左臂後', x: 30, y: 72, w: 16, h: 65, rx: 6 },
    { id: 'rbackarm', label: '右臂後', x: 154, y: 72, w: 16, h: 65, rx: 6 },
    { id: 'lbuttock', label: '左臀', x: 72, y: 138, w: 24, h: 18, rx: 4 },
    { id: 'rbuttock', label: '右臀', x: 104, y: 138, w: 24, h: 18, rx: 4 },
    { id: 'lbackthigh', label: '左大腿後', x: 74, y: 156, w: 18, h: 45, rx: 4 },
    { id: 'rbackthigh', label: '右大腿後', x: 108, y: 156, w: 18, h: 45, rx: 4 },
    { id: 'lbackcalf', label: '左小腿後', x: 76, y: 201, w: 14, h: 40, rx: 4 },
    { id: 'rbackcalf', label: '右小腿後', x: 110, y: 201, w: 14, h: 40, rx: 4 },
    { id: 'lheel', label: '左腳跟', cx: 83, cy: 250, rx: 10, ry: 6 },
    { id: 'rheel', label: '右腳跟', cx: 117, cy: 250, rx: 10, ry: 6 }
  ];
  
  const leftParts = [
    { id: 'sidehead', label: '頭側', cx: 100, cy: 30, rx: 18, ry: 24 },
    { id: 'sideneck', label: '頸側', x: 94, y: 54, w: 12, h: 16 },
    { id: 'sideshoulder', label: '肩側', x: 70, y: 70, w: 40, h: 16, rx: 4 },
    { id: 'sidechest', label: '胸側', x: 75, y: 86, w: 35, h: 30, rx: 4 },
    { id: 'sideabd', label: '腹側', x: 78, y: 116, w: 30, h: 35, rx: 3 },
    { id: 'sidearm', label: '手臂側', x: 45, y: 75, w: 18, h: 70, rx: 6 },
    { id: 'sidehip', label: '臀側', x: 72, y: 151, w: 28, h: 18, rx: 3 },
    { id: 'sidethigh', label: '大腿側', x: 78, y: 169, w: 18, h: 45, rx: 4 },
    { id: 'sideknee', label: '膝側', cx: 87, cy: 220, rx: 10, ry: 8 },
    { id: 'sidecalf', label: '小腿側', x: 80, y: 228, w: 14, h: 35, rx: 4 },
    { id: 'sidefoot', label: '腳側', cx: 87, cy: 272, rx: 14, ry: 6 }
  ];
  
  const rightParts = [
    { id: 'rsidehead', label: '右頭側', cx: 100, cy: 30, rx: 18, ry: 24 },
    { id: 'rsideneck', label: '右頸側', x: 94, y: 54, w: 12, h: 16 },
    { id: 'rsideshoulder', label: '右肩側', x: 90, y: 70, w: 40, h: 16, rx: 4 },
    { id: 'rsidechest', label: '右胸側', x: 90, y: 86, w: 35, h: 30, rx: 4 },
    { id: 'rsideabd', label: '右腹側', x: 92, y: 116, w: 30, h: 35, rx: 3 },
    { id: 'rsidearm', label: '右臂側', x: 137, y: 75, w: 18, h: 70, rx: 6 },
    { id: 'rsidehip', label: '右臀側', x: 100, y: 151, w: 28, h: 18, rx: 3 },
    { id: 'rsidethigh', label: '右大腿側', x: 104, y: 169, w: 18, h: 45, rx: 4 },
    { id: 'rsideknee', label: '右膝側', cx: 113, cy: 220, rx: 10, ry: 8 },
    { id: 'rsidecalf', label: '右小腿側', x: 106, y: 228, w: 14, h: 35, rx: 4 },
    { id: 'rsidefoot', label: '右腳側', cx: 113, cy: 272, rx: 14, ry: 6 }
  ];
  
  const parts = window.bodyView === 'front' ? frontParts : 
                window.bodyView === 'back' ? backParts :
                window.bodyView === 'left' ? leftParts : rightParts;
  
  let svgParts = parts.map(p => {
    const selected = window.selectedBodyParts.includes(p.label);
    const fill = selected ? '#5b8c7a' : '#e8f3ef';
    const stroke = selected ? '#3d6b5a' : '#5b8c7a';
    if (p.cx) {
      return `<ellipse cx="${p.cx}" cy="${p.cy}" rx="${p.rx}" ry="${p.ry}" fill="${fill}" stroke="${stroke}" stroke-width="2" style="cursor:pointer;" onclick="toggleBodyPart('${p.label}')" />`;
    } else {
      return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.rx || 0}" fill="${fill}" stroke="${stroke}" stroke-width="2" style="cursor:pointer;" onclick="toggleBodyPart('${p.label}')" />`;
    }
  }).join('');
  
  const views = [
    { id: 'front', label: '正面' },
    { id: 'back', label: '背面' },
    { id: 'left', label: '左側' },
    { id: 'right', label: '右側' }
  ];
  const viewBtn = views.map(v => 
    `<button class="btn ${window.bodyView === v.id ? '' : 'secondary'}" onclick="window.bodyView='${v.id}'; renderWizard();" style="font-size:0.8rem; padding:0.25rem 0.5rem; margin:0 0.2rem;">${v.label}</button>`
  ).join('');
  
  return `<div style="text-align:center; margin:1rem 0;">
    <p style="font-size:0.9rem; color:var(--text-soft); margin-bottom:0.5rem;">點選身體部位（已選：${window.selectedBodyParts.length}/8）</p>
    <svg viewBox="0 0 200 280" style="width:100%; max-width:160px; margin:0 auto; display:block;">
      ${svgParts}
    </svg>
    <div style="margin-top:0.5rem;">${viewBtn}</div>
    <p style="font-size:0.8rem; color:var(--accent); margin-top:0.5rem;">${window.selectedBodyParts.join('、') || '尚未選擇'}</p>
  </div>`;
}

function toggleBodyPart(label) {
  window.selectedBodyParts = window.selectedBodyParts || [];
  const idx = window.selectedBodyParts.indexOf(label);
  if (idx >= 0) {
    window.selectedBodyParts.splice(idx, 1);
  } else if (window.selectedBodyParts.length < 8) {
    window.selectedBodyParts.push(label);
  }
  // Update answers and re-render
  answers.areas = window.selectedBodyParts;
  renderWizard();
}



// Single-page form tools (matching original UX)
function renderSinglePageForm(toolId) {
  const isZh = lang === 'zh';
  const tool = tools.find(t => t.id === toolId);
  
  const forms = {
    feelings: {
      fields: [
        { key: 'feelings', type: 'multi', max: 5, label: isZh ? '選接近的感受詞（最多 5 個）' : 'Pick feelings (up to 5)', options: isZh ? ['開心','放鬆','感謝','期待','難過','失望','生氣','挫折','緊張','擔心','孤單','尷尬','困惑','麻木','好幾種感受混在一起','還不確定'] : ['Happy','Relaxed','Grateful','Hopeful','Sad','Disappointed','Angry','Frustrated','Nervous','Worried','Lonely','Awkward','Confused','Numb','Mixed','Not sure'] },
        { key: 'what', type: 'text', label: isZh ? '剛才發生了什麼？（選填）' : 'What happened? (optional)', placeholder: isZh ? '只寫你願意記下的部分' : 'Only what you want to note' },
        { key: 'needs', type: 'multi', max: 3, label: isZh ? '現在可能需要什麼？（最多 3 個）' : 'What might you need? (up to 3)', options: isZh ? ['休息','一點空間','有人陪伴','被聽見','更清楚的資訊','實際協助','釐清下一步','還不知道'] : ['Rest','Some space','Company','To be heard','Clearer info','Practical help','Clarity','Not sure'] },
        { key: 'try', type: 'single', label: isZh ? '我願意先試的一件事' : 'One thing to try', options: isZh ? ['先停一下','找個人聽我說','查一項需要的資訊','先不決定'] : ['Just pause','Talk to someone','Look up info','Decide later'] }
      ]
    },
    worry: {
      fields: [
        { key: 'worries', type: 'text', label: isZh ? '把擔心寫下來（一行一個，最多 10 件）' : 'List worries (one per line, up to 10)', placeholder: isZh ? '例：明天會議會不會出錯' : 'e.g. What if the meeting goes badly' },
        { key: 'canact', type: 'text', label: isZh ? '哪些是我可以採取行動的？' : 'Which can I act on?', placeholder: isZh ? '例：查資料、問人、安排時間' : 'e.g. look up info, ask someone' },
        { key: 'park', type: 'text', label: isZh ? '哪些先放著？' : 'Which to park?', placeholder: isZh ? '例：還沒發生的「如果…」' : 'e.g. hypotheticals' },
        { key: 'worrytime', type: 'text', label: isZh ? '擔心時間（選填）' : 'Worry time (optional)', placeholder: isZh ? '例：每天晚上八點，十分鐘' : 'e.g. 8pm daily, 10 min' }
      ]
    },
    convo: { zh: '主題：共同空間的整理安排\n注意到：這週有幾次餐具留在桌上\n影響：想用桌子前要先整理，覺得有點困擾\n討論：能否約定收拾的時間\n開場：我想和你討論一下桌面的使用，現在方便嗎？', en: 'Topic: shared space cleanup\nNoticed: dishes left several times\nImpact: have to clear table first, a bit bothered\nDiscuss: can we agree on cleanup time\nOpening: I want to discuss the table, is now okay?' },
  askhelp: { zh: '類型：聽我說\n對象：朋友\n內容：最近有些事想說\n溫和說法：我最近有些事想說，想找人聽一聽。你方便找個時間聊一下嗎？', en: 'Type: listen\nWho: friend\nWhat: some things I want to talk about\nGentle: I have some things I want to talk about. Do you have time to chat?' },
  repair: { zh: '發生的事：我們為了週末安排起爭執\n影響：之後沒再說話\n我負責的：我提高了音量\n不由我決定的：對方的感受\n我能做的：傳一句「我需要一點時間」', en: 'What happened: we argued about weekend\nImpact: stopped talking\nMy part: I raised my voice\nNot mine: their feelings\nI can do: send "I need some time"' },
  problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: { zh: '已知：晚上九點傳的訊息，到十一點還沒回\n猜測：他是不是不想理我\n想做的反應：一直傳訊息、反覆查看\n其他做法：先等一小時、先照顧自己\n決定：先去洗澡，明天再看', en: 'Known: sent at 9pm, no reply by 11pm\nGuess: does he not want to talk\nUrge: keep messaging, keep checking\nOther: wait an hour, care for myself\nDecide: shower first, check tomorrow' },
  phone: { zh: '情況：睡前滑不停\n原本想做：查一個資料\n停下提示：看完這一則\n放下後：把手機翻面放桌上', en: 'Situation: scroll before bed\nWanted: look something up\nStop cue: after this one\nAfter: place phone face down' },
  smallstep: {
      fields: [
        { key: 'task', type: 'text', label: isZh ? '我想處理的一件事' : 'The thing I want to handle', placeholder: isZh ? '例：整理房間' : 'e.g. tidy the room' },
        { key: 'stuck', type: 'single', label: isZh ? '現在卡在哪裡？（可略過）' : 'Where stuck? (optional)', options: isZh ? ['太大了','不知道第一步','缺資訊或資源','現在沒力氣','擔心做不好','還不確定'] : ['Too big','Don\'t know first step','Missing info','No energy','Afraid','Not sure'] },
        { key: 'first', type: 'text', label: isZh ? '第一小步' : 'First small step', placeholder: isZh ? '例：先整理桌面的一個角落' : 'e.g. tidy one corner of the desk' },
        { key: 'when', type: 'text', label: isZh ? '何時開始？（選填）' : 'When to start? (optional)', placeholder: isZh ? '例：今天下午' : 'e.g. this afternoon' }
      ]
    },
    compassion: {
      fields: [
        { key: 'harsh', type: 'text', label: isZh ? '腦中那句責備自己的話' : 'The harsh thing I say', placeholder: isZh ? '例：你怎麼又拖到最後一刻' : 'e.g. Why did you leave it to the last minute' },
        { key: 'difficulty', type: 'text', label: isZh ? '現在實際遇到的困難' : 'The actual difficulty', placeholder: isZh ? '例：這週工作太多' : 'e.g. Too much work this week' },
        { key: 'need', type: 'multi', max: 3, label: isZh ? '我現在需要' : 'I need', options: isZh ? ['休息','多一點時間','被理解','實際協助','其他'] : ['Rest','More time','To be understood','Help','Other'] },
        { key: 'kind', type: 'text', label: isZh ? '我能接受的新說法' : 'A new phrase I can accept', placeholder: isZh ? '例：這週真的很多，我已經盡力了' : 'e.g. This week was a lot, I did my best' },
        { key: 'action', type: 'text', label: isZh ? '一個小行動（選填）' : 'One small action (optional)', placeholder: isZh ? '例：今天先完成最急的' : 'e.g. Finish the most urgent today' }
      ]
    },
    decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: {
      fields: [
        { key: 'thing', type: 'text', label: isZh ? '今天想留下的一件事' : 'One thing to note today', placeholder: isZh ? '例：午餐很好吃' : 'e.g. lunch was good' },
        { key: 'meaning', type: 'text', label: isZh ? '這件事的意義（選填）' : 'Meaning (optional)', placeholder: isZh ? '例：提醒我還是有小事值得開心' : 'e.g. reminds me small things count' },
        { key: 'feeling', type: 'text', label: isZh ? '我注意到的感受（選填）' : 'Feelings (optional)', placeholder: isZh ? '例：滿足、平靜' : 'e.g. content, calm' }
      ]
    },
    thoughtcheck: {
      fields: [
        { key: 'event', type: 'text', label: isZh ? '發生了什麼事？' : 'What happened?', placeholder: isZh ? '例：主管說報告要重做' : 'e.g. manager said report needs rework' },
        { key: 'thought', type: 'text', label: isZh ? '當下冒出來的想法' : 'The thought that came up', placeholder: isZh ? '例：我一定又搞砸了' : 'e.g. I must have messed up' },
        { key: 'support', type: 'text', label: isZh ? '支持這個想法的線索' : 'Evidence supporting', placeholder: isZh ? '例：主管在會議上說的' : 'e.g. what the manager said' },
        { key: 'against', type: 'text', label: isZh ? '不太支持的線索' : 'Evidence against', placeholder: isZh ? '例：過去類似的經驗' : 'e.g. past similar experiences' },
        { key: 'balanced', type: 'text', label: isZh ? '比較完整的看法' : 'More complete view', placeholder: isZh ? '例：這次沒做好，不代表我不行' : 'e.g. one time does not define me' }
      ]
    },
    values: {
      fields: [
        { key: 'values', type: 'multi', max: 5, label: isZh ? '現在在意的方向（最多 5 個）' : 'Directions you care about (up to 5)', options: isZh ? ['身體健康','休息與放鬆','家人','伴侶關係','朋友','工作表現','學習與成長','經濟穩定','自由與選擇','創作與興趣','幫助別人','誠實做自己','內心平靜','好玩與新鮮','社群與歸屬','接近自然'] : ['Health','Rest','Family','Partner','Friends','Work','Learning','Financial','Freedom','Creativity','Helping','Authenticity','Peace','Fun','Community','Nature'] },
        { key: 'action', type: 'text', label: isZh ? '這週做得到的一件小事' : 'One small thing this week', placeholder: isZh ? '例：這週運動一次' : 'e.g. exercise once this week' }
      ]
    },
    goodenough: {
      fields: [
        { key: 'task', type: 'text', label: isZh ? '是哪一件事？' : 'Which task?', placeholder: isZh ? '例：週五要交的簡報' : 'e.g. Friday presentation' },
        { key: 'purpose', type: 'text', label: isZh ? '這件事是為了什麼？' : 'What is this for?', placeholder: isZh ? '例：讓團隊了解進度' : 'e.g. update the team' },
        { key: 'must', type: 'text', label: isZh ? '一定要有的（最多 3 項）' : 'Must have (up to 3)', placeholder: isZh ? '例：目標、進度、下一步' : 'e.g. goal, progress, next step' },
        { key: 'nice', type: 'text', label: isZh ? '有很好，沒有也可以（選填）' : 'Nice to have (optional)', placeholder: isZh ? '例：精美的圖表' : 'e.g. polished charts' },
        { key: 'stop', type: 'single', label: isZh ? '什麼時候停手？' : 'When to stop?', options: isZh ? ['到一個時間就停','檢查固定次數就停','花固定時間就停'] : ['Stop at a set time','Stop after set checks','Stop after set duration'] }
      ]
    },
    convo: {
      fields: [
        { key: 'topic', type: 'text', label: isZh ? '這次想談的主題' : 'Topic', placeholder: isZh ? '例：家事分工' : 'e.g. household chores' },
        { key: 'notice', type: 'text', label: isZh ? '我具體注意到什麼？' : 'What did I notice?', placeholder: isZh ? '例：這週有幾次餐具留在桌上' : 'e.g. dishes left several times' },
        { key: 'impact', type: 'text', label: isZh ? '對我的影響或感受' : 'Impact or feelings', placeholder: isZh ? '例：想用桌子前要先整理' : 'e.g. have to clear table first' },
        { key: 'discuss', type: 'text', label: isZh ? '我希望一起討論什麼？' : 'What to discuss', placeholder: isZh ? '例：能不能約定收拾時間' : 'e.g. can we agree on cleanup time' },
        { key: 'opening', type: 'text', label: isZh ? '我想怎麼開頭？（選填）' : 'How to start? (optional)', placeholder: isZh ? '例：有件事想跟你聊聊' : 'e.g. there is something I want to talk about' }
      ]
    },
    goodenough: { zh: '這件事：週五要交的企劃簡報\n目的：讓團隊了解進度\n一定要有：目標、進度、下一步\n有很好沒有也可以：精美的圖表\n停手：到一個時間就停', en: 'Task: Friday presentation\nPurpose: Update the team\nMust have: goal, progress, next step\nNice to have: polished charts\nStop: at a set time' },
  convo: { zh: '主題：共同空間的整理安排\n注意到：這週有幾次餐具留在桌上\n影響：想用桌子前要先整理，覺得有點困擾\n討論：能否約定收拾的時間\n開場：我想和你討論一下桌面的使用，現在方便嗎？', en: 'Topic: shared space cleanup\nNoticed: dishes left several times\nImpact: have to clear table first, a bit bothered\nDiscuss: can we agree on cleanup time\nOpening: I want to discuss the table, is now okay?' },
  askhelp: { zh: '類型：聽我說\n對象：朋友\n內容：最近有些事想說\n溫和說法：我最近有些事想說，想找人聽一聽。你方便找個時間聊一下嗎？', en: 'Type: listen\nWho: friend\nWhat: some things I want to talk about\nGentle: I have some things I want to talk about. Do you have time to chat?' },
  repair: { zh: '發生的事：我們為了週末安排起爭執\n影響：之後沒再說話\n我負責的：我提高了音量\n不由我決定的：對方的感受\n我能做的：傳一句「我需要一點時間」', en: 'What happened: we argued about weekend\nImpact: stopped talking\nMy part: I raised my voice\nNot mine: their feelings\nI can do: send "I need some time"' },
  problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: { zh: '已知：晚上九點傳的訊息，到十一點還沒回\n猜測：他是不是不想理我\n想做的反應：一直傳訊息、反覆查看\n其他做法：先等一小時、先照顧自己\n決定：先去洗澡，明天再看', en: 'Known: sent at 9pm, no reply by 11pm\nGuess: does he not want to talk\nUrge: keep messaging, keep checking\nOther: wait an hour, care for myself\nDecide: shower first, check tomorrow' },
  phone: { zh: '情況：睡前滑不停\n原本想做：查一個資料\n停下提示：看完這一則\n放下後：把手機翻面放桌上', en: 'Situation: scroll before bed\nWanted: look something up\nStop cue: after this one\nAfter: place phone face down' },
  smallstep: { zh: '我想處理：整理房間\n卡在：太大了\n第一小步：先整理桌面的一個角落\n開始時機：晚餐後\n做到這裡先停：桌面清出可以放筆電的空間', en: 'Task: tidy the room\nStuck: too big\nFirst step: tidy one corner of the desk\nWhen: after dinner\nStop: when there is space for laptop' },
  tasksep: {
      fields: [
        { key: 'situation', type: 'text', label: isZh ? '我現在在意的一件事' : 'One thing I care about', placeholder: isZh ? '例：家人希望我每週末都回家' : 'e.g. family wants me home every weekend' },
        { key: 'mine', type: 'text', label: isZh ? '我能決定的' : 'What I can decide', placeholder: isZh ? '例：我的時間安排' : 'e.g. my schedule' },
        { key: 'theirs', type: 'text', label: isZh ? '由對方決定的' : 'What they decide', placeholder: isZh ? '例：對方是否接受' : 'e.g. whether they accept' },
        { key: 'together', type: 'text', label: isZh ? '需要一起協商的' : 'Need to negotiate', placeholder: isZh ? '例：週末的安排' : 'e.g. weekend arrangements' },
        { key: 'action', type: 'text', label: isZh ? '我願意先做的（選填）' : 'What I will do first (optional)', placeholder: isZh ? '例：這週先說我需要休息' : 'e.g. say I need rest this week' }
      ]
    },

    decision: {
      fields: [
        { key: 'options', type: 'text', label: isZh ? '我的選項（一行一個）' : 'My options (one per line)', placeholder: isZh ? '例：接受新工作、留在現職' : 'e.g. take new job, stay' },
        { key: 'criteria', type: 'text', label: isZh ? '重要的考量' : 'Important criteria', placeholder: isZh ? '例：薪水、通勤、成長' : 'e.g. salary, commute, growth' },
        { key: 'lean', type: 'text', label: isZh ? '目前比較傾向' : 'Currently leaning toward', placeholder: isZh ? '例：留在現職，再觀察' : 'e.g. stay for now' }
      ]
    },
    careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: {
      fields: [
        { key: 'name', type: 'text', label: isZh ? '稱呼' : 'Name', placeholder: isZh ? '例：媽媽、朋友' : 'e.g. Mom, friend' },
        { key: 'contact', type: 'text', label: isZh ? '聯絡方式' : 'Contact', placeholder: isZh ? '例：電話、WhatsApp' : 'e.g. phone' },
        { key: 'help', type: 'text', label: isZh ? '可以請對方協助什麼' : 'What they can help with', placeholder: isZh ? '例：聽我說、陪我去' : 'e.g. listen, accompany' },
        { key: 'time', type: 'text', label: isZh ? '方便時段（選填）' : 'Convenient times (optional)', placeholder: isZh ? '例：晚上、週末' : 'e.g. evenings' }
      ]
    },
    repair: {
      fields: [
        { key: 'what', type: 'text', label: isZh ? '我記得發生的事' : 'What I remember', placeholder: isZh ? '例：我們為了週末安排起爭執' : 'e.g. we argued about weekend' },
        { key: 'impact', type: 'text', label: isZh ? '這件事帶來的影響' : 'Impact', placeholder: isZh ? '例：之後沒再說話' : 'e.g. stopped talking' },
        { key: 'mypart', type: 'text', label: isZh ? '我願意負責的部分' : 'My part', placeholder: isZh ? '例：我提高了音量' : 'e.g. I raised my voice' },
        { key: 'step', type: 'text', label: isZh ? '我能做的一步' : 'One step I can take', placeholder: isZh ? '例：傳一句訊息' : 'e.g. send a message' }
      ]
    },
    repair: { zh: '發生的事：我們為了週末安排起爭執\n影響：之後沒再說話\n我負責的：我提高了音量\n不由我決定的：對方的感受\n我能做的：傳一句「我需要一點時間」', en: 'What happened: we argued about weekend\nImpact: stopped talking\nMy part: I raised my voice\nNot mine: their feelings\nI can do: send "I need some time"' },
  problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: { zh: '已知：晚上九點傳的訊息，到十一點還沒回\n猜測：他是不是不想理我\n想做的反應：一直傳訊息、反覆查看\n其他做法：先等一小時、先照顧自己\n決定：先去洗澡，明天再看', en: 'Known: sent at 9pm, no reply by 11pm\nGuess: does he not want to talk\nUrge: keep messaging, keep checking\nOther: wait an hour, care for myself\nDecide: shower first, check tomorrow' },
  phone: {
      fields: [
        { key: 'situation', type: 'single', label: isZh ? '現在是哪種情況？' : 'What situation?', options: isZh ? ['睡前滑不停','工作中一直拿手機','一直刷新訊息','有正當用途但常滑過頭'] : ['Before bed','At work','Refreshing messages','Over-scroll'] },
        { key: 'intent', type: 'text', label: isZh ? '原本想做什麼？' : 'What did you want to do?', placeholder: isZh ? '例：查資料、不知道怎麼就打開了' : 'e.g. look something up' },
        { key: 'stop', type: 'single', label: isZh ? '我想停下的提示' : 'Cue to stop', options: isZh ? ['做完一件事','看完這一則','某個時間點','先停一下再決定'] : ['After one thing','After this one','At a time','Pause and decide'] },
        { key: 'after', type: 'text', label: isZh ? '放下手機後' : 'After putting down', placeholder: isZh ? '例：把手機翻面放桌上' : 'e.g. place face down' }
      ]
    },
    problemsolve: {
      fields: [
        { key: 'problem', type: 'text', label: isZh ? '我想處理的問題' : 'The problem', placeholder: isZh ? '例：工作量太大' : 'e.g. too much work' },
        { key: 'solutions', type: 'text', label: isZh ? '我想得到的方法（1-5個）' : 'Solutions (1-5)', placeholder: isZh ? '例：跟主管談、延後部分' : 'e.g. talk to manager' },
        { key: 'first', type: 'text', label: isZh ? '我想先試' : 'Try first', placeholder: isZh ? '例：跟主管談優先順序' : 'e.g. discuss priorities' },
        { key: 'review', type: 'text', label: isZh ? '什麼時候回顧' : 'When to review', placeholder: isZh ? '例：下週五' : 'e.g. next Friday' }
      ]
    },
    tasksorter: {
      fields: [
        { key: 'tasks', type: 'text', label: isZh ? '腦中的事情（一行一個）' : 'Tasks (one per line)', placeholder: isZh ? '例：回覆訊息、整理房間' : 'e.g. reply, tidy room' },
        { key: 'today', type: 'text', label: isZh ? '今天想處理' : 'Handle today', placeholder: isZh ? '例：回覆確認時間的信' : 'e.g. reply to confirm' },
        { key: 'later', type: 'text', label: isZh ? '可以延後' : 'Can wait', placeholder: isZh ? '例：整理整個房間' : 'e.g. tidy whole room' },
        { key: 'first', type: 'text', label: isZh ? '第一小步' : 'First step', placeholder: isZh ? '例：打開信件' : 'e.g. open the email' }
      ]
    },
    askhelp: {
      fields: [
        { key: 'type', type: 'single', label: isZh ? '需要的協助類型' : 'Type of help', options: isZh ? ['聽我說','具體幫忙','陪同','討論工作量'] : ['Listen','Specific help','Accompany','Discuss workload'] },
        { key: 'who', type: 'text', label: isZh ? '想請誰幫忙' : 'Who to ask', placeholder: isZh ? '例：朋友、同事' : 'e.g. friend, colleague' },
        { key: 'what', type: 'text', label: isZh ? '具體內容' : 'Specifics', placeholder: isZh ? '例：幫我看一下文件' : 'e.g. check this document' },
        { key: 'message', type: 'text', label: isZh ? '我的說法' : 'My message', placeholder: isZh ? '例：我想請你幫我看一下…' : 'e.g. Could you help me check...' }
      ]
    },
    problemsolve: { zh: '問題：早上出門總是很趕\n方法：晚餐後整理包包、前一晚準備衣服\n先試：晚餐後整理包包\n回顧：一週後看是否比較不趕', en: 'Problem: always rushed in the morning\nSolutions: pack bag after dinner, prepare clothes night before\nTry first: pack bag after dinner\nReview: check in a week' },
  decision: { zh: '決定：要不要轉換工作\n選項A：留在原職\n選項B：接受新工作\n條件：時間安排、收入變動、身心負擔\n缺資訊：新工作的加班頻率\n下一步：先問人，不急決定', en: 'Decision: whether to change jobs\nOption A: stay\nOption B: take new job\nCriteria: time, income, wellbeing\nMissing: overtime at new job\nNext: ask someone, no rush' },
  bodycheck: { zh: '部位：肩膀與上背\n感覺：緊繃、痠\n程度：中等\n補充：從早上開始就緊\n接下來：起來走走', en: 'Area: shoulders\nSensation: tight, sore\nIntensity: moderate\nNote: tight since morning\nNext: get up and walk' },
  tasksorter: { zh: '今天想處理：回覆確認時間的信\n可以延後：整理整個房間\n需要協助：確認活動交通安排\n還沒決定：決定週末怎麼安排\n第一小步：打開信件，先確認可行的時間', en: 'Today: reply to confirm time\nLater: tidy whole room\nNeed help: confirm event transport\nUndecided: weekend plans\nFirst step: open email, check times' },
  sleepdiary: { zh: '上床：23:30\n睡著：00:15\n醒來：07:00\n起床：07:15\n感覺：普通\n備註：喝了咖啡', en: 'Bed: 11:30pm\nAsleep: 12:15am\nWake: 7:00am\nUp: 7:15am\nFeeling: okay\nNote: had coffee' },
  sayingno: { zh: '要求：週末加班\n原因：已經有安排\n說法：這次我沒辦法，謝謝你想到我', en: 'Request: work overtime on weekend\nReason: already have plans\nPhrase: I can\'t this time, thanks for thinking of me' },
  apology: { zh: '發生的事：我遲到了，讓大家等\n我的部分：我沒有提早出門\n說法：抱歉讓你們等，下次我會提早出門', en: 'What happened: I was late\nMy part: I didn\'t leave early\nPhrase: Sorry for making you wait, I\'ll leave earlier next time' },
  threegood: { zh: '第一件：午餐很好吃\n第二件：和朋友聊了一下\n第三件：準時下班', en: 'First: lunch was good\nSecond: chatted with a friend\nThird: left work on time' },
  stresscheck: { zh: '壓力來源：工作截止日期、睡眠不好\n可以先處理：今晚早點睡', en: 'Sources: work deadline, poor sleep\nAddress first: sleep earlier tonight' },
  energycheck: { zh: '能量：偏低，只想做輕鬆的\n適合做：回幾封簡單的信、休息一下', en: 'Energy: low, only easy things\nFits: reply to simple emails, rest' },
  socialbattery: { zh: '電量：很累，想獨處\n決定：早點回家', en: 'Battery: very tired, want to be alone\nDecide: go home early' },
  goalreview: { zh: '目標：每週運動三次\n目前：這週動了一次\n下一步：明天早上做十分鐘', en: 'Goal: exercise 3 times a week\nNow: exercised once\nNext: do 10 minutes tomorrow morning' },
  selfaffirm: { zh: '我對自己說：我今天有努力，這次真的很多', en: 'I say: I tried today, this was a lot' },
  careguide: { zh: '低落時的樣子：話變少、一直待在房間\n有幫助的陪法：陪我坐著、傳一句「我在」\n沒幫助的：一直叫我想開、跟別人比較', en: 'When low: talks less, stays in room\nHelpful: sit with me, send "I\'m here"\nNot helpful: tell me to cheer up, compare' },
  lowenergy: { zh: '時間：2 分鐘\n活動：喝一杯溫水\n自己的：聽一首以前常聽的歌', en: 'Time: 2 minutes\nActivity: drink warm water\nOwn: listen to a song I used to like' },
  docprep: { zh: '看診類型：回診，目前有在用藥\n最想處理：晚上很難入睡\n影響到：睡眠、專注\n想問：藥的副作用？', en: 'Visit: follow-up, on medication\nMain: hard to fall asleep\nAffects: sleep, focus\nQuestions: side effects?' },
  breakup: { zh: '最難熬時段：晚上、週末\n準備的小事：晚上早點睡、週末約朋友', en: 'Hard times: evenings, weekends\nPrepared: sleep earlier, meet a friend on weekend' },
  examprep: { zh: '類型：面試\n日期：下週三\n這幾天：準備自我介紹、查公司資料\n當天：提早到、帶證件', en: 'Type: interview\nDate: next Wednesday\nThese days: prepare intro, research company\nDay of: arrive early, bring ID' },
  relatives: { zh: '常被問：感情狀況\n準備的回應：謝謝關心，有進展會跟大家說', en: 'Often asked: relationship status\nResponse: thanks for caring, I\'ll share when there is news' },
  parenttalk: { zh: '情境：孩子不想說話\n年齡：國小\n接話：你不想說也沒關係，我在這裡', en: 'Situation: child doesn\'t want to talk\nAge: primary school\nResponse: it\'s okay if you don\'t want to talk, I\'m here' },
  mindfulreply: { zh: '對方說：你怎麼又這樣\n我的衝動：想回嘴\n我的解讀：覺得被批評\n想說的：我聽到了，讓我想一下', en: 'They said: why did you do that again\nUrge: want to snap back\nInterpretation: feel criticized\nWant to say: I heard you, let me think' },
  screentime: { zh: '設備：手機、平板\n規則：晚上九點後不玩\n提醒：時間到了就收起來\n例外：作業需要時可以延長', en: 'Devices: phone, tablet\nRule: no play after 9pm\nReminder: put away when time is up\nException: can extend for homework' },
  visualcard: { zh: '活動：從玩玩具換到吃飯\n現在：玩玩具\n接下來：洗手\n完成後：吃飯', en: 'Activity: from toys to meal\nNow: playing\nNext: wash hands\nAfter: eat' },
  workplace: { zh: '時間：週二下午\n發生的事：主管在會議上公開批評\n影響：之後不敢發言\n記錄：日期、時間、地點、在場的人', en: 'When: Tuesday afternoon\nWhat: manager criticized publicly in meeting\nImpact: afraid to speak after\nRecord: date, time, place, who was there' },
  supportcard: { zh: '稱呼：朋友小明\n聯絡：WhatsApp\n可以協助：聽我說、陪我去\n方便時段：晚上、週末', en: 'Name: friend Ming\nContact: WhatsApp\nCan help: listen, accompany\nTimes: evenings, weekends' },
  values: { zh: '在意的方向：身體健康、休息與放鬆、家人\n這週小事：這週運動一次', en: 'Values: health, rest, family\nThis week: exercise once' },
  counselprep: { zh: '階段：正在找機構\n想確認：單次費用、保密方式、第一次流程\n聯絡範本：您好，我想了解第一次個別諮商的安排…', en: 'Stage: looking for a center\nQuestions: fee, confidentiality, first session\nTemplate: Hello, I would like to know about first session arrangements...' },
  transition: { zh: '類型：轉職、新工作\n階段：即將發生\n想保留：和朋友的聯絡\n可以調整：作息時間\n還不確定：新環境的人際\n先照顧：先把作息穩定下來', en: 'Type: new job\nStage: about to happen\nKeep: contact with friends\nAdjust: sleep schedule\nUnclear: new relationships\nCare first: stabilize sleep' },
  gratitude: { zh: '今天的事：下班吃了熱湯麵\n意義：忙碌後照顧自己\n感受：滿足、溫暖', en: 'Today: had hot noodles after work\nMeaning: cared for myself after busy day\nFeeling: content, warm' },
  relpause: {
      fields: [
        { key: 'known', type: 'text', label: isZh ? '已知的事' : 'What I know', placeholder: isZh ? '例：晚上九點傳的訊息還沒回' : 'e.g. sent at 9pm, no reply' },
        { key: 'guess', type: 'text', label: isZh ? '我的猜測' : 'My guesses', placeholder: isZh ? '例：他是不是生氣了' : 'e.g. is he angry' },
        { key: 'urge', type: 'multi', max: 3, label: isZh ? '現在想做的反應' : 'Reactions I want', options: isZh ? ['一直傳訊息','反覆查看','立刻問清楚','假裝沒事','也不理對方'] : ['Keep messaging','Keep checking','Ask now','Pretend nothing','Ignore too'] },
        { key: 'decide', type: 'single', label: isZh ? '我決定' : 'I decide', options: isZh ? ['先等一段時間','傳一則簡單訊息','先找朋友聊聊','先照顧自己','暫時不回應'] : ['Wait a while','Send simple message','Talk to friend','Care for myself','Not respond'] }
      ]
    },
    selfaffirm: {
      fields: [
        { key: 'affirm', type: 'single', label: isZh ? '我對自己說' : 'I say to myself', options: isZh ? ['我今天有努力','我已經盡力了','這次真的很多','我需要喘口氣','還在學習','一次沒做好不代表我不行'] : ['I tried today','I did my best','This was a lot','I need a break','Still learning','One time does not define me'] }
      ]
    }  };
  
  const form = forms[toolId];
  if (!form) return '<p>Form not found</p>';
  
  let html = `<div class="tool-header">
    <button class="back-btn" onclick="showHome()">← ${isZh ? '返回' : 'Back'}</button>
    <h1>${tool.icon || ''} ${tool[lang].name}</h1>
    <p class="tool-desc">${tool[lang].desc}</p>
  </div>
  <form id="single-form" onsubmit="event.preventDefault(); submitSingleForm('${toolId}')">`;
  
  form.fields.forEach(f => {
    html += `<div class="form-group"><label>${f.label}</label>`;
    if (f.type === 'text') {
      html += `<textarea name="${f.key}" placeholder="${f.placeholder || ''}" rows="2"></textarea>`;
    } else if (f.type === 'single') {
      html += '<div class="options">';
      f.options.forEach(opt => {
        html += `<button type="button" class="option-btn" onclick="this.parentElement.querySelectorAll('.option-btn').forEach(b=>b.classList.remove('selected')); this.classList.add('selected'); document.querySelector('[name=${f.key}]').value=this.textContent;">${opt}</button>`;
      });
      html += `<input type="hidden" name="${f.key}"></div>`;
    } else if (f.type === 'multi') {
      html += '<div class="options">';
      f.options.forEach(opt => {
        html += `<button type="button" class="option-btn" onclick="this.classList.toggle('selected'); updateMulti('${f.key}');">${opt}</button>`;
      });
      html += `<input type="hidden" name="${f.key}"></div>`;
    }
    html += '</div>';
  });
  
  html += `<div class="actions"><button type="submit" class="btn">${isZh ? '產生整理卡' : 'Generate card'}</button></div></form>
  <div id="form-result"></div>`;
  
  return html;
}

function updateMulti(key) {
  const selected = [...document.querySelectorAll(`[onclick*="${key}"]`)].filter(b => b.classList.contains('selected')).map(b => b.textContent);
  document.querySelector(`[name="${key}"]`).value = selected.join('、');
}

function submitSingleForm(toolId) {
  const form = document.getElementById('single-form');
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  
  const isZh = lang === 'zh';
  let result = `<div class="card-result"><h3>${isZh ? '整理卡' : 'Card'}</h3>`;
  for (const [k, v] of Object.entries(data)) {
    if (v) result += `<p><strong>${k}：</strong>${v}</p>`;
  }
  result += `<div class="actions" style="margin-top:1rem;"><button class="btn" onclick="window.print()">${isZh ? '列印' : 'Print'}</button></div></div>`;
  
  document.getElementById('form-result').innerHTML = result + renderToolNote(toolId) + renderFollowup(toolId) + renderToolFAQ(toolId);
}




// Follow-up suggestions
const toolFollowup = {
  worry: isZh => isZh ? '如果常常睡前想太多，可以試著把擔心時間排在睡前一兩個小時以前。如果擔心已經讓你很難睡、很難工作，可以找專業人員聊聊。' : 'If you worry a lot before bed, try scheduling worry time earlier. If worry affects sleep or work, consider talking to a professional.',
  feelings: isZh => isZh ? '整理完可以試著做一件照顧自己的小事，或找人聊聊。' : 'After sorting, try one small self-care thing or talk to someone.',
  smallstep: isZh => isZh ? '做完第一小步後，可以再回來寫下一個小步。' : 'After the first step, come back to write the next one.'
};

function renderFollowup(toolId) {
  const fn = toolFollowup[toolId];
  if (!fn) return '';
  const text = fn(lang === 'zh');
  return `<p style="margin-top:1rem; padding:0.8rem; background:var(--accent-light); border-radius:6px; font-size:0.9rem;">${text}</p>`;
}


// Educational notes for tools
const toolNotes = {
  thoughtcheck: '這不是要你「正面思考」，也不是證明自己想錯了。找不到其他看法也沒關係，可以先停在這裡。',
  compassion: '不用勉強說服自己「我很棒」，新的說法只要比原來溫和一點、讀了能接受就好。',
  tasksep: '分清楚不代表別人的感受與你無關；共同生活、照顧或工作分工，常常需要一起討論。',
  worry: '不是要你停止擔心，而是讓擔心有地方放。',
  boundary: '表達界線不能保證對方接受。你可以決定自己如何回應。',
  goodenough: '認真不是問題，問題是沒有終點。這張卡是幫你畫一條終點線。做到「一定要有的」，就是完成了。',
  smallstep: '不用一次做完，先找一個你願意開始的動作。小步驟是為了讓開始比較可行。',
  convo: '從自己的角度說，避免評價對方。我訊息是：具體事件 + 感受 + 影響 + 提議。',
  askhelp: '對方可以拒絕或協商；不把回應當作是否在乎的證明。',
  repair: '不是每次衝突都要立刻和好。自己能負責的是具體言行，不是把整件事的錯都攬在身上。',
  problemsolve: '先說清楚問題，再列出幾個可能的做法，選一個先試。想不到方法時，一個也可以。',
  lowenergy: '選「沒力氣時也有可能做到」的活動。不是作業，今天做不到也沒關係。',
  decision: '這張表不替你打分數，也不推薦。只是幫你把選項和條件攤開來看。',
  bodycheck: '只是「注意到」，不急著解釋原因。身體感覺可能有很多原因，不一定是壓力。',
  tasksorter: '整理是為了少一點負擔，不是要求自己把清單全部完成。不必全部放進「今天想處理」。',
  sleepdiary: '這不是失眠診斷。每天花一兩分鐘記下記得的部分，不需要精準到每分鐘。',
  sayingno: '可以溫和，也可以直接。寫一句你說得出口的話。',
  apology: '寫一句道歉。不用完美。',
  threegood: '小事也可以。寫得出來就好。',
  stresscheck: '列出壓力來源，挑一個可以先處理的。',
  energycheck: '根據能量，決定現在適合做什麼。',
  socialbattery: '根據電量，決定要充電還是繼續。',
  goalreview: '寫下目標、目前在哪、下一步是什麼。',
  selfaffirm: '對自己說一句真實的話。不用完美。',
  careguide: '這些不代表我在生你的氣。你不需要每一項都做到。',
  lowenergy: '選沒力氣時也有可能做到的。不是作業，今天做不到也沒關係。',
  docprep: '問題是幫你記得問，不一定要全部問完。',
  breakup: '找出最難熬的時段，替每一段先準備一件小事。',
  examprep: '依還有幾天整理出這幾天、前一天和當天要確認的事。',
  relatives: '先準備幾句想使用的回應。',
  parenttalk: '依情境和孩子年齡比較三種說法，寫下一句你自己的接話。',
  mindfulreply: '先看見自己的衝動，分開對方實際說的和自己的解讀。',
  screentime: '逐項寫下做法、提醒和例外。',
  visualcard: '選兩格或三格，放上「現在、接下來、完成後」。',
  workplace: '記下日期、時間、地點、在場的人。這不是法律建議。',
  supportcard: '寫下來方便之後找。',
  values: '排序沒有標準答案。排序只代表「現在」。',
  counselprep: '不需要先填寫病史或完成測驗。不知道怎麼說，也可以從「我還不太確定」開始。',
  transition: '生活變動可能帶來壓力，即使是正向的改變，也需要時間適應。',
  gratitude: '只記一件小事即可。沒有想到也沒關係，可先留白或記讓自己喘口氣的事。',
  relpause: '這張卡不判斷對方愛不愛你。猜測不代表事實，寫下來只是讓它被看見。',
  phone: '不需戒掉手機，而是先規劃使用範圍。為單次使用設結束點。',
  values: '排序沒有標準答案，也不分析個人類型。排序只代表「現在」，過一陣子改變很正常。'

};

function renderToolNote(toolId) {
  const note = toolNotes[toolId];
  if (!note) return '';
  return `<p style="margin-top:1rem; padding:0.8rem; background:var(--surface); border-left:3px solid var(--accent); font-size:0.9rem; color:var(--text-soft);">${note}</p>`;
}

// FAQ for tools
const toolFAQ = {
  feelings: [
    { q: '可以同時選相反的感受嗎？', a: '可以。不同感受可以同時存在，工具不會替你解釋矛盾。' },
    { q: '這會分析我的情緒嗎？', a: '不會。沒有評分、不產生病名，也不會從選項推論原因。' },
    { q: '什麼都沒選可以繼續嗎？', a: '可以。結果會寫「尚未整理」，不會自動幫你填。' }
  ],
  worry: [
    { q: '擔心時間真的有用嗎？', a: '這是公共衛生單位常推薦的自助方法，很多人覺得有幫助，但不是每個人都適合。試一兩週看看，不適合就換別的方法。' },
    { q: '擔心的事情是真的，不是想太多，也能用嗎？', a: '可以。這個方法不是在說你的擔心不合理，而是讓你不用整天被它追著跑。' },
    { q: '我寫的擔心會被存起來嗎？', a: '不會。內容只在這次頁面操作裡，重新整理就不見了；想留著請複製或列印。' }
  ],
  boundary: [
    { q: '這句話適合所有人嗎？', a: '不一定。請按關係、處境與自己的安全感調整，不需要照著念。' },
    { q: '對方不接受怎麼辦？', a: '句型不能控制對方反應。你可以先暫停，想想自己能採取的下一步或需要的支持。' },
    { q: '工具會替我傳訊息嗎？', a: '不會。內容由你編輯與複製，是否使用由你決定。' }
  ],
  convo: [
    { q: '這和界線表達有什麼不同？', a: '我訊息用於開啟討論找安排，界線表達著重能接受與不能接受的範圍。可搭配使用。' }
  ],
  askhelp: [
    { q: '工具會替我傳訊息嗎？', a: '不會。內容由你編輯與複製，是否送出由你決定。' },
    { q: '對方拒絕了怎麼辦？', a: '對方可以拒絕或協商。可以說「謝謝你告訴我，我會再想其他安排」。' }
  ],
  repair: [
    { q: '一定要道歉嗎？', a: '不用。修復不等於強迫道歉。承認自己做了什麼、停止重複的行為、先尊重距離，都可以是修復的一步。' },
    { q: '什麼情況不適合主動聯絡？', a: '如果有暴力、威脅、跟蹤、控制，或擔心聯絡會更不安全，先不要主動聯絡。先照顧自己的安全。' }
  ],
  problemsolve: [
    { q: '想不到第二個方法怎麼辦？', a: '一個方法也可以完成。可以想想如果是朋友會建議什麼，或回想以前有幫助的做法。' },
    { q: '問題不是自己能控制的怎麼辦？', a: '可以整理情緒和支持資源，或只針對能做的小部分。' }
  ],
  decision: [
    { q: '這會告訴我該選哪個嗎？', a: '不會。這張表不打分數、不推薦，只是幫你把選項和條件攤開來看。' },
    { q: '可以不今天決定嗎？', a: '可以。下一步可以是「先找資訊」或「先不決定」。' }
  ],
  tasksorter: [
    { q: '一定要把所有事情都分類嗎？', a: '不用。留在「還沒決定」也可以。' },
    { q: '今天沒有想處理的事怎麼辦？', a: '可以選「今天先不安排」，一樣能拿到整理結果。' }
  ],
  sleepdiary: [
    { q: '一定要每天記嗎？', a: '不用。漏掉可以留空，只記一兩天也可以。' },
    { q: '這能診斷失眠嗎？', a: '不能。這是個人觀察紀錄，可以帶給醫師參考。' }
  ],
  sayingno: [
    { q: '一定要給理由嗎？', a: '不用。「這次我沒辦法」就夠了。' }
  ],
  apology: [
    { q: '一定要道歉嗎？', a: '如果是你的部分，道歉可以幫助修復。但不用完美。' }
  ],
  thoughtcheck: [
    { q: '這是在教我正面思考嗎？', a: '不是。目的是把事件和想法分開，看看線索。如果原本的想法有它的道理，也可以保留。' },
    { q: '找不到其他看法怎麼辦？', a: '可以先停在這裡。有時候隔一段時間再看，會比較容易。' }
  ],
  tasksep: [
    { q: '這是不是「別人的事不用管」？', a: '不是。你可以決定自己的行動，對方可以決定怎麼回應，而共同生活常常需要一起協商。' },
    { q: '分不清楚怎麼辦？', a: '可以先放在「還不確定」。分類沒有標準答案。' }
  ],
  values: [
    { q: '這是價值觀測驗嗎？', a: '不是。不計分、不分析人格，只幫你整理現在在意的方向。' },
    { q: '排序會變嗎？', a: '會。排序只代表「現在」，過一陣子改變很正常。' }
  ],
  careguide: [
    { q: '一定要全部做到嗎？', a: '不用。你不需要每一項都做到，也可以跟對方說你的限度。' }
  ],
  lowenergy: [
    { q: '做了還是沒有比較好？', a: '正常。改變是慢的、小的。可以換活動，或找專業人員聊聊。' },
    { q: '連 2 分鐘都做不到？', a: '先休息。如果持續這樣，可以找身心科或諮商。' }
  ],
  docprep: [
    { q: '一定要全部問完嗎？', a: '不用。可以先勾最重要的兩三題。' }
  ],
  breakup: [
    { q: '一定要馬上好起來嗎？', a: '不用。給自己時間。找出難熬的時段，準備小事就好。' }
  ],
  examprep: [
    { q: '準備不完怎麼辦？', a: '先確認最重要的，其他的可以列在備案。' }
  ],
  relatives: [
    { q: '被追問怎麼辦？', a: '可以再說一次「今天先不談這個」，或暫時離開談話。' }
  ],
  parenttalk: [
    { q: '孩子還是不說話怎麼辦？', a: '可以說「不想說也沒關係」，給空間。不需要立刻有回應。' }
  ],
  mindfulreply: [
    { q: '還是很想回嘴怎麼辦？', a: '可以先不回，等一下再看。不回也是一種選擇。' }
  ],
  screentime: [
    { q: '孩子不遵守怎麼辦？', a: '可以一起回頭看約定，調整規則。不需要一次完美。' }
  ],
  visualcard: [
    { q: '孩子看不懂怎麼辦？', a: '可以用更簡單的圖示，或一起看著卡片說。' }
  ],
  workplace: [
    { q: '這是法律建議嗎？', a: '不是。這只是幫你記錄。如果需要，請尋求法律或工會協助。' }
  ],
  stresscheck: [
    { q: '壓力太多怎麼辦？', a: '先挑一個可以處理的。其他的可以先放著。' }
  ],
  energycheck: [
    { q: '能量一直很低怎麼辦？', a: '如果持續超過兩週，影響生活，可以找專業人員聊聊。' }
  ],
  socialbattery: [
    { q: '每次都想早點走正常嗎？', a: '正常。根據自己的電量決定，不需要勉強。' }
  ],
  goalreview: [
    { q: '沒有達到目標怎麼辦？', a: '可以調整目標，或只看下一步。不需要一次到位。' }
  ],
  threegood: [
    { q: '想不出三件怎麼辦？', a: '一件也可以。小事算，沒有想到也沒關係。' }
  ],
  supportcard: [
    { q: '沒有人可以找怎麼辦？', a: '可以寫下專線或機構。不需要有特定的人。' }
  ],
  transition: [
    { q: '變動太大怎麼辦？', a: '可以先寫「想保留」和「先照顧」的一件事。其他的可以慢慢來。' }
  ],
  selfaffirm: [
    { q: '寫不出來怎麼辦？', a: '可以從「我今天有努力」開始。不用完美。' }
  ],
  counselprep: [
    { q: '一定要先把問題想清楚嗎？', a: '不需要。這份工具只是幫你整理想確認的事。' },
    { q: '填完會幫我預約嗎？', a: '不會。你可以複製文字，自行向機構詢問。' }
  ],
  bodycheck: [
    { q: '不確定感覺是什麼能選嗎？', a: '可以。描述裡有「不確定」，說不清楚位置可以選「其他」。' },
    { q: '身體痠痛一定代表壓力嗎？', a: '不一定。可能和姿勢、睡眠、受傷有關。持續不適請找醫師評估。' }
  ],
  gratitude: [
    { q: '一定要寫三件嗎？', a: '不用。寫一件就完成了，想多寫可以寫到三件。' },
    { q: '沒有值得感謝的事怎麼辦？', a: '可以留白，或記一件讓自己稍微喘口氣的事。不需要勉強。' }
  ],
  relpause: [
    { q: '這張卡會告訴我對方是不是不愛我嗎？', a: '不會。這裡只幫你把知道的事和猜測分開，不判斷對方的想法或感情。' },
    { q: '暫時不回應是比較成熟嗎？', a: '不一定。它只是其中一個選項；有時候直接說出感受，或找朋友聊聊，會更適合。' }
  ],
  phone: [
    { q: '這會鎖我的手機嗎？', a: '不會。這只是幫你為單次使用設一個結束點。' },
    { q: '我需要戒手機嗎？', a: '不用。手機是工具，只是規劃這次怎麼用。' }
  ],
  smallstep: [
    { q: '第一小步要多小？', a: '小到你現在做得到。五分鐘、一個角落、一件事，都可以。' },
    { q: '今天先不開始可以嗎？', a: '可以。有時候先決定「今天不做」也是一種整理。' }
  ],
  goodenough: [
    { q: '這是叫我隨便做嗎？', a: '不是。這張卡是先訂好「做到哪裡算完成」，讓你把力氣放在真正重要的地方。' },
    { q: '如果交出去被說不夠好怎麼辦？', a: '可以把回饋寫下來，下次的標準就會更準。被說需要修改，也不代表你不夠好。' }
  ],
  convo: [
    { q: '這和界線表達有什麼不同？', a: '我訊息用於開啟討論找安排，界線表達著重能接受與不能接受的範圍。可搭配使用。' }
  ],
  askhelp: [
    { q: '工具會替我傳訊息嗎？', a: '不會。內容由你編輯與複製，是否送出由你決定。' },
    { q: '對方拒絕了怎麼辦？', a: '對方可以拒絕或協商。可以說「謝謝你告訴我，我會再想其他安排」。' }
  ],
  repair: [
    { q: '一定要道歉嗎？', a: '不用。修復不等於強迫道歉。承認自己做了什麼、停止重複的行為、先尊重距離，都可以是修復的一步。' },
    { q: '什麼情況不適合主動聯絡？', a: '如果有暴力、威脅、跟蹤、控制，或擔心聯絡會更不安全，先不要主動聯絡。先照顧自己的安全。' }
  ],
  problemsolve: [
    { q: '想不到第二個方法怎麼辦？', a: '一個方法也可以完成。可以想想如果是朋友會建議什麼，或回想以前有幫助的做法。' },
    { q: '問題不是自己能控制的怎麼辦？', a: '可以整理情緒和支持資源，或只針對能做的小部分。' }
  ],
  decision: [
    { q: '這會告訴我該選哪個嗎？', a: '不會。這張表不打分數、不推薦，只是幫你把選項和條件攤開來看。' },
    { q: '可以不今天決定嗎？', a: '可以。下一步可以是「先找資訊」或「先不決定」。' }
  ],
  tasksorter: [
    { q: '一定要把所有事情都分類嗎？', a: '不用。留在「還沒決定」也可以。' },
    { q: '今天沒有想處理的事怎麼辦？', a: '可以選「今天先不安排」，一樣能拿到整理結果。' }
  ],
  sleepdiary: [
    { q: '一定要每天記嗎？', a: '不用。漏掉可以留空，只記一兩天也可以。' },
    { q: '這能診斷失眠嗎？', a: '不能。這是個人觀察紀錄，可以帶給醫師參考。' }
  ],
  sayingno: [
    { q: '一定要給理由嗎？', a: '不用。「這次我沒辦法」就夠了。' }
  ],
  apology: [
    { q: '一定要道歉嗎？', a: '如果是你的部分，道歉可以幫助修復。但不用完美。' }
  ],
  thoughtcheck: [
    { q: '這是在教我正面思考嗎？', a: '不是。目的是把事件和想法分開，看看線索。如果原本的想法有它的道理，也可以保留。' },
    { q: '找不到其他看法怎麼辦？', a: '可以先停在這裡。有時候隔一段時間再看，會比較容易。' }
  ],
  tasksep: [
    { q: '這是不是「別人的事不用管」？', a: '不是。你可以決定自己的行動，對方可以決定怎麼回應，而共同生活常常需要一起協商。' },
    { q: '分不清楚怎麼辦？', a: '可以先放在「還不確定」。分類沒有標準答案。' }
  ],
  values: [
    { q: '這是價值觀測驗嗎？', a: '不是。不計分、不分析人格，只幫你整理現在在意的方向。' },
    { q: '排序會變嗎？', a: '會。排序只代表「現在」，過一陣子改變很正常。' }
  ],
  careguide: [
    { q: '一定要全部做到嗎？', a: '不用。你不需要每一項都做到，也可以跟對方說你的限度。' }
  ],
  lowenergy: [
    { q: '做了還是沒有比較好？', a: '正常。改變是慢的、小的。可以換活動，或找專業人員聊聊。' },
    { q: '連 2 分鐘都做不到？', a: '先休息。如果持續這樣，可以找身心科或諮商。' }
  ],
  docprep: [
    { q: '一定要全部問完嗎？', a: '不用。可以先勾最重要的兩三題。' }
  ],
  breakup: [
    { q: '一定要馬上好起來嗎？', a: '不用。給自己時間。找出難熬的時段，準備小事就好。' }
  ],
  examprep: [
    { q: '準備不完怎麼辦？', a: '先確認最重要的，其他的可以列在備案。' }
  ],
  relatives: [
    { q: '被追問怎麼辦？', a: '可以再說一次「今天先不談這個」，或暫時離開談話。' }
  ],
  parenttalk: [
    { q: '孩子還是不說話怎麼辦？', a: '可以說「不想說也沒關係」，給空間。不需要立刻有回應。' }
  ],
  mindfulreply: [
    { q: '還是很想回嘴怎麼辦？', a: '可以先不回，等一下再看。不回也是一種選擇。' }
  ],
  screentime: [
    { q: '孩子不遵守怎麼辦？', a: '可以一起回頭看約定，調整規則。不需要一次完美。' }
  ],
  visualcard: [
    { q: '孩子看不懂怎麼辦？', a: '可以用更簡單的圖示，或一起看著卡片說。' }
  ],
  workplace: [
    { q: '這是法律建議嗎？', a: '不是。這只是幫你記錄。如果需要，請尋求法律或工會協助。' }
  ],
  stresscheck: [
    { q: '壓力太多怎麼辦？', a: '先挑一個可以處理的。其他的可以先放著。' }
  ],
  energycheck: [
    { q: '能量一直很低怎麼辦？', a: '如果持續超過兩週，影響生活，可以找專業人員聊聊。' }
  ],
  socialbattery: [
    { q: '每次都想早點走正常嗎？', a: '正常。根據自己的電量決定，不需要勉強。' }
  ],
  goalreview: [
    { q: '沒有達到目標怎麼辦？', a: '可以調整目標，或只看下一步。不需要一次到位。' }
  ],
  threegood: [
    { q: '想不出三件怎麼辦？', a: '一件也可以。小事算，沒有想到也沒關係。' }
  ],
  supportcard: [
    { q: '沒有人可以找怎麼辦？', a: '可以寫下專線或機構。不需要有特定的人。' }
  ],
  transition: [
    { q: '變動太大怎麼辦？', a: '可以先寫「想保留」和「先照顧」的一件事。其他的可以慢慢來。' }
  ],
  selfaffirm: [
    { q: '寫不出來怎麼辦？', a: '可以從「我今天有努力」開始。不用完美。' }
  ],
  counselprep: [
    { q: '一定要先把問題想清楚嗎？', a: '不需要。這份工具只是幫你整理想確認的事。' },
    { q: '填完會幫我預約嗎？', a: '不會。你可以複製文字，自行向機構詢問。' }
  ],
  bodycheck: [
    { q: '不確定感覺是什麼能選嗎？', a: '可以。描述裡有「不確定」，說不清楚位置可以選「其他」。' },
    { q: '身體痠痛一定代表壓力嗎？', a: '不一定。可能和姿勢、睡眠、受傷有關。持續不適請找醫師評估。' }
  ],
  gratitude: [
    { q: '一定要寫三件嗎？', a: '不用。寫一件就完成了，想多寫可以寫到三件。' },
    { q: '沒有值得感謝的事怎麼辦？', a: '可以留白，或記一件讓自己稍微喘口氣的事。不需要勉強。' }
  ],
  relpause: [
    { q: '這張卡會告訴我對方是不是不愛我嗎？', a: '不會。這裡只幫你把知道的事和猜測分開，不判斷對方的想法或感情。' },
    { q: '暫時不回應是比較成熟嗎？', a: '不一定。它只是其中一個選項；有時候直接說出感受，或找朋友聊聊，會更適合。' }
  ],
  phone: [
    { q: '這會鎖我的手機嗎？', a: '不會。這只是幫你為單次使用設一個結束點。' },
    { q: '我需要戒手機嗎？', a: '不用。手機是工具，只是規劃這次怎麼用。' }
  ],
  smallstep: [
    { q: '一定要選卡點嗎？', a: '不用。略過時會用通用提示。' },
    { q: '今天真的沒力氣怎麼辦？', a: '選「今天先不開始」，不會被記成失敗。' }
  ],
  compassion: [
    { q: '寫不出來怎麼辦？', a: '可以先空著，或只寫你能接受的部分。不用完美。' },
    { q: '這會讓我變得不努力嗎？', a: '不會。對自己溫和不是放棄，是給自己繼續的空間。' }
  ]
};

function renderToolFAQ(toolId) {
  const faqs = toolFAQ[toolId];
  if (!faqs) return '';
  const isZh = lang === 'zh';
  let html = `<details style="margin-top:2rem;"><summary style="cursor:pointer; font-weight:500; color:var(--accent);">${isZh ? '常見問題' : 'FAQ'}</summary><div style="margin-top:1rem;">`;
  faqs.forEach(f => {
    html += `<p style="margin:0.8rem 0;"><strong>${f.q}</strong><br><span style="color:var(--text-soft);">${f.a}</span></p>`;
  });
  html += '</div></details>';
  return html;
}


// Init
applyTheme();
renderGuided();
document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
renderHome();
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash && tools.some(t => t.id === hash)) openTool(hash);
});
