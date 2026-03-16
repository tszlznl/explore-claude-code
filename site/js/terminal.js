/**
 * Terminal - 交互式 Claude Code 终端模拟器。
 * 支持带有动画响应的斜杠命令。
 */

class Terminal {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.isAnimating = false;
    this.collapsed = false;
    this.resizing = false;
    this.panel = null;
    this.output = null;
    this.input = null;
  }

  init() {
    this.panel = document.getElementById('terminal-panel');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    if (!this.panel || !this.output || !this.input) return;

    this._setupInput();
    this._setupHeader();
    this._setupResize();
    this._showWelcome();
  }

  _setupInput() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.input.value.trim();
        if (cmd && !this.isAnimating) {
          this._execute(cmd);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this._navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._navigateHistory(1);
      }
    });
    // 当终端获得焦点时阻止全局键盘导航
    this.input.addEventListener('keydown', (e) => {
      e.stopPropagation();
    });
  }

  _setupHeader() {
    const header = this.panel.querySelector('.terminal-header');
    const chevron = this.panel.querySelector('.terminal-header__chevron');

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // 在移动端，标题栏/箭头按钮点击会关闭终端而不是折叠
    const handleToggle = () => {
      if (isMobile()) {
        this._closeMobile();
      } else {
        this._toggleCollapse();
      }
    };

    if (header) {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.terminal-header__btn')) return;
        handleToggle();
      });
    }
    if (chevron) {
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        handleToggle();
      });
    }
  }

  _closeMobile() {
    this.panel.classList.remove('mobile-open');
    this.panel.style.display = 'none';
  }

  _setupResize() {
    const handle = this.panel.querySelector('.terminal-resize');
    if (!handle) return;

    const mainLayout = this.panel.closest('.main-layout');
    if (!mainLayout) return;

    let startX, startWidth;

    const onMouseMove = (e) => {
      if (!this.resizing) return;
      const delta = startX - e.clientX;
      const maxWidth = mainLayout.offsetWidth - 300; // 留出侧边栏和内容空间
      const newWidth = Math.max(200, Math.min(startWidth + delta, maxWidth));
      this.panel.style.width = newWidth + 'px';
    };

    const onMouseUp = () => {
      this.resizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.resizing = true;
      startX = e.clientX;
      startWidth = this.panel.offsetWidth;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  _toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.panel.classList.toggle('collapsed', this.collapsed);
    if (!this.collapsed) {
      this.input.focus();
    }
  }

  _showWelcome() {
    this._appendHtml(`
      <div class="term-welcome-banner">
        <div class="term-brand">
          <div class="term-brand__rule"></div>
          <pre class="term-brand__ascii"><span class="term-brand__char-bright">█▀▀ ▀▄▀ █▀█ █   █▀█ █▀█ █▀▀</span>
<span class="term-brand__char-bright">█▀▀  █  █▀▀ █   █ █ █▀▄ █▀▀</span>
<span class="term-brand__char-bright">▀▀▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀</span></pre>
          <pre class="term-brand__ascii term-brand__ascii--sub"><span class="term-brand__char-accent">█▀▀ █   █▀█ █ █ █▀▄ █▀▀</span>
<span class="term-brand__char-accent">█   █   █▀█ █ █ █ █ █▀▀</span>
<span class="term-brand__char-accent">▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀ ▀▀▀ ▀▀▀</span>
<span class="term-brand__char-dim">█▀▀ █▀█ █▀▄ █▀▀</span>
<span class="term-brand__char-dim">█   █ █ █ █ █▀▀</span>
<span class="term-brand__char-dim">▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀</span></pre>
          <div class="term-brand__rule"></div>
        </div>

        <div class="term-banner-tagline">
          在实践中学习。每个文件都是一堂课。<br>
          每个文件夹都是一个章节。
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-section">
          <div class="term-banner-section__title">快速开始</div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/help</span>
            <span class="term-text--dim">- 列出所有命令</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/init</span>
            <span class="term-text--dim">- 观看 CLAUDE.md 被创建</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/doctor</span>
            <span class="term-text--dim">- 运行健康检查</span>
          </div>
          <div class="term-banner-cmd-row">
            <span class="term-text--accent">/diff</span>
            <span class="term-text--dim">- 查看实时 diff 演示</span>
          </div>
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-section">
          <div class="term-banner-section__title">如何探索</div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">1</span>
            <span>浏览左侧文件树</span>
          </div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">2</span>
            <span>点击任何文件了解它的作用</span>
          </div>
          <div class="term-banner-step">
            <span class="term-banner-step__num">3</span>
            <span>在这里尝试命令以查看实际效果</span>
          </div>
        </div>

        <div class="term-banner-divider"></div>

        <div class="term-banner-info">
          <div class="term-banner-row">
            <span class="term-banner-key">版本</span>
            <span class="term-banner-val">1.0.42</span>
          </div>
          <div class="term-banner-row">
            <span class="term-banner-key">模型</span>
            <span class="term-banner-val term-text--accent">claude-opus-4-6</span>
          </div>
          <div class="term-banner-row">
            <span class="term-banner-key">项目</span>
            <span class="term-banner-val">my-project</span>
          </div>
        </div>
      </div>
    `);
  }

  _execute(rawCmd) {
    // 存储到历史记录
    this.history.push(rawCmd);
    this.historyIndex = this.history.length;

    // 回显命令
    this._appendHtml(`
      <div class="term-cmd">
        <span class="term-prompt-echo">claude &gt;</span> ${this._esc(rawCmd)}
      </div>
    `);

    this.input.value = '';

    // 解析命令
    const cmd = rawCmd.startsWith('/') ? rawCmd.split(/\s+/)[0].toLowerCase() : rawCmd.toLowerCase();

    // 路由到处理程序
    const handlers = {
      '/help': () => this._cmdHelp(),
      '/init': () => this._cmdInit(),
      '/doctor': () => this._cmdDoctor(),
      '/cost': () => this._cmdCost(),
      '/compact': () => this._cmdCompact(),
      '/model': () => this._cmdModel(),
      '/diff': () => this._cmdDiff(),
      '/clear': () => this._clearOutput(),
      '/status': () => this._cmdStatus(),
      '/config': () => this._cmdConfig(),
      '/memory': () => this._cmdMemory(),
    };

    if (handlers[cmd]) {
      handlers[cmd]();
    } else {
      this._appendHtml(`
        <div class="term-block">
          <div class="term-text--error">未知命令：${this._esc(rawCmd)}</div>
          <div class="term-text--dim">输入 <span class="term-text--accent">/help</span> 查看可用命令。</div>
        </div>
      `);
    }

    this._scrollToBottom();
  }

  _navigateHistory(direction) {
    if (this.history.length === 0) return;
    this.historyIndex = Math.max(0, Math.min(this.historyIndex + direction, this.history.length));
    this.input.value = this.historyIndex < this.history.length ? this.history[this.historyIndex] : '';
  }

  // ── 命令处理程序 ──────────────────────────────────────

  _cmdHelp() {
    const cmds = [
      ['/help', '显示此命令参考'],
      ['/init', '初始化 CLAUDE.md 项目文件'],
      ['/doctor', '检查安装健康状况'],
      ['/cost', '显示会话 token 使用量和成本'],
      ['/compact', '压缩对话上下文'],
      ['/model', '查看可用模型'],
      ['/diff', '显示未提交的更改'],
      ['/status', '版本、模型和账户信息'],
      ['/config', '打开设置浏览器'],
      ['/memory', '查看自动记忆条目'],
      ['/clear', '清除终端输出'],
    ];

    let rows = '';
    for (const [cmd, desc] of cmds) {
      rows += `<div class="term-row"><span class="term-col term-col--cmd">${cmd}</span><span class="term-col term-col--desc">${desc}</span></div>`;
    }

    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">可用命令</div>
        <div class="term-table">${rows}</div>
        <hr class="term-hr">
        <div class="term-text--dim">提示：使用箭头键导航命令历史记录。</div>
      </div>
    `);
  }

  _cmdInit() {
    this._animateSequence([
      { html: '<div class="term-text--dim">正在扫描项目结构...</div>', delay: 400 },
      { html: '<div class="term-text">找到：package.json, tsconfig.json, src/</div>', delay: 600 },
      { html: '<div class="term-text--dim">正在生成项目上下文...</div>', delay: 500 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: `<div class="term-heading">已创建 CLAUDE.md</div>`, delay: 300 },
      { html: `<div class="term-text--dim">  # 项目：my-project</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  </div>`, delay: 50 },
      { html: `<div class="term-text--dim">  ## 技术栈</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  - TypeScript + React</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Vite 用于打包</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - Tailwind CSS</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  </div>`, delay: 50 },
      { html: `<div class="term-text--dim">  ## 约定</div>`, delay: 100 },
      { html: `<div class="term-text--dim">  - 使用函数式组件</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - 优先使用命名导出</div>`, delay: 80 },
      { html: `<div class="term-text--dim">  - 测试文件在 __tests__/ 目录中</div>`, delay: 80 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-text--success">CLAUDE.md 创建成功。Claude 将以此作为项目上下文。</div>', delay: 0 },
    ]);
  }

  _cmdDoctor() {
    const checks = [
      ['身份验证', '已验证身份为用户 user@example.com', true, 500],
      ['模型访问', 'claude-opus-4-6 可用', true, 400],
      ['Git 仓库', '工作区干净', true, 350],
      ['Node.js', 'v22.1.0', true, 300],
      ['MCP 服务器', '已连接 2 个（文件系统，github）', true, 450],
      ['权限', 'settings.json 已加载', true, 300],
      ['CLAUDE.md', '在项目根目录找到', true, 350],
    ];

    this._animateSequence([
      { html: '<div class="term-heading">正在运行诊断...</div>', delay: 400 },
      ...checks.map(([label, detail, pass, delay]) => ({
        html: `<div class="term-check">
          <span class="term-check__icon term-check__icon--${pass ? 'pass' : 'fail'}">${pass ? '✓' : '✗'}</span>
          <span class="term-check__label">${label}</span>
          <span class="term-check__detail">${detail}</span>
        </div>`,
        delay,
      })),
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-text--success">所有检查通过。Claude Code 已就绪。</div>', delay: 0 },
    ]);
  }

  _cmdCost() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">会话使用量</div>
        <div class="term-stat"><span class="term-stat__key">输入 token</span><span class="term-stat__val">42,817</span></div>
        <div class="term-stat"><span class="term-stat__key">输出 token</span><span class="term-stat__val">18,243</span></div>
        <div class="term-stat"><span class="term-stat__key">缓存读取</span><span class="term-stat__val">156,092</span></div>
        <div class="term-stat"><span class="term-stat__key">缓存写入</span><span class="term-stat__val">28,451</span></div>
        <hr class="term-hr">
        <div class="term-stat"><span class="term-stat__key">总成本</span><span class="term-stat__val term-stat__val--accent">$0.847</span></div>
        <div class="term-stat"><span class="term-stat__key">消息数</span><span class="term-stat__val">23</span></div>
        <div class="term-stat"><span class="term-stat__key">时长</span><span class="term-stat__val">14 分 32 秒</span></div>
      </div>
    `);
  }

  _cmdCompact() {
    const block = document.createElement('div');
    block.className = 'term-block';
    block.innerHTML = `
      <div class="term-text--dim">正在压缩对话上下文...</div>
      <div class="term-progress">
        <div class="term-progress__bar"><div class="term-progress__fill" id="compact-fill"></div></div>
        <span class="term-progress__label" id="compact-pct">0%</span>
      </div>
    `;
    this.output.appendChild(block);
    this._scrollToBottom();

    const fill = document.getElementById('compact-fill');
    const pct = document.getElementById('compact-pct');
    let progress = 0;
    this.isAnimating = true;

    const step = () => {
      progress += 2 + Math.random() * 6;
      if (progress >= 100) {
        progress = 100;
        fill.style.width = '100%';
        pct.textContent = '100%';

        setTimeout(() => {
          block.innerHTML += `
            <hr class="term-hr">
            <div class="term-stat"><span class="term-stat__key">压缩前</span><span class="term-stat__val">187,204 tokens</span></div>
            <div class="term-stat"><span class="term-stat__key">压缩后</span><span class="term-stat__val term-stat__val--accent">24,817 tokens</span></div>
            <div class="term-stat"><span class="term-stat__key">压缩率</span><span class="term-stat__val term-stat__val--accent">86.7%</span></div>
            <div class="term-text--success" style="margin-top:6px">上下文已压缩。对话摘要已保留。</div>
          `;
          this.isAnimating = false;
          this._scrollToBottom();
        }, 300);
        return;
      }

      fill.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';
      setTimeout(step, 40 + Math.random() * 60);
    };

    setTimeout(step, 300);
  }

  _cmdModel() {
    const models = [
      ['claude-opus-4-6', '最强大，深度推理', true],
      ['claude-sonnet-4-6', '快速，平衡性能', false],
      ['claude-haiku-4-5', '最快，轻量级任务', false],
    ];

    let rows = '';
    for (const [name, desc, active] of models) {
      rows += `<div class="term-model">
        <span class="term-model__indicator term-model__indicator--${active ? 'active' : 'inactive'}"></span>
        <span class="term-model__name ${active ? 'term-model__name--active' : ''}">${name}</span>
        <span class="term-model__desc">${desc}</span>
      </div>`;
    }

    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Available Models</div>
        ${rows}
        <hr class="term-hr">
        <div class="term-text--dim">Active model shown with <span class="term-text--accent">\u25CF</span>. Use <span class="term-text--accent">/model &lt;name&gt;</span> to switch.</div>
      </div>
    `);
  }

  _cmdDiff() {
    this._animateSequence([
      { html: '<div class="term-text--dim">Checking uncommitted changes...</div>', delay: 400 },
      { html: '<div class="term-diff-hdr">--- a/src/utils/auth.ts</div>', delay: 200 },
      { html: '<div class="term-diff-hdr">+++ b/src/utils/auth.ts</div>', delay: 100 },
      { html: '<div class="term-diff-ctx">@@ -14,7 +14,9 @@ export function validateToken(token: string) {</div>', delay: 150 },
      { html: '<div class="term-diff-ctx">  const decoded = jwt.verify(token, SECRET);</div>', delay: 80 },
      { html: '<div class="term-diff-del">  return decoded;</div>', delay: 80 },
      { html: '<div class="term-diff-add">  if (!decoded.exp || decoded.exp < Date.now() / 1000) {</div>', delay: 80 },
      { html: '<div class="term-diff-add">    throw new TokenExpiredError(\'Token has expired\');</div>', delay: 80 },
      { html: '<div class="term-diff-add">  }</div>', delay: 80 },
      { html: '<div class="term-diff-add">  return decoded;</div>', delay: 80 },
      { html: '<div class="term-diff-ctx">}</div>', delay: 80 },
      { html: '<hr class="term-hr">', delay: 200 },
      { html: '<div class="term-stat"><span class="term-stat__key">Files changed</span><span class="term-stat__val">1</span></div>', delay: 100 },
      { html: '<div class="term-stat"><span class="term-stat__key">Insertions</span><span class="term-stat__val term-text--success">+4</span></div>', delay: 80 },
      { html: '<div class="term-stat"><span class="term-stat__key">Deletions</span><span class="term-stat__val term-text--error">-1</span></div>', delay: 0 },
    ]);
  }

  _cmdStatus() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-heading">Claude Code Status</div>
        <div class="term-stat"><span class="term-stat__key">Version</span><span class="term-stat__val">1.0.42</span></div>
        <div class="term-stat"><span class="term-stat__key">Model</span><span class="term-stat__val term-stat__val--accent">claude-opus-4-6</span></div>
        <div class="term-stat"><span class="term-stat__key">Account</span><span class="term-stat__val">user@example.com</span></div>
        <div class="term-stat"><span class="term-stat__key">Plan</span><span class="term-stat__val">Max (5x usage)</span></div>
        <div class="term-stat"><span class="term-stat__key">Project</span><span class="term-stat__val">my-project</span></div>
        <div class="term-stat"><span class="term-stat__key">Working dir</span><span class="term-stat__val">~/code/my-project</span></div>
        <hr class="term-hr">
        <div class="term-stat"><span class="term-stat__key">MCP servers</span><span class="term-stat__val">2 connected</span></div>
        <div class="term-stat"><span class="term-stat__key">CLAUDE.md</span><span class="term-stat__val term-text--success">loaded</span></div>
        <div class="term-stat"><span class="term-stat__key">Permissions</span><span class="term-stat__val">default + 3 custom</span></div>
      </div>
    `);
  }

  _cmdConfig() {
    this._appendHtml(`
      <div class="term-block">
        <div class="term-text--dim">Opening settings...</div>
      </div>
    `);
    // Navigate to settings.json in the file explorer
    setTimeout(() => {
      if (window.app && window.app.explorer) {
        window.app.explorer.selectPath('.claude/settings.json');
      }
    }, 300);
  }

  _cmdMemory() {
    this._animateSequence([
      { html: '<div class="term-heading">Auto-Memory Entries</div>', delay: 300 },
      { html: '<div class="term-text--dim">from ~/.claude/projects/.../memory/MEMORY.md</div>', delay: 200 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text">\u2022 User prefers functional components over classes</div>', delay: 150 },
      { html: '<div class="term-text">\u2022 Always run tests with --coverage flag</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Project uses pnpm, not npm</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Prefer named exports over default exports</div>', delay: 120 },
      { html: '<div class="term-text">\u2022 Error messages should be user-friendly, not technical</div>', delay: 120 },
      { html: '<hr class="term-hr">', delay: 150 },
      { html: '<div class="term-text--dim">5 entries. Edit with <span class="term-text--accent">/memory --edit</span></div>', delay: 0 },
    ]);
  }

  // ── Utilities ─────────────────────────────────────────────

  _clearOutput() {
    this.output.innerHTML = '';
    this._showWelcome();
  }

  _appendHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
      this.output.appendChild(div.firstChild);
    }
    this._scrollToBottom();
  }

  _scrollToBottom() {
    requestAnimationFrame(() => {
      this.output.scrollTop = this.output.scrollHeight;
    });
  }

  /** Animate a sequence of HTML blocks with delays */
  _animateSequence(steps) {
    this.isAnimating = true;
    let totalDelay = 0;

    const block = document.createElement('div');
    block.className = 'term-block';
    this.output.appendChild(block);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      totalDelay += step.delay;

      setTimeout(() => {
        const div = document.createElement('div');
        div.innerHTML = step.html;
        while (div.firstChild) {
          block.appendChild(div.firstChild);
        }
        this._scrollToBottom();

        if (i === steps.length - 1) {
          this.isAnimating = false;
        }
      }, totalDelay);
    }
  }

  _esc(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}
