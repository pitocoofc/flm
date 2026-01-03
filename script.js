let database = [];

// Carregar dados do JSON
async function loadData() {
    const response = await fetch('videos.json');
    database = await response.json();
    initApp();
}

function initApp() {
    renderHero(database[Math.floor(Math.random() * database.length)]);
    renderList(database, 'row-videos', 4); // Apenas 4 recomendações
    renderList(database, 'all-videos');    // Tudo
}

function renderHero(video) {
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${video.thumbnail})`;
    document.getElementById('hero-title').innerText = video.title;
    document.getElementById('hero-play').onclick = () => openPlayer(video.url);
}

function renderList(list, containerId, limit = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const items = limit ? list.slice(0, limit) : list;

    items.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="${video.thumbnail}">
            <div style="padding:10px"><strong>${video.title}</strong></div>
        `;
        card.onclick = () => openPlayer(video.url);
        container.appendChild(card);
    });
}

// Player
function openPlayer(url) {
    const overlay = document.getElementById('player-overlay');
    const video = document.getElementById('main-video');
    video.src = url;
    overlay.classList.add('active');
    video.play();
}

function closePlayer() {
    const overlay = document.getElementById('player-overlay');
    const video = document.getElementById('main-video');
    video.pause();
    overlay.classList.remove('active');
}

// Busca
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = database.filter(v => 
        v.title.toLowerCase().includes(term) || 
        v.tags.some(t => t.includes(term))
    );
    renderList(filtered, 'all-videos');
});

// Tecla ESC para sair
window.addEventListener('keydown', (e) => { if(e.key === "Escape") closePlayer(); });

loadData();
                    
