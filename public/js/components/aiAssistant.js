/**
 * Bilingual AI Health Navigation Assistant Component (Voice, Text, Triage Guidance)
 */

const AIAssistant = {
  isListening: false,
  recognition: null,

  init() {
    this.bindEvents();
    this.initSpeechRecognition();
  },

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        const micBtn = document.getElementById('ai-mic-btn');
        if (micBtn) {
          micBtn.classList.add('bg-error', 'text-white', 'animate-pulse');
        }
        window.Toast?.info('Listening... Speak your question in English or Telugu.');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('ai-query-input');
        if (input) input.value = transcript;
        this.handleQuery(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error', event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    }
  },

  stopListening() {
    this.isListening = false;
    const micBtn = document.getElementById('ai-mic-btn');
    if (micBtn) {
      micBtn.classList.remove('bg-error', 'text-white', 'animate-pulse');
    }
  },

  bindEvents() {
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-query-input');
    const micBtn = document.getElementById('ai-mic-btn');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input?.value.trim();
      if (query) {
        this.handleQuery(query);
      }
    });

    micBtn?.addEventListener('click', () => {
      if (!this.recognition) {
        window.Toast?.warning('Speech recognition is not supported in this browser. Please type your query.');
        return;
      }
      if (this.isListening) {
        this.recognition.stop();
      } else {
        this.recognition.lang = window.appState.lang === 'te' ? 'te-IN' : 'en-IN';
        try {
          this.recognition.start();
        } catch (e) {
          console.error(e);
        }
      }
    });

    // Suggested questions chips
    const questionChips = document.querySelectorAll('.ai-suggested-chip');
    questionChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent.trim();
        if (input) input.value = query;
        this.handleQuery(query);
      });
    });
  },

  async handleQuery(query) {
    const dialogBox = document.getElementById('ai-dialog-container');
    const input = document.getElementById('ai-query-input');
    if (!dialogBox) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-start justify-end gap-2.5';
    userMsg.innerHTML = `
      <div class="bg-primary text-on-primary rounded-2xl rounded-tr-none p-3.5 text-body-md max-w-[85%] shadow-sm">
        ${query}
      </div>
      <div class="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 text-[12px] font-bold">
        You
      </div>
    `;
    dialogBox.appendChild(userMsg);
    dialogBox.scrollTop = dialogBox.scrollHeight;

    if (input) input.value = '';

    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'flex items-start gap-2.5';
    typingIndicator.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 text-[12px] font-bold">
        AI
      </div>
      <div class="bg-surface-container-low rounded-2xl rounded-tl-none p-3.5 text-body-md text-on-surface max-w-[85%] border border-outline-variant/40 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-secondary animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-secondary animate-bounce" style="animation-delay: 0.2s"></span>
        <span class="w-2 h-2 rounded-full bg-secondary animate-bounce" style="animation-delay: 0.4s"></span>
        <span class="text-label-sm text-on-surface-variant ml-1">Analyzing triage rules...</span>
      </div>
    `;
    dialogBox.appendChild(typingIndicator);
    dialogBox.scrollTop = dialogBox.scrollHeight;

    try {
      const res = await window.API.ai.navigate(query, window.appState.lang);
      typingIndicator.remove();

      const aiMsg = document.createElement('div');
      aiMsg.className = 'flex items-start gap-2.5';

      const isEmergency = res.isEmergency;
      const bubbleClass = isEmergency 
        ? 'bg-red-50 text-red-950 border-2 border-red-400' 
        : 'bg-surface-container-low text-on-surface border border-outline-variant/40';

      let actionsHtml = '';
      if (res.actions && res.actions.length > 0) {
        actionsHtml = `
          <div class="flex flex-wrap gap-2 pt-3 mt-2 border-t border-outline-variant/40">
            ${res.actions.map(a => `
              <a href="${a.url}" class="px-3 py-1.5 rounded-lg text-label-sm font-bold flex items-center gap-1 transition-all ${a.primary ? 'bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant' : 'bg-surface-container-lowest border border-outline text-primary hover:bg-surface-container'}">
                <span class="material-symbols-outlined text-[15px]">${a.icon || 'arrow_forward'}</span>
                <span>${a.label}</span>
              </a>
            `).join('')}
          </div>
        `;
      }

      aiMsg.innerHTML = `
        <div class="w-7 h-7 rounded-full ${isEmergency ? 'bg-error text-white' : 'bg-surface-container-high text-primary'} flex items-center justify-center shrink-0 text-[12px] font-bold">
          ${isEmergency ? '!' : 'AI'}
        </div>
        <div class="${bubbleClass} rounded-2xl rounded-tl-none p-3.5 text-body-md max-w-[85%] shadow-sm">
          <div class="leading-relaxed">${res.text.replace(/\n/g, '<br/>')}</div>
          ${actionsHtml}
          <div class="mt-2.5 pt-2 border-t border-outline-variant/30 text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>${res.disclaimer}</span>
            <button class="ai-speak-btn p-1 hover:text-secondary transition-colors" title="Read response aloud">
              <span class="material-symbols-outlined text-[16px]">volume_up</span>
            </button>
          </div>
        </div>
      `;

      dialogBox.appendChild(aiMsg);
      dialogBox.scrollTop = dialogBox.scrollHeight;

      // Speak button handler
      aiMsg.querySelector('.ai-speak-btn')?.addEventListener('click', () => {
        this.speakText(res.text);
      });

    } catch (err) {
      typingIndicator.remove();
      const errorMsg = document.createElement('div');
      errorMsg.className = 'text-center p-3 bg-red-50 text-red-900 rounded-xl text-label-sm';
      errorMsg.textContent = 'Assistant error: ' + err.message;
      dialogBox.appendChild(errorMsg);
    }
  },

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = window.appState.lang === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95; // Clear pace for elder inclusion
      window.speechSynthesis.speak(utterance);
    }
  }
};

window.AIAssistant = AIAssistant;

