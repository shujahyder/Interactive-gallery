const photoData = [
    {
        id: 1,
        title: "Nature 1",
        src: "images/Nature-1.jpg",
        album: "nature",
        tags: ["landscape", "mountains"]
    },
    {
        id: 2,
        title: "City 1",
        src: "images/City-1.jpg",
        album: "city",
        tags: ["architecture", "day"]
    },
    {
        id: 3,
        title: "Nature 2",
        src: "images/Nature-2.jpg",
        album: "nature",
        tags: ["landscape", "water"]
    },
    {
        id: 4,
        title: "Animals 1",
        src: "images/Animal-1.jpg",
        album: "animals",
        tags: ["wildlife", "savanna"]
    },
    {
        id: 5,
        title: "City 2",
        src: "images/City-2.jpg",
        album: "city",
        tags: ["architecture", "modern"]
    },
    {
        id: 6,
        title: "Nature 3",
        src: "images/Nature-3.jpg",
        album: "nature",
        tags: ["water", "landscape"]
    },
    {
        id: 7,
        title: "Animals 2",
        src: "images/Animal-2.jpg",
        album: "animals",
        tags: ["wildlife", "birds"]
    },
    {
        id: 8,
        title: "City 3",
        src: "images/City-3.jpg",
        album: "city",
        tags: ["architecture", "Night"]
    },
    {
        id: 9,
        title: "Nature 4",
        src: "images/Nature-4.jpg",
        album: "nature",
        tags: ["landscape", "sunset"]
    },
    {
        id: 10,
        title: "Animals 3",
        src: "images/Animal-3.jpg",
        album: "animals",
        tags: ["wildlife", "Lion"]
    },
    {
        id: 11,
        title: "Nature 5",
        src: "images/Nature-5.jpg",
        album: "nature",
        tags: ["landscape", "water", "mountains"]
    },
    {
        id: 12,
        title: "City 4",
        src: "images/City-4.jpg",
        album: "city",
        tags: ["architecture", "modern"]
    }
];

const gallery = document.querySelector('.gallery');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const albumFilter = document.getElementById('album-filter');
const tagFilter = document.getElementById('tag-filter');
const filterReset = document.getElementById('filter-reset');
const albumItems = document.querySelectorAll('.album-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxTags = document.querySelector('.lightbox-tags');
const lightboxAlbum = document.querySelector('.lightbox-album');
const closeLightbox = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentFilters = {
    search: '',
    album: 'all',
    tag: 'all'
};

let currentLightboxIndex = 0;
let filteredPhotos = [...photoData];

function initGallery() {
    renderPhotos(photoData);
    setupEventListeners();
}

function renderPhotos(photos) {
    gallery.innerHTML = '';
    
    if (photos.length === 0) {
        gallery.innerHTML = '<div class="no-results-message">No photos match your search criteria</div>';
        return;
    }

    photos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        gallery.appendChild(photoElement);
    });
}

function createPhotoElement(photo) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.dataset.id = photo.id;
    
    photoItem.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}">
        <div class="photo-info">
            <h3>${photo.title}</h3>
            <div class="photo-tags">
                ${photo.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    photoItem.addEventListener('click', () => {
        openLightbox(photo.id);
    });
    
    return photoItem;
}

function filterPhotos() {
    const { search, album, tag } = currentFilters;
    
    filteredPhotos = photoData.filter(photo => {
        const matchesSearch = search === '' || 
                              photo.title.toLowerCase().includes(search.toLowerCase()) ||
                              photo.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        
        const matchesAlbum = album === 'all' || photo.album === album;
        
        const matchesTag = tag === 'all' || photo.tags.includes(tag);
        
        return matchesSearch && matchesAlbum && matchesTag;
    });
    
    renderPhotos(filteredPhotos);
}

function openLightbox(photoId) {
    const photoIndex = filteredPhotos.findIndex(photo => photo.id === parseInt(photoId));
    if (photoIndex === -1) return;
    
    currentLightboxIndex = photoIndex;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function updateLightboxContent() {
    const photo = filteredPhotos[currentLightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    
    lightboxTags.innerHTML = photo.tags.map(tag => 
        `<span class="lightbox-tag">${tag}</span>`
    ).join('');
    
    lightboxAlbum.textContent = `Album: ${photo.album.charAt(0).toUpperCase() + photo.album.slice(1)}`;
}

function closeLightboxFunc() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; 
}

function previousPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
}

function nextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
}

function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        currentFilters.search = searchInput.value.trim();
        filterPhotos();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentFilters.search = searchInput.value.trim();
            filterPhotos();
        }
    });
    
    albumFilter.addEventListener('change', () => {
        currentFilters.album = albumFilter.value;
        
        document.querySelectorAll('.album-item').forEach(item => {
            if (item.dataset.album === currentFilters.album || 
                (currentFilters.album === 'all' && item.dataset.album === 'all')) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        filterPhotos();
    });
    
    tagFilter.addEventListener('change', () => {
        currentFilters.tag = tagFilter.value;
        filterPhotos();
    });
    
    filterReset.addEventListener('click', () => {
        
        searchInput.value = '';
        albumFilter.value = 'all';
        tagFilter.value = 'all';
        
        
        currentFilters = {
            search: '',
            album: 'all',
            tag: 'all'
        };
        
        
        document.querySelectorAll('.album-item').forEach(item => {
            if (item.dataset.album === 'all') {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        filterPhotos();
    });
    

    albumItems.forEach(item => {
        item.addEventListener('click', () => {
            const album = item.dataset.album;
            
            
            albumFilter.value = album;
            
            
            albumItems.forEach(ai => ai.classList.remove('selected'));
            item.classList.add('selected');
            
            
            currentFilters.album = album;
            
            filterPhotos();
        });
    });
    
    closeLightbox.addEventListener('click', closeLightboxFunc);
    prevBtn.addEventListener('click', previousPhoto);
    nextBtn.addEventListener('click', nextPhoto);
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightboxFunc();
        if (e.key === 'ArrowLeft') previousPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
    });
}
document.addEventListener('DOMContentLoaded', initGallery);