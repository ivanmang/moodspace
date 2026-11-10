// MoodSpace - Main application logic
const translations = {
  zh: {
    homeTitle: "免費練習室",
    homeSub: "有些事情想不清楚、說不出口，或不知道從哪開始？這裡有免費練習工具，幫你釐清感受、準備一段對話，或先做一件小事。不需要註冊，資料只留在你的瀏覽器裡。",
    back: "返回練習室",
    langBtn: "EN",
    copy: "複製",
    print: "列印",
    copied: "已複製！",
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
    homeSub: "Feeling stuck, unsure how to say something, or not knowing where to start? Free self-guided tools to clarify feelings, prepare a conversation, or take one small step. No sign-up. Everything stays in your browser.",
    back: "Back to Practice Room",
    langBtn: "中文",
    copy: "Copy",
    print: "Print",
    copied: "Copied!",
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

const tools = [
  { id: 'feelings', cat: 'emotions', zh: { name: '情緒與需要整理卡', desc: '選接近的感受詞，整理目前的需要與下一步' }, en: { name: 'Feelings & Needs Card', desc: 'Pick feeling words and clarify what you need right now' } },
  { id: 'worry', cat: 'emotions', zh: { name: '擔心整理＋擔心時間', desc: '把擔心寫下來，區分可行動與先擱置' }, en: { name: 'Worry Sorter + Worry Time', desc: 'Write worries and sort what you can act on' } },
  { id: 'compassion', cat: 'emotions', zh: { name: '對自己換一句話', desc: '練習用更溫柔的方式回應自己' }, en: { name: 'Self-Compassion Response', desc: 'Practice a kinder inner response' } },
  { id: 'gratitude', cat: 'emotions', zh: { name: '感恩日記', desc: '記下今天值得感謝的三件事' }, en: { name: 'Gratitude Journal', desc: 'Note three things you appreciate today' } },
  { id: 'thoughtcheck', cat: 'emotions', zh: { name: '想法核對練習', desc: '檢視想法是否完全符合事實' }, en: { name: 'Thought Check', desc: 'Examine whether a thought is fully accurate' } },
  { id: 'tasksep', cat: 'emotions', zh: { name: '課題分離整理器', desc: '區分哪些是我的課題、哪些不是' }, en: { name: 'Task Separation', desc: 'Separate what is yours to handle from what is not' } },
  { id: 'boundary', cat: 'communication', zh: { name: '界線表達練習', desc: '練習清楚、尊重地說出自己的界線' }, en: { name: 'Boundary Expression', desc: 'Practice stating a boundary clearly and kindly' } },
  { id: 'help', cat: 'communication', zh: { name: '開口求助練習', desc: '整理想說的話，讓求助更容易開口' }, en: { name: 'Asking for Help', desc: 'Prepare what you want to say when asking for support' } },
  { id: 'convo', cat: 'communication', zh: { name: '對話前整理紙', desc: '準備重要對話前，先整理重點' }, en: { name: 'Conversation Prep', desc: 'Organize key points before an important conversation' } },
  { id: 'repair', cat: 'communication', zh: { name: '衝突後修復卡', desc: '衝突後，練習修復關係的第一步' }, en: { name: 'Conflict Repair Card', desc: 'Take a first step toward repairing after conflict' } },
  { id: 'smallstep', cat: 'actions', zh: { name: '把事情拆成第一小步', desc: '把大目標變成今天可以做的最小一步' }, en: { name: 'First Small Step', desc: 'Break something big into the smallest next action' } },
  { id: 'decision', cat: 'actions', zh: { name: '選擇困難整理器', desc: '並排比較兩個選項的利弊' }, en: { name: 'Decision Comparer', desc: 'Compare two options side by side' } },
  { id: 'lowenergy', cat: 'actions', zh: { name: '低能量活動菜單', desc: '當能量很低時，可以做的溫柔活動' }, en: { name: 'Low-Energy Menu', desc: 'Gentle options for when energy is low' } },
  { id: 'values', cat: 'actions', zh: { name: '我現在最在意什麼', desc: '排序目前最重要的價值' }, en: { name: 'Values Sort', desc: 'Clarify what matters most to you right now' } },
  { id: 'phone', cat: 'actions', zh: { name: '手機滑不停暫停計畫', desc: '為無意識滑手機設定暫停規則' }, en: { name: 'Phone Scroll Pause', desc: 'Create a plan to interrupt mindless scrolling' } },
  { id: 'breathing', cat: 'pause', zh: { name: '呼吸練習', desc: '跟著節奏慢慢呼吸，讓自己慢下來' }, en: { name: 'Breathing Exercise', desc: 'Follow a calm breathing rhythm' } },
  { id: 'fivesenses', cat: 'pause', zh: { name: '三分鐘五感練習', desc: '用五感把注意力帶回當下' }, en: { name: 'Five Senses Practice', desc: 'Ground yourself with your five senses' } },
  { id: 'anger', cat: 'pause', zh: { name: '生氣時的情緒暫停器', desc: '在反應前先給自己一點空間' }, en: { name: 'Anger Pause', desc: 'Create space before reacting' } },
  { id: 'muscle', cat: 'pause', zh: { name: '漸進式肌肉放鬆', desc: '依序放鬆身體各部位' }, en: { name: 'Progressive Muscle Relaxation', desc: 'Systematically relax muscle groups' } },
  { id: 'supportcard', cat: 'help', zh: { name: '我的支持資源卡', desc: '整理目前可以求助的人與管道' }, en: { name: 'Support Resource Card', desc: 'List people and resources you can turn to' } },
  { id: 'counselprep', cat: 'help', zh: { name: '第一次諮商準備', desc: '為第一次諮商整理想談的內容' }, en: { name: 'First Counseling Prep', desc: 'Prepare what you want to discuss in a first session' } }
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
}

function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('moodspace-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  renderHome();
  if (document.getElementById('tool-view').classList.contains('active')) {
    const current = document.getElementById('tool-content').dataset.tool;
    if (current) openTool(current);
  }
}

function openTool(id) {
  document.getElementById('home-view').classList.add('hidden');
  document.getElementById('tool-view').classList.add('active');
  document.getElementById('tool-content').dataset.tool = id;
  history.replaceState(null, '', '#' + id);
  renderTool(id);
}

function renderTool(id) {
  const content = document.getElementById('tool-content');
  const tool = tools.find(t => t.id === id);
  if (!tool) return;
  let html = `<div class="tool-header"><h1>${tool[lang].name}</h1><p class="tool-desc">${tool[lang].desc}</p></div>`;

  const renderers = {
    feelings: renderFeelings,
    worry: renderWorry,
    compassion: renderCompassion,
    gratitude: renderGratitude,
    boundary: renderBoundary,
    help: renderHelp,
    smallstep: renderSmallStep,
    decision: renderDecision,
    lowenergy: renderLowEnergy,
    breathing: renderBreathing,
    fivesenses: renderFiveSenses,
    anger: renderAnger,
    thoughtcheck: renderThoughtCheck,
    tasksep: renderTaskSep,
    convo: renderConvo,
    repair: renderRepair,
    values: renderValues,
    phone: renderPhone,
    muscle: renderMuscle,
    supportcard: renderSupportCard,
    counselprep: renderCounselPrep
  };

  if (renderers[id]) html += renderers[id]();
  content.innerHTML = html;
  attachToolEvents(id);
}

function renderFeelings() {
  const feelings = lang === 'zh'
    ? ['開心','放鬆','感謝','期待','難過','失望','生氣','挫折','緊張','擔心','孤單','尷尬','困惑','麻木','好幾種感受混在一起','還不確定']
    : ['Happy','Relaxed','Grateful','Hopeful','Sad','Disappointed','Angry','Frustrated','Nervous','Worried','Lonely','Awkward','Confused','Numb','Mixed feelings','Not sure yet'];
  const needs = lang === 'zh'
    ? ['休息','一點空間','有人陪伴','被聽見','更清楚的資訊','實際協助','釐清下一步','還不知道']
    : ['Rest','Some space','Company','To be heard','Clearer information','Practical help','Clarity on next step','Not sure'];
  const tries = lang === 'zh'
    ? ['先停一下','找個人聽我說','查一項需要的資訊','先不決定']
    : ['Just pause','Talk to someone','Look up one piece of info','Decide later'];

  return `
    <div class="form-group">
      <label>${lang === 'zh' ? '感受詞（最多選 5 個）' : 'Feeling words (up to 5)'}</label>
      <div class="options" id="feelings-options">${feelings.map(f => `<button type="button" class="option-btn" data-value="${f}">${f}</button>`).join('')}</div>
    </div>
    <div class="form-group">
      <label>${lang === 'zh' ? '剛才發生了什麼？（選填）' : 'What happened? (optional)'}</label>
      <textarea id="what-happened" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label>${lang === 'zh' ? '可能的需要（最多選 3 個）' : 'Possible needs (up to 3)'}</label>
      <div class="options" id="needs-options">${needs.map(n => `<button type="button" class="option-btn" data-value="${n}">${n}</button>`).join('')}</div>
    </div>
    <div class="form-group">
      <label>${lang === 'zh' ? '我願意先試的一件事' : 'One thing I\'m willing to try'}</label>
      <div class="options" id="try-options">${tries.map(t => `<button type="button" class="option-btn" data-value="${t}">${t}</button>`).join('')}</div>
    </div>
    <div id="result" class="card-result" style="display:none;"></div>
    <div class="actions"><button class="btn" onclick="generateFeelings()">${lang === 'zh' ? '產生整理卡' : 'Generate Card'}</button></div>
  `;
}

function generateFeelings() {
  const selectedFeelings = [...document.querySelectorAll('#feelings-options .selected')].map(b => b.dataset.value).slice(0,5);
  const what = document.getElementById('what-happened').value.trim();
  const selectedNeeds = [...document.querySelectorAll('#needs-options .selected')].map(b => b.dataset.value).slice(0,3);
  const tryOne = [...document.querySelectorAll('#try-options .selected')].map(b => b.dataset.value)[0] || '';
  let text = (lang === 'zh' ? '情緒與需要整理卡\n\n' : 'Feelings & Needs Card\n\n');
  text += (lang === 'zh' ? '我記下的事情：' : 'What I noted: ') + (what || '—') + '\n';
  text += (lang === 'zh' ? '我注意到的感受：' : 'Feelings I noticed: ') + (selectedFeelings.join('、') || '—') + '\n';
  text += (lang === 'zh' ? '我現在可能需要：' : 'What I may need: ') + (selectedNeeds.join('、') || '—') + '\n';
  text += (lang === 'zh' ? '我願意先試的一件事：' : 'One thing I\'m willing to try: ') + (tryOne || '—');
  showResult(text);
}

function renderThoughtCheck() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '那個想法是什麼？' : 'What is the thought?'}</label><textarea id="thought" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '支持這個想法的證據' : 'Evidence that supports it'}</label><textarea id="for" rows="3"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '不支持或相反的證據' : 'Evidence against it / alternative views'}</label><textarea id="against" rows="3"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '更平衡的想法可能是…' : 'A more balanced thought might be…'}</label><textarea id="balanced" rows="2"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateThoughtCheck()">${lang === 'zh' ? '產生核對卡' : 'Generate Check'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateThoughtCheck() {
  const t = document.getElementById('thought').value.trim();
  const f = document.getElementById('for').value.trim();
  const a = document.getElementById('against').value.trim();
  const b = document.getElementById('balanced').value.trim();
  let text = (lang === 'zh' ? '想法核對\n\n' : 'Thought Check\n\n');
  text += (lang === 'zh' ? '想法：' : 'Thought: ') + (t || '—') + '\n\n';
  text += (lang === 'zh' ? '支持：\n' : 'Supporting evidence:\n') + (f || '—') + '\n\n';
  text += (lang === 'zh' ? '不支持：\n' : 'Evidence against:\n') + (a || '—') + '\n\n';
  text += (lang === 'zh' ? '更平衡的想法：' : 'Balanced thought: ') + (b || '—');
  showResult(text);
}

function renderTaskSep() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '這件事是…' : 'This situation is…'}</label><textarea id="situation" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '哪些部分是我可以負責的？' : 'What parts are mine to handle?'}</label><textarea id="mine" rows="3"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '哪些部分不是我能控制的？' : 'What parts are outside my control?'}</label><textarea id="notmine" rows="3"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateTaskSep()">${lang === 'zh' ? '產生分離卡' : 'Generate Card'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateTaskSep() {
  let text = (lang === 'zh' ? '課題分離\n\n' : 'Task Separation\n\n');
  text += (lang === 'zh' ? '情況：' : 'Situation: ') + (document.getElementById('situation').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '我的課題：\n' : 'Mine to handle:\n') + (document.getElementById('mine').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '不是我的課題：\n' : 'Not mine:\n') + (document.getElementById('notmine').value.trim() || '—');
  showResult(text);
}

function renderConvo() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '對話對象' : 'Who will I talk to?'}</label><input type="text" id="who"></div>
    <div class="form-group"><label>${lang === 'zh' ? '我想達到的目的' : 'What outcome do I want?'}</label><textarea id="goal" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '我想說的重點（3 點以內）' : 'Key points I want to say (up to 3)'}</label><textarea id="points" rows="4"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '如果對方反應激烈，我可以怎麼做？' : 'If they react strongly, I can…'}</label><textarea id="backup" rows="2"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateConvo()">${lang === 'zh' ? '產生準備紙' : 'Generate Prep'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateConvo() {
  let text = (lang === 'zh' ? '對話前整理\n\n' : 'Conversation Prep\n\n');
  text += (lang === 'zh' ? '對象：' : 'With: ') + (document.getElementById('who').value.trim() || '—') + '\n';
  text += (lang === 'zh' ? '目的：' : 'Goal: ') + (document.getElementById('goal').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '重點：\n' : 'Key points:\n') + (document.getElementById('points').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '備用方案：' : 'Backup plan: ') + (document.getElementById('backup').value.trim() || '—');
  showResult(text);
}

function renderRepair() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '衝突後我想先做的一件事' : 'One thing I want to do first after the conflict'}</label><textarea id="step" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '我可以怎麼說？' : 'How can I phrase it?'}</label><textarea id="phrase" rows="3" placeholder="${lang === 'zh' ? '例如：我剛才反應很大，我想重新聽你說' : 'e.g. I reacted strongly earlier. I want to listen again.'}"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateRepair()">${lang === 'zh' ? '產生修復卡' : 'Generate Card'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateRepair() {
  let text = (lang === 'zh' ? '衝突後修復\n\n' : 'Conflict Repair\n\n');
  text += (lang === 'zh' ? '先做的一步：' : 'First step: ') + (document.getElementById('step').value.trim() || '—') + '\n';
  text += (lang === 'zh' ? '可以這樣說：\n' : 'Possible phrasing:\n') + (document.getElementById('phrase').value.trim() || '—');
  showResult(text);
}

function renderValues() {
  const vals = lang === 'zh'
    ? ['健康','關係','成長','自由','貢獻','成就','平靜','創造','安全','樂趣']
    : ['Health','Relationships','Growth','Freedom','Contribution','Achievement','Calm','Creativity','Safety','Fun'];
  return `
    <p>${lang === 'zh' ? '選出目前對你最重要的 3 個價值：' : 'Select the 3 values that matter most right now:'}</p>
    <div class="options" id="values-options" style="margin:1rem 0">${vals.map(v => `<button type="button" class="option-btn" data-value="${v}">${v}</button>`).join('')}</div>
    <div class="actions"><button class="btn" onclick="generateValues()">${lang === 'zh' ? '產生價值卡' : 'Generate Card'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateValues() {
  const selected = [...document.querySelectorAll('#values-options .selected')].map(b => b.dataset.value).slice(0,3);
  showResult((lang === 'zh' ? '我現在最在意：\n' : 'What matters most to me now:\n') + (selected.join('\n') || '—'));
}

function renderPhone() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '我最容易無意識滑手機的時間／情境' : 'When/where I scroll mindlessly most'}</label><textarea id="trigger" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '我想設定的暫停規則' : 'The pause rule I want to set'}</label><textarea id="rule" rows="2" placeholder="${lang === 'zh' ? '例如：睡前 30 分鐘不滑手機' : 'e.g. No phone 30 min before bed'}"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '如果想滑，我可以改做什麼？' : 'If I want to scroll, I can instead…'}</label><textarea id="alt" rows="2"></textarea></div>
    <div class="actions"><button class="btn" onclick="generatePhone()">${lang === 'zh' ? '產生暫停計畫' : 'Generate Plan'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generatePhone() {
  let text = (lang === 'zh' ? '手機滑不停暫停計畫\n\n' : 'Phone Scroll Pause Plan\n\n');
  text += (lang === 'zh' ? '容易滑的時機：' : 'Trigger times: ') + (document.getElementById('trigger').value.trim() || '—') + '\n';
  text += (lang === 'zh' ? '暫停規則：' : 'Rule: ') + (document.getElementById('rule').value.trim() || '—') + '\n';
  text += (lang === 'zh' ? '替代行動：' : 'Alternative: ') + (document.getElementById('alt').value.trim() || '—');
  showResult(text);
}

function renderMuscle() {
  return `
    <div id="muscle-steps">
      <p id="muscle-prompt" style="font-size:1.15rem; text-align:center; min-height:3rem;"></p>
      <div class="actions" style="justify-content:center"><button class="btn" id="nextMuscle">${lang === 'zh' ? '下一步' : 'Next'}</button></div>
    </div>
  `;
}

function renderSupportCard() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '我可以找的人（名字＋怎麼聯絡）' : 'People I can reach (name + how to contact)'}</label><textarea id="people" rows="4"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '其他資源（專線、機構、網站）' : 'Other resources (hotlines, centers, sites)'}</label><textarea id="resources" rows="3"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateSupport()">${lang === 'zh' ? '產生支持卡' : 'Generate Card'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateSupport() {
  let text = (lang === 'zh' ? '我的支持資源卡\n\n' : 'Support Resource Card\n\n');
  text += (lang === 'zh' ? '人：\n' : 'People:\n') + (document.getElementById('people').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '其他資源：\n' : 'Other resources:\n') + (document.getElementById('resources').value.trim() || '—');
  showResult(text);
}

function renderCounselPrep() {
  return `
    <div class="form-group"><label>${lang === 'zh' ? '我希望這次諮商談什麼？' : 'What do I hope to talk about?'}</label><textarea id="topics" rows="4"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '我目前最困擾的是…' : 'What is bothering me most right now?'}</label><textarea id="main" rows="2"></textarea></div>
    <div class="form-group"><label>${lang === 'zh' ? '有什麼我希望諮商師知道的？' : 'Anything I want the counselor to know?'}</label><textarea id="note" rows="2"></textarea></div>
    <div class="actions"><button class="btn" onclick="generateCounsel()">${lang === 'zh' ? '產生準備單' : 'Generate Prep'}</button></div>
    <div id="result" class="card-result" style="display:none;"></div>
  `;
}
function generateCounsel() {
  let text = (lang === 'zh' ? '第一次諮商準備\n\n' : 'First Counseling Prep\n\n');
  text += (lang === 'zh' ? '想談的：\n' : 'Topics:\n') + (document.getElementById('topics').value.trim() || '—') + '\n\n';
  text += (lang === 'zh' ? '最困擾：' : 'Main concern: ') + (document.getElementById('main').value.trim() || '—') + '\n';
  text += (lang === 'zh' ? '其他：' : 'Other notes: ') + (document.getElementById('note').value.trim() || '—');
  showResult(text);
}

function renderWorry() { return `<div class="form-group"><label>${lang==='zh'?'把擔心寫下來（一行一個）':'List your worries (one per line)'}</label><textarea id="worries" rows="6"></textarea></div><div class="actions"><button class="btn" onclick="generateWorry()">${lang==='zh'?'整理擔心':'Sort Worries'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateWorry() {
  const lines = document.getElementById('worries').value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,10);
  if (!lines.length) return alert(lang==='zh'?'請先寫下至少一個擔心':'Please write at least one worry');
  let text = (lang==='zh'?'擔心整理\n\n':'Worry Sorter\n\n');
  lines.forEach((w,i)=> text += `${i+1}. ${w}\n   → ${lang==='zh'?'這是我可以採取行動的，還是先擱置？':'Can I act on this or park it?'}\n`);
  showResult(text);
}
function renderCompassion() { return `<div class="form-group"><label>${lang==='zh'?'最近對自己說了什麼嚴厲的話？':'What harsh thing have you been saying to yourself?'}</label><textarea id="harsh" rows="3"></textarea></div><div class="form-group"><label>${lang==='zh'?'如果是對好朋友說，你會怎麼說？':'What would you say to a good friend?'}</label><textarea id="kind" rows="4"></textarea></div><div class="actions"><button class="btn" onclick="generateCompassion()">${lang==='zh'?'產生對照':'Generate Response'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateCompassion() {
  let text = (lang==='zh'?'自我同理\n\n':'Self-Compassion\n\n');
  text += (lang==='zh'?'原本的話：\n':'Original:\n') + (document.getElementById('harsh').value.trim()||'—') + '\n\n';
  text += (lang==='zh'?'對朋友會說：\n':'To a friend:\n') + (document.getElementById('kind').value.trim()||'—');
  showResult(text);
}
function renderGratitude() { return `<div class="form-group"><label>${lang==='zh'?'今天值得感謝的三件事':'Three things I appreciate today'}</label><textarea id="g1" rows="2" placeholder="1."></textarea><textarea id="g2" rows="2" placeholder="2." style="margin-top:0.5rem"></textarea><textarea id="g3" rows="2" placeholder="3." style="margin-top:0.5rem"></textarea></div><div class="actions"><button class="btn" onclick="generateGratitude()">${lang==='zh'?'產生感恩卡':'Generate Card'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateGratitude() {
  const items = [1,2,3].map(i=>document.getElementById('g'+i).value.trim()).filter(Boolean);
  showResult((lang==='zh'?'感恩日記\n\n':'Gratitude Journal\n\n') + items.map((it,i)=>`${i+1}. ${it}`).join('\n') || '—');
}
function renderBoundary() { return `<div class="form-group"><label>${lang==='zh'?'我想設定的界線是：':'The boundary I want to set:'}</label><textarea id="boundary" rows="2"></textarea></div><div class="form-group"><label>${lang==='zh'?'我可以這樣說：':'I can say it like this:'}</label><textarea id="phrase" rows="3"></textarea></div><div class="actions"><button class="btn" onclick="generateBoundary()">${lang==='zh'?'產生表達卡':'Generate Card'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateBoundary() {
  let text = (lang==='zh'?'界線表達\n\n':'Boundary Expression\n\n');
  text += (lang==='zh'?'界線：':'Boundary: ') + (document.getElementById('boundary').value.trim()||'—') + '\n';
  text += (lang==='zh'?'可以這樣說：\n':'Phrasing:\n') + (document.getElementById('phrase').value.trim()||'—');
  showResult(text);
}
function renderHelp() { return `<div class="form-group"><label>${lang==='zh'?'我想向誰求助？':'Who do I want to ask?'}</label><input type="text" id="who"></div><div class="form-group"><label>${lang==='zh'?'我想說的重點：':'Main points:'}</label><textarea id="points" rows="4"></textarea></div><div class="actions"><button class="btn" onclick="generateHelp()">${lang==='zh'?'產生求助卡':'Generate Card'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateHelp() {
  let text = (lang==='zh'?'開口求助\n\n':'Asking for Help\n\n');
  text += (lang==='zh'?'對象：':'To: ') + (document.getElementById('who').value.trim()||'—') + '\n\n';
  text += (lang==='zh'?'想說的：\n':'What I want to say:\n') + (document.getElementById('points').value.trim()||'—');
  showResult(text);
}
function renderSmallStep() { return `<div class="form-group"><label>${lang==='zh'?'想做的大事情：':'The bigger thing:'}</label><textarea id="big" rows="2"></textarea></div><div class="form-group"><label>${lang==='zh'?'今天可以做的最小一步：':'Smallest step today:'}</label><textarea id="small" rows="2"></textarea></div><div class="actions"><button class="btn" onclick="generateSmall()">${lang==='zh'?'產生行動卡':'Generate Card'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateSmall() {
  let text = (lang==='zh'?'第一小步\n\n':'First Small Step\n\n');
  text += (lang==='zh'?'大目標：':'Bigger goal: ') + (document.getElementById('big').value.trim()||'—') + '\n';
  text += (lang==='zh'?'最小一步：':'Smallest step: ') + (document.getElementById('small').value.trim()||'—');
  showResult(text);
}
function renderDecision() { return `<div class="form-group"><label>Option A</label><input type="text" id="optA"></div><div class="form-group"><label>Option B</label><input type="text" id="optB"></div><div class="form-group"><label>${lang==='zh'?'A 的利弊':'Pros/Cons A'}</label><textarea id="aPros" rows="3"></textarea></div><div class="form-group"><label>${lang==='zh'?'B 的利弊':'Pros/Cons B'}</label><textarea id="bPros" rows="3"></textarea></div><div class="actions"><button class="btn" onclick="generateDecision()">${lang==='zh'?'產生比較':'Generate Comparison'}</button></div><div id="result" class="card-result" style="display:none;"></div>`; }
function generateDecision() {
  const a = document.getElementById('optA').value.trim() || 'A';
  const b = document.getElementById('optB').value.trim() || 'B';
  let text = (lang==='zh'?'選擇比較\n\n':'Decision Comparison\n\n');
  text += `【${a}】\n${document.getElementById('aPros').value.trim()||'—'}\n\n【${b}】\n${document.getElementById('bPros').value.trim()||'—'}`;
  showResult(text);
}
function renderLowEnergy() {
  const items = lang==='zh' ? ['喝一杯溫水','躺下休息 10 分鐘','聽一首喜歡的歌','簡單伸展','看窗外','洗把臉','傳訊息給一個安全的人','什麼都不做也沒關係'] : ['Drink water','Lie down 10 min','Listen to one song','Gentle stretch','Look outside','Splash face','Message a safe person','Doing nothing is okay'];
  return `<p>${lang==='zh'?'能量很低時，從下面選一件就好：':'When energy is low, pick one:'}</p><div class="options" id="low-options" style="margin:1rem 0">${items.map(i=>`<button type="button" class="option-btn" data-value="${i}">${i}</button>`).join('')}</div><div id="result" class="card-result" style="display:none;"></div>`;
}
function renderBreathing() {
  return `<div style="text-align:center"><div class="breathing-circle" id="breathCircle">${lang==='zh'?'準備':'Ready'}</div><div class="timer-display" id="breathTimer">4:00</div><div class="actions" style="justify-content:center"><button class="btn" id="startBreath">${lang==='zh'?'開始呼吸':'Start'}</button><button class="btn secondary" id="stopBreath">${lang==='zh'?'停止':'Stop'}</button></div><p class="note">${lang==='zh'?'吸氣 4 秒 → 停留 4 秒 → 呼氣 4 秒 → 停留 4 秒':'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s'}</p></div>`;
}
function renderFiveSenses() {
  return `<div id="senses-steps"><p id="sense-prompt" style="font-size:1.2rem;text-align:center;min-height:3rem;"></p><div class="actions" style="justify-content:center"><button class="btn" id="nextSense">${lang==='zh'?'下一步':'Next'}</button></div></div><p class="note">${lang==='zh'?'不需要寫下來，只要在心裡或小聲說出即可。':'No need to write. Just notice quietly.'}</p>`;
}
function renderAnger() {
  return `<div style="text-align:center"><div class="timer-display" id="angerTimer">1:00</div><p>${lang==='zh'?'先暫停 60 秒，什麼都先不要做。':'Pause for 60 seconds. Do nothing else.'}</p><div class="actions" style="justify-content:center"><button class="btn" id="startAnger">${lang==='zh'?'開始暫停':'Start Pause'}</button></div></div>`;
}

function showResult(text) {
  const result = document.getElementById('result');
  if (!result) return;
  result.style.display = 'block';
  result.textContent = text;
  addCopyPrint(result);
}

function attachToolEvents(id) {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      const parent = btn.parentElement;
      const max = parent.id === 'feelings-options' ? 5 : parent.id === 'needs-options' ? 3 : parent.id === 'values-options' ? 3 : 1;
      if (max === 1) {
        parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      } else {
        const selected = parent.querySelectorAll('.selected').length;
        if (btn.classList.contains('selected')) btn.classList.remove('selected');
        else if (selected < max) btn.classList.add('selected');
      }
      if (id === 'lowenergy') {
        const result = document.getElementById('result');
        result.style.display = 'block';
        result.textContent = (lang==='zh'?'我選擇：':'I choose: ') + btn.dataset.value;
        addCopyPrint(result);
      }
    };
  });

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

  if (id === 'muscle') {
    const steps = lang==='zh'
      ? ['握緊拳頭 5 秒，然後放開','聸肩靠近耳朵，再放下','緊繃腹部，再放鬆','繃緊腳趾，再放鬆','深呼吸一次，感受全身','完成。']
      : ['Clench fists for 5s, then release','Shrug shoulders to ears, then drop','Tighten stomach, then relax','Curl toes, then release','Take one deep breath and notice the body','Done.'];
    let idx = 0;
    const prompt = document.getElementById('muscle-prompt');
    prompt.textContent = steps[0];
    document.getElementById('nextMuscle').onclick = () => {
      idx++;
      if (idx < steps.length) prompt.textContent = steps[idx];
      else document.getElementById('nextMuscle').style.display = 'none';
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

// Init
applyTheme();
document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
renderHome();
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash && tools.some(t => t.id === hash)) openTool(hash);
});
