const STORAGE_KEYS={favorites:'asmaulhusna_favorites',theme:'asmaulhusna_theme'};
const state={filter:'all',query:'',selectedName:null,counter:0,favorites:new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)||'[]'))};
const grid=document.getElementById('namesGrid');
const stats=document.getElementById('stats');
const searchInput=document.getElementById('searchInput');
const modal=document.getElementById('detailModal');
const modalContent=document.getElementById('modalContent');
const closeModalBtn=document.getElementById('closeModal');
const counterValue=document.getElementById('counterValue');
const countBtn=document.getElementById('countBtn');
const resetBtn=document.getElementById('resetBtn');
const themeToggle=document.getElementById('themeToggle');

function saveFavorites(){localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...state.favorites]));}
function setTheme(theme){document.body.classList.toggle('light', theme==='light');themeToggle.textContent=theme==='light'?'☀️':'🌙';localStorage.setItem(STORAGE_KEYS.theme, theme);}
function initTheme(){setTheme(localStorage.getItem(STORAGE_KEYS.theme)||'dark');}
themeToggle.addEventListener('click',()=>{const current=document.body.classList.contains('light')?'light':'dark';setTheme(current==='light'?'dark':'light');});

function filterNames(){
  const q=state.query.trim().toLowerCase();
  return ALLAH_NAMES.filter(item=>{
    const matchesFavorites=state.filter==='favorites'?state.favorites.has(item.id):true;
    const matchesQuery=!q||[item.arabic,item.transliteration,item.meaning].join(' ').toLowerCase().includes(q);
    return matchesFavorites && matchesQuery;
  });
}

function render(){
  const items=filterNames();
  stats.textContent=`${items.length} names shown • ${state.favorites.size} favorites`;
  grid.innerHTML=items.map(item=>`
    <article class="card">
      <div class="card-top">
        <div>
          <div class="latin">${item.id}. ${item.transliteration}</div>
          <div class="meaning">${item.meaning}</div>
        </div>
        <div class="arabic">${item.arabic}</div>
      </div>
      <div class="card-actions">
        <button class="small-btn favorite ${state.favorites.has(item.id)?'active':''}" data-favorite="${item.id}">
          ${state.favorites.has(item.id)?'★ Favorite':'☆ Favorite'}
        </button>
        <button class="small-btn view" data-view="${item.id}">View</button>
      </div>
    </article>
  `).join('');
  document.querySelectorAll('[data-favorite]').forEach(btn=>btn.addEventListener('click',()=>toggleFavorite(Number(btn.dataset.favorite))));
  document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>openModal(Number(btn.dataset.view))));
}

function toggleFavorite(id){ if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id); saveFavorites(); render(); }

function openModal(id){
  const item=ALLAH_NAMES.find(n=>n.id===id); if(!item) return;
  state.selectedName=item; state.counter=0; counterValue.textContent='0';
  modalContent.innerHTML=`<div class="modal-arabic">${item.arabic}</div><div class="modal-latin">${item.transliteration}</div><p class="modal-meaning">${item.meaning}</p>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}

function closeModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); state.selectedName=null; }
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click',(e)=>{if(e.target===modal) closeModal();});
countBtn.addEventListener('click',()=>{ state.counter+=1; counterValue.textContent=String(state.counter); if((state.counter===33 || state.counter===99) && navigator.vibrate){ navigator.vibrate(180);} });
resetBtn.addEventListener('click',()=>{ state.counter=0; counterValue.textContent='0'; });
searchInput.addEventListener('input',(e)=>{ state.query=e.target.value; render(); });
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); state.filter=btn.dataset.filter; render(); }));
initTheme(); render();
