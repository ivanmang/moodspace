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

  { id: 'moodtracker', icon: '📈', cat: 'emotions', zh: { name: '心情紀錄', desc: '每天記下心情，看看這一週的變化。資料只留在你的瀏覽器。' }, en: { name: 'Mood Tracker', desc: 'Log your mood each day and see the week\'s pattern. Data stays in your browser.' } },
  { id: 'feelings', icon: '💭', cat: 'emotions', zh: { name: '情緒與需要整理卡', desc: '不太確定自己在想什麼、感受什麼？選幾個詞，整理此刻可能的需要。' }, en: { name: 'Feelings & Needs Card', desc: 'Name feelings, note what happened, identify needs, then choose one next step' } },
  { id: 'worry', icon: '😰', cat: 'emotions', zh: { name: '擔心整理＋擔心時間', desc: '擔心的事反覆出現？先記下來，區分可以處理和暫時放下的部分。' }, en: { name: 'Worry Sorter', desc: 'List your worries, then sort what you can act on' } },
  { id: 'compassion', icon: '💚', cat: 'emotions', zh: { name: '對自己換一句話', desc: '常常責備自己？試著找到一種比較能接受的方式回應自己。' }, en: { name: 'Self-Compassion Response', desc: 'Write a harsh self-talk, then rephrase it as if talking to a friend' } },
  { id: 'gratitude', icon: '🙏', cat: 'emotions', zh: { name: '感恩日記', desc: '記下今天值得感謝，或讓你覺得還不錯的一件小事。' }, en: { name: 'Gratitude Journal', desc: 'Note things you appreciate, one at a time' } },
  { id: 'thoughtcheck', icon: '🔍', cat: 'emotions', zh: { name: '想法核對練習', desc: '一個想法讓你很難受？整理有哪些線索支持它，還有哪些可能的看法。' }, en: { name: 'Thought Check', desc: 'Write the thought, find evidence for and against, then write a balanced version' } },
  { id: 'boundary', icon: '🚧', cat: 'communication', zh: { name: '界線表達練習', desc: '有些話很難開口？先找出符合處境、自己也說得出口的表達方式。' }, en: { name: 'Boundary Expression', desc: 'Clarify the boundary, then practice a short phrase to express it' } },
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
    { key: 'worries', type: 'text', explain: isZh ? '把腦中的擔心一件一行寫下來。不用想完整，先放下來。' : 'Write each worry on its own line. No need to be complete — just get them out.', hint: isZh ? '一行寫一件，不用想完整' : 'One per line — no need to be complete', title: isZh ? '把擔心寫下來（一行一個）' : 'List your worries (one per line)', placeholder: isZh ? '例如：明天會議會不會出錯' : 'e.g. What if the meeting goes badly' },
    { key: 'canact', type: 'text', explain: isZh ? '哪些是你現在或最近能做點什麼的？寫下來。' : 'Which ones can you do something about now or soon? Write them down.', hint: isZh ? '寫下你現在或最近能做的事' : 'Write what you can do now or soon', title: isZh ? '哪些是我可以採取行動的？' : 'Which can I take action on?', placeholder: isZh ? '例：查資料、問人、安排時間' : 'e.g. look up info, ask someone, schedule time' },
    { key: 'park', type: 'text', explain: isZh ? '還沒發生的「如果…」、別人的決定、已經發生的事，可以先放著。' : 'Things that haven\'t happened, others\' decisions, or past events can be parked for now.', hint: isZh ? '還沒發生的「如果…」、別人的決定、已經發生的事' : 'Things that haven\'t happened, others\' decisions, past events', title: isZh ? '哪些先放著？' : 'Which to park for now?', placeholder: isZh ? '例：如果對方不喜歡我怎麼辦' : 'e.g. What if they don\'t like me' },
    { key: 'worrytime', type: 'text', explain: isZh ? '給擔心一個固定時間，其他時間先放著。選填。' : 'Give worries a set time. Park them the rest of the time. Optional.', hint: isZh ? '例：每天晚上八點，十分鐘' : 'e.g. 8 pm every day, 10 minutes', title: isZh ? '給擔心一個固定時間（選填）' : 'Set a worry time (optional)', placeholder: isZh ? '例：每天晚上八點，十分鐘' : 'e.g. 8 pm daily, 10 minutes' }
  ];
  if (id === 'compassion') return [
    { key: 'harsh', type: 'text', explain: isZh ? '寫下你對自己說的話，不用修飾。這不是要你批評自己。' : 'Write what you say to yourself, without polishing. This is not about criticizing yourself.', hint: isZh ? '寫下你對自己說的話，不用修飾' : 'Write what you actually say to yourself', title: isZh ? '最近對自己說了什麼嚴厲的話？' : 'What harsh thing have you been saying to yourself?' },
    { key: 'difficulty', type: 'text', explain: isZh ? '現在實際遇到什麼困難？寫下來，幫助自己看清楚。' : 'What difficulty are you actually facing? Writing it down can help clarify.', hint: isZh ? '現在實際遇到什麼困難？' : 'What difficulty are you actually facing?', title: isZh ? '現在遇到的困難是…' : 'The difficulty I\'m facing is…', placeholder: isZh ? '例：工作量突然增加，來不及完成' : 'e.g. Workload suddenly increased' },
    { key: 'kind', type: 'text', explain: isZh ? '如果是對好朋友說，你會怎麼說？試著寫一句你能接受的話。' : 'What would you say to a good friend? Try writing a phrase you can accept.', hint: isZh ? '試著寫一句你能接受的新說法' : 'Try writing a phrase you can accept', title: isZh ? '如果是對好朋友說，你會怎麼說？' : 'What would you say to a good friend in the same situation?' }
  ];
  if (id === 'gratitude') return [
    { key: 'g1', type: 'text', explain: isZh ? '小事也可以。寫得出來就好，不用想很大的事。' : 'Small things count. Just write what comes to mind.', hint: isZh ? '小事也可以，寫得出來就好' : 'Small things count — just write what comes to mind', title: isZh ? '第一件值得感謝的事' : 'First thing I appreciate' },
    { key: 'g2', type: 'text', explain: isZh ? '選填。有想到再寫。' : 'Optional. Write if something comes to mind.', title: isZh ? '第二件（選填）' : 'Second (optional)' },
    { key: 'g3', type: 'text', explain: isZh ? '選填。有想到再寫。' : 'Optional. Write if something comes to mind.', title: isZh ? '第三件（選填）' : 'Third (optional)' }
  ];
  if (id === 'thoughtcheck') return [
    { key: 'thought', type: 'text', explain: isZh ? '用一句話寫下那個想法。不是要證明它對或錯。' : 'Write the thought in one sentence. This is not about proving it right or wrong.', hint: isZh ? '用一句話寫下那個想法' : 'Write the thought in one sentence', title: isZh ? '那個想法是什麼？' : 'What is the thought?' },
    { key: 'pattern', type: 'multi', max: 2, explain: isZh ? '這個想法比較接近哪種模式？選最接近的，不確定也可以跳過。這些是常見的思考習慣，不是診斷。' : 'Which pattern does this thought resemble? Pick the closest. These are common thinking habits, not a diagnosis.', hint: isZh ? '選最接近的，不確定可以跳過' : 'Pick the closest — skip if unsure', title: isZh ? '這個想法比較接近哪種模式？' : 'Which pattern does this thought resemble?', options: isZh ? ['全有或全無（非黑即白）','過度概括（一次就代表永遠）','讀心術（猜別人在想什麼）','災難化（想像最壞結果）','應該思考（一定要、不應該）','個人化（都是我的錯）','忽略正面（只看壞的）','情緒推理（感覺如此就是真的）','不確定／其他'] : ['All-or-nothing','Overgeneralizing','Mind reading','Catastrophizing','Should statements','Personalizing','Discounting the positive','Emotional reasoning','Not sure / Other'] },
    { key: 'for', type: 'text', explain: isZh ? '有哪些實際發生的事支持這個想法？寫下來。' : 'What actually happened that supports this thought? Write it down.', title: isZh ? '支持這個想法的證據' : 'Evidence that supports it' },
    { key: 'against', type: 'text', explain: isZh ? '有哪些線索不太支持？過去的經驗、別人的其他反應都可以。' : 'What evidence does not support it? Past experience or other reactions count.', title: isZh ? '不支持或相反的證據' : 'Evidence against it' },
    { key: 'balanced', type: 'text', explain: isZh ? '試著寫一個比較完整的看法。找不到也可以留白。' : 'Try writing a more complete view. Leaving it blank is okay.', title: isZh ? '更平衡的想法可能是…' : 'A more balanced thought might be…' }
  ];
  if (id === 'boundary') return [
    { key: 'situation', type: 'text', explain: isZh ? '是什麼情況讓你想設定界線？寫下來幫助自己釐清。' : 'What situation makes you want to set a boundary? Writing it helps clarify.', hint: isZh ? '例：下班後收到非緊急訊息、被問私事' : 'e.g. non-urgent messages after work, personal questions', title: isZh ? '是什麼情況讓你想設定界線？' : 'What situation makes you want to set a boundary?', placeholder: isZh ? '例：下班後收到非緊急訊息' : 'e.g. Non-urgent messages after work' },
    { key: 'boundary', type: 'text', explain: isZh ? '具體一點會比較容易表達。寫下你想保留或拒絕的是什麼。' : 'Being specific makes it easier to express. Write what you want to keep or decline.', hint: isZh ? '具體一點會比較容易表達' : 'Being specific makes it easier to express', title: isZh ? '我想設定的界線是…' : 'The boundary I want to set is…', placeholder: isZh ? '例：保留下班後的休息時間' : 'e.g. Keep my rest time after work' },
    { key: 'phrase', type: 'text', explain: isZh ? '先寫一句你說得出口的話。之後可以再調整。' : 'Write a phrase you can actually say. You can adjust it later.', hint: isZh ? '可以先寫溫和的說法，之後再調整' : 'Start with a gentle version, adjust later', title: isZh ? '我可以這樣說：' : 'I can say it like this:', placeholder: isZh ? '例：我下班後需要休息，明天再回你' : 'e.g. I need rest after work, I\'ll reply tomorrow' }
  ];
  if (id === 'convo') return [
    { key: 'who', type: 'text', explain: isZh ? '寫名字或關係都可以，如「主管」「媽媽」。' : 'Name or relationship is fine, e.g. manager, mom.', hint: isZh ? '可以寫名字或關係，如「主管」「媽媽」' : 'Name or relationship is fine, e.g. manager, mom', title: isZh ? '對話對象是誰？' : 'Who will I talk to?' },
    { key: 'goal', type: 'text', explain: isZh ? '這次對話你希望達到什麼？寫下來幫助自己聚焦。' : 'What do you hope to achieve? Writing it helps you focus.', title: isZh ? '我想達到的目的是？' : 'What outcome do I want?' },
    { key: 'points', type: 'text', explain: isZh ? '列出想說的重點。不用一次說完，先整理。' : 'List the key points. No need to say everything — just organize.', title: isZh ? '我想說的重點' : 'Key points I want to say' }
  ];
  if (id === 'smallstep') return [
    { key: 'big', type: 'text', explain: isZh ? '用一句話寫下你想處理的事。不用想完整計畫。' : 'Write what you want to handle in one sentence. No need for a full plan.', hint: isZh ? '用一句話寫下你想處理的事' : 'Write what you want to handle in one sentence', title: isZh ? '想做的大事情是…' : 'The bigger thing I want to do is…', placeholder: isZh ? '例：整理房間、開始運動、回覆積壓的訊息' : 'e.g. tidy the room, start exercising, reply to messages' },
    { key: 'stuck', type: 'single', explain: isZh ? '選最接近的卡點。這幫助你找到適合的第一步。' : 'Pick the closest stuck point. This helps find a fitting first step.', hint: isZh ? '選最接近的就好' : 'Just pick the closest one', title: isZh ? '現在卡在哪裡？' : 'Where are you stuck?', options: isZh ? ['太大了不知道從哪開始','不知道第一步是什麼','沒有時間或精力','怕做不好','其他'] : ['Too big, don\'t know where to start','Don\'t know the first step','No time or energy','Afraid of doing it poorly','Other'] },
    { key: 'small', type: 'text', explain: isZh ? '越小越好，最好是今天就能做的。寫下來就好。' : 'Smaller is better — ideally something you can do today. Just write it down.', hint: isZh ? '越小越好，最好是今天就能做的' : 'Smaller is better — ideally something you can do today', title: isZh ? '今天可以做的最小一步是…' : 'The smallest step I can take today is…', placeholder: isZh ? '例：先整理桌面的一個角落' : 'e.g. Just tidy one corner of the desk' }
  ];
  if (id === 'decision') return [
    { key: 'optA', type: 'text', explain: isZh ? '用一句話描述選項 A。' : 'Describe Option A in one sentence.', hint: isZh ? '用一句話描述就好' : 'One sentence is enough', title: isZh ? '選項 A 是什麼？' : 'What is Option A?' },
    { key: 'optB', type: 'text', explain: isZh ? '用一句話描述選項 B。' : 'Describe Option B in one sentence.', title: isZh ? '選項 B 是什麼？' : 'What is Option B?' },
    { key: 'aPros', type: 'text', explain: isZh ? '寫下選項 A 的好處和風險。不用想完整。' : 'Write the pros and cons of Option A. No need to be complete.', title: isZh ? '選項 A 的好處與風險' : 'Pros and cons of Option A' },
    { key: 'bPros', type: 'text', explain: isZh ? '寫下選項 B 的好處和風險。不用想完整。' : 'Write the pros and cons of Option B. No need to be complete.', title: isZh ? '選項 B 的好處與風險' : 'Pros and cons of Option B' }
  ];
  if (id === 'values') return [
    { key: 'values', type: 'multi', max: 3, hint: isZh ? '選少一點比較容易排出先後' : 'Fewer choices make it easier to prioritize', title: isZh ? '選出目前最重要的 3 個價值' : 'Select the 3 values that matter most right now', options: isZh ? ['健康','關係','成長','自由','貢獻','成就','平靜','創造','安全','樂趣'] : ['Health','Relationships','Growth','Freedom','Contribution','Achievement','Calm','Creativity','Safety','Fun'] },
    { key: 'action', type: 'text', explain: isZh ? '挑一個方向，寫一件這週做得到的小事。' : 'Pick one direction and write one small action for this week.', hint: isZh ? '越小越好，這週做得到的就好' : 'Smaller is better — something doable this week', title: isZh ? '這週想多照顧哪個？寫一件小事' : 'Which one do you want to care for more this week? Write one small action', placeholder: isZh ? '例：這週有兩個晚上十一點前關電腦睡覺' : 'e.g. Two nights this week, close the laptop before 11' }
  ];
  if (id === 'supportcard') return [
    { key: 'people', type: 'text', explain: isZh ? '寫名字和怎麼聯絡，方便之後找。' : 'Write names and how to reach them, for later.', hint: isZh ? '寫名字和怎麼聯絡，方便之後找' : 'Name and how to reach them, for later', title: isZh ? '我可以找的人（名字＋怎麼聯絡）' : 'People I can reach (name + how to contact)', placeholder: isZh ? '例：媽媽 電話／WhatsApp' : 'e.g. Mom, phone / WhatsApp' },
    { key: 'resources', type: 'text', explain: isZh ? '專線、機構、網站都可以。寫下來方便之後找。' : 'Hotlines, centers, websites all count. Write them down for later.', hint: isZh ? '專線、機構、網站都可以' : 'Hotlines, centers, websites all count', title: isZh ? '其他資源（專線、機構、網站）' : 'Other resources (hotlines, centers, sites)', placeholder: isZh ? '例：情緒通 18111、撒瑪利亞會 2896 0000' : 'e.g. Emotional Support 18111' },
    { key: 'note', type: 'text', explain: isZh ? '選填。寫給自己看的提醒。' : 'Optional. A note for yourself.', hint: isZh ? '選填，寫給自己看的提醒' : 'Optional — a note for yourself', title: isZh ? '其他想記下來的（選填）' : 'Anything else to note (optional)', placeholder: isZh ? '例：週末可以找朋友喝咖啡' : 'e.g. Can meet a friend for coffee on weekends' }
  ];

  if (id === 'tasksep') return [
    { key: 'situation', type: 'text', explain: isZh ? '用一句話描述這件事。' : 'Describe the situation in one sentence.', hint: isZh ? '用一句話描述這件事' : 'Describe it in one sentence', title: isZh ? '這件事是…' : 'This situation is…' },
    { key: 'mine', type: 'text', explain: isZh ? '哪些部分是你能負責或決定的？寫下來。' : 'What parts are yours to handle or decide? Write them down.', title: isZh ? '哪些部分是我可以負責的？' : 'What parts are mine to handle?' },
    { key: 'notmine', type: 'text', explain: isZh ? '哪些部分不是你能控制的？寫下來，幫助自己放下。' : 'What parts are outside your control? Writing them helps you let go.', title: isZh ? '哪些部分不是我能控制的？' : 'What parts are outside my control?' }
  ];
  if (id === 'repair') return [
    { key: 'what', type: 'text', explain: isZh ? '只寫你記得的部分，不用完整。' : 'Just what you remember — no need to be complete.', hint: isZh ? '只寫你記得的部分，不用完整' : 'Just what you remember — no need to be complete', title: isZh ? '發生了什麼事？' : 'What happened?', placeholder: isZh ? '例：我們為了週末安排起爭執' : 'e.g. We argued about weekend plans' },
    { key: 'step', type: 'text', explain: isZh ? '不用完美，先想一件願意做的事。' : 'Not perfect — just one thing you are willing to try.', hint: isZh ? '不用完美，先想一件願意做的事' : 'Not perfect — just one thing you are willing to try', title: isZh ? '衝突後我想先做的一件事' : 'One thing I want to do first after the conflict', placeholder: isZh ? '例：先傳一句訊息問對方還好嗎' : 'e.g. Send a message asking if they are okay' },
    { key: 'phrase', type: 'text', explain: isZh ? '寫下來就好，不一定要現在傳。' : 'Just write it down — you don\'t have to send it now.', hint: isZh ? '可以先寫下來，不一定要現在傳' : 'Write it down — you don\'t have to send it now', title: isZh ? '我可以怎麼說？' : 'How can I phrase it?', placeholder: isZh ? '例：剛才的事我有些後悔，想跟你聊聊' : 'e.g. I regret what happened, can we talk?' }
  ];
  if (id === 'goodenough') return [
    { key: 'task', type: 'text', explain: isZh ? '寫下你一直停不下來的那件事。' : 'Write the task you keep working on without stopping.', title: isZh ? '這件事是…' : 'The task is…' },
    { key: 'standard', type: 'text', explain: isZh ? '不用完美。寫下「夠好」的樣子，做到就可以停。' : 'Not perfect. Describe what good enough looks like — you can stop there.', hint: isZh ? '不用完美，寫下「夠好」的樣子' : 'Not perfect — describe what good enough looks like', title: isZh ? '「夠好」長什麼樣子？' : 'What does "good enough" look like?' },
    { key: 'stop', type: 'text', explain: isZh ? '做到這樣就夠了，之後可以停。寫下來提醒自己。' : 'Once you reach this, you can stop. Write it as a reminder.', title: isZh ? '做到這樣就夠了，之後可以停' : 'Once I reach this, I can stop' }
  ];
  if (id === 'phone') return [
    { key: 'trigger', type: 'text', explain: isZh ? '什麼時候或什麼情況最容易滑手機？寫下來。' : 'When or where do you scroll most? Write it down.', hint: isZh ? '例：等車時、睡前、無聊時' : 'e.g. waiting for the bus, before bed, when bored', title: isZh ? '我最容易無意識滑手機的時間／情境' : 'When/where I scroll mindlessly most' },
    { key: 'rule', type: 'text', explain: isZh ? '設定一個暫停規則。不用戒手機，只是先停一下。' : 'Set a pause rule. Not about quitting — just pausing first.', title: isZh ? '我想設定的暫停規則' : 'The pause rule I want to set' },
    { key: 'alt', type: 'text', explain: isZh ? '如果想滑，可以改做什麼？寫一個替代行動。' : 'If you want to scroll, what can you do instead? Write one alternative.', title: isZh ? '如果想滑，我可以改做什麼？' : 'If I want to scroll, I can instead…' }
  ];
  if (id === 'problemsolve') return [
    { key: 'problem', type: 'text', explain: isZh ? '用一句話說清楚問題是什麼。' : 'State the problem in one sentence.', title: isZh ? '問題是什麼？（一句話）' : 'What is the problem? (one sentence)' },
    { key: 'solutions', type: 'text', explain: isZh ? '先不用判斷好壞，至少寫兩個可能。寫下來就好。' : 'No need to judge yet — list at least two possibilities. Just write them down.', hint: isZh ? '先不用判斷好壞，至少寫兩個可能' : 'No need to judge yet — just list at least two possibilities', title: isZh ? '可能的解法（至少 2 個）' : 'Possible solutions (at least 2)' },
    { key: 'first', type: 'text', explain: isZh ? '選一個願意先試的解法。不用完美，先試就好。' : 'Pick one solution to try first. Not perfect — just try.', title: isZh ? '我願意先試的一個解法' : 'The one solution I will try first' },
    { key: 'when', type: 'text', explain: isZh ? '決定什麼時候開始。寫下來幫助自己行動。' : 'Decide when to start. Writing it helps you act.', title: isZh ? '第一步什麼時候做？' : 'When will I take the first step?' }
  ];
  if (id === 'selfbreak') return [
    { key: 'p1', type: 'text', explain: isZh ? '可以沿用例子，或改寫成自己的話。承認困難是第一步。' : 'Use the example or rewrite it. Acknowledging difficulty is the first step.', hint: isZh ? '可以沿用例子，或改寫成自己的話' : 'You can use the example or rewrite it in your own words', title: isZh ? '第一句：承認這是困難的時刻' : 'Phrase 1: Acknowledge this is a difficult moment', placeholder: isZh ? '例：這是一個困難的時刻' : 'e.g. This is a moment of difficulty' },
    { key: 'p2', type: 'text', explain: isZh ? '困難是共同的經驗。寫一句提醒自己的話。' : 'Difficulty is a shared experience. Write a reminder for yourself.', title: isZh ? '第二句：困難是共同的經驗' : 'Phrase 2: Difficulty is a shared human experience', placeholder: isZh ? '例：困難是人生的一部分' : 'e.g. Difficulty is part of life' },
    { key: 'p3', type: 'text', explain: isZh ? '給自己一句溫柔的話。可以沿用例子或改寫。' : 'Offer yourself a kind phrase. Use the example or rewrite it.', title: isZh ? '第三句：給自己一句溫柔的話' : 'Phrase 3: Offer yourself a kind phrase', placeholder: isZh ? '例：願我對自己溫柔一點' : 'e.g. May I be kind to myself' }
  ];
  if (id === 'bodycheck') return [
    { key: 'areas', type: 'multi', explain: isZh ? '選現在有感覺的部位。不用全部，選有感覺的就好。' : 'Select where you notice sensation. Just the ones you feel.', max: 5, hint: isZh ? '選有感覺的就好，不用全部' : 'Just the ones you notice — no need for all', title: isZh ? '哪個部位現在有感覺？' : 'Where do you notice sensation?', options: isZh ? ['頭／臉','肩膀／頸','胸口','肚子','手／手臂','腿／腳','全身'] : ['Head/Face','Shoulders/Neck','Chest','Belly','Hands/Arms','Legs/Feet','Whole body'] },
    { key: 'sensation', type: 'text', explain: isZh ? '簡單描述感覺。選填，不用分析原因。' : 'Briefly describe the sensation. Optional — no need to analyze.', title: isZh ? '簡單描述感覺（選填）' : 'Briefly describe the sensation (optional)' }
  ];
  if (id === 'sleep') return [
    { key: 'steps', type: 'multi', explain: isZh ? '選 2–3 個今晚想做的放鬆步驟。不用全部做。' : 'Pick 2–3 wind-down steps for tonight. No need to do all.', max: 3, hint: isZh ? '選 2–3 個就好，不用全部做' : 'Pick 2–3 — no need to do all', title: isZh ? '為今晚選 2–3 個放鬆步驟' : 'Choose 2–3 wind-down steps for tonight', options: isZh ? ['調暗燈光','關掉螢幕','簡單伸展','寫下明天一件事','聽輕柔聲音','喝溫水','深呼吸 5 次'] : ['Dim lights','Turn off screens','Gentle stretch','Write one thing for tomorrow','Listen to soft sound','Drink warm water','5 deep breaths'] },
    { key: 'when', type: 'text', explain: isZh ? '大概什麼時候開始？寫下來提醒自己。' : 'Roughly when will you start? Write it as a reminder.', hint: isZh ? '例：洗完澡後、上床前' : 'e.g. After shower, before bed', title: isZh ? '大概什麼時候開始？' : 'Roughly when will you start?', placeholder: isZh ? '例：晚上十點半' : 'e.g. Around 10:30 pm' }
  ];
  if (id === 'counselprep') return [
    { key: 'topics', type: 'text', explain: isZh ? '列出想談的主題。可以列幾個。' : 'List topics you want to discuss. A few is fine.', hint: isZh ? '可以列幾個想談的主題' : 'List a few topics you want to discuss', title: isZh ? '我希望這次輔導談什麼？' : 'What do I hope to talk about?' },
    { key: 'main', type: 'text', explain: isZh ? '目前最困擾的是什麼？寫下來幫助自己聚焦。' : 'What is bothering you most? Writing it helps you focus.', title: isZh ? '我目前最困擾的是…' : 'What is bothering me most right now?' },
    { key: 'note', type: 'text', title: isZh ? '有什麼我希望輔導師知道的？' : 'Anything I want the counselor to know?' }
  ];


  if (id === 'tasksorter') return [
    { key: 'tasks', type: 'text', explain: isZh ? '把腦中的事情一件件寫下來，一行一個。' : 'Write each task on its own line.', hint: isZh ? '最多寫 10 件就好' : 'Up to 10 is enough', title: isZh ? '腦中有哪些待辦？' : 'What tasks are on your mind?', placeholder: isZh ? '例：回覆訊息、整理房間、準備會議' : 'e.g. reply to messages, tidy room, prepare meeting' },
    { key: 'today', type: 'text', explain: isZh ? '從上面挑一件今天有意願也有條件處理的。' : 'Pick one you are willing and able to handle today.', title: isZh ? '今天想先處理哪一件？' : 'Which one do you want to handle today?', placeholder: isZh ? '例：回覆確認時間的信' : 'e.g. reply to confirm the time' },
    { key: 'first', type: 'text', explain: isZh ? '寫下第一個可執行的小動作。' : 'Write the first actionable step.', hint: isZh ? '越小越好' : 'Smaller is better', title: isZh ? '第一小步是什麼？' : 'What is the first small step?', placeholder: isZh ? '例：打開信件，先確認可行的時間' : 'e.g. open the email, check available times' }
  ];
  if (id === 'askhelp') return [
    { key: 'who', type: 'text', explain: isZh ? '你想請誰幫忙？' : 'Who do you want to ask?', title: isZh ? '想請誰幫忙？' : 'Who do you want to ask for help?', placeholder: isZh ? '例：同事、朋友、家人' : 'e.g. colleague, friend, family' },
    { key: 'what', type: 'text', explain: isZh ? '具體說明需要什麼幫忙。' : 'Be specific about what help you need.', title: isZh ? '需要什麼幫忙？' : 'What help do you need?', placeholder: isZh ? '例：幫我看一下這份文件有沒有問題' : 'e.g. Can you check if this document has issues' },
    { key: 'message', type: 'text', explain: isZh ? '整理成一段可以修改的訊息。' : 'Draft a message you can edit.', hint: isZh ? '寫下來就好，不一定要現在傳' : 'Just write it — you don\'t have to send it now', title: isZh ? '我可以這樣說：' : 'I can say it like this:', placeholder: isZh ? '例：你好，我想請你幫我看一下…' : 'e.g. Hi, could you help me check…' }
  ];
  if (id === 'careguide') return [
    { key: 'signs', type: 'multi', max: 4, explain: isZh ? '低落時別人可能會看到的樣子。' : 'What others might notice when you are low.', title: isZh ? '我狀態不好的時候，你可能會看到' : 'When I am not okay, you might notice', options: isZh ? ['話變少、不太回訊息','一直待在房間或床上','容易煩躁、講話比較衝','一直說「我沒事」','吃很少或吃很多','睡很多或睡不著','一直道歉、覺得自己很糟'] : ['Talk less, reply slowly','Stay in room or bed','Get irritable easily','Keep saying I am fine','Eat very little or a lot','Sleep a lot or not at all','Apologize a lot, feel bad about myself'] },
    { key: 'helpful', type: 'multi', max: 4, explain: isZh ? '選對你有幫助的陪伴方式。' : 'Pick ways of support that help you.', title: isZh ? '這些陪法對我有幫助' : 'These ways of support help me', options: isZh ? ['陪我坐著就好，不用一直說話','傳一句「我在」，不用急著等我回','問我想被安慰還是被聽','聽我說完再回應','幫我買飯或提醒我吃東西','給我一點空間，但讓我知道你在'] : ['Just sit with me, no need to talk','Send a message saying you are there','Ask if I want comfort or just listening','Listen fully before responding','Help with food or remind me to eat','Give me space but let me know you are around'] },
    { key: 'note', type: 'text', explain: isZh ? '其他想讓對方知道的。選填。' : 'Anything else you want them to know. Optional.', title: isZh ? '其他想說的（選填）' : 'Anything else (optional)', placeholder: isZh ? '例：這些不代表我在生你的氣' : 'e.g. This does not mean I am angry at you' }
  ];
  if (id === 'lowenergy') return [
    { key: 'activity', type: 'single', explain: isZh ? '從負擔較小的活動中挑一件目前做得到的。' : 'Pick one low-effort activity you can do right now.', title: isZh ? '現在做得到的一件事' : 'One thing I can do right now', options: isZh ? ['喝一杯水','開窗透氣','站起來伸展','洗把臉','聽一首歌','寫下一件事','什麼都不做，休息一下'] : ['Drink a glass of water','Open a window','Stand and stretch','Wash my face','Listen to one song','Write down one thing','Do nothing, just rest'] }
  ];
  if (id === 'docprep') return [
    { key: 'changes', type: 'text', explain: isZh ? '近期有什麼變化？睡眠、情緒、生活都可以。' : 'Any recent changes? Sleep, mood, daily life all count.', title: isZh ? '近期有什麼變化？' : 'Any recent changes?', placeholder: isZh ? '例：這兩週睡不好，容易醒來' : 'e.g. Sleep has been poor these two weeks' },
    { key: 'meds', type: 'text', explain: isZh ? '目前用藥情況。選填。' : 'Current medications. Optional.', title: isZh ? '目前用藥（選填）' : 'Current medications (optional)', placeholder: isZh ? '例：沒有／正在吃…' : 'e.g. None / Currently taking…' },
    { key: 'questions', type: 'text', explain: isZh ? '想問醫師的問題。' : 'Questions you want to ask the doctor.', title: isZh ? '想問醫師的事' : 'Questions for the doctor', placeholder: isZh ? '例：這個症狀需要調整藥物嗎？' : 'e.g. Does this symptom need a medication adjustment?' }
  ];
  if (id === 'breakup') return [
    { key: 'hardtime', type: 'text', explain: isZh ? '這一週最難熬的時段是什麼時候？' : 'When is the hardest time this week?', title: isZh ? '最難熬的時段' : 'The hardest time', placeholder: isZh ? '例：晚上獨處時、看到共同朋友時' : 'e.g. evenings alone, seeing mutual friends' },
    { key: 'prepare', type: 'text', explain: isZh ? '為那個時段準備一件小事。' : 'Prepare one small thing for that time.', hint: isZh ? '越小越好' : 'Smaller is better', title: isZh ? '我可以先準備…' : 'I can prepare…', placeholder: isZh ? '例：準備一張播放清單、約朋友吃飯' : 'e.g. prepare a playlist, plan a meal with a friend' }
  ];
  if (id === 'transition') return [
    { key: 'keep', type: 'text', explain: isZh ? '這次變動中，你想保留的是什麼？' : 'In this change, what do you want to keep?', title: isZh ? '想保留的' : 'What I want to keep', placeholder: isZh ? '例：和朋友的聯絡、運動習慣' : 'e.g. staying in touch with friends, exercise habit' },
    { key: 'adjust', type: 'text', explain: isZh ? '哪些可以慢慢調整？' : 'What can you adjust gradually?', title: isZh ? '可以慢慢調整的' : 'What I can adjust gradually', placeholder: isZh ? '例：作息時間、通勤方式' : 'e.g. sleep schedule, commute' },
    { key: 'unclear', type: 'text', explain: isZh ? '還不確定的事。可以先放著。' : 'Things that are still unclear. They can wait.', title: isZh ? '還不確定的' : 'Still unclear', placeholder: isZh ? '例：新環境的人際關係' : 'e.g. relationships in the new environment' }
  ];
  if (id === 'relpause') return [
    { key: 'feeling', type: 'text', explain: isZh ? '訊息沒回時，你注意到什麼感受？' : 'When the message is not replied, what do you notice?', title: isZh ? '我注意到的感受' : 'What I notice', placeholder: isZh ? '例：不安、擔心被忽略' : 'e.g. uneasy, worried about being ignored' },
    { key: 'check', type: 'single', explain: isZh ? '先問自己：這是事實，還是我的解讀？' : 'Ask yourself: is this a fact, or my interpretation?', title: isZh ? '這是事實還是解讀？' : 'Fact or interpretation?', options: isZh ? ['還不確定','比較像是我的解讀','有一些事實依據'] : ['Not sure yet','More like my interpretation','Has some factual basis'] },
    { key: 'respond', type: 'text', explain: isZh ? '決定現在要不要回應。可以先不回。' : 'Decide whether to respond now. Not responding is okay.', title: isZh ? '我決定…' : 'I decide to…', placeholder: isZh ? '例：先等一下再看、傳一句簡單的訊息' : 'e.g. wait a bit, send a simple message' }
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
    { key: 'day', type: 'single', explain: isZh ? '選今天是第幾天。連續記錄七天。' : 'Select which day this is. Track for seven days.', title: isZh ? '今天是第幾天？' : 'Which day is this?', options: isZh ? ['第1天','第2天','第3天','第4天','第5天','第6天','第7天'] : ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'] },
    { key: 'bed', type: 'text', explain: isZh ? '幾點上床？' : 'What time did you go to bed?', title: isZh ? '上床時間' : 'Bedtime', placeholder: isZh ? '例：23:30' : 'e.g. 11:30 pm' },
    { key: 'sleep', type: 'text', explain: isZh ? '大概幾點睡著？' : 'Roughly what time did you fall asleep?', title: isZh ? '睡著時間' : 'Fell asleep', placeholder: isZh ? '例：00:15' : 'e.g. 12:15 am' },
    { key: 'wake', type: 'text', explain: isZh ? '幾點醒來？' : 'What time did you wake up?', title: isZh ? '醒來時間' : 'Wake time', placeholder: isZh ? '例：07:00' : 'e.g. 7:00 am' },
    { key: 'feel', type: 'single', explain: isZh ? '起床後的感覺。' : 'How did you feel after waking?', title: isZh ? '起床後感覺' : 'Feeling after waking', options: isZh ? ['精神不錯','普通','還是很累','不確定'] : ['Fairly refreshed','Okay','Still tired','Not sure'] }
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
  return [];
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

  let html = `
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
    // Show recommendations
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
    // Return a few popular ones
    return tools.filter(t => ['feelings', 'worry', 'smallstep', 'breathing'].includes(t.id)).slice(0, 4);
  }
  
  // Score tools by matching tags
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

// Call on init


// Interactive decision tree
function renderTree() {
  const container = document.getElementById('tree-container');
  if (!container) return;
  
  const tree = {
    zh: {
      start: { text: '開始', next: 'q1' },
      q1: {
        text: '現在最接近的狀態？',
        options: [
          { text: '情緒有些亂', next: 'q2a' },
          { text: '有話想說', next: 'q2b' },
          { text: '事情很多', next: 'q2c' },
          { text: '想先停一下', next: 'q2d' },
          { text: '想求助', next: 'result-help' }
        ]
      },
      q2a: {
        text: '更具體？',
        options: [
          { text: '擔心一直轉', next: 'result-worry' },
          { text: '對自己嚴厲', next: 'result-compassion' },
          { text: '不確定', next: 'result-feelings' }
        ]
      },
      q2b: {
        text: '更具體？',
        options: [
          { text: '想設定界線', next: 'result-boundary' },
          { text: '準備對話', next: 'result-convo' },
          { text: '衝突後想修復', next: 'result-repair' }
        ]
      },
      q2c: {
        text: '更具體？',
        options: [
          { text: '一直沒開始', next: 'result-smallstep' },
          { text: '待辦太多', next: 'result-tasksorter' },
          { text: '不知道先做什麼', next: 'result-values' }
        ]
      },
      q2d: {
        text: '更具體？',
        options: [
          { text: '身體很緊', next: 'result-body' },
          { text: '只想呼吸', next: 'result-breathing' },
          { text: '生氣想暫停', next: 'result-anger' }
        ]
      },
      'result-worry': { tools: ['worry', 'thoughtcheck'], text: '推薦：擔心整理、想法核對' },
      'result-compassion': { tools: ['compassion', 'selfbreak'], text: '推薦：對自己換一句話、自我同理休息' },
      'result-feelings': { tools: ['feelings', 'bodycheck'], text: '推薦：情緒與需要整理卡、身體覺察' },
      'result-boundary': { tools: ['boundary', 'convo'], text: '推薦：界線表達、對話前整理' },
      'result-convo': { tools: ['convo', 'askhelp'], text: '推薦：對話前整理、開口求助' },
      'result-repair': { tools: ['repair', 'relpause'], text: '推薦：衝突後修復、關係不安暫停' },
      'result-smallstep': { tools: ['smallstep', 'goodenough'], text: '推薦：第一小步、夠好就好' },
      'result-tasksorter': { tools: ['tasksorter', 'smallstep'], text: '推薦：待辦整理器、第一小步' },
      'result-values': { tools: ['values', 'tasksorter'], text: '推薦：我現在最在意什麼、待辦整理器' },
      'result-body': { tools: ['bodycheck', 'pmr', 'breathing'], text: '推薦：身體覺察、肌肉放鬆、呼吸' },
      'result-breathing': { tools: ['breathing', 'breathspace'], text: '推薦：呼吸練習、三分鐘呼吸空間' },
      'result-anger': { tools: ['anger', 'breathing'], text: '推薦：生氣暫停、呼吸練習' },
      'result-help': { tools: ['counselprep', 'docprep', 'supportcard'], text: '推薦：輔導準備、看診準備、支持資源卡' }
    }
  };
  
  let path = ['start'];
  
  function render() {
    const node = tree.zh[path[path.length - 1]];
    let html = '<div class="tree-path">';
    
    // Show path
    path.forEach((p, i) => {
      const n = tree.zh[p];
      if (n.text && p !== 'start') {
        html += `<span class="tree-crumb">${n.text || p}</span>`;
        if (i < path.length - 1) html += ' → ';
      }
    });
    html += '</div>';
    
    if (node.tools) {
      // Result
      html += `<div class="guided-result"><h3>${node.text}</h3>`;
      node.tools.forEach(id => {
        const tool = tools.find(t => t.id === id);
        if (tool) {
          html += `<a href="#" class="tool-link" onclick="event.preventDefault(); openTool('${id}')">${tool.icon || ''} ${tool[lang].name}</a>`;
        }
      });
      html += `<p style="margin-top:0.8rem;"><a href="#" onclick="event.preventDefault(); resetTree()" style="color:var(--accent);">重新開始</a></p></div>`;
    } else if (node.options) {
      // Question
      html += `<p style="font-weight:500; margin:0.8rem 0;">${node.text}</p><div class="options">`;
      node.options.forEach(opt => {
        html += `<button class="option-btn" onclick="goTree('${opt.next}')">${opt.text}</button>`;
      });
      html += '</div>';
      if (path.length > 1) {
        html += `<p style="margin-top:0.5rem;"><a href="#" onclick="event.preventDefault(); backTree()" style="color:var(--text-soft); font-size:0.9rem;">← 返回</a></p>`;
      }
    }
    
    container.innerHTML = html;
  }
  
  window.goTree = function(next) {
    path.push(next);
    render();
  };
  
  window.backTree = function() {
    if (path.length > 1) {
      path.pop();
      render();
    }
  };
  
  window.resetTree = function() {
    path = ['start'];
    render();
  };
  
  render();
}



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


// Init
applyTheme();
renderTree();
renderGuided();
document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
renderHome();
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash && tools.some(t => t.id === hash)) openTool(hash);
});
