(function () {
  if (window.__a11y_initialized) return;
  window.__a11y_initialized = true;

  // --- Menu toggle (visual/text) ---
  document.addEventListener('DOMContentLoaded', function () {
    const visualBtn = document.getElementById('visual-btn');
    const textBtn = document.getElementById('text-btn');
    const visualMenu = document.getElementById('visual-menu');
    const textMenu = document.getElementById('text-menu');

    function setActiveButton(activeBtn, inactiveBtn) {
      if (!activeBtn || !inactiveBtn) return;
      activeBtn.classList.add('font-bold', 'text-[#181611]', 'dark:text-white', 'bg-white', 'dark:bg-gray-700', 'shadow-sm');
      activeBtn.classList.remove('font-medium', 'text-gray-500', 'dark:text-gray-400');

      inactiveBtn.classList.add('font-medium', 'text-gray-500', 'dark:text-gray-400');
      inactiveBtn.classList.remove('font-bold', 'text-[#181611]', 'dark:text-white', 'bg-white', 'dark:bg-gray-700', 'shadow-sm');
    }

    if (textBtn) {
      textBtn.addEventListener('click', () => {
        if (visualMenu) visualMenu.classList.add('hidden');
        if (textMenu) textMenu.classList.remove('hidden');
        setActiveButton(textBtn, visualBtn);
      });
    }

    if (visualBtn) {
      visualBtn.addEventListener('click', () => {
        if (textMenu) textMenu.classList.add('hidden');
        if (visualMenu) visualMenu.classList.remove('hidden');
        setActiveButton(visualBtn, textBtn);
      });
    }
  });

  // --- Text-to-Speech ---
  (function () {
    const readBtn = document.getElementById('tts-read-btn');
    const stopBtn = document.getElementById('tts-stop-btn');
    const textMenu = document.getElementById('text-menu');
    let utterance;

    function gatherVisibleText() {
      if (!textMenu) return '';
      const visible = Array.from(textMenu.querySelectorAll(':scope section, :scope ul, :scope p, :scope h1, :scope h2, :scope h3, :scope li'))
        .filter(el => el.offsetParent !== null);
      const texts = visible.map(el => el.innerText.trim()).filter(Boolean);
      return texts.join('\n\n');
    }

    function startReading() {
      if (!('speechSynthesis' in window)) {
        try { alert('Text-to-speech is not supported in this browser.'); } catch (e) { /* ignore */ }
        return;
      }

      const text = gatherVisibleText();
      if (!text) return;

      window.speechSynthesis.cancel();

      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = document.documentElement.lang || 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        if (readBtn) readBtn.setAttribute('aria-pressed', 'true');
        if (stopBtn) {
          stopBtn.classList.remove('hidden');
          stopBtn.removeAttribute('aria-hidden');
        }
      };

      utterance.onend = () => {
        if (readBtn) readBtn.setAttribute('aria-pressed', 'false');
        if (stopBtn) {
          stopBtn.classList.add('hidden');
          stopBtn.setAttribute('aria-hidden', 'true');
        }
      };

      utterance.onerror = () => {
        if (readBtn) readBtn.setAttribute('aria-pressed', 'false');
        if (stopBtn) {
          stopBtn.classList.add('hidden');
          stopBtn.setAttribute('aria-hidden', 'true');
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    function stopReading() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      utterance = null;
      if (readBtn) readBtn.setAttribute('aria-pressed', 'false');
      if (stopBtn) {
        stopBtn.classList.add('hidden');
        stopBtn.setAttribute('aria-hidden', 'true');
      }
    }

    if (readBtn) {
      readBtn.addEventListener('click', (e) => {
        const pressed = readBtn.getAttribute('aria-pressed') === 'true';
        if (pressed) stopReading(); else startReading();
      });
    }

    if (stopBtn) stopBtn.addEventListener('click', stopReading);
    const visualBtn = document.getElementById('visual-btn');
    if (visualBtn) visualBtn.addEventListener('click', stopReading);
    window.addEventListener('beforeunload', stopReading);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopReading(); });
  })();

  // --- Not Implemented Modal ---
  (function () {
    const style = document.createElement('style');
    style.textContent = `
.__notimpl_modal_backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999; }
.__notimpl_modal { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); max-width: 90%; width: 360px; text-align: center; font-family: 'Work Sans', sans-serif; }
.__notimpl_modal h2 { margin: 0 0 12px; font-size: 20px; color: #1F2937; }
.__notimpl_modal p { margin: 0 0 20px; color: #6B7280; font-size: 14px; }
.__notimpl_modal button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; background: #fac638; color: white; font-weight: 600; }
.__notimpl_modal button:hover { background: #D97706; }
    `;
    document.head.appendChild(style);

    function showModal() {
      if (document.querySelector('.__notimpl_modal_backdrop')) return;
      const backdrop = document.createElement('div');
      backdrop.className = '__notimpl_modal_backdrop';
      const modal = document.createElement('div');
      modal.className = '__notimpl_modal';
      modal.innerHTML = '<h2>Not implemented yet!</h2><p>This functionality is not implemented yet.</p>';
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Cerrar';
      closeBtn.addEventListener('click', () => backdrop.remove());
      modal.appendChild(closeBtn);
      backdrop.appendChild(modal);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
      document.body.appendChild(backdrop);
    }

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-not-implemented]');
      if (target) {
        e.preventDefault();
        showModal();
      }
    });
  })();

  // --- Accessibility Panel Logic ---
  (function () {
    const KEY_SIZE = 'a11y_font';
    const KEY_FG = 'a11y_fg';
    const KEY_BG = 'a11y_bg';
    const KEY_DYS = 'a11y_dyslexia';
    const KEY_HC = 'a11y_highcontrast';
    const KEY_CURSOR = 'a11y_cursor';
    const KEY_LINKS = 'a11y_links';
    const KEY_GRAY = 'a11y_grayscale';
    const KEY_SPACE = 'a11y_spacing';
    const KEY_GUIDE = 'a11y_guide';
    const KEY_PAUSE = 'a11y_pause';

    const trigger = document.getElementById('accessibility-trigger');
    const menu = document.getElementById('accessibility-menu');

    const sizeSlider = document.getElementById('font-size');
    const dyslexiaToggle = document.getElementById('dyslexia-toggle');
    const cursorToggle = document.getElementById('cursor-toggle');
    const linksToggle = document.getElementById('links-toggle');
    const grayscaleToggle = document.getElementById('grayscale-toggle');
    const spacingToggle = document.getElementById('spacing-toggle');
    const guideToggle = document.getElementById('reading-guide-toggle');
    const animationToggle = document.getElementById('animation-toggle');
    const resetBtn = document.getElementById('a11y-reset');

    const contrastButtons = document.querySelectorAll('[data-contrast]');
    const readingGuide = document.getElementById('a11y-reading-guide');

    document.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('a11y-reading-guide') && readingGuide) {
        readingGuide.style.top = e.clientY + 'px';
      }
    });

    if (trigger && menu) {
      trigger.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden', !isHidden);
        trigger.setAttribute('aria-expanded', String(isHidden));
      });
    }

    function setHighContrast(fg, bg) {
      if (fg) {
        document.documentElement.style.setProperty('--a11y-fg', fg);
        localStorage.setItem(KEY_FG, fg);
      }
      if (bg) {
        document.documentElement.style.setProperty('--a11y-bg', bg);
        localStorage.setItem(KEY_BG, bg);
      }
      document.body.classList.add('a11y-high-contrast', 'a11y-custom-colors');
      localStorage.setItem(KEY_HC, '1');
    }

    contrastButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentFg = btn.dataset.fg;
        const currentBg = btn.dataset.bg;
        setHighContrast(currentFg, currentBg);
      });
    });

    function setupToggle(el, cls, key) {
      if (!el) return;
      el.addEventListener('change', () => {
        const enabled = el.checked;
        if (cls === 'a11y-grayscale') document.documentElement.classList.toggle(cls, enabled);
        else document.body.classList.toggle(cls, enabled);
        localStorage.setItem(key, enabled ? '1' : '0');
      });
    }

    setupToggle(dyslexiaToggle, 'a11y-dyslexia-font', KEY_DYS);
    setupToggle(cursorToggle, 'a11y-cursor-big', KEY_CURSOR);
    setupToggle(linksToggle, 'a11y-highlight-links', KEY_LINKS);
    setupToggle(grayscaleToggle, 'a11y-grayscale', KEY_GRAY);
    setupToggle(spacingToggle, 'a11y-text-spacing', KEY_SPACE);
    setupToggle(guideToggle, 'a11y-reading-guide', KEY_GUIDE);
    setupToggle(animationToggle, 'a11y-paused', KEY_PAUSE);

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.documentElement.style.fontSize = '100%';
        if (sizeSlider) sizeSlider.value = 100;
        document.documentElement.style.removeProperty('--a11y-fg');
        document.documentElement.style.removeProperty('--a11y-bg');
        document.body.classList.remove('a11y-high-contrast', 'a11y-custom-colors', 'a11y-dyslexia-font', 'a11y-cursor-big', 'a11y-highlight-links', 'a11y-text-spacing', 'a11y-reading-guide', 'a11y-paused');
        document.documentElement.classList.remove('a11y-grayscale');
        [dyslexiaToggle, cursorToggle, linksToggle, grayscaleToggle, spacingToggle, guideToggle, animationToggle].forEach(el => { if (el) el.checked = false; });
        [KEY_SIZE, KEY_FG, KEY_BG, KEY_DYS, KEY_HC, KEY_CURSOR, KEY_LINKS, KEY_GRAY, KEY_SPACE, KEY_GUIDE, KEY_PAUSE].forEach(k => localStorage.removeItem(k));
      });
    }

    function applyInitialSettings() {
      const loadState = (key, cls, input) => {
        if (localStorage.getItem(key) === '1') {
          if (cls === 'a11y-grayscale') document.documentElement.classList.add(cls);
          else document.body.classList.add(cls);
          if (input) input.checked = true;
        }
      };

      const savedSize = localStorage.getItem(KEY_SIZE);
      if (savedSize) {
        document.documentElement.style.fontSize = savedSize + '%';
        if (sizeSlider) sizeSlider.value = savedSize;
      }

      const savedFg = localStorage.getItem(KEY_FG);
      const savedBg = localStorage.getItem(KEY_BG);
      const savedHC = localStorage.getItem(KEY_HC);

      if (savedFg) document.documentElement.style.setProperty('--a11y-fg', savedFg);
      if (savedBg) document.documentElement.style.setProperty('--a11y-bg', savedBg);
      if (savedHC === '1' && (savedFg || savedBg)) {
        document.body.classList.add('a11y-high-contrast', 'a11y-custom-colors');
      }

      loadState(KEY_DYS, 'a11y-dyslexia-font', dyslexiaToggle);
      loadState(KEY_CURSOR, 'a11y-cursor-big', cursorToggle);
      loadState(KEY_LINKS, 'a11y-highlight-links', linksToggle);
      loadState(KEY_GRAY, 'a11y-grayscale', grayscaleToggle);
      loadState(KEY_SPACE, 'a11y-text-spacing', spacingToggle);
      loadState(KEY_GUIDE, 'a11y-reading-guide', guideToggle);
      loadState(KEY_PAUSE, 'a11y-paused', animationToggle);
    }

    applyInitialSettings();
  })();

  // Expose simple staff helpers used by inline handlers
  window.doCheckIn = function() {
    try { localStorage.setItem('staffStatus','checkin'); } catch(e){}
    window.location.href = '/staff/staff_checkout';
  };
  window.doCheckOut = function() {
    try { localStorage.removeItem('staffStatus'); } catch(e){}
    window.location.href = '/';
  };

})();
