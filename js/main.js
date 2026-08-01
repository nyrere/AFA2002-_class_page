(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'vbw-theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      var label = toggle.querySelector('.toggle-label');
      if (label) label.textContent = theme === 'light' ? 'On' : 'Off';
    }
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    var theme = saved || getSystemTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') || getSystemTheme();
    var next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function initTabs() {
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));

    function activate(id, pushHash) {
      tabButtons.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-tab') === id;
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        btn.tabIndex = isMatch ? 0 : -1;
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.id === id);
      });
      if (pushHash) {
        history.replaceState(null, '', '#' + id);
      }
      var activeBtn = document.querySelector('.tab-btn[data-tab="' + id + '"]');
      if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }

    tabButtons.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        activate(btn.getAttribute('data-tab'), true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      btn.addEventListener('keydown', function (e) {
        var newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (index + 1) % tabButtons.length;
        if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        if (newIndex !== null) {
          e.preventDefault();
          tabButtons[newIndex].focus();
          activate(tabButtons[newIndex].getAttribute('data-tab'), true);
        }
      });
    });

    document.querySelectorAll('[data-goto]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = el.getAttribute('data-goto');
        activate(targetId, true);
        var subgoto = el.getAttribute('data-subgoto');
        if (subgoto) {
          var panel = document.getElementById(targetId);
          if (panel && panel._activateSubtab) panel._activateSubtab(subgoto);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    var initial = (location.hash || '').replace('#', '');
    var validIds = panels.map(function (p) { return p.id; });
    if (initial && validIds.indexOf(initial) !== -1) {
      activate(initial, false);
    } else {
      activate(validIds[0], false);
    }
  }

  function initSubtabs() {
    document.querySelectorAll('.subtabs').forEach(function (nav) {
      var buttons = Array.prototype.slice.call(nav.querySelectorAll('.subtab-btn'));
      var panelRoot = nav.closest('.panel');
      if (!panelRoot || !buttons.length) return;
      var subpanels = Array.prototype.slice.call(panelRoot.querySelectorAll('.subpanel'));

      function activate(key) {
        buttons.forEach(function (btn) {
          var isMatch = btn.getAttribute('data-subtab') === key;
          btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
          btn.tabIndex = isMatch ? 0 : -1;
        });
        subpanels.forEach(function (sp) {
          sp.classList.toggle('active', sp.getAttribute('data-subpanel') === key);
        });
      }

      buttons.forEach(function (btn, index) {
        btn.addEventListener('click', function () {
          activate(btn.getAttribute('data-subtab'));
        });
        btn.addEventListener('keydown', function (e) {
          var newIndex = null;
          if (e.key === 'ArrowRight') newIndex = (index + 1) % buttons.length;
          if (e.key === 'ArrowLeft') newIndex = (index - 1 + buttons.length) % buttons.length;
          if (newIndex !== null) {
            e.preventDefault();
            buttons[newIndex].focus();
            activate(buttons[newIndex].getAttribute('data-subtab'));
          }
        });
      });

      panelRoot._activateSubtab = activate;
      activate(buttons[0].getAttribute('data-subtab'));
    });
  }

  function initSparkles() {
    var field = document.getElementById('sparkleField');
    if (!field) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var count = window.innerWidth < 640 ? 14 : 26;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      var size = (Math.random() * 5 + 3).toFixed(1);
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDelay = (Math.random() * 4.5).toFixed(2) + 's';
      s.style.animationDuration = (3.5 + Math.random() * 3).toFixed(2) + 's';
      field.appendChild(s);
    }
  }

  function initClouds() {
    var field = document.getElementById('cloudField');
    if (!field) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var count = window.innerWidth < 640 ? 6 : 10;
    for (var i = 0; i < count; i++) {
      var c = document.createElement('div');
      c.className = 'cloud';
      c.style.left = Math.random() * 100 + '%';
      c.style.top = Math.random() * 100 + '%';
      var size = (Math.random() * 8 + 10).toFixed(1);
      c.style.fontSize = size + 'px';
      c.style.opacity = (Math.random() * 0.35 + 0.45).toFixed(2);
      c.style.animationDelay = (Math.random() * -60).toFixed(1) + 's';
      c.style.animationDuration = (55 + Math.random() * 40).toFixed(1) + 's';
      field.appendChild(c);
    }
  }

  function initLeaves() {
    var field = document.getElementById('vineField');
    if (!field) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['var(--plum)', '#4a7a4f', '#3d6642'];
    var count = window.innerWidth < 640 ? 16 : 28;
    for (var i = 0; i < count; i++) {
      var l = document.createElement('span');
      l.className = 'leaf';
      l.style.left = Math.random() * 100 + '%';
      l.style.top = Math.random() * 100 + '%';
      var size = (Math.random() * 10 + 10).toFixed(1);
      l.style.width = size + 'px';
      l.style.height = size + 'px';
      l.style.background = colors[i % colors.length];
      l.style.opacity = (Math.random() * 0.3 + 0.35).toFixed(2);
      var rotation = Math.floor(Math.random() * 360);
      l.style.setProperty('--leaf-rot', rotation + 'deg');
      l.style.animationDelay = (Math.random() * -8).toFixed(2) + 's';
      l.style.animationDuration = (5 + Math.random() * 4).toFixed(2) + 's';
      field.appendChild(l);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initTabs();
    initSubtabs();
    initSparkles();
    initClouds();
    initLeaves();
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
