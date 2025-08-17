document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            populateAbout(data.about, data.education);
            populateJourney(data.journey);
            populateProjects(data.projects);
            populateToolkit(data.skills);
            initializeCertifications(data.certifications);
            initializeFaders();
            initializeTimelineScroll();
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Failed to load portfolio data. Please try again later.';
            document.body.appendChild(errorMessage);
        });
});

function initializeTabScroll() {
    const tabContainer = document.getElementById('project-tabs');
    const leftArrow = document.querySelector('.project-tab-arrow.left');
    const rightArrow = document.querySelector('.project-tab-arrow.right');
    if (!tabContainer || !leftArrow || !rightArrow) return;

    function updateTabArrows() {
        leftArrow.disabled = tabContainer.scrollLeft <= 0;
        rightArrow.disabled = tabContainer.scrollLeft + tabContainer.clientWidth >= tabContainer.scrollWidth - 1;
    }

    updateTabArrows();
    leftArrow.addEventListener('click', () => tabContainer.scrollBy({ left: -200, behavior: 'smooth' }));
    rightArrow.addEventListener('click', () => tabContainer.scrollBy({ left: 200, behavior: 'smooth' }));
    tabContainer.addEventListener('scroll', updateTabArrows);
    window.addEventListener('resize', updateTabArrows);
}
function populateAbout(aboutText, education) {
    const aboutTextElement = document.getElementById('about-text');
    const educationBox = document.getElementById('education-box');
    if (!aboutTextElement || !educationBox) return;

    aboutTextElement.textContent = aboutText;

    educationBox.innerHTML = education.map(edu => `
        <div class="education-item fade-in">
            <h3>${edu.degree}</h3>
            <div class="institution">${edu.institution}</div>
            <div class="date">${edu.date}</div>
            <p>${edu.description}</p>
        </div>
    `).join('');
}

function populateJourney(journeyItems) {
    const timeline = document.getElementById('journey-timeline');
    const modal = document.getElementById('journey-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalCompany = document.getElementById('modal-company');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.modal .close');
    if (!timeline || !modal || !closeBtn) return;

    timeline.innerHTML = journeyItems.map((item, index) => `
        <div class="timeline-item fade-in ${index % 2 === 0 ? 'top' : 'bottom'}">
            <div class="timeline-card" data-title="${item.title}" data-date="${item.date}" data-company="${item.company || ''}" data-description="${item.description}">
                <div class="card-face card-front">
                </div>
                <div class="card-face card-back">
                    <h3>${item.title}</h3>
                    <div class="date">${item.date}</div>
                    <div class="company">${item.company || ''}</div>
                    <p>${item.description}</p>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.timeline-card').forEach(card => {
        card.addEventListener('click', () => {
            modalTitle.textContent = card.dataset.title;
            modalDate.textContent = card.dataset.date;
            modalCompany.textContent = card.dataset.company;
            modalDescription.textContent = card.dataset.description;
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function populateProjects(projectItems) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    projectsGrid.innerHTML = projectItems.map((project, index) => {
        const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const detailsHTML = project.details.map(detail => `<li>${detail}</li>`).join('');
        return `
            <div class="project-card fade-in" style="transition-delay: ${index * 100}ms;">
                <div class="card-face card-front glass-card">
                    <h3>${project.title}</h3>
                    <div class="tags">${tagsHTML}</div>
                </div>
                <div class="card-face card-back glass-card">
                    <h3>${project.title}</h3>
                    <ul>${detailsHTML}</ul>
                    <div class="project-links">
                        <a href="${project.link}" target="_blank">View Code <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateToolkit(skills) {
    const grid = document.getElementById('toolkit-grid');
    if (!grid) return;
    grid.innerHTML = skills.map(category => `
        <div class="toolkit-card fade-in">
            <h3 class="toolkit-title">${category.title}</h3>
            <ul class="toolkit-list">
                ${category.items.map(skill => `
                    <li class="toolkit-item">
                        <img src="${skill.img || 'img/placeholder.png'}" alt="${skill.name}" class="toolkit-logo" loading="lazy" onerror="this.src='img/placeholder.png'; this.alt='Image not found';">
                        <span class="toolkit-name">${skill.name}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function initializeCertifications(certifications) {
    const track = document.getElementById('certsTrack');
    const leftBtn = document.querySelector('.cert-arrow.left');
    const rightBtn = document.querySelector('.cert-arrow.right');
    if (!track || !leftBtn || !rightBtn) return;

    track.innerHTML = certifications.map(cert => `
        <div class="cert-card glass-card fade-in">
            <img src="${cert.image}" alt="${cert.name}" onerror="this.src='img/placeholder.png'; this.alt='Image not found';">
            <h3>${cert.name}</h3>
            <p class="cert-meta">${cert.issuer} — <span class="cert-date">${cert.date}</span></p>
        </div>
    `).join('');

    function stepSize() {
        const card = track.querySelector('.cert-card');
        if (!card) return 0;
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseInt(getComputedStyle(track).gap || '16', 10) || 16;
        return Math.round(cardWidth + gap);
    }

    function updateArrows() {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        leftBtn.disabled = track.scrollLeft <= 0;
        rightBtn.disabled = track.scrollLeft >= maxScroll;
    }

    updateArrows();
    leftBtn.addEventListener('click', () => track.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => track.scrollBy({ left: stepSize(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', () => {
        const s = stepSize();
        if (s > 0) {
            const idx = Math.round(track.scrollLeft / s);
            track.scrollTo({ left: idx * s, behavior: 'auto' });
        }
        updateArrows();
    });
}
function initializeTimelineScroll() {
    const track = document.getElementById('journey-timeline');
    const leftBtn = document.querySelector('.timeline-arrow.left');
    const rightBtn = document.querySelector('.timeline-arrow.right');
    if (!track || !leftBtn || !rightBtn) return;

    function stepSize() {
        const card = track.querySelector('.timeline-item');
        if (!card) return 0;
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseInt(getComputedStyle(track).gap || '16', 10) || 16;
        return Math.round(cardWidth + gap);
    }

    function updateArrows() {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        leftBtn.disabled = track.scrollLeft <= 0;
        rightBtn.disabled = track.scrollLeft >= maxScroll;
    }

    updateArrows();
    leftBtn.addEventListener('click', () => track.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => track.scrollBy({ left: stepSize(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', () => {
        const s = stepSize();
        if (s > 0) {
            const idx = Math.round(track.scrollLeft / s);
            track.scrollTo({ left: idx * s, behavior: 'auto' });
        }
        updateArrows();
    });
}
function initializeFaders() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
}

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let nodes = [];
let dataPulses = [];
let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y, isNode = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.isNode = isNode;
        this.size = isNode ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
        this.speedX = (Math.random() * 1 - 0.5) * 0.5;
        this.speedY = (Math.random() * 1 - 0.5) * 0.5;
        this.color = 'rgba(30, 64, 175, 0.8)';
        if (isNode) {
            this.pulse = { size: this.size, speed: 0.1, growing: true };
        }
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        if (this.isNode) {
            if (this.pulse.growing) {
                this.pulse.size += this.pulse.speed;
                if (this.pulse.size > this.size * 2) this.pulse.growing = false;
            } else {
                this.pulse.size -= this.pulse.speed;
                if (this.pulse.size < this.size) this.pulse.growing = true;
            }
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        if (this.isNode) {
            ctx.strokeStyle = 'rgba(217, 119, 6, 1.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.pulse.size, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Pulse {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.endX = endX;
        this.endY = endY;
        this.progress = 0;
        this.speed = 0.005 + Math.random() * 0.005;
    }
    draw() {
        this.progress += this.speed;
        this.x = this.startX + (this.endX - this.startX) * this.progress;
        this.y = this.startY + (this.endY - this.startY) * this.progress;
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCanvas() {
    const particleCount = Math.floor(canvas.width / 5);
    particles = [];
    nodes = [];
    dataPulses = [];
    for (let i = 0; i < particleCount; i++) {
        const isNode = i % 5 === 0;
        const p = new Particle(null, null, isNode);
        particles.push(p);
        if (isNode) nodes.push(p);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
    ctx.lineWidth = 0.9;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i; j < nodes.length; j++) {
            let dx = nodes[i].x - nodes[j].x;
            let dy = nodes[i].y - nodes[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 250) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    if (Math.random() < 0.05 && nodes.length > 1) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (startNode !== endNode) {
            dataPulses.push(new Pulse(startNode.x, startNode.y, endNode.x, endNode.y));
        }
    }
    dataPulses.forEach((pulse, index) => {
        if (pulse.progress >= 1) {
            dataPulses.splice(index, 1);
        } else {
            pulse.draw();
        }
    });
    animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        animate();
    }
});

initCanvas();
animate();

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

  const timeline = document.getElementById('journey-timeline');
  const leftBtn = document.querySelector('.timeline-arrow.left');
  const rightBtn = document.querySelector('.timeline-arrow.right');

  const scrollAmount = 400; // how much to move per click

  leftBtn.addEventListener('click', () => {
    timeline.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    timeline.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

 let projects = [];
let currentProject = 0;
let currentImg = 0;

async function loadProjects() {
    try {
        const res = await fetch("data.json");
        if (!res.ok) throw new Error("Failed to load data.json");
        const data = await res.json();
        projects = data.projects;

        renderTabs();
        renderProject(0);
        initializeTabScroll(); // Add this
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

function renderTabs() {
  const tabsContainer = document.getElementById("project-tabs");
  tabsContainer.innerHTML = projects.map((p, i) =>
    `<button class="project-tab ${i === 0 ? 'active' : ''}" data-index="${i}">${p.name}</button>`
  ).join("");

  // Tab click events
  tabsContainer.querySelectorAll(".project-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelector(".project-tab.active")?.classList.remove("active");
      tab.classList.add("active");
      currentProject = parseInt(tab.dataset.index);
      renderProject(currentProject);
    });
  });
}

function renderProject(index) {
  const project = projects[index];
  const imgWrapper = document.getElementById("proj-img-wrapper");
  const info = document.getElementById("project-info");

  currentImg = 0; // reset image index

  // Images
  imgWrapper.innerHTML = project.images.map((src, i) =>
    `<img src="${src}" alt="${project.name}" class="${i === 0 ? 'active' : ''}">`
  ).join("");

  // Info
  info.innerHTML = `
    <h3>${project.name}</h3>
    <p>${project.description}</p>
    <ul>
      <li><strong>Tech:</strong> ${project.tech.join(", ")}</li>
      <li><strong>Role:</strong> ${project.role}</li>
      <li><strong>Year:</strong> ${project.year}</li>
    </ul>
  `;
}

// Image carousel
function changeImage(direction) {
  const project = projects[currentProject];
  const images = document.querySelectorAll("#proj-img-wrapper img");

  images[currentImg].classList.remove("active");
  currentImg = (currentImg + direction + project.images.length) % project.images.length;
  images[currentImg].classList.add("active");
}

document.querySelector(".proj-arrow.left").addEventListener("click", () => changeImage(-1));
document.querySelector(".proj-arrow.right").addEventListener("click", () => changeImage(1));

// Scrollable tabs
const tabContainer = document.getElementById("project-tabs");
document.querySelector(".project-tab-arrow.left").addEventListener("click", () => {
  tabContainer.scrollBy({ left: -200, behavior: "smooth" });
});
document.querySelector(".project-tab-arrow.right").addEventListener("click", () => {
  tabContainer.scrollBy({ left: 200, behavior: "smooth" });
});

// Load on start
loadProjects();
function renderProjectInfo(project) {
  const infoDiv = document.getElementById("project-info");
  infoDiv.innerHTML = `
    <h3>${project.name}</h3>
    <div class="project-meta">
      <span class="role">${project.role}</span>
      <span class="year">${project.year}</span>
    </div>
    <p>${project.description}</p>
    <div class="tech-stack">
      ${project.tech.map(t => `<span class="tech">${t}</span>`).join("")}
    </div>
  `;
}