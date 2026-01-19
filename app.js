/* ==================================================================================
   SAKE - AI 侍酒師 JavaScript
   ================================================================================== */

// ==================== 全域變數 ====================
let cocktails = []; 
let autoScrollInterval = null;
let scrollSpeed = 0;

// ==================== 初始化:載入酒單資料 ====================
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
        document.getElementById('results').innerHTML = 
            '<p class="error">資料載入失敗，請確認網路連線或重新整理頁面</p>';
    }
});

// ==================== 背景動態切換 ====================
document.addEventListener('DOMContentLoaded', () => {
    const background = document.querySelector('.background-container');
    const baseSelect = document.getElementById('baseSelect');
    const showFavBtn = document.getElementById('showFavBtn');

    function isFavoriteMode() {
        return showFavBtn.classList.contains('active');
    }

    function updateBackground() {
        if (isFavoriteMode()) {
            background.style.backgroundImage =
                "url('images/bg/back.jpg')";
            return;
        }

        const base = baseSelect.value.toLowerCase();

        if (base && base !== 'other') {
            background.style.backgroundImage =
                `url('images/bg/${base}.jpg')`;
        } else {
            background.style.backgroundImage = '';
        }
    }

    baseSelect.addEventListener('change', updateBackground);

    showFavBtn.addEventListener('click', () => {
        updateBackground();
    });
});



// ==================== 搜尋與篩選邏輯 ====================

/**
 * 執行搜尋與篩選
 * @param {Object} options - 選項
 * @param {boolean} options.skipName - 是否跳過名稱搜尋
 */
function runSearch({ skipName = false } = {}) {
    // 防止資料未載入時執行搜尋
    if (cocktails.length === 0) return;

    // 取得搜尋條件
    const base = baseSelect.value.toLowerCase();
    const strength = document.getElementById('strengthSelect').value.toLowerCase();
    const nameInput = skipName ? "" : document.getElementById('nameInput').value.trim().toLowerCase();
    
    // 判斷是否在收藏模式
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');
    
    // 根據模式決定搜尋範圍
    let searchPool = inFavoriteMode ? getSortedFavorites() : cocktails;
    let results = [...searchPool];

    // A. 基酒篩選
    if (base) {
        const mainBases = [
            "gin", "琴酒", 
            "vodka", "伏特加", 
            "rum", "蘭姆酒", "朗姆酒",
            "tequila", "龍舌蘭", 
            "whiskey", "whisky", "威士忌", 
            "brandy", "白蘭地"
        ];

        if (base === "other") {
            // 篩選非六大基酒
            results = results.filter(c => {
                const cocktailBase = (c.base || "").toLowerCase().trim();
                return !mainBases.some(mb => cocktailBase.includes(mb));
            });
        } else {
            // 篩選特定基酒
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

    // 使用 Fuse.js 進行模糊搜尋
    if (window.Fuse) {
        const fuse = new Fuse(results, {
            keys: ["name_en", "name_zh", "initials"],
            threshold: 0.35,
        });

        const fuseResults = fuse.search(nameInput).map(r => r.item);
        
        // 首字母比對
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

/**
 * 重置搜尋介面
 */
function resetSearchUI() {
    document.getElementById('nameInput').value = "";
    baseSelect.value = "";
    document.getElementById('strengthSelect').value = "";
}

// -------------------- 事件監聽設定 --------------------
document.getElementById('searchBtn').addEventListener('click', () => runSearch());
baseSelect.addEventListener('change', () => runSearch({ skipName: true }));
document.getElementById('strengthSelect').addEventListener('change', () => runSearch({ skipName: true }));

// ==================== 渲染結果 ====================

/**
 * 將搜尋結果渲染到畫面
 * @param {Array} results - 酒款陣列
 */
function displayResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    // 檢查是否在收藏模式
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');

    // 無結果時顯示提示訊息
    if (results.length === 0) {
        if (inFavoriteMode) {
            container.innerHTML = `
                <div class="no-result favorite-empty">
                    <p>📭 你的收藏是空的</p>
                    <p class="hint">試著點擊酒款卡片上的「☆ 收藏這杯」按鈕來收藏你喜歡的調酒吧!</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="no-result">
                    <p>🔍 找不到符合的酒款</p>
                    <p class="hint">試試看其他關鍵字或調整篩選條件?</p>
                </div>
            `;
        }
        return;
    }

    // 渲染每個酒款卡片
    results.forEach((c) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFav = favorites.includes(c.name_en);

        const card = document.createElement('div');
        card.className = 'card';
        
        // 收藏模式下啟用拖曳
        if (inFavoriteMode) {
            card.draggable = true;
            card.classList.add('draggable');
            card.dataset.name = c.name_en;
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
                <div class="cocktail-image"></div>
            </div>
        `;

        // 綁定收藏按鈕事件
        const btn = card.querySelector('.favorite-btn');
        btn.addEventListener('click', () => toggleFavorite(c, btn));

        // 綁定拖曳事件
        if (inFavoriteMode) {
            setupDragEvents(card);
            setupTouchDrag(card);
        }

        container.appendChild(card);
    });
}

// ==================== 收藏功能 ====================

/**
 * 切換收藏狀態
 * @param {Object} cocktail - 酒款物件
 * @param {HTMLElement} btn - 按鈕元素
 */
function toggleFavorite(cocktail, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');

    // 切換收藏狀態
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

    // 收藏模式下重新渲染
    if (inFavoriteMode) {
        if (favorites.length === 0) {
            // 收藏清空,切回全部模式
            showFavBtn.classList.remove('active');
            showFavBtn.textContent = "★ 我的酒單";
            document.getElementById('search').classList.remove('favorite-mode');
        }
        runSearch();
    }
}

/**
 * 取得排序後的收藏清單
 * @returns {Array} 排序後的酒款陣列
 */
function getSortedFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    return favorites
        .map(name => cocktails.find(c => c.name_en === name))
        .filter(c => c !== undefined);
}

/**
 * 儲存收藏的排序
 */
function saveFavoriteOrder() {
    const container = document.getElementById('results');
    const cards = container.querySelectorAll('.card.draggable');
    const newOrder = Array.from(cards).map(card => card.dataset.name);
    
    localStorage.setItem('favorites', JSON.stringify(newOrder));
    console.log('✅ 收藏順序已更新:', newOrder);
}

// -------------------- 收藏按鈕事件 --------------------
document.getElementById('showFavBtn').addEventListener('click', function () {
    const searchSection = document.getElementById('search');

    this.classList.toggle('active');
    resetSearchUI();

    if (this.classList.contains('active')) {
        // 進入收藏模式
        this.textContent = "🍸 全部酒單";
        searchSection.classList.add('favorite-mode');
    } else {
        // 離開收藏模式
        this.textContent = "★ 我的酒單";
        searchSection.classList.remove('favorite-mode');
    }

    runSearch();
});

// ==================== 拖曳排序功能 ====================

/**
 * 設定桌機版拖曳事件
 * @param {HTMLElement} card - 卡片元素
 */
function setupDragEvents(card) {
    card.addEventListener('dragstart', function(e) {
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    });

    card.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        stopAutoScroll();
    });

    card.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        startAutoScroll(e.clientY);
        
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
        stopAutoScroll();
        saveFavoriteOrder();
    });
}
/**
 * 設定手機版拖曳事件
 * @param {HTMLElement} card - 卡片元素
 */
function setupTouchDrag(card) {
    let startX = 0, startY = 0;
    let longPressTimer = null;
    let placeholder = null;
    let offsetY = 0;

    /* ---------- touchstart ---------- */
    card.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        longPressTimer = setTimeout(() => {
            card.classList.add('dragging');

            const rect = card.getBoundingClientRect();

            // 建立 placeholder
            placeholder = document.createElement('div');
            placeholder.className = 'card drag-placeholder';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.visibility = 'hidden';
            card.parentElement.insertBefore(placeholder, card);

            // 計算手指在卡片上的偏移
            offsetY = touch.clientY - rect.top;

            // 脫離文件流
            card.style.position = 'fixed';
            card.style.top = rect.top + 'px';
            card.style.left = rect.left + 'px';
            card.style.width = rect.width + 'px';
            card.style.zIndex = 9999;
            card.style.pointerEvents = 'none';

            if (navigator.vibrate) navigator.vibrate(50);
        }, 300);
    });

    /* ---------- touchmove ---------- */
    card.addEventListener('touchmove', function(e) {
        if (!card.classList.contains('dragging')) return;
        e.preventDefault();

        const touch = e.touches[0];
        if (typeof startAutoScroll === 'function') startAutoScroll(touch.clientY);

        // 卡片跟著手指移動
        card.style.top = touch.clientY - offsetY + 'px';

        const container = card.parentElement;
        if (!container || !placeholder) return;

        const cards = Array.from(
            container.querySelectorAll('.card.draggable:not(.dragging):not(.drag-placeholder)')
        );

        let insertBeforeNode = null;
        for (const c of cards) {
            const rect = c.getBoundingClientRect();
            const middle = rect.top + rect.height / 2;
            if (touch.clientY < middle) {
                insertBeforeNode = c;
                break;
            }
        }

        if (insertBeforeNode) {
            container.insertBefore(placeholder, insertBeforeNode);
        } else {
            container.appendChild(placeholder);
        }
    }, { passive: false });

    /* ---------- touchend ---------- */
    card.addEventListener('touchend', function() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (!card.classList.contains('dragging')) return;

        card.classList.remove('dragging');
        if (typeof stopAutoScroll === 'function') stopAutoScroll();

        // 移回 placeholder
        if (placeholder && placeholder.parentElement) {
            placeholder.parentElement.insertBefore(card, placeholder);
            placeholder.remove();
        }

        // 還原樣式
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';

        placeholder = null;
        if (typeof saveFavoriteOrder === 'function') saveFavoriteOrder();
    });

    /* ---------- touchcancel ---------- */
    card.addEventListener('touchcancel', function() {
        if (longPressTimer) clearTimeout(longPressTimer);
        card.classList.remove('dragging');
        if (typeof stopAutoScroll === 'function') stopAutoScroll();

        if (placeholder && placeholder.parentElement) placeholder.remove();
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';
        placeholder = null;
    });
}


// -------------------- 拖曳自動滾動 --------------------

/**
 * 開始自動滾動
 * @param {number} clientY - 滑鼠/觸控 Y 座標
 */
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

/**
 * 停止自動滾動
 */
function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
    scrollSpeed = 0;
}

// ==================== 搜尋欄滾動縮小功能 ====================
(function () {
    let lastScrollTop = 0;
    let isManuallyExpanded = false; // 🔥 新增:手動展開標記

    const searchSection = document.getElementById('search');
    const nameInput = document.getElementById('nameInput');
    const strengthSelect = document.getElementById('strengthSelect');
    const searchInputs = [nameInput, baseSelect, strengthSelect];

    // -------------------- 更新縮小標籤顯示 --------------------
    function updateMinimizedDisplay() {
        if (window.innerWidth > 768) return;

        let label = searchSection.querySelector('.minimized-label');
        if (!label) {
            label = document.createElement('div');
            label.className = 'minimized-label';
            searchSection.insertBefore(label, searchSection.firstChild);
        }

        // 優先顯示有值的欄位
        if (nameInput.value.trim()) {
            label.textContent = nameInput.value.trim();
        } else if (baseSelect.value) {
            label.textContent = baseSelect.options[baseSelect.selectedIndex].text;
        } else if (strengthSelect.value) {
            label.textContent = strengthSelect.options[strengthSelect.selectedIndex].text;
        } else {
            label.textContent = '搜尋';
        }
    }

    // -------------------- 控制欄位顯示/隱藏 --------------------
    function updateFieldVisibility() {
        if (window.innerWidth > 768) return;

        const fields = [
            { el: nameInput, hasValue: nameInput.value.trim() !== '' },
            { el: baseSelect, hasValue: baseSelect.value !== '' },
            { el: strengthSelect, hasValue: strengthSelect.value !== '' }
        ];

        const hasAnyValue = fields.some(f => f.hasValue);

        fields.forEach(f => {
            if (searchSection.classList.contains('minimized')) {
                // 縮小時:有任何值就只顯示有值的,全空就全隱藏
                f.el.classList.toggle('empty-hidden', hasAnyValue ? !f.hasValue : true);
            } else {
                // 展開時:全部顯示
                f.el.classList.remove('empty-hidden');
            }
        });
    }

    // -------------------- 防抖函數 --------------------
    function debounce(fn, wait) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, wait);
        };
    }

    // -------------------- 滾動處理 --------------------
    const SCROLL_TRIGGER_Y = 48;   // 觸發縮小的起始高度
    const COLLAPSE_DIFF = 16;     // 向下縮小（手指要有明確意圖）
    const EXPAND_DIFF = 48;       // 向上展開（比縮小更難）
    const DEBOUNCE_MS = 32;       // 1 frame + 緩衝

    function handleScroll() {
    if (isManuallyExpanded) return;

    if (window.innerWidth > 768 &&
        searchInputs.includes(document.activeElement)) {
        return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const diff = scrollTop - lastScrollTop;
    const isMinimized = searchSection.classList.contains('minimized');

    // --------- 向下滑：只在「尚未縮小」時觸發 ---------
    if (
        !isMinimized &&
        scrollTop > SCROLL_TRIGGER_Y &&
        diff > COLLAPSE_DIFF
    ) {
        searchSection.classList.add('minimized');
        updateMinimizedDisplay();
        updateFieldVisibility();
    }

    // --------- 向上滑：只在「已縮小」時，且滑很多才展開 ---------
    if (
        isMinimized &&
        diff < -EXPAND_DIFF
    ) {
        searchSection.classList.remove('minimized');
        updateFieldVisibility();
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}


    window.addEventListener(
        'scroll',
        debounce(handleScroll, DEBOUNCE_MS),
        { passive: true }
    );

    // -------------------- Focus/Blur 處理 --------------------
    searchInputs.forEach(el => {
        el.addEventListener('focus', () => {
            // 🔥 聚焦時設為手動展開
            isManuallyExpanded = true;
            searchSection.classList.remove('minimized');
            updateFieldVisibility();
        });

        el.addEventListener('blur', () => {
            setTimeout(() => {
                const anyFocus = searchInputs.some(i => i === document.activeElement);
                if (!anyFocus) {
                    // 🔥 所有欄位都失焦後,解除鎖定
                    isManuallyExpanded = false;
                    if (window.innerWidth > 768) {
                        searchSection.classList.remove('expanded');
                    }
                }
            }, 150);
        });
    });

    // -------------------- 點擊展開 --------------------
    searchSection.addEventListener('click', e => {
        if (window.innerWidth > 768) return;

        if (e.target.classList.contains('minimized-label') || e.target === searchSection) {
            // 🔥 點擊展開,設為手動展開狀態
            isManuallyExpanded = true;
            searchSection.classList.remove('minimized');
            updateFieldVisibility();
            
            // 🔥 自動聚焦到名稱輸入框
            setTimeout(() => {
                nameInput.focus();
            }, 100);
        }
    });

    // 🔥 新增:點擊搜尋區域外部,解除鎖定
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        
        if (!searchSection.contains(e.target)) {
            isManuallyExpanded = false;
        }
    });

    // -------------------- 輸入變化更新 --------------------
    searchInputs.forEach(el => {
        el.addEventListener('input', () => {
            updateMinimizedDisplay();
            updateFieldVisibility();
        });
        el.addEventListener('change', () => {
            updateMinimizedDisplay();
            updateFieldVisibility();
        });
    });
})();
// ==================== 回到頂端按鈕 ====================
(function() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;

    // 監聽滾動,超過 100px 顯示按鈕
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    // 點擊平滑滾動到頂端
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();