/* =========================================================================
   GOFMAN LABS — Learn module interactions
   Curriculum rendering, progress (localStorage), iceberg, terminal dojo,
   prompt lab, and quiz. Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var STORE_KEY = 'gl-learn-progress-v1';

  /* --------------------------------------------------------------------- */
  /*  Progress store                                                        */
  /* --------------------------------------------------------------------- */
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  var progress = loadProgress();

  /* --------------------------------------------------------------------- */
  /*  Curriculum data                                                       */
  /* --------------------------------------------------------------------- */
  var CURRICULUM = [
    {
      id: 'foundations', num: '01', icon: 'i-foundations',
      title: 'Foundations of Building',
      desc: 'The ground floor every tool stands on. Even with an AI co-pilot, you steer — so you need to read the dashboard.',
      lessons: [
        {
          id: 'f1', kicker: 'Environment', title: 'The terminal is your cockpit',
          why: 'Why it matters',
          why_text: 'Claude Code lives in the terminal. Knowing how to move around it turns the agent from a black box into a machine you can supervise.',
          concepts: [
            'Navigating folders: <code>pwd</code>, <code>ls</code>, <code>cd</code>',
            'Running and stopping programs (<code>Ctrl-C</code>)',
            'Paths: absolute vs relative, the <code>~</code> home shortcut',
            'Reading output and exit codes instead of fearing them'
          ],
          try_text: 'Ask Claude Code to give you a guided tour of your own machine.',
          cmd: 'Explain what every file and folder in this directory is for, like I\'m new to the terminal.'
        },
        {
          id: 'f2', kicker: 'Version control', title: 'Git: your time machine & safety net',
          why_text: 'Git lets you experiment fearlessly. Every change is a savepoint you can return to — essential when an AI is editing your files.',
          concepts: [
            'The loop: <code>status → add → commit</code>',
            'Branches: try ideas without breaking <code>main</code>',
            'Undo safely: <code>git restore</code>, <code>git revert</code>',
            'Pushing to GitHub as off-machine backup'
          ],
          try_text: 'Let the agent set up version control and explain each step.',
          cmd: 'Initialise git here, make a first commit, and explain what each command did and why.'
        },
        {
          id: 'f3', kicker: 'Project anatomy', title: 'How a codebase is organised',
          why_text: 'Tools are not single files. Understanding structure lets you tell the agent precisely where things should go.',
          concepts: [
            'Entry points, modules, and configuration files',
            'Dependencies & package managers (<code>pip</code>, <code>npm</code>, <code>cargo</code>)',
            'The role of <code>README</code>, <code>.gitignore</code>, lockfiles',
            'Where source, tests, and assets typically live'
          ],
          try_text: 'Have the agent map an unfamiliar project for you.',
          cmd: 'Draw me a tree of this project and explain the responsibility of each top-level folder.'
        },
        {
          id: 'f4', kicker: 'Resilience', title: 'Reading errors without panic',
          why_text: 'Errors are directions, not dead ends. The engineers who improve fastest are the ones who read the stack trace.',
          concepts: [
            'Anatomy of a stack trace — read it bottom-up',
            'The difference between syntax, runtime, and logic errors',
            'Reproduce → isolate → fix → verify',
            'Pasting the full error to the agent, not a paraphrase'
          ],
          try_text: 'When something breaks, hand the agent the whole error.',
          cmd: 'Here is the full error and the command that produced it. Explain the root cause before changing anything.'
        }
      ]
    },
    {
      id: 'claude', num: '02', icon: 'i-spark',
      title: 'Mastering Claude Code',
      desc: 'Vibe coding is the tip of the iceberg. This is how you turn a chat assistant into a disciplined engineering partner.',
      lessons: [
        {
          id: 'c1', kicker: 'Mental model', title: 'How the agent actually thinks',
          why_text: 'Claude Code runs a loop: read context → plan → use tools (edit, run, search) → observe → repeat. Knowing the loop lets you guide it.',
          concepts: [
            'Context window: what the agent can "see" right now',
            'Tools: it reads, edits, and runs commands on your behalf',
            'It is literal — vague asks produce vague work',
            'You are the reviewer; never merge what you haven\'t read'
          ],
          try_text: 'Make the agent narrate its plan before touching code.',
          cmd: 'Before writing anything, tell me your plan as numbered steps and wait for my approval.'
        },
        {
          id: 'c2', kicker: 'Context engineering', title: 'CLAUDE.md — a map for the agent',
          why_text: 'A CLAUDE.md file is persistent memory: your conventions, commands, and architecture. It makes every future session smarter.',
          concepts: [
            'Document how to run, test, and build the project',
            'State conventions: style, libraries, folder rules',
            'Record gotchas so they are never repeated',
            'Run <code>/init</code> to generate a first draft automatically'
          ],
          try_text: 'Generate project memory in one command.',
          cmd: '/init',
          cmd_is_slash: true
        },
        {
          id: 'c3', kicker: 'Discipline', title: 'Plan before you build',
          why_text: 'The single biggest upgrade over vibe coding: separate thinking from doing. Plan mode lets you agree on the approach first.',
          concepts: [
            'Use plan mode for anything non-trivial',
            'Break large goals into small, reviewable steps',
            'Approve the plan, then let it execute step by step',
            'Course-correct early, when changes are cheap'
          ],
          try_text: 'Ask for a plan and pressure-test it before any code is written.',
          cmd: 'Draft an implementation plan for this feature. List risks and the simplest version that could work first.'
        },
        {
          id: 'c4', kicker: 'Power tools', title: 'Slash commands, skills & subagents',
          why_text: 'These turn repetitive work into one keystroke and let the agent fan out across big tasks without losing focus.',
          concepts: [
            'Slash commands: <code>/init</code>, <code>/clear</code>, <code>/review</code>, custom ones',
            'Skills: reusable, packaged know-how the agent can invoke',
            'Subagents: spin off focused workers for research or search',
            'Custom commands for your own recurring workflows'
          ],
          try_text: 'Create a reusable command for a chore you do often.',
          cmd: 'Create a custom slash command that runs my tests, summarises failures, and proposes fixes.'
        },
        {
          id: 'c5', kicker: 'Extending reach', title: 'MCP — connecting real tools',
          why_text: 'The Model Context Protocol lets the agent talk to outside systems: GitHub, databases, your CAD or robotics tooling, documentation.',
          concepts: [
            'MCP servers expose tools and data to the agent',
            'Connect issue trackers, databases, browsers, hardware',
            'The agent gains real abilities, not just text generation',
            'Scope access deliberately — grant only what is needed'
          ],
          try_text: 'Have the agent explain which integrations would help your work.',
          cmd: 'Given that I build robotics and simulation tools, which MCP servers would make you more useful, and how do I add one?'
        },
        {
          id: 'c6', kicker: 'Core skill', title: 'The art of the prompt',
          why_text: 'The quality of your output tracks the quality of your ask. Specific context and constraints beat clever wording every time.',
          concepts: [
            'Give context: what, where, and why',
            'State constraints: libraries, performance, style',
            'Show an example of the shape you want',
            'Define "done" so the agent knows when to stop'
          ],
          try_text: 'Practice in the Prompt Lab below — then come back and check this off.',
          cmd: 'Refactor this function for readability. Keep the public signature, add type hints, and explain the tradeoffs.'
        }
      ]
    },
    {
      id: 'production', num: '03', icon: 'i-terminal',
      title: 'Production Reality',
      desc: 'Everything below the waterline. This is the gap between a demo that works once and a tool you can trust.',
      lessons: [
        {
          id: 'p1', kicker: 'Trust', title: 'Testing — proving it works',
          why_text: 'Tests are how you and the agent know a change is safe. They let you move fast without breaking what already worked.',
          concepts: [
            'Unit vs integration tests',
            'Test-driven flow: write the test, then the code',
            'Let the agent generate tests, but read them',
            'A failing test is a precise spec for the next fix'
          ],
          try_text: 'Ask for tests first, implementation second.',
          cmd: 'Write failing unit tests for this function\'s expected behaviour, then implement until they pass.'
        },
        {
          id: 'p2', kicker: 'Method', title: 'Debugging systematically',
          why_text: 'Random changes create new bugs. A method — reproduce, isolate, fix, verify — turns debugging from luck into engineering.',
          concepts: [
            'Reproduce reliably before changing anything',
            'Bisect: cut the problem space in half',
            'Add logging / inspect state at the boundary',
            'Verify the fix and add a test to lock it in'
          ],
          try_text: 'Force a disciplined diagnosis instead of a guess.',
          cmd: 'Do not patch yet. First reproduce this bug, form a hypothesis, and confirm the root cause with evidence.'
        },
        {
          id: 'p3', kicker: 'Reproducibility', title: 'Environments & dependencies',
          why_text: '"Works on my machine" is the classic trap. Isolated, declared environments make your tool runnable anywhere — including on a robot.',
          concepts: [
            'Virtual environments (<code>venv</code>, <code>conda</code>)',
            'Pinning versions with lockfiles',
            'Containers (Docker) for full reproducibility',
            'Separating dev, test, and production config'
          ],
          try_text: 'Have the agent make your project reproducible.',
          cmd: 'Set up an isolated environment and a lockfile for this project, and document how to recreate it from scratch.'
        },
        {
          id: 'p4', kicker: 'Automation', title: 'CI/CD — guardrails on autopilot',
          why_text: 'Continuous Integration runs your tests automatically on every change, so quality is enforced by the system, not by memory.',
          concepts: [
            'CI runs tests/linters on every push',
            'Catch regressions before they reach <code>main</code>',
            'CD automates building and releasing',
            'GitHub Actions as an accessible starting point'
          ],
          try_text: 'Add automated checks to your repository.',
          cmd: 'Create a GitHub Actions workflow that installs deps, runs my tests and linter on every pull request.'
        },
        {
          id: 'p5', kicker: 'Operations', title: 'Shipping & running for real',
          why_text: 'A tool only matters when it runs reliably for its user — whether that is a cloud server, a laptop, or an embedded board.',
          concepts: [
            'Deploy targets: server, container, edge device',
            'Configuration & secrets handled safely',
            'Logging and monitoring so you see failures',
            'Rollback: always have a way back'
          ],
          try_text: 'Plan a realistic path to running your tool.',
          cmd: 'My tool runs locally. Propose the simplest reliable way to deploy it, with monitoring and a rollback plan.'
        },
        {
          id: 'p6', kicker: 'Data', title: 'Working with data & interfaces',
          why_text: 'Real tools read sensors, store results, and talk to other systems. Handling data cleanly is most of engineering.',
          concepts: [
            'Files & formats: CSV, JSON, binary logs',
            'Databases vs flat files — when to use which',
            'APIs: consuming and exposing them',
            'Validating inputs you do not control'
          ],
          try_text: 'Design a data layer before writing it.',
          cmd: 'I need to log sensor data at 100 Hz and query it later. Recommend a storage approach and justify the tradeoffs.'
        }
      ]
    },
    {
      id: 'domain', num: '04', icon: 'i-robot',
      title: 'Building for Your Domain',
      desc: 'Mechanical engineering, robotics, and physical AI. Apply everything above to the tools only you are positioned to build.',
      lessons: [
        {
          id: 'd1', kicker: 'Scientific computing', title: 'Numerical & simulation Python',
          why_text: 'NumPy, SciPy, and friends are the lingua franca of engineering computation — and the agent is fluent in them.',
          concepts: [
            'Vectorised math with NumPy',
            'Solving ODEs / optimisation with SciPy',
            'Plotting results with Matplotlib',
            'Notebooks for exploration, modules for tools'
          ],
          try_text: 'Turn a hand calculation into a reusable script.',
          cmd: 'Build a small NumPy/SciPy script that simulates a damped mass-spring system and plots the response. Explain the model.'
        },
        {
          id: 'd2', kicker: 'Robotics', title: 'ROS 2, simulation & control loops',
          why_text: 'Robotics tooling is sprawling. The agent can scaffold nodes, parse messages, and explain the stack as you go.',
          concepts: [
            'ROS 2 nodes, topics, and messages',
            'Simulating in Gazebo / Isaac before touching hardware',
            'Control loops: sense → compute → actuate',
            'Coordinate frames & transforms (TF)'
          ],
          try_text: 'Scaffold a robotics component and learn its parts.',
          cmd: 'Scaffold a ROS 2 Python node that subscribes to a laser scan and publishes a velocity command. Comment every line.'
        },
        {
          id: 'd3', kicker: 'Signals', title: 'Sensors, signals & real-time data',
          why_text: 'Physical systems are noisy. Clean pipelines and good filtering are what separate a flaky prototype from a robust device.',
          concepts: [
            'Sampling, timestamps, and real-time constraints',
            'Filtering: moving average, low-pass, Kalman',
            'Serialising data streams without losing samples',
            'Visualising live data for debugging'
          ],
          try_text: 'Build a filter and see it work on real-looking data.',
          cmd: 'Implement a 1-D Kalman filter for a noisy distance sensor, generate synthetic data, and plot raw vs filtered.'
        },
        {
          id: 'd4', kicker: 'Physical AI', title: 'Learning-based control & sim-to-real',
          why_text: 'Physical AI fuses ML with the physical world. The hard parts are data, the reality gap, and safety — all teachable.',
          concepts: [
            'Policies: from classical control to learned control',
            'Collecting and labelling real-world data',
            'The sim-to-real gap and domain randomisation',
            'Safety constraints around a learned system'
          ],
          try_text: 'Map the path from idea to a learned controller.',
          cmd: 'I want a learned controller for a small robot. Outline a safe, staged plan from simulation to hardware.'
        },
        {
          id: 'd5', kicker: 'Mechanical', title: 'From CAD to code',
          why_text: 'Modern mechanical work is programmable: parametric models, generative design, and automation of repetitive design tasks.',
          concepts: [
            'Scripting CAD (e.g. CadQuery, FreeCAD, OnShape API)',
            'Parametric, version-controllable geometry',
            'Automating analysis & report generation',
            'Bridging design data into your tools'
          ],
          try_text: 'Generate a parametric part from code.',
          cmd: 'Using CadQuery, generate a parametric mounting bracket with configurable hole spacing, and export an STL.'
        },
        {
          id: 'd6', kicker: 'Capstone', title: 'Build your first real tool',
          why_text: 'Everything converges here: plan it, build it with tests, make it reproducible, and ship it for your own engineering work.',
          concepts: [
            'Pick a real annoyance in your workflow',
            'Plan → build with tests → document → automate',
            'Keep a decision log (see Avirlog) as you go',
            'Ship it, use it, iterate'
          ],
          try_text: 'Start the capstone with a planning session.',
          cmd: 'Help me scope a small tool that removes a repetitive task in my engineering workflow. Start with questions, then a plan.'
        }
      ]
    }
  ];

  /* --------------------------------------------------------------------- */
  /*  Helpers                                                               */
  /* --------------------------------------------------------------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function allLessons() {
    return CURRICULUM.reduce(function (n, t) { return n + t.lessons.length; }, 0);
  }
  function doneCount() {
    return Object.keys(progress).filter(function (k) { return progress[k]; }).length;
  }

  /* --------------------------------------------------------------------- */
  /*  Hero progress ring                                                    */
  /* --------------------------------------------------------------------- */
  var RING_R = 16;
  var RING_C = 2 * Math.PI * RING_R;
  function updateHeroProgress() {
    var total = allLessons();
    var done = doneCount();
    var pct = total ? Math.round((done / total) * 100) : 0;
    var bar = document.querySelector('.progress-ring .bar');
    var pctEl = document.querySelector('.pp-pct');
    if (bar) {
      bar.style.strokeDasharray = RING_C;
      bar.style.strokeDashoffset = RING_C * (1 - pct / 100);
    }
    if (pctEl) pctEl.textContent = pct + '%';
  }

  /* --------------------------------------------------------------------- */
  /*  Render curriculum                                                     */
  /* --------------------------------------------------------------------- */
  function renderCurriculum() {
    var root = document.getElementById('curriculum');
    if (!root) return;

    CURRICULUM.forEach(function (track) {
      var section = el('div', 'track reveal');
      var head = el('div', 'track-head');
      head.innerHTML =
        '<svg class="t-icon" aria-hidden="true"><use href="assets/icons.svg#' + track.icon + '"/></svg>' +
        '<div class="t-meta">' +
          '<div class="track-num">Track ' + track.num + '</div>' +
          '<h3>' + track.title + '</h3>' +
          '<p>' + track.desc + '</p>' +
        '</div>' +
        '<div class="track-prog" data-track="' + track.id + '"><b>0</b>of ' + track.lessons.length + '</div>';
      section.appendChild(head);

      var list = el('div', 'lessons');
      track.lessons.forEach(function (lesson) {
        list.appendChild(buildLesson(lesson));
      });
      section.appendChild(list);
      root.appendChild(section);
    });

    refreshTrackCounts();
    updateHeroProgress();
  }

  function buildLesson(lesson) {
    var wrap = el('div', 'lesson');
    wrap.dataset.id = lesson.id;
    if (progress[lesson.id]) wrap.classList.add('done');

    var concepts = lesson.concepts.map(function (c) { return '<li>' + c + '</li>'; }).join('');
    var cmdClass = lesson.cmd_is_slash ? 'codeline' : 'codeline';
    var cmdHtml = lesson.cmd_is_slash
      ? '<span class="cmd">' + lesson.cmd + '</span>'
      : '<span class="c">&gt; </span>' + lesson.cmd;

    var top = el('div', 'lesson-top');
    top.innerHTML =
      '<span class="lesson-check" aria-hidden="true"><svg><use href="assets/icons.svg#i-check"/></svg></span>' +
      '<div class="lesson-titles">' +
        '<div class="lt-kicker">' + lesson.kicker + '</div>' +
        '<h4>' + lesson.title + '</h4>' +
      '</div>' +
      '<button class="lesson-toggle" aria-label="Expand lesson" aria-expanded="false">' +
        '<svg aria-hidden="true"><use href="assets/icons.svg#i-arrow"/></svg>' +
      '</button>';

    var body = el('div', 'lesson-body');
    body.innerHTML =
      '<div class="lesson-body-inner">' +
        '<p class="why">' + (lesson.why || 'Why it matters') + '</p>' +
        '<p>' + lesson.why_text + '</p>' +
        '<ul class="concept-list">' + concepts + '</ul>' +
        '<div class="try-box">' +
          '<div class="try-label"><svg aria-hidden="true"><use href="assets/icons.svg#i-play"/></svg>Try this with Claude Code</div>' +
          '<p>' + lesson.try_text + '</p>' +
          '<div class="' + cmdClass + '">' + cmdHtml + '</div>' +
        '</div>' +
        '<button class="mark-done-btn"><svg aria-hidden="true"><use href="assets/icons.svg#i-check"/></svg>' +
          '<span class="mdb-text">' + (progress[lesson.id] ? 'Completed' : 'Mark complete') + '</span>' +
        '</button>' +
      '</div>';

    wrap.appendChild(top);
    wrap.appendChild(body);

    // toggle expand (rotate arrow rotates 180 via .open)
    function toggle() {
      var open = wrap.classList.toggle('open');
      var btn = top.querySelector('.lesson-toggle');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '';
    }
    top.querySelector('.lesson-titles').addEventListener('click', toggle);
    top.querySelector('.lesson-toggle').addEventListener('click', function (e) { e.stopPropagation(); toggle(); });

    // mark complete
    var checkBtn = top.querySelector('.lesson-check');
    var doneBtn = body.querySelector('.mark-done-btn');
    function toggleDone() {
      var nowDone = !wrap.classList.contains('done');
      wrap.classList.toggle('done', nowDone);
      progress[lesson.id] = nowDone;
      if (!nowDone) delete progress[lesson.id];
      saveProgress(progress);
      doneBtn.querySelector('.mdb-text').textContent = nowDone ? 'Completed' : 'Mark complete';
      refreshTrackCounts();
      updateHeroProgress();
      if (wrap.classList.contains('open')) body.style.maxHeight = body.scrollHeight + 'px';
    }
    checkBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleDone(); });
    doneBtn.addEventListener('click', toggleDone);

    return wrap;
  }

  function refreshTrackCounts() {
    CURRICULUM.forEach(function (track) {
      var n = track.lessons.filter(function (l) { return progress[l.id]; }).length;
      var node = document.querySelector('.track-prog[data-track="' + track.id + '"] b');
      if (node) node.textContent = n;
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Iceberg                                                               */
  /* --------------------------------------------------------------------- */
  function initIceberg() {
    var items = document.querySelectorAll('.berg-item');
    items.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        var detail = btn.nextElementSibling;
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (detail) detail.classList.toggle('open', !open);
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Command Dojo — terminal simulator                                     */
  /* --------------------------------------------------------------------- */
  var COMMANDS = {
    '/init': {
      out: [
        ['sys', 'Scanning project structure…'],
        ['muted', '  reading files, configs, and conventions'],
        ['gold', '✓ Created CLAUDE.md'],
        ['', 'A memory file the agent reads every session: how to run, test,'],
        ['', 'and build your project, plus your conventions. Edit it freely.']
      ]
    },
    '/plan': {
      out: [
        ['sys', 'Entering plan mode — no files will be changed.'],
        ['', 'The agent will research, then propose numbered steps for your'],
        ['', 'approval before writing any code. Your single best habit.'],
        ['gold', 'Tip: "plan before you build" beats vibe coding every time.']
      ]
    },
    '/clear': {
      out: [
        ['sys', 'Context cleared.'],
        ['', 'Starts a fresh conversation. Use it between unrelated tasks so'],
        ['', 'old context does not confuse the agent. CLAUDE.md persists.']
      ]
    },
    '/review': {
      out: [
        ['sys', 'Reviewing current changes…'],
        ['', 'Asks the agent to critique the diff for bugs, edge cases, and'],
        ['gold', 'clarity — like a senior engineer reading your pull request.']
      ]
    },
    'git status': {
      out: [
        ['', 'On branch main'],
        ['gold', 'Changes not staged for commit:'],
        ['muted', '  modified:   robot_controller.py'],
        ['', 'Shows what changed. Your dashboard before every commit.']
      ]
    },
    'help': {
      out: [
        ['sys', 'Try these:'],
        ['', '  /init        generate project memory'],
        ['', '  /plan        plan before building'],
        ['', '  /clear       reset the conversation'],
        ['', '  /review      critique your changes'],
        ['', '  git status   see what changed'],
        ['muted', 'Or click a command on the right.']
      ]
    }
  };

  function initDojo() {
    var screen = document.getElementById('term-screen');
    var input = document.getElementById('term-input');
    if (!screen || !input) return;

    function addLine(kind, text) {
      var line = el('div', 'term-line ' + (kind || ''));
      line.textContent = text;
      screen.appendChild(line);
      screen.scrollTop = screen.scrollHeight;
    }
    function run(raw) {
      var cmd = raw.trim();
      if (!cmd) return;
      var u = el('div', 'term-line user');
      u.innerHTML = '<span class="prompt">❯ </span>' + cmd.replace(/[<>&]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c];
      });
      screen.appendChild(u);

      var match = COMMANDS[cmd.toLowerCase()];
      if (match) {
        match.out.forEach(function (pair) { addLine(pair[0], pair[1]); });
      } else if (cmd.charAt(0) === '/') {
        addLine('muted', 'Unknown command. Type "help" for the ones wired up here.');
      } else {
        addLine('sys', 'In real Claude Code, this would be sent as an instruction.');
        addLine('', 'The agent would plan, edit files, and run commands to do it.');
        addLine('muted', 'Type "help" to see the demo commands.');
      }
      addLine('', '');
      screen.scrollTop = screen.scrollHeight;
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { run(input.value); input.value = ''; }
    });

    document.querySelectorAll('.cmd-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var c = chip.dataset.cmd;
        run(c);
        input.focus();
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Prompt Lab — heuristic grader                                         */
  /* --------------------------------------------------------------------- */
  function gradePrompt(text) {
    var t = text.toLowerCase();
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    var checks = [];

    checks.push({
      ok: words >= 12,
      label: words >= 12 ? 'Enough detail to act on' : 'Too short — add specifics and context'
    });
    var hasContext = /\b(this|here|project|file|function|code|repo|directory|module)\b/.test(t);
    checks.push({
      ok: hasContext,
      label: hasContext ? 'Points to concrete context' : 'Name what to work on (this file / function / project)'
    });
    var hasConstraint = /\b(use|don'?t|without|keep|must|should|only|avoid|limit|prefer|python|library|style|type|performance|test)\b/.test(t);
    checks.push({
      ok: hasConstraint,
      label: hasConstraint ? 'States constraints or preferences' : 'Add constraints (libraries, style, what NOT to do)'
    });
    var hasGoalVerb = /\b(plan|explain|refactor|implement|write|create|build|fix|debug|test|review|design|generate|optimi[sz]e|scaffold)\b/.test(t);
    checks.push({
      ok: hasGoalVerb,
      label: hasGoalVerb ? 'Clear action verb' : 'Start with a precise verb (plan, refactor, implement…)'
    });
    var hasDone = /\b(then|first|before|after|so that|until|step|explain|wait|approval|done|output|return|plot)\b/.test(t);
    checks.push({
      ok: hasDone,
      label: hasDone ? 'Defines process or "done"' : 'Say what "done" looks like, or to plan before acting'
    });

    var score = Math.round((checks.filter(function (c) { return c.ok; }).length / checks.length) * 100);
    return { score: score, checks: checks };
  }

  function initPromptLab() {
    var ta = document.getElementById('pl-input');
    var btn = document.getElementById('pl-grade');
    var clear = document.getElementById('pl-clear');
    var out = document.getElementById('pl-result');
    if (!ta || !btn || !out) return;

    function render() {
      var res = gradePrompt(ta.value);
      var verdict = res.score >= 80 ? 'Strong prompt' : res.score >= 50 ? 'Getting there' : 'Needs work';
      var fb = res.checks.map(function (c) {
        return '<div class="pl-fb ' + (c.ok ? 'ok' : 'miss') + '">' +
          '<svg aria-hidden="true"><use href="assets/icons.svg#' + (c.ok ? 'i-check' : 'i-arrow') + '"/></svg>' +
          '<span>' + c.label + '</span></div>';
      }).join('');
      out.innerHTML =
        '<div class="pl-score-label"><span>' + verdict + '</span><b>' + res.score + '</b></div>' +
        '<div class="pl-meter"><span style="width:' + res.score + '%"></span></div>' +
        '<div class="pl-feedback">' + fb + '</div>';
    }
    btn.addEventListener('click', render);
    if (clear) clear.addEventListener('click', function () { ta.value = ''; out.innerHTML = ''; ta.focus(); });
  }

  /* --------------------------------------------------------------------- */
  /*  Quiz                                                                  */
  /* --------------------------------------------------------------------- */
  function initQuiz() {
    document.querySelectorAll('.quiz-q').forEach(function (q) {
      var opts = q.querySelectorAll('.quiz-opt');
      var explain = q.querySelector('.quiz-explain');
      opts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (q.dataset.answered) return;
          q.dataset.answered = '1';
          var correct = opt.dataset.correct === '1';
          opt.classList.add(correct ? 'correct' : 'wrong');
          if (!correct) {
            opts.forEach(function (o) { if (o.dataset.correct === '1') o.classList.add('correct'); });
          }
          opts.forEach(function (o) { o.disabled = true; });
          if (explain) explain.classList.add('show');
        });
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Reset                                                                 */
  /* --------------------------------------------------------------------- */
  function initReset() {
    var btn = document.getElementById('reset-progress');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!confirm('Reset all lesson progress on this device?')) return;
      progress = {};
      saveProgress(progress);
      document.querySelectorAll('.lesson').forEach(function (l) {
        l.classList.remove('done');
        var t = l.querySelector('.mdb-text');
        if (t) t.textContent = 'Mark complete';
      });
      refreshTrackCounts();
      updateHeroProgress();
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Boot                                                                  */
  /* --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderCurriculum();
    initIceberg();
    initDojo();
    initPromptLab();
    initQuiz();
    initReset();

    // re-observe freshly rendered .reveal nodes for the scroll animation
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('#curriculum .reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  });
})();
