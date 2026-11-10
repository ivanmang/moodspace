// MoodSpace - Step-by-step wizard version
const translations = {
  zh: {
    homeTitle: "免費練習室",
    homeSub: "有些事情想不清楚、說不出口，或不知道從哪開始？這裡有免費練習工具，幫你一步一步釐清感受、準備對話，或先做一件小事。不需要註冊。",
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
  { id: 'feelings', cat: 'emotions', zh: { name: '情緒與需要整理卡', desc: '一步一步選感受、需要與下一步' }, en: { name: 'Feelings & Needs Card', desc: 'Step by step: feelings, needs, and one next action' } },
  { id: 'worry', cat: 'emotions', zh: { name: '擔心整理', desc: '把擔心寫下來，再決定要不要行動' }, en: { name: 'Worry Sorter', desc: 'Write worries, then decide what to act on' } },
  { id: 'compassion', cat: 'emotions', zh: { name: '對自己換一句話', desc: '先寫嚴厲的話，再換成對朋友會說的話' }, en: { name: 'Self-Compassion Response', desc: 'Rewrite a harsh thought as if speaking to a friend' } },
  { id: 'gratitude', cat: 'emotions', zh: { name: '感恩日記', desc: '一次寫一件值得感謝的事' }, en: { name: 'Gratitude Journal', desc: 'Note things you appreciate, one at a time' } },
  { id: 'thoughtcheck', cat: 'emotions', zh: { name: '想法核對', desc: '一步一步檢視一個想法' }, en: { name: 'Thought Check', desc: 'Examine a thought step by step' } },
  { id: 'boundary', cat: 'communication', zh: { name: '界線表達', desc: '先定義界線，再練習怎麼說' }, en: { name: 'Boundary Expression', desc: 'Define a boundary, then practice saying it' } },
  { id: 'convo', cat: 'communication', zh: { name: '對話前整理', desc: '為重要對話做準備' }, en: { name: 'Conversation Prep', desc: 'Prepare for an important conversation' } },
  { id: 'smallstep', cat: 'actions', zh: { name: '第一小步', desc: '把大目標拆成今天可以做的最小一步' }, en: { name: 'First Small Step', desc: 'Break a big thing into the smallest next action' } },
  { id: 'decision', cat: 'actions', zh: { name: '選擇比較', desc: '一步一步比較兩個選項' }, en: { name: 'Decision Comparer', desc: 'Compare two options step by step' } },
  { id: 'values', cat: 'actions', zh: { name: '我現在最在意什麼', desc: '選出目前最重要的價值' }, en: { name: 'Values Sort', desc: 'Choose what matters most right now' } },
  { id: 'breathing', cat: 'pause', zh: { name: '呼吸練習', desc: '跟著節奏慢慢呼吸' }, en: { name: 'Breathing Exercise', desc: 'Follow a calm breathing rhythm' } },
  { id: 'fivesenses', cat: 'pause', zh: { name: '五感練習', desc: '一步一步把注意力帶回當下' }, en: { name: 'Five Senses Practice', desc: 'Ground yourself one sense at a time' } },
  { id: 'anger', cat: 'pause', zh: { name: '生氣暫停', desc: '先暫停 60 秒再決定' }, en: { name: 'Anger Pause', desc: 'Pause for 60 seconds before responding' } },
  { id: 'supportcard', cat: 'help', zh: { name: '支持資源卡', desc: '整理可以求助的人與管道' }, en: { name: 'Support Resource Card', desc: 'List people and resources you can turn to' } },
  { id: 'tasksep', cat: 'emotions', zh: { name: '課題分離', desc: '一步一步區分哪些是我的課題' }, en: { name: 'Task Separation', desc: 'Separate what is yours to handle' } },
  { id: 'repair', cat: 'communication', zh: { name: '衝突後修復', desc: '練習修復關係的第一步' }, en: { name: 'Conflict Repair', desc: 'Take a first step after conflict' } },
  { id: 'goodenough', cat: 'actions', zh: { name: '夠好就好', desc: '為一件事定義夠好的標準' }, en: { name: 'Good-Enough Standard', desc: 'Define what good enough looks like' } },
  { id: 'phone', cat: 'actions', zh: { name: '手機暫停計畫', desc: '為無意識滑手機設定規則' }, en: { name: 'Phone Pause Plan', desc: 'Create a rule to interrupt scrolling' } },
  { id: 'problemsolve', cat: 'actions', zh: { name: '問題解決', desc: '用五個步驟面對一個問題' }, en: { name: 'Problem Solving', desc: 'Work through a problem step by step' } },
  { id: 'selfbreak', cat: 'emotions', zh: { name: '自我同理休息', desc: '用三句話給自己空間' }, en: { name: 'Self-Compassion Break', desc: 'Offer yourself three phrases of kindness' } },
  { id: 'bodycheck', cat: 'emotions', zh: { name: '身體覺察', desc: '快速掃描身體哪裡有感覺' }, en: { name: 'Body Awareness', desc: 'Notice sensations in the body' } },
  { id: 'sleep', cat: 'pause', zh: { name: '睡前放鬆', desc: '為今晚設計一個簡單流程' }, en: { name: 'Bedtime Wind-Down', desc: 'Design a simple wind-down for tonight' } },
  { id: 'counselprep', cat: 'help', zh: { name: '諮商準備', desc: '為第一次諮商整理想談的內容' }, en: { name: 'Counseling Prep', desc: 'Prepare what to discuss in a first session' } },
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
    { key: 'feelings', type: 'multi', max: 5, title: isZh ? '選接近的感受詞（最多 5 個）' : 'Pick feeling words (up to 5)', options: isZh ? ['開心','放鬆','感謝','期待','難過','失望','生氣','挫折','緊張','擔心','孤單','尷尬','困惑','麻木','好幾種感受混在一起','還不確定'] : ['Happy','Relaxed','Grateful','Hopeful','Sad','Disappointed','Angry','Frustrated','Nervous','Worried','Lonely','Awkward','Confused','Numb','Mixed feelings','Not sure yet'] },
    { key: 'what', type: 'text', title: isZh ? '剛才發生了什麼？（選填）' : 'What happened? (optional)', placeholder: isZh ? '只寫你願意記下的部分' : 'Only write what you want to note' },
    { key: 'needs', type: 'multi', max: 3, title: isZh ? '現在可能需要什麼？（最多 3 個）' : 'What might you need? (up to 3)', options: isZh ? ['休息','一點空間','有人陪伴','被聽見','更清楚的資訊','實際協助','釐清下一步','還不知道'] : ['Rest','Some space','Company','To be heard','Clearer information','Practical help','Clarity on next step','Not sure'] },
    { key: 'try', type: 'single', title: isZh ? '我願意先試的一件事' : 'One thing I\'m willing to try first', options: isZh ? ['先停一下','找個人聽我說','查一項需要的資訊','先不決定'] : ['Just pause','Talk to someone','Look up one piece of info','Decide later'] }
  ];
  if (id === 'worry') return [
    { key: 'worries', type: 'text', title: isZh ? '把擔心寫下來（一行一個）' : 'List your worries (one per line)', placeholder: isZh ? '例如：明天會議會不會出錯' : 'e.g. What if the meeting goes badly' },
    { key: 'action', type: 'single', title: isZh ? '這些擔心裡，有哪些是我可以採取行動的？' : 'Which of these can I take action on?', options: isZh ? ['大部分可以行動','只有少數可以行動','大部分先擱置','我還不確定'] : ['Mostly actionable','Only a few','Mostly park for now','Not sure yet'] }
  ];
  if (id === 'compassion') return [
    { key: 'harsh', type: 'text', title: isZh ? '最近對自己說了什麼嚴厲的話？' : 'What harsh thing have you been saying to yourself?' },
    { key: 'kind', type: 'text', title: isZh ? '如果是對好朋友說，你會怎麼說？' : 'What would you say to a good friend in the same situation?' }
  ];
  if (id === 'gratitude') return [
    { key: 'g1', type: 'text', title: isZh ? '第一件值得感謝的事' : 'First thing I appreciate' },
    { key: 'g2', type: 'text', title: isZh ? '第二件（選填）' : 'Second (optional)' },
    { key: 'g3', type: 'text', title: isZh ? '第三件（選填）' : 'Third (optional)' }
  ];
  if (id === 'thoughtcheck') return [
    { key: 'thought', type: 'text', title: isZh ? '那個想法是什麼？' : 'What is the thought?' },
    { key: 'for', type: 'text', title: isZh ? '支持這個想法的證據' : 'Evidence that supports it' },
    { key: 'against', type: 'text', title: isZh ? '不支持或相反的證據' : 'Evidence against it' },
    { key: 'balanced', type: 'text', title: isZh ? '更平衡的想法可能是…' : 'A more balanced thought might be…' }
  ];
  if (id === 'boundary') return [
    { key: 'boundary', type: 'text', title: isZh ? '我想設定的界線是…' : 'The boundary I want to set is…' },
    { key: 'phrase', type: 'text', title: isZh ? '我可以這樣說：' : 'I can say it like this:' }
  ];
  if (id === 'convo') return [
    { key: 'who', type: 'text', title: isZh ? '對話對象是誰？' : 'Who will I talk to?' },
    { key: 'goal', type: 'text', title: isZh ? '我想達到的目的是？' : 'What outcome do I want?' },
    { key: 'points', type: 'text', title: isZh ? '我想說的重點' : 'Key points I want to say' }
  ];
  if (id === 'smallstep') return [
    { key: 'big', type: 'text', title: isZh ? '想做的大事情是…' : 'The bigger thing I want to do is…' },
    { key: 'small', type: 'text', title: isZh ? '今天可以做的最小一步是…' : 'The smallest step I can take today is…' }
  ];
  if (id === 'decision') return [
    { key: 'optA', type: 'text', title: isZh ? '選項 A 是什麼？' : 'What is Option A?' },
    { key: 'optB', type: 'text', title: isZh ? '選項 B 是什麼？' : 'What is Option B?' },
    { key: 'aPros', type: 'text', title: isZh ? '選項 A 的好處與風險' : 'Pros and cons of Option A' },
    { key: 'bPros', type: 'text', title: isZh ? '選項 B 的好處與風險' : 'Pros and cons of Option B' }
  ];
  if (id === 'values') return [
    { key: 'values', type: 'multi', max: 3, title: isZh ? '選出目前最重要的 3 個價值' : 'Select the 3 values that matter most right now', options: isZh ? ['健康','關係','成長','自由','貢獻','成就','平靜','創造','安全','樂趣'] : ['Health','Relationships','Growth','Freedom','Contribution','Achievement','Calm','Creativity','Safety','Fun'] }
  ];
  if (id === 'supportcard') return [
    { key: 'people', type: 'text', title: isZh ? '我可以找的人（名字＋怎麼聯絡）' : 'People I can reach (name + how to contact)' },
    { key: 'resources', type: 'text', title: isZh ? '其他資源（專線、機構、網站）' : 'Other resources (hotlines, centers, sites)' }
  ];
  if (id === 'tasksep') return [
    { key: 'situation', type: 'text', title: isZh ? '這件事是…' : 'This situation is…' },
    { key: 'mine', type: 'text', title: isZh ? '哪些部分是我可以負責的？' : 'What parts are mine to handle?' },
    { key: 'notmine', type: 'text', title: isZh ? '哪些部分不是我能控制的？' : 'What parts are outside my control?' }
  ];
  if (id === 'repair') return [
    { key: 'step', type: 'text', title: isZh ? '衝突後我想先做的一件事' : 'One thing I want to do first after the conflict' },
    { key: 'phrase', type: 'text', title: isZh ? '我可以怎麼說？' : 'How can I phrase it?' }
  ];
  if (id === 'goodenough') return [
    { key: 'task', type: 'text', title: isZh ? '這件事是…' : 'The task is…' },
    { key: 'standard', type: 'text', title: isZh ? '「夠好」長什麼樣子？' : 'What does "good enough" look like?' },
    { key: 'stop', type: 'text', title: isZh ? '做到這樣就夠了，之後可以停' : 'Once I reach this, I can stop' }
  ];
  if (id === 'phone') return [
    { key: 'trigger', type: 'text', title: isZh ? '我最容易無意識滑手機的時間／情境' : 'When/where I scroll mindlessly most' },
    { key: 'rule', type: 'text', title: isZh ? '我想設定的暫停規則' : 'The pause rule I want to set' },
    { key: 'alt', type: 'text', title: isZh ? '如果想滑，我可以改做什麼？' : 'If I want to scroll, I can instead…' }
  ];
  if (id === 'problemsolve') return [
    { key: 'problem', type: 'text', title: isZh ? '問題是什麼？（一句話）' : 'What is the problem? (one sentence)' },
    { key: 'solutions', type: 'text', title: isZh ? '可能的解法（至少 2 個）' : 'Possible solutions (at least 2)' },
    { key: 'first', type: 'text', title: isZh ? '我願意先試的一個解法' : 'The one solution I will try first' },
    { key: 'when', type: 'text', title: isZh ? '第一步什麼時候做？' : 'When will I take the first step?' }
  ];
  if (id === 'selfbreak') return [
    { key: 'p1', type: 'text', title: isZh ? '這是一個困難的時刻' : 'This is a moment of difficulty', placeholder: isZh ? '可以改寫' : 'You can rewrite' },
    { key: 'p2', type: 'text', title: isZh ? '困難是人生的一部分' : 'Difficulty is part of life' },
    { key: 'p3', type: 'text', title: isZh ? '願我對自己溫柔一點' : 'May I be kind to myself' }
  ];
  if (id === 'bodycheck') return [
    { key: 'areas', type: 'multi', max: 5, title: isZh ? '哪個部位現在有感覺？' : 'Where do you notice sensation?', options: isZh ? ['頭／臉','肩膀／頸','胸口','肚子','手／手臂','腳／腳','全身'] : ['Head/Face','Shoulders/Neck','Chest','Belly','Hands/Arms','Legs/Feet','Whole body'] },
    { key: 'sensation', type: 'text', title: isZh ? '簡單描述感覺（選填）' : 'Briefly describe the sensation (optional)' }
  ];
  if (id === 'sleep') return [
    { key: 'steps', type: 'multi', max: 3, title: isZh ? '為今晚選 2–3 個放鬆步驟' : 'Choose 2–3 wind-down steps for tonight', options: isZh ? ['調暗燈光','關掉螢幕','簡單伸展','寫下明天一件事','聽輕柔聲音','喝溫水','深呼吸 5 次'] : ['Dim lights','Turn off screens','Gentle stretch','Write one thing for tomorrow','Listen to soft sound','Drink warm water','5 deep breaths'] }
  ];
  if (id === 'counselprep') return [
    { key: 'topics', type: 'text', title: isZh ? '我希望這次諮商談什麼？' : 'What do I hope to talk about?' },
    { key: 'main', type: 'text', title: isZh ? '我目前最困擾的是…' : 'What is bothering me most right now?' },
    { key: 'note', type: 'text', title: isZh ? '有什麼我希望諮商師知道的？' : 'Anything I want the counselor to know?' }
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
    <div class="tool-header"><h1>${tool[lang].name}</h1></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    <p class="step-indicator">${lang === 'zh' ? `第 ${currentStep + 1} / ${steps.length} 步` : `Step ${currentStep + 1} of ${steps.length}`}</p>
    <h2 style="font-size:1.3rem; margin:1rem 0;">${step.title}</h2>
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
    return (isZh ? '擔心整理\n\n' : 'Worry Sorter\n\n') + (a.worries || '—') + '\n\n' +
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
    return (isZh ? '想法核對\n\n' : 'Thought Check\n\n') +
      (isZh ? '想法：' : 'Thought: ') + (a.thought || '—') + '\n\n' +
      (isZh ? '支持：\n' : 'Supporting:\n') + (a.for || '—') + '\n\n' +
      (isZh ? '不支持：\n' : 'Against:\n') + (a.against || '—') + '\n\n' +
      (isZh ? '更平衡：' : 'Balanced: ') + (a.balanced || '—');
  }
  if (id === 'boundary') {
    return (isZh ? '界線表達\n\n' : 'Boundary Expression\n\n') +
      (isZh ? '界線：' : 'Boundary: ') + (a.boundary || '—') + '\n' +
      (isZh ? '可以這樣說：\n' : 'Phrasing:\n') + (a.phrase || '—');
  }
  if (id === 'convo') {
    return (isZh ? '對話前整理\n\n' : 'Conversation Prep\n\n') +
      (isZh ? '對象：' : 'With: ') + (a.who || '—') + '\n' +
      (isZh ? '目的：' : 'Goal: ') + (a.goal || '—') + '\n\n' +
      (isZh ? '重點：\n' : 'Key points:\n') + (a.points || '—');
  }
  if (id === 'smallstep') {
    return (isZh ? '第一小步\n\n' : 'First Small Step\n\n') +
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
    return (isZh ? '支持資源卡\n\n' : 'Support Resource Card\n\n') +
      (isZh ? '人：\n' : 'People:\n') + (a.people || '—') + '\n\n' +
      (isZh ? '其他資源：\n' : 'Other:\n') + (a.resources || '—');
  }
  if (id === 'tasksep') {
    return (isZh ? '課題分離\n\n' : 'Task Separation\n\n') +
      (isZh ? '情況：' : 'Situation: ') + (a.situation || '—') + '\n\n' +
      (isZh ? '我的課題：\n' : 'Mine:\n') + (a.mine || '—') + '\n\n' +
      (isZh ? '不是我的：\n' : 'Not mine:\n') + (a.notmine || '—');
  }
  if (id === 'repair') {
    return (isZh ? '衝突後修復\n\n' : 'Conflict Repair\n\n') +
      (isZh ? '先做的一步：' : 'First step: ') + (a.step || '—') + '\n' +
      (isZh ? '可以這樣說：\n' : 'Phrasing:\n') + (a.phrase || '—');
  }
  if (id === 'goodenough') {
    return (isZh ? '夠好就好\n\n' : 'Good-Enough Standard\n\n') +
      (isZh ? '任務：' : 'Task: ') + (a.task || '—') + '\n' +
      (isZh ? '夠好的標準：\n' : 'Good enough:\n') + (a.standard || '—') + '\n' +
      (isZh ? '可以停的點：' : 'Stop when: ') + (a.stop || '—');
  }
  if (id === 'phone') {
    return (isZh ? '手機暫停計畫\n\n' : 'Phone Pause Plan\n\n') +
      (isZh ? '容易滑的時機：' : 'Trigger: ') + (a.trigger || '—') + '\n' +
      (isZh ? '暫停規則：' : 'Rule: ') + (a.rule || '—') + '\n' +
      (isZh ? '替代行動：' : 'Instead: ') + (a.alt || '—');
  }
  if (id === 'problemsolve') {
    return (isZh ? '問題解決\n\n' : 'Problem Solving\n\n') +
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
    return (isZh ? '身體覺察\n\n' : 'Body Awareness\n\n') +
      (isZh ? '有感覺的部位：' : 'Areas: ') + ((a.areas || []).join('、') || '—') + '\n' +
      (isZh ? '描述：' : 'Description: ') + (a.sensation || '—');
  }
  if (id === 'sleep') {
    const steps = a.steps || [];
    return (isZh ? '今晚睡前流程\n\n' : 'Tonight\'s Wind-Down\n\n') + steps.map((s,i) => `${i+1}. ${s}`).join('\n') || '—';
  }
  if (id === 'counselprep') {
    return (isZh ? '諮商準備\n\n' : 'Counseling Prep\n\n') +
      (isZh ? '想談的：\n' : 'Topics:\n') + (a.topics || '—') + '\n\n' +
      (isZh ? '最困擾：' : 'Main concern: ') + (a.main || '—') + '\n' +
      (isZh ? '其他：' : 'Other: ') + (a.note || '—');
  }
  return '—';
}

function renderSpecial(id) {
  if (id === 'breathing') {
    return `<div style="text-align:center"><div class="breathing-circle" id="breathCircle">${lang==='zh'?'準備':'Ready'}</div><div class="timer-display" id="breathTimer">4:00</div><div class="actions" style="justify-content:center"><button class="btn" id="startBreath">${lang==='zh'?'開始':'Start'}</button><button class="btn secondary" id="stopBreath">${lang==='zh'?'停止':'Stop'}</button></div><p class="note">${lang==='zh'?'吸氣 4 秒 → 停留 4 秒 → 呼氣 4 秒 → 停留 4 秒':'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s'}</p></div>`;
  }
  if (id === 'fivesenses') {
    return `<div id="senses-steps"><p id="sense-prompt" style="font-size:1.2rem;text-align:center;min-height:4rem;"></p><div class="actions" style="justify-content:center"><button class="btn" id="nextSense">${lang==='zh'?'下一步':'Next'}</button></div></div>`;
  }
  if (id === 'anger') {
    return `<div style="text-align:center"><div class="timer-display" id="angerTimer">1:00</div><p>${lang==='zh'?'先暫停 60 秒，什麼都先不要做。':'Pause for 60 seconds. Do nothing else.'}</p><div class="actions" style="justify-content:center"><button class="btn" id="startAnger">${lang==='zh'?'開始暫停':'Start Pause'}</button></div></div>`;
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
      ? ['說出 5 個你看到的東西','說出 4 個你摸得到的東西','說出 3 個你聽得到的聲音','說出 2 個你聞得到的氣味','說出 1 個你嘗得到的味道','完成。慢慢回到當下。']
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

const style = document.createElement('style');
style.textContent = `
.progress-bar { height: 6px; background: var(--border); border-radius: 3px; margin: 1rem 0; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; }
.step-indicator { color: var(--text-soft); font-size: 0.9rem; margin: 0; }
`;
document.head.appendChild(style);

applyTheme();
document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
renderHome();
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash && tools.some(t => t.id === hash)) openTool(hash);
});
