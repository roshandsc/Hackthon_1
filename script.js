const responses = {
  tax: {
    keywords: ['tax', 'refund', 'return', 'income', 'filing', 'ita'],
    reply: `Your <strong>Tax Year 2024–25</strong> refund is currently being processed. Here's a summary:`,
    card: {
      type: 'status',
      title: 'Income Tax Refund — AY 2024–25',
      badge: 'processing',
      badgeText: 'PROCESSING',
      steps: [
        { label: 'Filed', status: 'done' },
        { label: 'Verified', status: 'done' },
        { label: 'Processing', status: 'active' },
        { label: 'Dispatched', status: 'todo' },
        { label: 'Credited', status: 'todo' }
      ],
      info: [
        { label: 'Refund Amount', value: '₹ 24,580' },
        { label: 'Filed On', value: '15 Jul 2024' },
        { label: 'Assessment Year', value: '2024–25' },
        { label: 'ETA', value: '5–7 working days' }
      ]
    },
    suffix: `Your refund of <strong>₹24,580</strong> is expected within <strong>5–7 working days</strong>. You'll receive an SMS and email once it's credited to your registered bank account ending in ****4721.`,
    actions: ['Download ITR Copy', 'Update Bank Details', 'Raise Grievance', 'View All Filings']
  },
  passport: {
    keywords: ['passport', 'travel', 'app-2024', 'track'],
    reply: `I found your passport application. Here's the current status:`,
    card: {
      type: 'status',
      title: 'Passport Application — APP-2024-9812',
      badge: 'processing',
      badgeText: 'UNDER REVIEW',
      steps: [
        { label: 'Submitted', status: 'done' },
        { label: 'Police Verification', status: 'done' },
        { label: 'Printing', status: 'active' },
        { label: 'Dispatched', status: 'todo' },
        { label: 'Delivered', status: 'todo' }
      ],
      info: [
        { label: 'Application No.', value: 'APP-2024-9812' },
        { label: 'Applied On', value: '02 Nov 2024' },
        { label: 'Type', value: 'Fresh · 10 Years' },
        { label: 'Expected By', value: '10 Mar 2025' }
      ]
    },
    suffix: `Your passport is currently at the <strong>printing stage</strong>. Police verification was completed on 18 Feb 2025. It will be dispatched via speed post once printed.`,
    actions: ['Track Shipment', 'Contact Passport Office', 'Download Acknowledgement', 'Schedule Re-appointment']
  },
  benefit: {
    keywords: ['benefit', 'social', 'eligible', 'scheme', 'welfare', 'pension'],
    reply: `Based on your profile (income bracket, age, and employment status), here are the benefits you may be eligible for:`,
    docList: [
      { icon: '🏥', name: 'PM-JAY Health Cover', status: 'ok', statusText: 'ENROLLED' },
      { icon: '🌾', name: 'PM-KISAN Subsidy', status: 'req', statusText: 'APPLY NOW' },
      { icon: '👴', name: 'Old Age Pension', status: 'req', statusText: 'CHECK ELIGIBILITY' },
      { icon: '🏠', name: 'PM Awas Yojana', status: 'ok', statusText: 'ENROLLED' },
      { icon: '⚡', name: 'Ujjwala 2.0 Scheme', status: 'req', statusText: 'APPLY NOW' }
    ],
    suffix: `You are currently enrolled in 2 of 5 applicable schemes. I can help you apply for the remaining ones — just say which you'd like to start with.`,
    actions: ['Apply for PM-KISAN', 'Check Pension Eligibility', 'View All Schemes', 'Upload Documents']
  },
  documents: {
    keywords: ['document', 'pending', 'upload', 'deadline', 'required', 'submit'],
    reply: `You have <strong>2 pending documents</strong> that require your attention before the deadline:`,
    docList: [
      { icon: '📄', name: 'Form 16 — FY 2024–25', status: 'req', statusText: '⚠ DUE: 31 Mar' },
      { icon: '🏦', name: 'Bank Statement (6 months)', status: 'req', statusText: '⚠ DUE: 28 Feb' },
      { icon: '🪪', name: 'Aadhaar — Linked', status: 'ok', statusText: '✓ VERIFIED' },
      { icon: '🏠', name: 'Address Proof', status: 'ok', statusText: '✓ UPLOADED' },
      { icon: '📸', name: 'Passport Photo', status: 'ok', statusText: '✓ VERIFIED' }
    ],
    suffix: `⚠️ Your bank statement is due <strong>tomorrow (28 Feb)</strong>. I can guide you through the upload process or send you a reminder. Would you like to proceed?`,
    actions: ['Upload Form 16', 'Upload Bank Statement', 'Set Reminder', 'Get Help']
  },
  appointment: {
    keywords: ['appointment', 'book', 'schedule', 'visit', 'office'],
    reply: `I can help you schedule an appointment. Here are the next available slots at your nearest service center:`,
    card: {
      type: 'status',
      title: 'Appointment Booking — District Service Center',
      badge: 'pending',
      badgeText: 'SELECT SLOT',
      steps: [
        { label: 'Select Date', status: 'active' },
        { label: 'Choose Service', status: 'todo' },
        { label: 'Confirm', status: 'todo' },
        { label: 'Booked', status: 'todo' }
      ],
      info: [
        { label: 'Center', value: 'City Hall, Block B' },
        { label: 'Next Available', value: '01 Mar 2025, 10:30' },
        { label: 'Mode', value: 'Walk-in / Online' },
        { label: 'Duration', value: '30 min' }
      ]
    },
    suffix: `Available slots: <strong>01 Mar (10:30 AM, 2:00 PM)</strong> and <strong>03 Mar (11:00 AM, 3:30 PM)</strong>. Shall I confirm the first available slot for you?`,
    actions: ['Confirm 01 Mar, 10:30 AM', 'See All Slots', 'Choose Different Center', 'Online Service Instead']
  },
  default: {
    reply: `I understand you're looking for assistance with government services. I can help with tax filings, application tracking, social benefits, legal compliance, and document management. Could you please be more specific about what you need? You can also try one of the quick options below.`,
    actions: ['Check tax refund', 'Track application', 'View benefits', 'Pending documents']
  }
};

function detectIntent(msg) {
  const lower = msg.toLowerCase();
  for (const [key, data] of Object.entries(responses)) {
    if (key === 'default') continue;
    if (data.keywords.some(k => lower.includes(k))) return key;
  }
  return 'default';
}

function buildSteps(steps) {
  return steps.map(s => `
    <div class="progress-step ${s.status}">
      <div class="step-dot ${s.status}">${s.status === 'done' ? '✓' : s.status === 'active' ? '◉' : '·'}</div>
      <div class="step-label">${s.label}</div>
    </div>
  `).join('');
}

function buildCard(card) {
  if (!card) return '';
  return `
    <div class="status-card">
      <div class="card-header">
        <div class="card-title">${card.title}</div>
        <div class="card-badge ${card.badge}">${card.badgeText}</div>
      </div>
      <div class="card-body">
        <div class="progress-track">${buildSteps(card.steps)}</div>
        <div class="info-grid">
          ${card.info.map(i => `<div class="info-item"><div class="info-label">${i.label}</div><div class="info-value">${i.value}</div></div>`).join('')}
        </div>
      </div>
    </div>`;
}

function buildDocList(docs) {
  if (!docs) return '';
  return `<div class="doc-list">${docs.map(d => `
    <div class="doc-item">
      <span class="doc-icon">${d.icon}</span>
      <span class="doc-name">${d.name}</span>
      <span class="doc-status ${d.status}">${d.statusText}</span>
    </div>`).join('')}</div>`;
}

function buildActions(actions) {
  if (!actions) return '';
  return `<div class="quick-actions">${actions.map(a => `<button class="quick-btn" onclick="sendSuggestion('${a}')">${a}</button>`).join('')}</div>`;
}

let isThinking = false;
let chatHistory = []; // Store the conversation history

async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text || isThinking) return;
  input.value = '';
  autoResize(input);
  addUserMessage(text);
  // Determine if running locally or on Vercel
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE_URL = isLocal 
    ? 'http://localhost:8000' 
    : 'https://INSERT_YOUR_VERCEL_BACKEND_URL_HERE'; // The user must replace this!

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    removeThinking();
    
    // Add user message to history
    chatHistory.push({ role: 'user', content: text });
    // Add AI response to history
    chatHistory.push({ role: 'model', content: data.response });
    
    addAIResponseText(data.response);
  } catch (error) {
    console.error('Error calling chat API:', error);
    removeThinking();
    addAIResponseText("I'm sorry, I'm having trouble connecting to the server right now. Please try again later.");
  }
}

function sendSuggestion(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

function addUserMessage(text) {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const el = document.createElement('div');
  el.className = 'message user';
  el.innerHTML = `
    <div class="msg-avatar user">M</div>
    <div class="msg-content">
      <div class="msg-sender" style="text-align:right">MANTHAN · NOW</div>
      <div class="msg-bubble user">${escapeHtml(text)}</div>
    </div>`;
  msgs.appendChild(el);
  scrollBottom();
}

let thinkingEl;
function showThinking() {
  isThinking = true;
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  thinkingEl = document.createElement('div');
  thinkingEl.className = 'message';
  thinkingEl.innerHTML = `
    <div class="msg-avatar ai">🏛️</div>
    <div class="msg-content">
      <div class="msg-sender">GOVERNMENT ASSISTANT</div>
      <div class="thinking">
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
      </div>
    </div>`;
  msgs.appendChild(thinkingEl);
  scrollBottom();
}

function removeThinking() {
  if (thinkingEl) { thinkingEl.remove(); thinkingEl = null; }
  isThinking = false;
}

function addAIResponseText(text) {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const el = document.createElement('div');
  el.className = 'message';
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  // Basic markdown-like formatting for links and bold
  let formattedText = escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  el.innerHTML = `
    <div class="msg-avatar ai">🏛️</div>
    <div class="msg-content">
      <div class="msg-sender">GOVERNMENT ASSISTANT · ${now}</div>
      <div class="msg-bubble ai">
        <div>${formattedText}</div>
      </div>
    </div>`;
  msgs.appendChild(el);
  scrollBottom();
}

function scrollBottom() {
  const msgs = document.getElementById('messages');
  if (msgs) setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

function clearChat() {
  if (!confirm('Clear conversation history?')) return;
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  const welcome = document.createElement('div');
  welcome.className = 'message';
  welcome.id = 'welcomeMsg';
  welcome.innerHTML = `
    <div class="msg-avatar ai">��️</div>
    <div class="msg-content">
      <div class="msg-sender">GOVERNMENT ASSISTANT · SESSION CLEARED</div>
      <div class="msg-bubble ai">Chat cleared. How can I assist you today?
        <div class="quick-actions" style="margin-top:12px;">
          <button class="quick-btn" onclick="sendSuggestion('Check my tax refund status')">Tax Refund</button>
          <button class="quick-btn" onclick="sendSuggestion('Track my passport application')">Track Application</button>
          <button class="quick-btn" onclick="sendSuggestion('What social benefits am I eligible for?')">Benefits</button>
        </div>
      </div>
    </div>`;
  msgs.appendChild(welcome);
}

function showNotif() {
  addAIResponse('default');
}

// UI Sidebar Toggle Logic
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  } else {
    sidebar.classList.toggle('closed');
  }
}
