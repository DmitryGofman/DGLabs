/* =========================================================================
   GOFMAN LABS — Robotics Study Plan module
   Interactive implementation of the Personalized Robotics Study Plan:
   self-assessment, competency tracker + time calculator, projects,
   24-month timeline, resources, career prep. Vanilla JS, localStorage.
   ========================================================================= */
(function () {
  'use strict';

  var PROG_KEY = 'gl-robotics-progress-v1';   // completed competencies/projects/phases
  var AUDIT_KEY = 'gl-robotics-audit-v1';      // self-assessment ratings

  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  var progress = load(PROG_KEY);
  var audit = load(AUDIT_KEY);

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* --------------------------------------------------------------------- */
  /*  Data                                                                  */
  /* --------------------------------------------------------------------- */

  // 1. Self-assessment domains (weight = foundational importance, 1–3)
  var DOMAINS = [
    { id: 'linalg',   label: 'Linear algebra & transformations', weight: 3 },
    { id: 'calcprob', label: 'Calculus, probability & estimation', weight: 3 },
    { id: 'python',   label: 'Python (logic, ML, scripting)', weight: 3 },
    { id: 'cpp',      label: 'C / C++ (real-time, embedded)', weight: 2 },
    { id: 'kinematics', label: 'Kinematics & dynamics', weight: 3 },
    { id: 'control',  label: 'Control systems (PID, state-space)', weight: 3 },
    { id: 'sensors',  label: 'Sensors & actuators', weight: 2 },
    { id: 'embedded', label: 'Embedded & real-time systems', weight: 2 },
    { id: 'perception', label: 'Perception & computer vision', weight: 2 },
    { id: 'slam',     label: 'SLAM & state estimation', weight: 2 },
    { id: 'planning', label: 'Motion planning (A*, RRT)', weight: 2 },
    { id: 'mlrl',     label: 'Machine learning & RL', weight: 2 },
    { id: 'sim',      label: 'Simulation (Gazebo, PyBullet)', weight: 2 },
    { id: 'ros2',     label: 'ROS2 & middleware', weight: 3 },
    { id: 'hardware', label: 'Hardware prototyping', weight: 1 },
    { id: 'safety',   label: 'Safety standards & ethics', weight: 1 }
  ];
  var RATINGS = ['None', 'Basic', 'Proficient']; // 0,1,2

  // 2. Core competencies (week estimates assume full-time study)
  var COMPETENCIES = [
    { id: 'm1', name: 'Mathematics & Physics', hMin: 8, hMax: 12, kicker: 'Foundation',
      desc: 'Linear algebra (matrices, transformations), calculus, probability and estimation — the bedrock for kinematics and sensor fusion.',
      sub: ['Matrices & linear transformations', 'Calculus for motion', 'Probability & Bayesian estimation'],
      prompt: 'Teach me the linear algebra behind robot transformations with small NumPy examples I can run.' },
    { id: 'm2', name: 'Kinematics & Dynamics', hMin: 10, hMax: 15, kicker: 'Core robotics',
      desc: 'Robot geometry and motion: forward/inverse kinematics for end-effector positioning, and dynamics via Newton/Lagrange methods.',
      sub: ['Forward & inverse kinematics', 'Rigid-body transforms & Jacobians', 'Newton/Lagrange dynamics'],
      prompt: 'Walk me through forward and inverse kinematics for a 2-link planar arm, then generate Python to solve and plot it.' },
    { id: 'm3', name: 'Control Systems', hMin: 8, hMax: 12, kicker: 'Core robotics',
      desc: 'Linear control and feedback: PID, state-space, and stability — foundational for all robot motion control.',
      sub: ['PID tuning', 'State-space & feedback', 'Stability analysis'],
      prompt: 'Implement a PID controller for a simulated motor, plot the step response, and help me tune the gains.' },
    { id: 'm4', name: 'Sensors & Actuators', hMin: 5, hMax: 8, kicker: 'Hardware',
      desc: 'Common sensors (encoders, IMUs, cameras, LiDAR) and actuators (motors, servos), plus signal processing and ADC/DAC sampling.',
      sub: ['Encoders, IMUs, cameras, LiDAR', 'Motors & servos', 'Filtering, ADC/DAC, sampling'],
      prompt: 'Explain how to interface an IMU with a microcontroller and filter the signal, with example embedded code.' },
    { id: 'm5', name: 'Embedded & Real-Time Systems', hMin: 8, hMax: 12, kicker: 'Hardware',
      desc: 'Microcontroller programming (C/C++ on ARM/Arduino) and real-time OS concepts: task scheduling, interrupts, deterministic control loops.',
      sub: ['Microcontroller architecture & I/O', 'Interrupts & timers', 'RTOS task scheduling'],
      prompt: 'Show me a FreeRTOS task structure for a deterministic 1 kHz control loop and explain the scheduling.' },
    { id: 'm6', name: 'Perception', hMin: 12, hMax: 18, kicker: 'Intelligence',
      desc: 'Computer vision and LiDAR processing: image processing (OpenCV), neural nets for detection, point-cloud filtering, and camera+LiDAR sensor fusion.',
      sub: ['Image processing with OpenCV', 'Object detection & classification', 'Point clouds & sensor fusion'],
      prompt: 'Build an OpenCV pipeline that detects and tracks a coloured object from a webcam, commented step by step.' },
    { id: 'm7', name: 'SLAM', hMin: 8, hMax: 12, kicker: 'Intelligence',
      desc: 'Simultaneous Localization and Mapping: odometry, Kalman and particle filters, and a simple 2D LiDAR SLAM implementation.',
      sub: ['Odometry & motion models', 'Kalman & particle filters', '2D LiDAR SLAM (Cartographer)'],
      prompt: 'Explain 2D LiDAR SLAM intuitively, then help me run Cartographer on a recorded ROS2 bag.' },
    { id: 'm8', name: 'Motion Planning', hMin: 8, hMax: 12, kicker: 'Intelligence',
      desc: 'Path-planning algorithms (A*, RRT, Dijkstra) and trajectory generation (splines, optimization), integrated with robot kinematics.',
      sub: ['Graph search: A*, Dijkstra', 'Sampling: RRT / RRT*', 'Trajectory smoothing'],
      prompt: 'Implement A* and RRT on a 2D occupancy grid in Python and visualise the paths side by side.' },
    { id: 'm9', name: 'Reinforcement Learning', hMin: 10, hMax: 15, kicker: 'Learning',
      desc: 'RL basics (Q-learning, policy gradients) for robotics: reward design and sim-to-real transfer, practised in Gym or PyBullet.',
      sub: ['Q-learning & policy gradients', 'Reward design', 'Sim-to-real transfer'],
      prompt: 'Set up a PyBullet environment and train a simple policy to balance a cartpole, explaining each component.' },
    { id: 'm10', name: 'Machine Learning for Robotics', hMin: 12, hMax: 18, kicker: 'Learning',
      desc: 'Supervised learning, neural networks, and deep learning: perception models (CNNs, point nets) and learned system identification.',
      sub: ['Neural network fundamentals', 'CNNs for vision', 'System identification'],
      prompt: 'Help me train a small CNN to classify images from my robot camera, from dataset to evaluation.' },
    { id: 'm11', name: 'Simulation (Gazebo, PyBullet)', hMin: 6, hMax: 10, kicker: 'Tools',
      desc: 'Robot simulation: Gazebo (Ignition) 3D physics integrated with ROS, and PyBullet for Python-accessible rigid-body dynamics.',
      sub: ['URDF robot modelling', 'Gazebo physics & sensors', 'PyBullet rapid prototyping'],
      prompt: 'Help me write a URDF for a differential-drive robot and spawn it in Gazebo with a LiDAR sensor.' },
    { id: 'm12', name: 'ROS2 & Middleware', hMin: 10, hMax: 15, kicker: 'Tools',
      desc: 'ROS2: nodes, topics/services, TF transforms, DDS middleware, and the colcon build system.',
      sub: ['Nodes, topics & services', 'TF transforms', 'colcon & DDS'],
      prompt: 'Scaffold a ROS2 package with a publisher and subscriber node in Python and explain how to build it with colcon.' },
    { id: 'm13', name: 'Hardware Prototyping', hMin: 8, hMax: 12, kicker: 'Hardware',
      desc: 'Building real robots: mechanical design, PCBs, wiring, and integrating sensors/microcontrollers on Arduino or Raspberry Pi.',
      sub: ['Mechanical design & chassis', 'Wiring & basic PCBs', 'Sensor/MCU integration'],
      prompt: 'Help me plan the wiring and bill of materials for a Raspberry Pi mobile robot with a LiDAR and motor driver.' },
    { id: 'm14', name: 'Safety & Ethics', hMin: 2, hMax: 4, kicker: 'Responsibility',
      desc: 'Safety standards (ISO 10218, ISO/TS 15066 for collaborative robots), fail-safes, and IEEE Ethically Aligned Design principles.',
      sub: ['ISO 10218 / ISO-TS 15066', 'Fail-safes & human-in-loop', 'Ethics & AI bias'],
      prompt: 'Summarise ISO/TS 15066 collaborative-robot safety requirements and how they affect my control design.' }
  ];

  // 4. Hands-on projects
  var PROJECTS = [
    { id: 'p1', name: 'Line-following Robot', level: 'Low', cls: 'low',
      summary: 'A small wheeled robot with IR sensors that follows a line using closed-loop PID control.',
      deliverables: ['Chassis with two DC motors + encoders', 'IR sensor array', 'Arduino PID control code'],
      components: ['Microcontroller board', 'Motor driver', 'Chassis kit', 'Battery'],
      teaches: 'Sensor integration and closed-loop control.' },
    { id: 'p2', name: 'LiDAR Obstacle Avoidance', level: 'Moderate', cls: 'mod',
      summary: 'A mobile base with a 2D LiDAR that detects obstacles and commands motors to avoid them via ROS2.',
      deliverables: ['ROS2 node processing scan data', 'Reactive avoidance behaviour'],
      components: ['RPLidar (or ultrasonic)', 'ROS2 board (Raspberry Pi)', 'Motors + driver'],
      teaches: 'ROS messaging and real-time sensor feedback.' },
    { id: 'p3', name: 'SLAM Mapping', level: 'High', cls: 'high',
      summary: 'A TurtleBot-class robot that autonomously maps an indoor environment and navigates to waypoints.',
      deliverables: ['2D map of an indoor area', 'Waypoint navigation'],
      components: ['Mobile base', 'LiDAR or depth camera', 'IMU'],
      teaches: 'ROS2 Nav2 stack, SLAM, and coordinate transforms.' },
    { id: 'p4', name: 'Manipulator Arm Control', level: 'High', cls: 'high',
      summary: 'A 6-DOF robotic arm programmed with inverse kinematics and planning for pick-and-place.',
      deliverables: ['Pick-and-place demo (moving blocks)', 'IK + planning pipeline'],
      components: ['Robotic arm kit', 'ROS MoveIt2', 'Camera / gripper'],
      teaches: 'Kinematics, motion planning, and ROS2 integration.' },
    { id: 'p5', name: 'Simulation-to-Real Integration', level: 'Advanced', cls: 'adv',
      summary: 'Train an RL/ML control policy in Gazebo or PyBullet, then deploy and evaluate it on real hardware.',
      deliverables: ['Policy training scripts', 'Sim + real performance evaluation'],
      components: ['GPU-enabled PC', 'Gazebo / PyBullet', 'Target robot platform'],
      teaches: 'ML for robotics, the sim pipeline, and domain transfer.' }
  ];

  // 5. Resources
  var RESOURCES = [
    ['Modern Robotics (Northwestern)', 'Online Course', 'Kinematics, dynamics, control, math', 'Coursera'],
    ['Intro to Robotics with Webots (Boulder)', 'Online Course', 'ROS, robot design, simulation', 'Coursera'],
    ['Foundations of Robotics: Python & ROS', 'Textbook', 'Python, ROS, mechanics', 'Course Central'],
    ['Introduction to Robotics — Craig, 4th ed.', 'Textbook', 'Kinematics, dynamics, control', 'Pearson'],
    ['Probabilistic Robotics — Thrun et al.', 'Textbook', 'Bayesian filters, SLAM', 'MIT Press'],
    ['Reinforcement Learning — Sutton & Barto', 'Textbook', 'RL fundamentals', 'MIT Press'],
    ['ROS2 Documentation', 'Official Docs', 'ROS2 tutorials & examples', 'docs.ros.org'],
    ['Gazebo Simulator', 'Official Docs', 'Simulation, URDF, physics', 'gazebosim.org'],
    ['PyBullet Quickstart', 'Tutorials', 'Physics engine for RL/robotics', 'pybullet.org'],
    ['OpenCV Documentation', 'Official Docs', 'Computer vision algorithms', 'opencv.org'],
    ['Claude API Docs', 'Official Docs', 'Prompt engineering, API usage', 'docs.claude.com']
  ];

  // 6. Timeline phases
  var PHASES = [
    { id: 'ph1', months: 'Months 1–3', title: 'Foundations',
      goals: 'Linear algebra, basic control, Python, Linux. Complete introductory courses (Modern Robotics) and set up ROS2 + Gazebo.',
      eval: 'Solve sample kinematics/control problems; write a simple ROS2 node.' },
    { id: 'ph2', months: 'Months 4–6', title: 'Intermediate',
      goals: 'PID control, Kalman filtering, C/C++ proficiency, Arduino sensor interfacing, basic perception with OpenCV.',
      eval: 'Demo a line-following robot or a basic SLAM map; peer code review.' },
    { id: 'ph3', months: 'Months 7–12', title: 'Advanced Topics',
      goals: 'Motion planning (A*, RRT), SLAM implementation, ML basics (CNNs, RL). Project: TurtleBot mapping & navigation.',
      eval: 'Present an autonomous mapping demo; write up your learning.' },
    { id: 'ph4', months: 'Months 13–18', title: 'Systems Integration',
      goals: 'Real-time systems, full ROS2 applications, advanced Gazebo physics. Project: arm manipulation or multi-sensor fusion.',
      eval: 'Successful pick/place or stable navigation in Gazebo; competition or peer feedback.' },
    { id: 'ph5', months: 'Months 19–24', title: 'Specialization & Review',
      goals: 'Hone a niche (vision, controls, ML), build a portfolio. Flagship integrated project. Prepare for interviews.',
      eval: 'Complete & document the flagship project; mock interviews using the STAR method.' }
  ];

  /* --------------------------------------------------------------------- */
  /*  Overall progress ring (competencies + projects + phases)              */
  /* --------------------------------------------------------------------- */
  var TOTAL_ITEMS = COMPETENCIES.length + PROJECTS.length + PHASES.length;
  var RING_C = 2 * Math.PI * 16;
  function overallDone() {
    return Object.keys(progress).filter(function (k) { return progress[k]; }).length;
  }
  function updateOverall() {
    var pct = TOTAL_ITEMS ? Math.round((overallDone() / TOTAL_ITEMS) * 100) : 0;
    var bar = document.querySelector('.r-progress-ring .bar');
    var pctEl = document.getElementById('robotics-hero-pct');
    if (bar) { bar.style.strokeDasharray = RING_C; bar.style.strokeDashoffset = RING_C * (1 - pct / 100); }
    if (pctEl) pctEl.textContent = pct + '%';
  }

  /* --------------------------------------------------------------------- */
  /*  1. Self-assessment auditor                                            */
  /* --------------------------------------------------------------------- */
  function renderAudit() {
    var grid = document.getElementById('audit-grid');
    if (!grid) return;
    DOMAINS.forEach(function (d) {
      var row = el('div', 'audit-row');
      var current = typeof audit[d.id] === 'number' ? audit[d.id] : -1;
      var opts = RATINGS.map(function (label, i) {
        return '<button class="audit-btn' + (current === i ? ' on lvl' + i : '') + '" data-domain="' + d.id + '" data-val="' + i + '">' + label + '</button>';
      }).join('');
      row.innerHTML =
        '<div class="audit-label">' + d.label + '</div>' +
        '<div class="audit-opts">' + opts + '</div>';
      grid.appendChild(row);
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.audit-btn');
      if (!btn) return;
      var id = btn.dataset.domain, val = parseInt(btn.dataset.val, 10);
      audit[id] = val;
      save(AUDIT_KEY, audit);
      // update button states in this row
      btn.parentNode.querySelectorAll('.audit-btn').forEach(function (b) {
        b.classList.remove('on', 'lvl0', 'lvl1', 'lvl2');
      });
      btn.classList.add('on', 'lvl' + val);
      computeReadiness();
    });
    computeReadiness();
  }

  function computeReadiness() {
    var rated = DOMAINS.filter(function (d) { return typeof audit[d.id] === 'number'; });
    var maxScore = DOMAINS.length * 2;
    var score = DOMAINS.reduce(function (s, d) {
      return s + (typeof audit[d.id] === 'number' ? audit[d.id] : 0);
    }, 0);
    var pct = Math.round((score / maxScore) * 100);

    var bar = document.getElementById('readiness-bar');
    var pctEl = document.getElementById('readiness-pct');
    var verdict = document.getElementById('readiness-verdict');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (verdict) {
      var v = rated.length === 0 ? 'Rate yourself to begin'
        : pct >= 75 ? 'Strong base — specialise & build'
        : pct >= 45 ? 'Solid start — close the gaps'
        : 'Early days — focus on foundations';
      verdict.textContent = v + (rated.length ? ' · ' + rated.length + '/' + DOMAINS.length + ' rated' : '');
    }

    // Gap analysis: domains rated None/Basic, ranked by weight then lowest rating
    var gaps = DOMAINS.filter(function (d) {
      return typeof audit[d.id] === 'number' && audit[d.id] < 2;
    }).sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return (audit[a.id]) - (audit[b.id]);
    });

    var list = document.getElementById('gap-list');
    if (!list) return;
    if (rated.length === 0) {
      list.innerHTML = '<p class="gap-empty">Your prioritised focus areas will appear here as you rate each domain above.</p>';
      return;
    }
    if (gaps.length === 0) {
      list.innerHTML = '<p class="gap-empty">No gaps flagged — every rated domain is at Proficient. Time to specialise.</p>';
      return;
    }
    list.innerHTML = gaps.slice(0, 8).map(function (d) {
      var priority = (d.weight >= 3 && audit[d.id] === 0) ? 'High'
        : (d.weight >= 2 || audit[d.id] === 0) ? 'Medium' : 'Low';
      var pcls = priority.toLowerCase();
      return '<div class="gap-item">' +
        '<span class="gap-pri ' + pcls + '">' + priority + '</span>' +
        '<span class="gap-name">' + d.label + '</span>' +
        '<span class="gap-lvl">' + RATINGS[audit[d.id]] + '</span>' +
        '</div>';
    }).join('');
  }

  /* --------------------------------------------------------------------- */
  /*  2. Competency tracker + study-time calculator                         */
  /* --------------------------------------------------------------------- */
  function renderCompetencies() {
    var root = document.getElementById('competency-list');
    if (!root) return;
    COMPETENCIES.forEach(function (c) {
      var wrap = el('div', 'lesson');
      wrap.dataset.id = c.id;
      if (progress[c.id]) wrap.classList.add('done');
      var sub = c.sub.map(function (s) { return '<li>' + s + '</li>'; }).join('');

      var top = el('div', 'lesson-top');
      top.innerHTML =
        '<span class="lesson-check" aria-hidden="true"><svg><use href="assets/icons.svg#i-check"/></svg></span>' +
        '<div class="lesson-titles">' +
          '<div class="lt-kicker">' + c.kicker + ' · ' + c.hMin + '–' + c.hMax + ' h focused</div>' +
          '<h4>' + c.name + '</h4>' +
        '</div>' +
        '<button class="lesson-toggle" aria-label="Expand topic" aria-expanded="false"><svg aria-hidden="true"><use href="assets/icons.svg#i-arrow"/></svg></button>';

      var body = el('div', 'lesson-body');
      body.innerHTML =
        '<div class="lesson-body-inner">' +
          '<p>' + c.desc + '</p>' +
          '<ul class="concept-list">' + sub + '</ul>' +
          '<div class="try-box">' +
            '<div class="try-label"><svg aria-hidden="true"><use href="assets/icons.svg#i-play"/></svg>Learn it with Claude Code</div>' +
            '<div class="codeline"><span class="c">&gt; </span>' + c.prompt + '</div>' +
          '</div>' +
          '<button class="mark-done-btn"><svg aria-hidden="true"><use href="assets/icons.svg#i-check"/></svg>' +
            '<span class="mdb-text">' + (progress[c.id] ? 'Completed' : 'Mark complete') + '</span></button>' +
        '</div>';

      wrap.appendChild(top); wrap.appendChild(body);

      function toggle() {
        var open = wrap.classList.toggle('open');
        top.querySelector('.lesson-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '';
      }
      top.querySelector('.lesson-titles').addEventListener('click', toggle);
      top.querySelector('.lesson-toggle').addEventListener('click', function (e) { e.stopPropagation(); toggle(); });

      function toggleDone() {
        var now = !wrap.classList.contains('done');
        wrap.classList.toggle('done', now);
        if (now) progress[c.id] = true; else delete progress[c.id];
        save(PROG_KEY, progress);
        body.querySelector('.mdb-text').textContent = now ? 'Completed' : 'Mark complete';
        if (wrap.classList.contains('open')) body.style.maxHeight = body.scrollHeight + 'px';
        updateCompProgress(); updateCalc(); updateOverall();
      }
      top.querySelector('.lesson-check').addEventListener('click', function (e) { e.stopPropagation(); toggleDone(); });
      body.querySelector('.mark-done-btn').addEventListener('click', toggleDone);

      root.appendChild(wrap);
    });
    updateCompProgress();
    updateCalc();
  }

  function updateCompProgress() {
    var done = COMPETENCIES.filter(function (c) { return progress[c.id]; }).length;
    var pct = Math.round((done / COMPETENCIES.length) * 100);
    var bar = document.getElementById('comp-progress-bar');
    var count = document.getElementById('comp-progress-count');
    if (bar) bar.style.width = pct + '%';
    if (count) count.textContent = done + ' / ' + COMPETENCIES.length + ' topics';
  }

  function updateCalc() {
    var remaining = COMPETENCIES.filter(function (c) { return !progress[c.id]; });
    var hMin = remaining.reduce(function (s, c) { return s + c.hMin; }, 0);
    var hMax = remaining.reduce(function (s, c) { return s + c.hMax; }, 0);
    var out = document.getElementById('calc-output');
    if (!out) return;
    var hoursEl = document.getElementById('calc-hours');
    var hours = hoursEl ? Math.max(1, parseInt(hoursEl.value, 10) || 0) : 10;
    if (hMax === 0) {
      out.innerHTML = '<strong>All topics complete.</strong> Every core competency is checked off — focus on projects, specialisation, and portfolio.';
      return;
    }
    var wkMin = hMin / hours, wkMax = hMax / hours;
    // express calendar time in the most readable unit
    var span = wkMax < 1.5
      ? Math.round(wkMin * 7) + '–' + Math.round(wkMax * 7) + ' days'
      : wkMax < 9
        ? wkMin.toFixed(1) + '–' + wkMax.toFixed(1) + ' weeks'
        : (wkMin / 4.33).toFixed(1) + '–' + (wkMax / 4.33).toFixed(1) + ' months';
    out.innerHTML =
      '<div class="calc-line"><span>Focused hours to working competence</span><b>' + hMin + '–' + hMax + ' h</b></div>' +
      '<div class="calc-line"><span>At ' + hours + ' h/week, that\'s</span><b>' + span + '</b></div>' +
      '<div class="calc-line muted"><span>Per topic, on average</span><b>~' + Math.round((hMin + hMax) / 2 / COMPETENCIES.length) + ' h</b></div>';
  }

  /* --------------------------------------------------------------------- */
  /*  4. Projects                                                           */
  /* --------------------------------------------------------------------- */
  function renderProjects() {
    var root = document.getElementById('project-list');
    if (!root) return;
    PROJECTS.forEach(function (p, idx) {
      var card = el('article', 'rproj' + (progress[p.id] ? ' done' : ''));
      card.dataset.id = p.id;
      var deliv = p.deliverables.map(function (d) { return '<li>' + d + '</li>'; }).join('');
      var comp = p.components.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');
      card.innerHTML =
        '<div class="rproj-head">' +
          '<div class="rproj-no">0' + (idx + 1) + '</div>' +
          '<div class="rproj-title"><span class="diff ' + p.cls + '">' + p.level + '</span><h3>' + p.name + '</h3></div>' +
          '<button class="rproj-check" aria-label="Mark project done"><svg aria-hidden="true"><use href="assets/icons.svg#i-check"/></svg></button>' +
        '</div>' +
        '<p class="rproj-summary">' + p.summary + '</p>' +
        '<div class="rproj-cols">' +
          '<div><h5>Deliverables</h5><ul class="concept-list">' + deliv + '</ul></div>' +
          '<div><h5>Components</h5><div class="chips">' + comp + '</div>' +
            '<p class="rproj-teaches"><strong>Teaches:</strong> ' + p.teaches + '</p></div>' +
        '</div>';
      card.querySelector('.rproj-check').addEventListener('click', function () {
        var now = !card.classList.contains('done');
        card.classList.toggle('done', now);
        if (now) progress[p.id] = true; else delete progress[p.id];
        save(PROG_KEY, progress);
        updateOverall();
      });
      root.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------- */
  /*  5. Resources table                                                    */
  /* --------------------------------------------------------------------- */
  function renderResources() {
    var body = document.getElementById('res-body');
    if (!body) return;
    body.innerHTML = RESOURCES.map(function (r) {
      return '<tr><td class="res-name">' + r[0] + '</td><td><span class="res-type">' + r[1] + '</span></td>' +
        '<td>' + r[2] + '</td><td class="res-link">' + r[3] + '</td></tr>';
    }).join('');
  }

  /* --------------------------------------------------------------------- */
  /*  6. Timeline                                                           */
  /* --------------------------------------------------------------------- */
  function renderTimeline() {
    var root = document.getElementById('timeline-list');
    if (!root) return;
    PHASES.forEach(function (ph) {
      var item = el('div', 'phase' + (progress[ph.id] ? ' done' : ''));
      item.dataset.id = ph.id;
      item.innerHTML =
        '<button class="phase-dot" aria-label="Mark phase done"><svg aria-hidden="true"><use href="assets/icons.svg#i-check"/></svg></button>' +
        '<div class="phase-body">' +
          '<div class="phase-months">' + ph.months + '</div>' +
          '<h3>' + ph.title + '</h3>' +
          '<p>' + ph.goals + '</p>' +
          '<div class="phase-eval"><span class="pe-label">Checkpoint</span>' + ph.eval + '</div>' +
        '</div>';
      item.querySelector('.phase-dot').addEventListener('click', function () {
        var now = !item.classList.contains('done');
        item.classList.toggle('done', now);
        if (now) progress[ph.id] = true; else delete progress[ph.id];
        save(PROG_KEY, progress);
        updateOverall();
      });
      root.appendChild(item);
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Reset                                                                 */
  /* --------------------------------------------------------------------- */
  function initReset() {
    var btn = document.getElementById('reset-robotics');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!confirm('Reset all robotics progress and self-assessment on this device?')) return;
      progress = {}; audit = {};
      save(PROG_KEY, progress); save(AUDIT_KEY, audit);
      document.querySelectorAll('.lesson.done, .rproj.done, .phase.done').forEach(function (n) { n.classList.remove('done'); });
      document.querySelectorAll('.mdb-text').forEach(function (t) { t.textContent = 'Mark complete'; });
      document.querySelectorAll('.audit-btn.on').forEach(function (b) { b.classList.remove('on', 'lvl0', 'lvl1', 'lvl2'); });
      computeReadiness(); updateCompProgress(); updateCalc(); updateOverall();
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Boot                                                                  */
  /* --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderAudit();
    renderCompetencies();
    renderProjects();
    renderResources();
    renderTimeline();
    updateOverall();
    initReset();

    var hoursEl = document.getElementById('calc-hours');
    if (hoursEl) hoursEl.addEventListener('input', updateCalc);

    // reveal animation for dynamically added blocks
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (n) { n.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (n) { io.observe(n); });
    }
  });
})();
