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
  { id: 'feelings', cat: 'emotions', zh: { name: '情緒與需要整理卡', desc: '不太確定自己在想什麼、感受什麼？選幾個詞，整理此刻可能的需要。' }, en: { name: 'Feelings & Needs Card', desc: 'Name feelings, note what happened, identify needs, then choose one next step' } },
  { id: 'worry', cat: 'emotions', zh: { name: '擔心整理＋擔心時間', desc: '擔心的事反覆出現？先記下來，區分可以處理和暫時放下的部分。' }, en: { name: 'Worry Sorter', desc: 'List your worries, then sort what you can act on' } },
  { id: 'compassion', cat: 'emotions', zh: { name: '對自己換一句話', desc: '常常責備自己？試著找到一種比較能接受的方式回應自己。' }, en: { name: 'Self-Compassion Response', desc: 'Write a harsh self-talk, then rephrase it as if talking to a friend' } },
  { id: 'gratitude', cat: 'emotions', zh: { name: '感恩日記', desc: '記下今天值得感謝，或讓你覺得還不錯的一件小事。' }, en: { name: 'Gratitude Journal', desc: 'Note things you appreciate, one at a time' } },
  { id: 'thoughtcheck', cat: 'emotions', zh: { name: '想法核對練習', desc: '一個想法讓你很難受？整理有哪些線索支持它，還有哪些可能的看法。' }, en: { name: 'Thought Check', desc: 'Write the thought, find evidence for and against, then write a balanced version' } },
  { id: 'boundary', cat: 'communication', zh: { name: '界線表達練習', desc: '有些話很難開口？先找出符合處境、自己也說得出口的表達方式。' }, en: { name: 'Boundary Expression', desc: 'Clarify the boundary, then practice a short phrase to express it' } },
  { id: 'convo', cat: 'communication', zh: { name: '對話前整理紙', desc: '有件事想談，怕一開口就亂了？先寫下要談的重點與自己的需求。' }, en: { name: 'Conversation Prep', desc: 'Clarify who, what outcome you want, and key points before talking' } },
  { id: 'smallstep', cat: 'actions', zh: { name: '把事情拆成第一小步', desc: '一件事拖了很久還沒開始？試著找出現在做得到的第一步。' }, en: { name: 'First Small Step', desc: 'Write the bigger goal, then name the smallest step you can take today' } },
  { id: 'decision', cat: 'actions', zh: { name: '選擇比較', desc: '先寫出兩個選項，再分別列出好處與風險' }, en: { name: 'Decision Comparer', desc: 'Name two options, then list pros and cons for each' } },
  { id: 'values', cat: 'actions', zh: { name: '我現在最在意什麼', desc: '事情擠在一起時，先排出目前最在意、最需要處理的事。' }, en: { name: 'Values Sort', desc: 'Select the three values that matter most to you right now' } },
  { id: 'breathing', cat: 'pause', zh: { name: '呼吸練習', desc: '不想填寫文字時，可以跟著畫面輕輕呼吸，或照自己的速度進行。' }, en: { name: 'Breathing Exercise', desc: 'Follow a calm breathing rhythm' } },
  { id: 'fivesenses', cat: 'pause', zh: { name: '三分鐘五感練習', desc: '跟著提示留意周圍看見、聽見的事物；任何一步都可以跳過。' }, en: { name: 'Five Senses Practice', desc: 'Ground yourself one sense at a time' } },
  { id: 'anger', cat: 'pause', zh: { name: '生氣時的情緒暫停器', desc: '正在生氣、怕一開口就後悔時，先暫停一下再決定。' }, en: { name: 'Anger Pause', desc: 'Pause for 60 seconds before responding' } },
  { id: 'supportcard', cat: 'help', zh: { name: '我的支持資源卡', desc: '把遇到困難時可以聯絡的人、機構和聯絡方式整理在一起。' }, en: { name: 'Support Resource Card', desc: 'List people you can reach and other support resources' } },
  { id: 'tasksep', cat: 'emotions', zh: { name: '課題分離整理器', desc: '有件事牽涉別人的決定？分清自己能做的事，以及需要一起討論的部分。' }, en: { name: 'What is Mine to Handle', desc: 'Describe the situation, then separate what you can handle from what you cannot' } },
  { id: 'repair', cat: 'communication', zh: { name: '衝突後關係修復卡', desc: '吵完架不知道該不該聯絡？先整理發生的事、自己願意負責的部分和想採取的修復方式。' }, en: { name: 'Conflict Repair', desc: 'Decide one first step after a conflict, then practice how to say it' } },
  { id: 'goodenough', cat: 'actions', zh: { name: '夠好就好標準卡', desc: '常因為擔心不夠好而做個不停？先決定做到哪裡可以暫時停下。' }, en: { name: 'Good-Enough Standard', desc: 'Define what good enough looks like for a task, and when you can stop' } },
  { id: 'phone', cat: 'actions', zh: { name: '手機滑不停暫停計畫', desc: '一拿起手機就停不下來？選這次原本想做什麼、想在哪裡先停、放下後的第一個動作。' }, en: { name: 'Phone Pause Plan', desc: 'Identify when you scroll mindlessly, then set a pause rule and alternative' } },
  { id: 'problemsolve', cat: 'actions', zh: { name: '問題解決五步驟', desc: '有件事卡住了？說清楚問題、列出方法，選一個先試。' }, en: { name: 'Problem Solving', desc: 'Define the problem, list solutions, pick one to try, and set a time' } },
  { id: 'selfbreak', cat: 'emotions', zh: { name: '自我同理休息', desc: '用三句話給自己一點空間：承認困難、看到共同性、給自己溫柔' }, en: { name: 'Self-Compassion Break', desc: 'Offer yourself three phrases: acknowledge difficulty, note shared experience, be kind' } },
  { id: 'bodycheck', cat: 'emotions', zh: { name: '身體覺察地圖', desc: '想看看現在身體哪裡緊、哪裡有感覺？選部位，記下感覺，整理成一張覺察卡。' }, en: { name: 'Body Awareness', desc: 'Quickly scan your body, mark where you notice sensation, then describe it' } },
  { id: 'sleep', cat: 'pause', zh: { name: '睡前放鬆流程產生器', desc: '睡前腦袋停不下來時，選想做的活動，排出一份今晚的睡前流程。' }, en: { name: 'Bedtime Wind-Down', desc: 'Choose 2–3 simple wind-down steps for tonight' } },
  { id: 'counselprep', cat: 'help', zh: { name: '第一次諮商準備包', desc: '正在考慮心理諮商？先整理想談的內容和想問的問題。' }, en: { name: 'Counseling Prep', desc: 'Organize topics, main concern, and anything you want the counselor to know' } },
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
      card.innerHTML = `<h3>${tool[lang].name}</h3><p>${tool[lang].desc}</p>`;
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
    { key: 'try', type: 'single', title: isZh ? '我願意先試的一件事' : 'One thing I\'m willing to try first', options: isZh ? ['先停一下','找個人聽我說','查一項需要的資訊','先不決定'] : ['Just pause','Talk to someone','Look up one piece of info','Decide later'] }
  ];
  if (id === 'worry') return [
    { key: 'worries', type: 'text', explain: isZh ? '把腦中的擔心一件一行寫下來。不用想完整，先放下來。' : 'Write each worry on its own line. No need to be complete — just get them out.', hint: isZh ? '一行寫一件，不用想完整' : 'One per line — no need to be complete', title: isZh ? '把擔心寫下來（一行一個）' : 'List your worries (one per line)', placeholder: isZh ? '例如：明天會議會不會出錯' : 'e.g. What if the meeting goes badly' },
    { key: 'canact', type: 'text', explain: isZh ? '哪些是你現在或最近能做點什麼的？寫下來。' : 'Which ones can you do something about now or soon? Write them down.', hint: isZh ? '寫下你現在或最近能做的事' : 'Write what you can do now or soon', title: isZh ? '哪些是我可以採取行動的？' : 'Which can I take action on?', placeholder: isZh ? '例：查資料、問人、安排時間' : 'e.g. look up info, ask someone, schedule time' },
    { key: 'park', type: 'text', explain: isZh ? '還沒發生的「如果…」、別人的決定、已經發生的事，可以先放著。' : 'Things that haven\'t happened, others\' decisions, or past events can be parked for now.', hint: isZh ? '還沒發生的「如果…」、別人的決定、已經發生的事' : 'Things that haven\'t happened, others\' decisions, past events', title: isZh ? '哪些先放著？' : 'Which to park for now?', placeholder: isZh ? '例：如果對方不喜歡我怎麼辦' : 'e.g. What if they don\'t like me' },
    { key: 'worrytime', type: 'text', hint: isZh ? '例：每天晚上八點，十分鐘' : 'e.g. 8 pm every day, 10 minutes', title: isZh ? '給擔心一個固定時間（選填）' : 'Set a worry time (optional)', placeholder: isZh ? '例：每天晚上八點，十分鐘' : 'e.g. 8 pm daily, 10 minutes' }
  ];
  if (id === 'compassion') return [
    { key: 'harsh', type: 'text', explain: isZh ? '寫下你對自己說的話，不用修飾。這不是要你批評自己。' : 'Write what you say to yourself, without polishing. This is not about criticizing yourself.', hint: isZh ? '寫下你對自己說的話，不用修飾' : 'Write what you actually say to yourself', title: isZh ? '最近對自己說了什麼嚴厲的話？' : 'What harsh thing have you been saying to yourself?' },
    { key: 'difficulty', type: 'text', explain: isZh ? '現在實際遇到什麼困難？寫下來，幫助自己看清楚。' : 'What difficulty are you actually facing? Writing it down can help clarify.', hint: isZh ? '現在實際遇到什麼困難？' : 'What difficulty are you actually facing?', title: isZh ? '現在遇到的困難是…' : 'The difficulty I\'m facing is…', placeholder: isZh ? '例：工作量突然增加，來不及完成' : 'e.g. Workload suddenly increased' },
    { key: 'kind', type: 'text', hint: isZh ? '試著寫一句你能接受的新說法' : 'Try writing a phrase you can accept', title: isZh ? '如果是對好朋友說，你會怎麼說？' : 'What would you say to a good friend in the same situation?' }
  ];
  if (id === 'gratitude') return [
    { key: 'g1', type: 'text', hint: isZh ? '小事也可以，寫得出來就好' : 'Small things count — just write what comes to mind', title: isZh ? '第一件值得感謝的事' : 'First thing I appreciate' },
    { key: 'g2', type: 'text', title: isZh ? '第二件（選填）' : 'Second (optional)' },
    { key: 'g3', type: 'text', title: isZh ? '第三件（選填）' : 'Third (optional)' }
  ];
  if (id === 'thoughtcheck') return [
    { key: 'thought', type: 'text', explain: isZh ? '用一句話寫下那個想法。不是要證明它對或錯。' : 'Write the thought in one sentence. This is not about proving it right or wrong.', hint: isZh ? '用一句話寫下那個想法' : 'Write the thought in one sentence', title: isZh ? '那個想法是什麼？' : 'What is the thought?' },
    { key: 'for', type: 'text', explain: isZh ? '有哪些實際發生的事支持這個想法？寫下來。' : 'What actually happened that supports this thought? Write it down.', title: isZh ? '支持這個想法的證據' : 'Evidence that supports it' },
    { key: 'against', type: 'text', explain: isZh ? '有哪些線索不太支持？過去的經驗、別人的其他反應都可以。' : 'What evidence does not support it? Past experience or other reactions count.', title: isZh ? '不支持或相反的證據' : 'Evidence against it' },
    { key: 'balanced', type: 'text', explain: isZh ? '試著寫一個比較完整的看法。找不到也可以留白。' : 'Try writing a more complete view. Leaving it blank is okay.', title: isZh ? '更平衡的想法可能是…' : 'A more balanced thought might be…' }
  ];
  if (id === 'boundary') return [
    { key: 'situation', type: 'text', explain: isZh ? '是什麼情況讓你想設定界線？寫下來幫助自己釐清。' : 'What situation makes you want to set a boundary? Writing it helps clarify.', hint: isZh ? '例：下班後收到非緊急訊息、被問私事' : 'e.g. non-urgent messages after work, personal questions', title: isZh ? '是什麼情況讓你想設定界線？' : 'What situation makes you want to set a boundary?', placeholder: isZh ? '例：下班後收到非緊急訊息' : 'e.g. Non-urgent messages after work' },
    { key: 'boundary', type: 'text', explain: isZh ? '具體一點會比較容易表達。寫下你想保留或拒絕的是什麼。' : 'Being specific makes it easier to express. Write what you want to keep or decline.', hint: isZh ? '具體一點會比較容易表達' : 'Being specific makes it easier to express', title: isZh ? '我想設定的界線是…' : 'The boundary I want to set is…', placeholder: isZh ? '例：保留下班後的休息時間' : 'e.g. Keep my rest time after work' },
    { key: 'phrase', type: 'text', hint: isZh ? '可以先寫溫和的說法，之後再調整' : 'Start with a gentle version, adjust later', title: isZh ? '我可以這樣說：' : 'I can say it like this:', placeholder: isZh ? '例：我下班後需要休息，明天再回你' : 'e.g. I need rest after work, I\'ll reply tomorrow' }
  ];
  if (id === 'convo') return [
    { key: 'who', type: 'text', hint: isZh ? '可以寫名字或關係，如「主管」「媽媽」' : 'Name or relationship is fine, e.g. manager, mom', title: isZh ? '對話對象是誰？' : 'Who will I talk to?' },
    { key: 'goal', type: 'text', title: isZh ? '我想達到的目的是？' : 'What outcome do I want?' },
    { key: 'points', type: 'text', title: isZh ? '我想說的重點' : 'Key points I want to say' }
  ];
  if (id === 'smallstep') return [
    { key: 'big', type: 'text', explain: isZh ? '用一句話寫下你想處理的事。不用想完整計畫。' : 'Write what you want to handle in one sentence. No need for a full plan.', hint: isZh ? '用一句話寫下你想處理的事' : 'Write what you want to handle in one sentence', title: isZh ? '想做的大事情是…' : 'The bigger thing I want to do is…', placeholder: isZh ? '例：整理房間、開始運動、回覆積壓的訊息' : 'e.g. tidy the room, start exercising, reply to messages' },
    { key: 'stuck', type: 'single', explain: isZh ? '選最接近的卡點。這幫助你找到適合的第一步。' : 'Pick the closest stuck point. This helps find a fitting first step.', hint: isZh ? '選最接近的就好' : 'Just pick the closest one', title: isZh ? '現在卡在哪裡？' : 'Where are you stuck?', options: isZh ? ['太大了不知道從哪開始','不知道第一步是什麼','沒有時間或精力','怕做不好','其他'] : ['Too big, don\'t know where to start','Don\'t know the first step','No time or energy','Afraid of doing it poorly','Other'] },
    { key: 'small', type: 'text', explain: isZh ? '越小越好，最好是今天就能做的。寫下來就好。' : 'Smaller is better — ideally something you can do today. Just write it down.', hint: isZh ? '越小越好，最好是今天就能做的' : 'Smaller is better — ideally something you can do today', title: isZh ? '今天可以做的最小一步是…' : 'The smallest step I can take today is…', placeholder: isZh ? '例：先整理桌面的一個角落' : 'e.g. Just tidy one corner of the desk' }
  ];
  if (id === 'decision') return [
    { key: 'optA', type: 'text', hint: isZh ? '用一句話描述就好' : 'One sentence is enough', title: isZh ? '選項 A 是什麼？' : 'What is Option A?' },
    { key: 'optB', type: 'text', title: isZh ? '選項 B 是什麼？' : 'What is Option B?' },
    { key: 'aPros', type: 'text', title: isZh ? '選項 A 的好處與風險' : 'Pros and cons of Option A' },
    { key: 'bPros', type: 'text', title: isZh ? '選項 B 的好處與風險' : 'Pros and cons of Option B' }
  ];
  if (id === 'values') return [
    { key: 'values', type: 'multi', max: 3, hint: isZh ? '選少一點比較容易排出先後' : 'Fewer choices make it easier to prioritize', title: isZh ? '選出目前最重要的 3 個價值' : 'Select the 3 values that matter most right now', options: isZh ? ['健康','關係','成長','自由','貢獻','成就','平靜','創造','安全','樂趣'] : ['Health','Relationships','Growth','Freedom','Contribution','Achievement','Calm','Creativity','Safety','Fun'] },
    { key: 'action', type: 'text', hint: isZh ? '越小越好，這週做得到的就好' : 'Smaller is better — something doable this week', title: isZh ? '這週想多照顧哪個？寫一件小事' : 'Which one do you want to care for more this week? Write one small action', placeholder: isZh ? '例：這週有兩個晚上十一點前關電腦睡覺' : 'e.g. Two nights this week, close the laptop before 11' }
  ];
  if (id === 'supportcard') return [
    { key: 'people', type: 'text', hint: isZh ? '寫名字和怎麼聯絡，方便之後找' : 'Name and how to reach them, for later', title: isZh ? '我可以找的人（名字＋怎麼聯絡）' : 'People I can reach (name + how to contact)', placeholder: isZh ? '例：媽媽 電話／WhatsApp' : 'e.g. Mom, phone / WhatsApp' },
    { key: 'resources', type: 'text', hint: isZh ? '專線、機構、網站都可以' : 'Hotlines, centers, websites all count', title: isZh ? '其他資源（專線、機構、網站）' : 'Other resources (hotlines, centers, sites)', placeholder: isZh ? '例：情緒通 18111、撒瑪利亞會 2896 0000' : 'e.g. Emotional Support 18111' },
    { key: 'note', type: 'text', hint: isZh ? '選填，寫給自己看的提醒' : 'Optional — a note for yourself', title: isZh ? '其他想記下來的（選填）' : 'Anything else to note (optional)', placeholder: isZh ? '例：週末可以找朋友喝咖啡' : 'e.g. Can meet a friend for coffee on weekends' }
  ];

  if (id === 'tasksep') return [
    { key: 'situation', type: 'text', hint: isZh ? '用一句話描述這件事' : 'Describe it in one sentence', title: isZh ? '這件事是…' : 'This situation is…' },
    { key: 'mine', type: 'text', title: isZh ? '哪些部分是我可以負責的？' : 'What parts are mine to handle?' },
    { key: 'notmine', type: 'text', title: isZh ? '哪些部分不是我能控制的？' : 'What parts are outside my control?' }
  ];
  if (id === 'repair') return [
    { key: 'what', type: 'text', hint: isZh ? '只寫你記得的部分，不用完整' : 'Just what you remember — no need to be complete', title: isZh ? '發生了什麼事？' : 'What happened?', placeholder: isZh ? '例：我們為了週末安排起爭執' : 'e.g. We argued about weekend plans' },
    { key: 'step', type: 'text', hint: isZh ? '不用完美，先想一件願意做的事' : 'Not perfect — just one thing you are willing to try', title: isZh ? '衝突後我想先做的一件事' : 'One thing I want to do first after the conflict', placeholder: isZh ? '例：先傳一句訊息問對方還好嗎' : 'e.g. Send a message asking if they are okay' },
    { key: 'phrase', type: 'text', hint: isZh ? '可以先寫下來，不一定要現在傳' : 'Write it down — you don\'t have to send it now', title: isZh ? '我可以怎麼說？' : 'How can I phrase it?', placeholder: isZh ? '例：剛才的事我有些後悔，想跟你聊聊' : 'e.g. I regret what happened, can we talk?' }
  ];
  if (id === 'goodenough') return [
    { key: 'task', type: 'text', title: isZh ? '這件事是…' : 'The task is…' },
    { key: 'standard', type: 'text', explain: isZh ? '不用完美。寫下「夠好」的樣子，做到就可以停。' : 'Not perfect. Describe what good enough looks like — you can stop there.', hint: isZh ? '不用完美，寫下「夠好」的樣子' : 'Not perfect — describe what good enough looks like', title: isZh ? '「夠好」長什麼樣子？' : 'What does "good enough" look like?' },
    { key: 'stop', type: 'text', title: isZh ? '做到這樣就夠了，之後可以停' : 'Once I reach this, I can stop' }
  ];
  if (id === 'phone') return [
    { key: 'trigger', type: 'text', hint: isZh ? '例：等車時、睡前、無聊時' : 'e.g. waiting for the bus, before bed, when bored', title: isZh ? '我最容易無意識滑手機的時間／情境' : 'When/where I scroll mindlessly most' },
    { key: 'rule', type: 'text', title: isZh ? '我想設定的暫停規則' : 'The pause rule I want to set' },
    { key: 'alt', type: 'text', title: isZh ? '如果想滑，我可以改做什麼？' : 'If I want to scroll, I can instead…' }
  ];
  if (id === 'problemsolve') return [
    { key: 'problem', type: 'text', title: isZh ? '問題是什麼？（一句話）' : 'What is the problem? (one sentence)' },
    { key: 'solutions', type: 'text', explain: isZh ? '先不用判斷好壞，至少寫兩個可能。寫下來就好。' : 'No need to judge yet — list at least two possibilities. Just write them down.', hint: isZh ? '先不用判斷好壞，至少寫兩個可能' : 'No need to judge yet — just list at least two possibilities', title: isZh ? '可能的解法（至少 2 個）' : 'Possible solutions (at least 2)' },
    { key: 'first', type: 'text', title: isZh ? '我願意先試的一個解法' : 'The one solution I will try first' },
    { key: 'when', type: 'text', title: isZh ? '第一步什麼時候做？' : 'When will I take the first step?' }
  ];
  if (id === 'selfbreak') return [
    { key: 'p1', type: 'text', explain: isZh ? '可以沿用例子，或改寫成自己的話。承認困難是第一步。' : 'Use the example or rewrite it. Acknowledging difficulty is the first step.', hint: isZh ? '可以沿用例子，或改寫成自己的話' : 'You can use the example or rewrite it in your own words', title: isZh ? '第一句：承認這是困難的時刻' : 'Phrase 1: Acknowledge this is a difficult moment', placeholder: isZh ? '例：這是一個困難的時刻' : 'e.g. This is a moment of difficulty' },
    { key: 'p2', type: 'text', title: isZh ? '第二句：困難是共同的經驗' : 'Phrase 2: Difficulty is a shared human experience', placeholder: isZh ? '例：困難是人生的一部分' : 'e.g. Difficulty is part of life' },
    { key: 'p3', type: 'text', title: isZh ? '第三句：給自己一句溫柔的話' : 'Phrase 3: Offer yourself a kind phrase', placeholder: isZh ? '例：願我對自己溫柔一點' : 'e.g. May I be kind to myself' }
  ];
  if (id === 'bodycheck') return [
    { key: 'areas', type: 'multi', max: 5, hint: isZh ? '選有感覺的就好，不用全部' : 'Just the ones you notice — no need for all', title: isZh ? '哪個部位現在有感覺？' : 'Where do you notice sensation?', options: isZh ? ['頭／臉','肩膀／頸','胸口','肚子','手／手臂','腿／腳','全身'] : ['Head/Face','Shoulders/Neck','Chest','Belly','Hands/Arms','Legs/Feet','Whole body'] },
    { key: 'sensation', type: 'text', title: isZh ? '簡單描述感覺（選填）' : 'Briefly describe the sensation (optional)' }
  ];
  if (id === 'sleep') return [
    { key: 'steps', type: 'multi', max: 3, hint: isZh ? '選 2–3 個就好，不用全部做' : 'Pick 2–3 — no need to do all', title: isZh ? '為今晚選 2–3 個放鬆步驟' : 'Choose 2–3 wind-down steps for tonight', options: isZh ? ['調暗燈光','關掉螢幕','簡單伸展','寫下明天一件事','聽輕柔聲音','喝溫水','深呼吸 5 次'] : ['Dim lights','Turn off screens','Gentle stretch','Write one thing for tomorrow','Listen to soft sound','Drink warm water','5 deep breaths'] },
    { key: 'when', type: 'text', hint: isZh ? '例：洗完澡後、上床前' : 'e.g. After shower, before bed', title: isZh ? '大概什麼時候開始？' : 'Roughly when will you start?', placeholder: isZh ? '例：晚上十點半' : 'e.g. Around 10:30 pm' }
  ];
  if (id === 'counselprep') return [
    { key: 'topics', type: 'text', hint: isZh ? '可以列幾個想談的主題' : 'List a few topics you want to discuss', title: isZh ? '我希望這次輔導談什麼？' : 'What do I hope to talk about?' },
    { key: 'main', type: 'text', title: isZh ? '我目前最困擾的是…' : 'What is bothering me most right now?' },
    { key: 'note', type: 'text', title: isZh ? '有什麼我希望輔導師知道的？' : 'Anything I want the counselor to know?' }
  ];

  return [];
}

function renderWizard() {
  const tool = tools.find(t => t.id === currentTool);
  const content = document.getElementById('tool-content');
  if (!tool) return;

  if (['breathing','fivesenses','anger'].includes(currentTool)) {
    content.innerHTML = `<div class="tool-header"><h1>${tool[lang].name}</h1><p class="tool-desc">${tool[lang].desc}</p></div>` + renderSpecial(currentTool);
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
      <h1>${tool[lang].name}</h1>
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

// Init
applyTheme();
document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
renderHome();
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash && tools.some(t => t.id === hash)) openTool(hash);
});
