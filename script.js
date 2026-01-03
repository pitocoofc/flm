let videoData = [];

// 1. Carregar Dados
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        videoData = await response.json();
        renderApp();
    } catch (e) { console.error("Erro ao carregar JSON", e); }
}

function renderApp() {
    // Hero Aleatório
    const randomVideo = videoData[Math.floor(Math.random() * videoData.length)];
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${randomVideo.thumbnail})`;
    document.getElementById('hero-title').innerText = randomVideo.title;
    document.getElementById('hero-btn-details').onclick = () => openDetails(randomVideo);

    // Grid Inicial
    renderGrid(videoData);
}

function renderGrid(list) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = '';
    list.forEach(v => {
        const div = document.createElement('div');
        div.className = 'video-card';
        div.innerHTML = `<img src="${v.thumbnail}"><div style="padding:10px"><b>${v.title}</b></div>`;
        div.onclick = () => openDetails(v);
        grid.appendChild(div);
    });
}

// 2. Lógica do Modal de Detalhes
function openDetails(video) {
    const modal = document.getElementById('details-modal');
    document.getElementById('details-img').src = video.thumbnail;
    document.getElementById('details-title').innerText = video.title;
    document.getElementById('details-desc').innerText = video.description;
    document.getElementById('details-tags').innerText = "Tags: " + video.tags.join(', ');
    
    // Cor da Classificação
    const ratingEl = document.getElementById('details-rating');
    ratingEl.innerText = video.rating;
    ratingEl.style.backgroundColor = video.rating === 'L' ? '#46d369' : 
                                   video.rating === '18' ? '#e50914' : '#f5a623';

    document.getElementById('btn-play-now').onclick = () => startVideo(video.url);
    modal.style.display = 'flex';
}

function closeDetails() { document.getElementById('details-modal').style.display = 'none'; }

// 3. Lógica do Player
function startVideo(url) {
    const wrapper = document.getElementById('video-wrapper');
    const video = document.getElementById('main-video');
    video.src = url;
    wrapper.style.display = 'block';
    video.play();
}

function stopVideo() {
    const video = document.getElementById('main-video');
    video.pause();
    document.getElementById('video-wrapper').style.display = 'none';
}

function toggleFullscreen() {
    const video = document.getElementById('main-video');
    if (video.requestFullscreen) video.requestFullscreen();
}

// 4. Busca em Tempo Real
document.getElementById('search-input').oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = videoData.filter(v => 
        v.title.toLowerCase().includes(term) || 
        v.tags.some(t => t.toLowerCase().includes(term))
    );
    renderGrid(filtered);
};

loadVideos();
