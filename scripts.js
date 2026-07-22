/* ==========================================================================
   DEVELOPER PORTFOLIO - JAVASCRIPT LOGIC
   Owner: Abhi Vignesh Samala
   Includes: Particle System, Mock IDE File Loading, Terminal Shell, Project Filtering
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Particle Canvas System (Holographic Network)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleCount = 60;
  const connectionDistance = 120;
  let mouse = { x: null, y: null, radius: 150 };

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Initialize Particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  // Draw lines between close particles
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          let alpha = (1 - (dist / connectionDistance)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(191, 85, 236, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();


  // ==========================================
  // 2. Mock IDE / Code Editor Simulator
  // ==========================================
  const files = {
    "about.json": `{
  "name": "Abhi Vignesh Samala",
  "title": "Full Stack Developer",
  "focus": "MERN Stack and Python Django Development",
  "location": "Jaggayyapeta, Andhra Pradesh, India", 
  "mission": "Building scalable and user-friendly web applications."
}`,

    "skills.py": `# Technical Skills Profile

frontend = ["HTML", "CSS", "Bootstrap", "JavaScript", "React.js"]
backend = ["Node.js", "Express.js", "Python", "Django"]
database = ["MongoDB", "SQL", "SQLite", "PostgreSQL"]
tools = ["Git", "GitHub", "REST APIs"]`,

    "experience.js": `const experience = {
  role: "Full Stack Web Developer Intern",
  company: "Inxcel Technologies",
  duration: "Feb 2026 - Present",
  responsibilities: [
    "Developed responsive web applications using HTML, CSS, Bootstrap, JavaScript, React.js, Python Django, SQL and SQLite.",
    "Built REST APIs and integrated frontend with backend services.",
    "Worked on authentication, CRUD operations and database-driven applications.",
    "Participated in real-world application development and deployment."
  ]
};

export default experience;`,

    "contact.md": `# Contact Coordinates

If you would like to collaborate, discuss internship opportunities, or enquire about hiring, please reach out via:

* **Email:** abhivignesh27@gmail.com
* **GitHub:** https://github.com/Abhi09-vigu
* **LinkedIn:** https://www.linkedin.com/in/abhi-vignesh-samala-459b77370/
* **Location:** Jaggayyapeta, Andhra Pradesh, India

*Or fill out the terminal/visual form on this landing page!*`
  };

  const codeBlock = document.getElementById('editor-code-block');
  const lineNumbersContainer = document.getElementById('line-numbers');
  const fileItems = document.querySelectorAll('.file-item');
  const ideTabs = document.querySelectorAll('.ide-tab');
  
  let typingTimer = null;

  // Typewriter Code Animation
  function typeCode(filename) {
    if (typingTimer) clearInterval(typingTimer);
    
    const codeText = files[filename];
    codeBlock.innerHTML = '';
    
    // Set up line numbers count
    const linesCount = codeText.split('\n').length;
    let numsHtml = '';
    for (let i = 1; i <= linesCount; i++) {
      numsHtml += `${i}\n`;
    }
    lineNumbersContainer.innerText = numsHtml;

    // Fast typing effect
    let index = 0;
    const charsPerTick = 4; // Type multiple characters per tick for fluid feeling
    
    typingTimer = setInterval(() => {
      if (index >= codeText.length) {
        clearInterval(typingTimer);
        codeBlock.textContent = codeText; // Final clean print
        return;
      }
      codeBlock.textContent = codeText.substring(0, index + charsPerTick);
      index += charsPerTick;
      
      // Auto scroll code editor content down if overflow
      const editorWindow = document.querySelector('.editor-window');
      editorWindow.scrollTop = editorWindow.scrollHeight;
    }, 15);
  }

  // File tree and tabs sync helper
  function switchFile(filename) {
    // Update active class in sidebar file tree
    fileItems.forEach(item => {
      if (item.getAttribute('data-file') === filename) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active class in tabs
    ideTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === filename) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Animate typing
    typeCode(filename);
  }

  // Sidebar item listeners
  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      const filename = item.getAttribute('data-file');
      switchFile(filename);
    });
  });

  // Tab click listeners
  ideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filename = tab.getAttribute('data-tab');
      switchFile(filename);
    });
  });

  // Load initial file about.json
  switchFile('about.json');


  // ==========================================
  // 3. Interactive Terminal Shell simulator
  // ==========================================
  const terminalTextBox = document.getElementById('terminal-textbox');
  const terminalHistory = document.getElementById('terminal-history');

  function addTerminalLine(text, cssClass = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${cssClass}`;
    line.innerHTML = text;
    terminalHistory.appendChild(line);
    
    // Scroll terminal history to bottom
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  terminalTextBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalTextBox.value.trim();
      const cleanCommand = command.toLowerCase();
      
      // Clear textbox
      terminalTextBox.value = '';

      if (!command) return;

      // Echo command
      addTerminalLine(`<span class="terminal-prompt">abhivignesh@dev-server:~$</span> ${command}`);

      // Parse Command
      switch (cleanCommand) {
        case 'help':
          addTerminalLine('Available commands:', 'text-muted');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">help</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List available shell commands');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print technical capabilities profile');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List major portfolio architectures');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">neofetch</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Display mock developer system metadata');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print contact coordinates');
          addTerminalLine('&nbsp;&nbsp;<span class="neon-blue">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear console terminal window');
          break;

        case 'skills':
          addTerminalLine('Technical Ecosystem Profile:', 'neon-teal');
          addTerminalLine('---------------------------------', 'text-muted');
          addTerminalLine('Frontend: HTML, CSS, Bootstrap, JavaScript, React.js');
          addTerminalLine('Backend: Node.js, Express.js, Python, Django');
          addTerminalLine('Database: MongoDB, SQL, SQLite, PostgreSQL');
          addTerminalLine('Tools: Git, GitHub, REST APIs');
          break;

        case 'projects':
          addTerminalLine('Active Projects:', 'neon-purple');
          addTerminalLine('---------------------------------', 'text-muted');
          addTerminalLine('1. ShareOcar - MERN Stack Ride-Sharing Platform (https://shareocar.netlify.app/)');
          addTerminalLine('2. Foodora - Python Django Food Ordering Web Application (https://foodora-zoaq.onrender.com/)');
          break;

        case 'contact':
          addTerminalLine('Communication channels:', 'neon-blue');
          addTerminalLine('&bull; Email: <a href="mailto:abhivignesh27@gmail.com" class="neon-link">abhivignesh27@gmail.com</a>');
          addTerminalLine('&bull; GitHub: <a href="https://github.com/Abhi09-vigu" target="_blank" class="neon-link">github.com/Abhi09-vigu</a>');
          addTerminalLine('&bull; LinkedIn: <a href="https://www.linkedin.com/in/abhi-vignesh-samala-459b77370/" target="_blank" class="neon-link">linkedin.com/in/abhi-vignesh-samala-459b77370/</a>');
          addTerminalLine('&bull; Location: Jaggayyapeta, Andhra Pradesh, India');
          break;

        case 'clear':
          terminalHistory.innerHTML = '';
          break;

        case 'neofetch':
          const asciiArt = `
<pre style="line-height: 1.1; font-family: monospace; color: var(--neon-purple); display: inline-block; vertical-align: top; margin-right: 20px;">
   /\\_/\\
  ( o.o )
   &gt; ^ &lt;
 /  | |  \\
(  |_|_|  )
</pre>
<div style="display: inline-block; vertical-align: top;">
  <span class="neon-blue" style="font-weight: bold;">abhivignesh@dev-server</span><br>
  <span>----------------------</span><br>
  <span>OS:</span> Debian GNU/Linux 12 (bookworm)<br>
  <span>Uptime:</span> Internship Active @ Inxcel Tech<br>
  <span>Shell:</span> Bash v2.4<br>
  <span>CPU:</span> MERN &amp; Django Stack Core<br>
  <span>RAM:</span> Buffered by Inxcel Tech
</div>`;
          addTerminalLine(asciiArt);
          break;

        default:
          addTerminalLine(`dev-server: command not found: ${command}. Type <span class="neon-teal">help</span> to query inputs.`, 'text-danger');
          break;
      }
    }
  });


  // ==========================================
  // 4. Project Showcase Tag Filters
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class for buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter project cards
      projectCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          if (card.getAttribute('data-tech') === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        }
      });
    });
  });
  // ==========================================
  // 5. Mobile Navigation Sidebar Drawer Toggle
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpened = navLinks.classList.contains('active');
      mobileMenuBtn.innerHTML = isOpened ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav link item
    navLinkItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
});
