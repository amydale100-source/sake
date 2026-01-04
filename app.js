// 1. 全域變數
let cocktails = []; 

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

    let results = [...cocktails]; // 複製一份原始資料進行過濾

    // A. 基酒篩選
    const mainBases = ["gin", "vodka", "rum", "tequila", "whiskey", "brandy"];
   // --- 修改後的基酒過濾邏輯 ---
if (base) {
    // 定義六大基酒的中英文關鍵字 (全部轉小寫)
    const mainBases = [
        "gin", "琴酒", 
        "vodka", "伏特加", 
        "rum", "蘭姆酒", "朗姆酒",
        "tequila", "龍舌蘭", 
        "whiskey", "whisky", "威士忌", 
        "brandy", "白蘭地"
    ];

    if (base === "other") {
        // 🔥 其他：如果這杯酒的 base 不包含在上面任何一個關鍵字中，就顯示
        results = results.filter(c => {
            const cocktailBase = (c.base || "").toLowerCase().trim();
            // 檢查這杯酒的基酒，是否「完全沒有」出現在 mainBases 名單中
            return !mainBases.some(mb => cocktailBase.includes(mb));
        });
    } else {
        // 六大基酒正常比對 (包含模糊比對，避免 JSON 寫 "Gin" 但搜尋 "gin")
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
        
        // 額外處理：首字母(Initials) 比對 (針對沒在 JSON 裡寫 initials 的情況做保底)
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
        container.innerHTML = '<p class="no-result">找不到符合的酒款，試試看其他關鍵字？</p>';
        return;
    }

    results.forEach(c => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFav = favorites.includes(c.name_en);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <div class="card-text">
                    <h2>${c.name_zh} <small>${c.name_en}</small></h2>
                    <p><strong>基酒:</strong> ${c.base.toUpperCase()}</p>
                    <p><strong>濃度:</strong> ${c.strength} | <strong>ABV:</strong> ${c.abv}%</p>
                    <p><strong>材料:</strong> ${c.ingredients.join('、')}</p>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" data-name="${c.name_en}">
                        ${isFav ? '💛 已收藏' : '🤍 收藏這杯'}
                    </button>
                </div>
                <div class="cocktail-image">
                    </div>
            </div>
        `;

        // 收藏按鈕點擊事件
        const btn = card.querySelector('.favorite-btn');
        btn.addEventListener('click', () => toggleFavorite(c, btn));

        container.appendChild(card);
    });
}

// --- 7. 收藏功能邏輯 ---
function toggleFavorite(cocktail, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const showFavBtn = document.getElementById('showFavBtn');
    const inFavoriteMode = showFavBtn.classList.contains('active');

    if (favorites.includes(cocktail.name_en)) {
        // 取消收藏
        favorites = favorites.filter(name => name !== cocktail.name_en);
        btn.classList.remove('active');
        btn.textContent = '🤍 收藏這杯';
    } else {
        // 加入收藏
        favorites.push(cocktail.name_en);
        btn.classList.add('active');
        btn.textContent = '💛 已收藏';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // 處理收藏模式下的即時刷新
    if (inFavoriteMode) {
        if (favorites.length === 0) {
            // 如果收藏清空了，自動切換回全部顯示
            showFavBtn.classList.remove('active');
            showFavBtn.textContent = "💛 我的收藏";
            displayResults(cocktails);
        } else {
            // 重新過濾並顯示剩下的收藏
            const favResults = cocktails.filter(c => favorites.includes(c.name_en));
            displayResults(favResults);
        }
    }
}

// --- 8. 「我的收藏」切換按鈕 ---
document.getElementById('showFavBtn').addEventListener('click', function() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    this.classList.toggle('active');

    if (this.classList.contains('active')) {
        this.textContent = "📜 顯示全部";
        if (favorites.length === 0) {
            displayResults([]);
        } else {
            const favResults = cocktails.filter(c => favorites.includes(c.name_en));
            displayResults(favResults);
        }
    } else {
        this.textContent = "💛 我的收藏";
        displayResults(cocktails);
    }
});


