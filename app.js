// 1. 全域變數
let cocktails = []; 
// 🔥 在這裡加入自動滾動的全域變數
let autoScrollInterval = null;
let scrollSpeed = 0;

// 2. 初始化：從 JSON 載入資料
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('cocktails.json');
        if (!res.ok) throw new Error('連線回應不正常');
        
        cocktails = await res.json();
        console.log('🍸 酒單資料載入完成，共', cocktails.length, '杯');

        // 初次進入顯示全部
        displayResults(cocktails);
    } catch (err) {
        console.error('❌ 無法載入酒單資料', err);
        document.getElementById('results').innerHTML = '<p class="error">資料載入失敗，請確認資料夾路徑或伺服器狀態</p>';
    }
});

// --- 3. 背景動態切換 ---
const background = document.querySelector('.background-container');
const baseSelect = document.getElementById('baseSelect');

baseSelect.addEventListener('change', () => {
    const base = baseSelect.value.toLowerCase();
    
    if (base && base !== 'other') {
        background.style.backgroundImage = `url('images/bg/${base}.jpg')`;
    } else {
        // 移除 inline style,讓 CSS 預設背景生效
        background.style.backgroundImage = '';
    }
});

// --- 4. 搜尋 & 篩選邏輯 ---
function runSearch({ skipName = false } = {}) {
    // 防止資料未載入時執行搜尋
    if (cocktails.length === 0) return;

    const base = document.getElementById('baseSelect').value.toLowerCase();
    const strength = document.getElementById('strengthSelect').value.toLowerCase();
    const nameInput = skipName ? "" : document.getElementById('nameInput').value.trim().toLowerCase();
    
    // 🔥 新增:判斷目前是否在收藏模式
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');
    
    // 🔥 新增:根據模式決定搜尋範圍
    let searchPool = cocktails; // 預設搜尋全部
    
    if (inFavoriteMode) {
        // 在收藏模式下,只搜尋收藏的酒款
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        searchPool = cocktails.filter(c => favorites.includes(c.name_en));
    }

    let results = [...searchPool]; // 從選定的範圍開始過濾

    // A. 基酒篩選
    const mainBases = [
        "gin", "琴酒", 
        "vodka", "伏特加", 
        "rum", "蘭姆酒", "朗姆酒",
        "tequila", "龍舌蘭", 
        "whiskey", "whisky", "威士忌", 
        "brandy", "白蘭地"
    ];

    if (base) {
        if (base === "other") {
            results = results.filter(c => {
                const cocktailBase = (c.base || "").toLowerCase().trim();
                return !mainBases.some(mb => cocktailBase.includes(mb));
            });
        } else {
            results = results.filter(c => 
                c.base.toLowerCase().includes(base)
            );
        }
    }

    // B. 濃度篩選
    if (strength) {
        results = results.filter(c => c.strength.toLowerCase() === strength);
    }

    // C. 名稱搜尋 (模糊搜尋 vs 精準比對)
    if (!nameInput) {
        displayResults(results);
        return;
    }

    // 使用 Fuse.js 進行模糊搜尋
    if (window.Fuse) {
        const fuse = new Fuse(results, {
            keys: ["name_en", "name_zh", "initials"],
            threshold: 0.35,
        });

        const fuseResults = fuse.search(nameInput).map(r => r.item);
        
        // 額外處理:首字母(Initials) 比對
        const initialsInput = nameInput.replace(/\s+/g, "");
        const initialMatch = results.filter(c => 
            (c.initials || "").toLowerCase().includes(initialsInput)
        );

        // 合併結果並去除重複
        const combined = [...new Set([...fuseResults, ...initialMatch])];
        displayResults(combined);
    } else {
        // 保底精準搜尋
        const exact = results.filter(c =>
            c.name_en.toLowerCase().includes(nameInput) ||
            c.name_zh.includes(nameInput)
        );
        displayResults(exact);
    }
}

// --- 5. 事件監聽設定 ---
document.getElementById('searchBtn').addEventListener('click', () => runSearch());
document.getElementById('baseSelect').addEventListener('change', () => runSearch({ skipName: true }));
document.getElementById('strengthSelect').addEventListener('change', () => runSearch({ skipName: true }));


// --- 6. 渲染結果到畫面上 ---
function displayResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p class="no-result">找不到符合的酒款,試試看其他關鍵字?</p>';
        return;
    }

    // 🔥 檢查是否在收藏模式
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');

    results.forEach((c, index) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFav = favorites.includes(c.name_en);

        const card = document.createElement('div');
        card.className = 'card';
        
        // 🔥 在收藏模式下啟用拖曳功能
        if (inFavoriteMode) {
            card.draggable = true;
            card.classList.add('draggable');
            card.dataset.name = c.name_en; // 儲存酒款名稱用於識別
        }
        
        card.innerHTML = `
            <div class="card-content">
                <div class="card-text">
                    ${inFavoriteMode ? '<span class="drag-handle">☰</span>' : ''}
                    <h2>${c.name_zh} <small>${c.name_en}</small></h2>
                    <p><strong>基酒:</strong> ${c.base.toUpperCase()}</p>
                    <p><strong>濃度:</strong> ${c.strength} | <strong>ABV:</strong> ${c.abv}%</p>
                    <p><strong>材料:</strong> ${c.ingredients.join('、')}</p>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" data-name="${c.name_en}">
                        ${isFav ? '★ 已收藏' : '☆ 收藏這杯'}
                    </button>
                </div>
                <div class="cocktail-image">
                </div>
            </div>
        `;

        // 收藏按鈕點擊事件
        const btn = card.querySelector('.favorite-btn');
        btn.addEventListener('click', () => toggleFavorite(c, btn));

        // 🔥 加入拖曳事件監聽
        if (inFavoriteMode) {
            setupDragEvents(card);
        }

        container.appendChild(card);
    });
}

// 🔥 在這裡加入自動滾動函數（在 displayResults 之後）
function startAutoScroll(clientY) {
    const viewportHeight = window.innerHeight;
    const scrollZone = 100;
    const maxSpeed = 15;
    
    if (clientY < scrollZone) {
        const ratio = (scrollZone - clientY) / scrollZone;
        scrollSpeed = -ratio * maxSpeed;
    } else if (clientY > viewportHeight - scrollZone) {
        const ratio = (clientY - (viewportHeight - scrollZone)) / scrollZone;
        scrollSpeed = ratio * maxSpeed;
    } else {
        scrollSpeed = 0;
        stopAutoScroll();
        return;
    }
    
    if (!autoScrollInterval && scrollSpeed !== 0) {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, 16);
    }
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
    scrollSpeed = 0;
}

// 🔥 修改現有的 setupDragEvents 函數
function setupDragEvents(card) {
    let dragStartIndex;

    card.addEventListener('dragstart', function(e) {
        dragStartIndex = Array.from(this.parentElement.children).indexOf(this);
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    });

    card.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        stopAutoScroll(); // 🔥 加入這行
    });

    card.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        startAutoScroll(e.clientY); // 🔥 加入這行
        
        const dragging = document.querySelector('.dragging');
        if (dragging && dragging !== this) {
            const cards = Array.from(this.parentElement.children);
            const currentIndex = cards.indexOf(this);
            const draggingIndex = cards.indexOf(dragging);
            
            if (currentIndex > draggingIndex) {
                this.parentElement.insertBefore(dragging, this.nextSibling);
            } else {
                this.parentElement.insertBefore(dragging, this);
            }
        }
    });

    card.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        stopAutoScroll(); // 🔥 加入這行
        saveFavoriteOrder();
    });
}

// 🔥 修改現有的 setupTouchDrag 函數
function setupTouchDrag(card) {
    let startY, startX;
    let currentCard = null;
    let longPressTimer = null;

    card.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) return;
        
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        currentCard = this;
        
        longPressTimer = setTimeout(() => {
            if (currentCard) {
                currentCard.classList.add('dragging');
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        }, 300);
    });

    card.addEventListener('touchmove', function(e) {
        if (longPressTimer && !this.classList.contains('dragging')) {
            const touch = e.touches[0];
            const moveX = Math.abs(touch.clientX - startX);
            const moveY = Math.abs(touch.clientY - startY);
            
            if (moveX > 10 || moveY > 10) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            return;
        }
        
        if (!this.classList.contains('dragging')) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        
        startAutoScroll(touch.clientY); // 🔥 加入這行
        
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = elementAtPoint?.closest('.card.draggable');
        
        if (targetCard && targetCard !== this) {
            const cards = Array.from(this.parentElement.children);
            const currentIndex = cards.indexOf(this);
            const targetIndex = cards.indexOf(targetCard);
            
            if (targetIndex > currentIndex) {
                targetCard.parentElement.insertBefore(this, targetCard.nextSibling);
            } else {
                targetCard.parentElement.insertBefore(this, targetCard);
            }
        }
    }, { passive: false });

    card.addEventListener('touchend', function() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        
        if (this.classList.contains('dragging')) {
            this.classList.remove('dragging');
            stopAutoScroll(); // 🔥 加入這行
            saveFavoriteOrder();
        }
        currentCard = null;
    });

    card.addEventListener('touchcancel', function() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        
        this.classList.remove('dragging');
        stopAutoScroll(); // 🔥 加入這行
        currentCard = null;
    });
}

// 🔥 新增:儲存收藏的排序
function saveFavoriteOrder() {
    const container = document.getElementById('results');
    const cards = container.querySelectorAll('.card.draggable');
    const newOrder = Array.from(cards).map(card => card.dataset.name);
    
    localStorage.setItem('favorites', JSON.stringify(newOrder));
    console.log('✅ 收藏順序已更新:', newOrder);
}

// 🔥 修改:按照儲存的順序顯示收藏
function getSortedFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // 根據收藏順序排序酒款
    const sortedCocktails = favorites
        .map(name => cocktails.find(c => c.name_en === name))
        .filter(c => c !== undefined); // 過濾掉找不到的酒款
    
    return sortedCocktails;
}

// --- 修改 runSearch 函數中的收藏模式部分 ---
function runSearch({ skipName = false } = {}) {
    if (cocktails.length === 0) return;

    const base = document.getElementById('baseSelect').value.toLowerCase();
    const strength = document.getElementById('strengthSelect').value.toLowerCase();
    const nameInput = skipName ? "" : document.getElementById('nameInput').value.trim().toLowerCase();
    
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');
    
    let searchPool = cocktails;
    
    if (inFavoriteMode) {
        // 🔥 使用排序後的收藏清單
        searchPool = getSortedFavorites();
    }

    let results = [...searchPool];

    // A. 基酒篩選
    const mainBases = [
        "gin", "琴酒", 
        "vodka", "伏特加", 
        "rum", "蘭姆酒", "朗姆酒",
        "tequila", "龍舌蘭", 
        "whiskey", "whisky", "威士忌", 
        "brandy", "白蘭地"
    ];

    if (base) {
        if (base === "other") {
            results = results.filter(c => {
                const cocktailBase = (c.base || "").toLowerCase().trim();
                return !mainBases.some(mb => cocktailBase.includes(mb));
            });
        } else {
            results = results.filter(c => 
                c.base.toLowerCase().includes(base)
            );
        }
    }

    // B. 濃度篩選
    if (strength) {
        results = results.filter(c => c.strength.toLowerCase() === strength);
    }

    // C. 名稱搜尋
    if (!nameInput) {
        displayResults(results);
        return;
    }

    if (window.Fuse) {
        const fuse = new Fuse(results, {
            keys: ["name_en", "name_zh", "initials"],
            threshold: 0.35,
        });

        const fuseResults = fuse.search(nameInput).map(r => r.item);
        const initialsInput = nameInput.replace(/\s+/g, "");
        const initialMatch = results.filter(c => 
            (c.initials || "").toLowerCase().includes(initialsInput)
        );

        const combined = [...new Set([...fuseResults, ...initialMatch])];
        displayResults(combined);
    } else {
        const exact = results.filter(c =>
            c.name_en.toLowerCase().includes(nameInput) ||
            c.name_zh.includes(nameInput)
        );
        displayResults(exact);
    }
}

// --- 7. 收藏功能邏輯 ---
function resetSearchUI() {
  document.getElementById('nameInput').value = "";
  document.getElementById('baseSelect').value = "";
  document.getElementById('strengthSelect').value = "";
}
function toggleFavorite(cocktail, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');

    if (favorites.includes(cocktail.name_en)) {
        favorites = favorites.filter(name => name !== cocktail.name_en);
        btn.classList.remove('active');
        btn.textContent = '☆ 收藏這杯';
    } else {
        favorites.push(cocktail.name_en);
        btn.classList.add('active');
        btn.textContent = '★ 已收藏';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // 只有在收藏模式下才重新執行搜尋
    if (inFavoriteMode) {
    if (favorites.length === 0) {
        // 如果收藏清空了,自動切換回全部顯示
        showFavBtn.classList.remove('active');
        showFavBtn.textContent = "★ 我的酒單";
        
        // 🔥 加入這行:移除搜尋欄的收藏模式樣式
        document.getElementById('search').classList.remove('favorite-mode');
        
        runSearch(); // 改用 runSearch,保持搜尋條件
    } else {
        // 重新執行搜尋(會自動只在收藏中搜尋)
        runSearch();
    }
}
}

// --- 8. 「我的收藏」切換按鈕 ---


document.getElementById('showFavBtn').addEventListener('click', function () {
  const searchSection = document.getElementById('search');

  // 切換收藏模式
  this.classList.toggle('active');

  // 重置搜尋欄
  resetSearchUI();

  if (this.classList.contains('active')) {
    // ✅ 進入收藏模式
    this.textContent = "🍸 全部酒單";
    searchSection.classList.add('favorite-mode');
  } else {
    // ✅ 離開收藏模式
    this.textContent = "★ 我的酒單";
    searchSection.classList.remove('favorite-mode');
  }

  runSearch();
});



