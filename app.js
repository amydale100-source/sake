const cocktails = [ {
        "name_en": "Gin Tonic",
        "name_zh": "琴通寧",
        "base": "gin",
        "strength": "light",
        "abv": 10,
        "ingredients": [
            "琴酒 Gin 45ml",
            "通寧水 Tonic Water 120ml",
            "萊姆片 Lime slice"
        ]
    },
    {
        "name_en": "Martini",
        "name_zh": "馬丁尼",
        "base": "gin",
        "strength": "strong",
        "abv": 28,
        "ingredients": [
            "琴酒 Gin 75ml",
            "苦艾酒 Dry Vermouth 15ml",
            "橄欖 Olive"
        ]
    },
    {
        "name_en": "Negroni",
        "name_zh": "內格羅尼",
        "base": "gin",
        "strength": "medium",
        "abv": 24,
        "ingredients": [
            "琴酒 Gin 30ml",
            "金巴利 Campari 30ml",
            "甜苦艾酒 Sweet Vermouth 30ml",
            "橙皮 Orange peel"
        ]
    },
    {
        "name_en": "Tom Collins",
        "name_zh": "湯姆可林",
        "base": "gin",
        "strength": "light",
        "abv": 8,
        "ingredients": [
            "琴酒 Gin 45ml",
            "檸檬汁 Lemon juice 20ml",
            "糖 Syrup 15ml",
            "蘇打水 Soda"
        ]
    },
    {
        "name_en": "Aviation",
        "name_zh": "航空",
        "base": "gin",
        "strength": "medium",
        "abv": 20,
        "ingredients": [
            "琴酒 Gin 45ml",
            "櫻桃白蘭地 Maraschino 15ml",
            "紫羅蘭利口酒 Creme de Violette 5ml",
            "檸檬汁 15ml"
        ]
    },
    {
        "name_en": "Moscow Mule",
        "name_zh": "莫斯科騾子",
        "base": "vodka",
        "strength": "light",
        "abv": 7,
        "ingredients": [
            "伏特加 Vodka 45ml",
            "薑汁啤酒 Ginger beer 120ml",
            "萊姆汁 10ml"
        ]
    },
    {
        "name_en": "Screwdriver",
        "name_zh": "螺絲起子",
        "base": "vodka",
        "strength": "light",
        "abv": 10,
        "ingredients": [
            "伏特加 Vodka 45ml",
            "柳橙汁 Orange juice 120ml"
        ]
    },
    {
        "name_en": "Cosmopolitan",
        "name_zh": "大都會",
        "base": "vodka",
        "strength": "medium",
        "abv": 20,
        "ingredients": [
            "伏特加 Vodka 45ml",
            "柑橘香甜酒 Triple Sec 15ml",
            "蔓越莓汁 30ml",
            "萊姆汁 15ml"
        ]
    },
    {
        "name_en": "White Russian",
        "name_zh": "白俄羅斯",
        "base": "vodka",
        "strength": "medium",
        "abv": 18,
        "ingredients": [
            "伏特加 Vodka 45ml",
            "咖啡甜酒 Kahlua 30ml",
            "奶油 Cream 30ml"
        ]
    },
    {
        "name_en": "Black Russian",
        "name_zh": "黑俄羅斯",
        "base": "vodka",
        "strength": "strong",
        "abv": 25,
        "ingredients": [
            "伏特加 Vodka 60ml",
            "咖啡甜酒 Kahlua 30ml"
        ]
    },
    {
        "name_en": "Mojito",
        "name_zh": "莫西多",
        "base": "rum",
        "strength": "light",
        "abv": 10,
        "ingredients": [
            "白蘭姆酒 45ml",
            "薄荷葉 Mint",
            "青檸汁 20ml",
            "糖 Syrup",
            "蘇打水 Soda"
        ]
    },
    {
        "name_en": "Daiquiri",
        "name_zh": "黛綺莉",
        "base": "rum",
        "strength": "medium",
        "abv": 20,
        "ingredients": [
            "白蘭姆酒 60ml",
            "青檸汁 30ml",
            "糖 Syrup 15ml"
        ]
    },
    {
        "name_en": "Piña Colada",
        "name_zh": "椰林飄香",
        "base": "rum",
        "strength": "light",
        "abv": 13,
        "ingredients": [
            "白蘭姆 45ml",
            "椰奶 Coconut cream 30ml",
            "鳳梨汁 Pineapple juice 90ml"
        ]
    },
    {
        "name_en": "Cuba Libre",
        "name_zh": "自由古巴",
        "base": "rum",
        "strength": "light",
        "abv": 10,
        "ingredients": [
            "蘭姆酒 Rum 45ml",
            "可樂 Cola 120ml",
            "萊姆汁 10ml"
        ]
    },
    {
        "name_en": "Mai Tai",
        "name_zh": "邁泰",
        "base": "rum",
        "strength": "strong",
        "abv": 26,
        "ingredients": [
            "白蘭姆 30ml",
            "黑蘭姆 30ml",
            "橙酒 15ml",
            "杏仁糖漿 Orgeat 15ml",
            "萊姆汁 15ml"
        ]
    },
    {
        "name_en": "Margarita",
        "name_zh": "瑪格麗特",
        "base": "tequila",
        "strength": "medium",
        "abv": 22,
        "ingredients": [
            "龍舌蘭 Tequila 50ml",
            "Triple Sec 25ml",
            "萊姆汁 20ml"
        ]
    },
    {
        "name_en": "Tequila Sunrise",
        "name_zh": "龍舌蘭日出",
        "base": "tequila",
        "strength": "light",
        "abv": 8,
        "ingredients": [
            "龍舌蘭 Tequila 45ml",
            "柳橙汁 120ml",
            "紅石榴糖漿 15ml"
        ]
    },
    {
        "name_en": "Paloma",
        "name_zh": "鳳凰",
        "base": "tequila",
        "strength": "light",
        "abv": 10,
        "ingredients": [
            "龍舌蘭 45ml",
            "葡萄柚汽水 120ml",
            "萊姆汁 10ml"
        ]
    },
    {
        "name_en": "Tequila Sour",
        "name_zh": "龍舌蘭酸酒",
        "base": "tequila",
        "strength": "medium",
        "abv": 18,
        "ingredients": [
            "龍舌蘭 45ml",
            "檸檬汁 30ml",
            "糖 20ml",
            "蛋白可選"
        ]
    },
    {
        "name_en": "Bloody Maria",
        "name_zh": "血腥瑪麗",
        "base": "tequila",
        "strength": "medium",
        "abv": 10,
        "ingredients": [
            "龍舌蘭 45ml",
            "蕃茄汁 120ml",
            "香料、胡椒"
        ]
    },
    {
        "name_en": "Old Fashioned",
        "name_zh": "古典",
        "base": "whiskey",
        "strength": "strong",
        "abv": 30,
        "ingredients": [
            "波本 60ml",
            "苦精 bitters",
            "糖 Syrup",
            "橙皮"
        ]
    },
    {
        "name_en": "Whiskey Sour",
        "name_zh": "威士忌酸酒",
        "base": "whiskey",
        "strength": "medium",
        "abv": 18,
        "ingredients": [
            "威士忌 45ml",
            "檸檬汁 30ml",
            "糖 20ml",
            "蛋白可選"
        ]
    },
    {
        "name_en": "Manhattan",
        "name_zh": "曼哈頓",
        "base": "whiskey",
        "strength": "strong",
        "abv": 28,
        "ingredients": [
            "黑麥威士忌 60ml",
            "甜苦艾酒 30ml",
            "苦精 bitters"
        ]
    },
    {
        "name_en": "Godfather",
        "name_zh": "教父",
        "base": "whiskey",
        "strength": "strong",
        "abv": 30,
        "ingredients": [
            "蘇格蘭威士忌 45ml",
            "杏仁甜酒 Amaretto 30ml"
        ]
    },
    {
        "name_en": "Boulevardier",
        "name_zh": "大道",
        "base": "whiskey",
        "strength": "strong",
        "abv": 26,
        "ingredients": [
            "波本 30ml",
            "金巴利 30ml",
            "甜苦艾酒 30ml"
        ]
    },
    {
        "name_en": "Sidecar",
        "name_zh": "側車",
        "base": "brandy",
        "strength": "medium",
        "abv": 24,
        "ingredients": [
            "白蘭地 50ml",
            "柑橘酒 20ml",
            "檸檬汁 20ml"
        ]
    },
    {
        "name_en": "Brandy Alexander",
        "name_zh": "白蘭地亞歷山大",
        "base": "brandy",
        "strength": "light",
        "abv": 16,
        "ingredients": [
            "白蘭地 30ml",
            "可可利口酒 30ml",
            "鮮奶油 30ml"
        ]
    },
    {
        "name_en": "Between the Sheets",
        "name_zh": "床笫之間",
        "base": "brandy",
        "strength": "medium",
        "abv": 22,
        "ingredients": [
            "白蘭地 30ml",
            "朗姆 30ml",
            "橙酒 30ml",
            "檸檬汁 15ml"
        ]
    },
    {
        "name_en": "French Connection",
        "name_zh": "法蘭西集團",
        "base": "brandy",
        "strength": "strong",
        "abv": 28,
        "ingredients": [
            "干邑 45ml",
            "杏仁酒 Amaretto 30ml"
        ]
    },
    {
        "name_en": "Stinger",
        "name_zh": "毒刺/史汀格",
        "base": "brandy",
        "strength": "strong",
        "abv": 28,
        "ingredients": [
            "白蘭地 45ml",
            "薄荷酒 Creme de Menthe 20ml"
        ]
    },
    {
        "name_en": "Long Island Iced Tea",
        "name_zh": "長島冰茶",
        "base": "rum",
        "strength": "strong",
        "abv": 22,
        "ingredients": [
            "伏特加 15ml",
            "琴酒 15ml",
            "朗姆酒 15ml",
            "龍舌蘭 15ml",
            "Triple Sec 15ml",
            "可樂 60ml",
            "檸檬汁 10ml"
        ]
    },
{
    "name_en": "Espresso Martini",
    "name_zh": "咖啡馬丁尼",
    "base": "vodka",
    "strength": "medium",
    "abv": 18,
    "ingredients": [
        "伏特加 40ml",
        "咖啡利口酒 20ml",
        "濃縮咖啡 30ml",
        "糖漿 10ml"
    ]
},
{
    "name_en": "Sex on the Beach",
    "name_zh": "性感海灘",
    "base": "vodka",
    "strength": "light",
    "abv": 12,
    "ingredients": [
        "伏特加 40ml",
        "桃子酒 20ml",
        "柳橙汁 40ml",
        "蔓越莓汁 40ml"
    ]
},
{
    "name_en": "B-52",
    "name_zh": "B-52轟炸機",
    "base": "liqueur",
    "strength": "strong",
    "abv": 30,
    "ingredients": [
        "咖啡酒 20ml",
        "貝禮詩奶酒 20ml",
        "橙酒 20ml"
    ]
},
{
    "name_en": "Blue Lagoon",
    "name_zh": "藍色珊瑚礁",
    "base": "vodka",
    "strength": "light",
    "abv": 10,
    "ingredients": [
        "伏特加 40ml",
        "藍橙酒 20ml",
        "檸檬水"
    ]
},
{
    "name_en": "Caipirinha",
    "name_zh": "卡琵莉亞",
    "base": "rum",
    "strength": "medium",
    "abv": 18,
    "ingredients": [
        "甘蔗酒 Cachaça 50ml",
        "萊姆切塊",
        "砂糖"
    ]
},
{
    "name_en": "Dark 'N' Stormy",
    "name_zh": "月黑風高/黑色風暴",
    "base": "rum",
    "strength": "medium",
    "abv": 16,
    "ingredients": [
        "黑朗姆 50ml",
        "薑汁啤酒",
        "萊姆"
    ]
},
{
    "name_en": "Hurricane",
    "name_zh": "颶風",
    "base": "rum",
    "strength": "strong",
    "abv": 24,
    "ingredients": [
        "朗姆酒 60ml",
        "百香果汁",
        "橙汁",
        "糖漿"
    ]
},
{
    "name_en": "Mint Julep",
    "name_zh": "薄荷茱莉普",
    "base": "whiskey",
    "strength": "medium",
    "abv": 18,
    "ingredients": [
        "波本威士忌 60ml",
        "薄荷",
        "糖漿",
        "碎冰"
    ]
},
{
    "name_en": "Penicillin",
    "name_zh": "盤尼西林",
    "base": "whiskey",
    "strength": "medium",
    "abv": 20,
    "ingredients": [
        "蘇格蘭威士忌 60ml",
        "薑汁",
        "蜂蜜薑糖漿",
        "檸檬汁"
    ]
},
{
    "name_en": "Rusty Nail",
    "name_zh": "鏽釘",
    "base": "whiskey",
    "strength": "strong",
    "abv": 28,
    "ingredients": [
        "蘇格蘭威士忌 45ml",
        "蜂蜜香甜酒(威士忌) 25ml"
    ]
},
{
    "name_en": "Amaretto Sour",
    "name_zh": "杏仁酸酒",
    "base": "liqueur",
    "strength": "light",
    "abv": 12,
    "ingredients": [
        "杏仁甜酒 45ml",
        "檸檬汁 30ml",
        "糖漿",
        "蛋白可選"
    ]
},
{
    "name_en": "Kir Royale",
    "name_zh": "皇家基爾",
    "base": "wine",
    "strength": "light",
    "abv": 10,
    "ingredients": [
        "黑醋栗利口酒",
        "香檳"
    ]
},
{
    "name_en": "Bellini",
    "name_zh": "貝里尼",
    "base": "wine",
    "strength": "light",
    "abv": 7,
    "ingredients": [
        "白桃泥",
        "氣泡酒"
    ]
},
{
    "name_en": "Mimosa",
    "name_zh": "含羞草",
    "base": "wine",
    "strength": "light",
    "abv": 6,
    "ingredients": [
        "柳橙汁",
        "香檳"
    ]
},
{
    "name_en": "Americano",
    "name_zh": "美國佬",
    "base": "aperol",
    "strength": "light",
    "abv": 11,
    "ingredients": [
        "Campari",
        "甜苦艾酒",
        "蘇打水"
    ]
},
{
    "name_en": "Zombie",
    "name_zh": "殭屍",
    "base": "rum",
    "strength": "strong",
    "abv": 30,
    "ingredients": [
        "白朗姆",
        "黑朗姆",
        "果汁",
        "香料"
    ]
},
{
    "name_en": "Singapore Sling",
    "name_zh": "新加坡司令",
    "base": "gin",
    "strength": "medium",
    "abv": 19,
    "ingredients": [
        "琴酒",
        "櫻桃白蘭地",
        "鳳梨汁",
        "檸檬汁",
        "紅石榴糖漿"
    ]
},
{
    "name_en": "Gimlet",
    "name_zh": "吉姆雷特",
    "base": "gin",
    "strength": "light",
    "abv": 12,
    "ingredients": [
        "琴酒 Gin 60ml",
        "青檸汁 Lime juice 20ml",
        "糖漿 Syrup 10ml"
    ]
},
{
    "name_en": "French 75",
    "name_zh": "法式75",
    "base": "gin",
    "strength": "light",
    "abv": 14,
    "ingredients": [
        "琴酒 Gin 30ml",
        "檸檬汁 Lemon juice 15ml",
        "糖漿 Syrup 10ml",
        "香檳 Champagne Top up"
    ]
}

]

// 初始化顯示全部
window.addEventListener('DOMContentLoaded', () => {
  displayResults(cocktails);

  // --- 新增背景動態切換 ---
  const background = document.querySelector('.background-container');
  const baseSelect = document.getElementById('baseSelect');

  baseSelect.addEventListener('change', () => {
    const base = baseSelect.value.toLowerCase();
    if (base) {
      background.style.backgroundImage = `url('images/bg/${base}.jpg')`;
    } else {
      background.style.backgroundImage = '';
    }
  });
});




// 搜尋 & 篩選（改良版）
document.getElementById('searchBtn').addEventListener('click', () => {
  const base = document.getElementById('baseSelect').value.toLowerCase();
  const strength = document.getElementById('strengthSelect').value.toLowerCase();
  const nameInput = document.getElementById('nameInput').value.trim().toLowerCase();

  let results = cocktails;

  // 先做基酒 & 濃度篩選（所有模式共用）
  if (base) results = results.filter(c => c.base.toLowerCase() === base);
  if (strength) results = results.filter(c => c.strength.toLowerCase() === strength);

  // 沒有文字搜尋就直接顯示
  if (!nameInput) {
    displayResults(results);
    return;
  }

  // 先取得 initials
  const initialsInput = nameInput.split(/\s+/).map(w => w[0]).join("");

  // === 強化模糊搜尋 ===
  // 自訂 Fuse keys：英文/中文/首字母
  const fuse = new Fuse(results, {
    keys: ["name_en", "name_zh", "initials"],
    threshold: 0.35,
    includeScore: true,
  });

  // 用 Fuse 去搜尋
  const fuseRes = fuse.search(nameInput).map(r => r.item);

  // 再做一次 initials 搜尋（補上例如 GT -> GinTonic）
  const initialMatch = results.filter(c => c.initials.toLowerCase().includes(initialsInput));

  // 合併並去重
  const combined = [
    ...new Set([
      ...fuseRes,
      ...initialMatch
    ])
  ];

  displayResults(combined);
});



function displayResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if(results.length === 0){
    container.innerHTML = '<p>找不到符合的酒款</p>';
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
      <h2>${c.name_zh} (${c.name_en})</h2>
      <p>基酒: ${c.base}</p>
      <p>濃度: ${c.strength} | ABV: ${c.abv}%</p>
      <p>材料: ${c.ingredients.join(', ')}</p>

      <button class="favorite-btn ${isFav ? 'active' : ''}" data-name="${c.name_en}">
        ${isFav ? '💛 已收藏' : '🤍 收藏這杯'}
      </button>
    </div>

    <div class="cocktail-image">
      <!-- 之後可以放圖片 -->
    </div>
  </div>
`;
const btn = card.querySelector('.favorite-btn');

btn.addEventListener('click', () => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // 切換收藏狀態
  if (favorites.includes(c.name_en)) {
    favorites = favorites.filter(name => name !== c.name_en);
    btn.classList.remove('active');
    btn.textContent = '🤍 收藏這杯';
  } else {
    favorites.push(c.name_en);
    btn.classList.add('active');
    btn.textContent = '💛 已收藏';
  }

  // 存回 localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));

  const showFavBtn = document.getElementById('showFavBtn');
  const inFavoriteMode = showFavBtn.classList.contains('active');

  // 🔥 關鍵：收藏模式下「最後一個被取消」
  if (inFavoriteMode && favorites.length === 0) {
    console.log("已清空收藏，自動跳回全部");   //測試用
    showFavBtn.classList.remove('active');
    showFavBtn.textContent = "💛 只看我的收藏";
    displayResults(cocktails);
    return;
  }

  // 如果還在收藏模式 → 即時刷新收藏清單
  if (inFavoriteMode) {
    const favResults = cocktails.filter(c => favorites.includes(c.name_en));
    displayResults(favResults);
  }
});
    container.appendChild(card);
  });
}
// 只顯示收藏的酒
document.getElementById('showFavBtn').addEventListener('click', () => {
  const btn = document.getElementById('showFavBtn');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // 沒收藏
  if (favorites.length === 0) {
    displayResults([]);
    return;
  }

  // 過濾出收藏的酒
  const favResults = cocktails.filter(c => favorites.includes(c.name_en));

  // 切換按鈕樣式
  btn.classList.toggle('active');

  // 如果目前是 active → 顯示收藏，否則顯示全部
  if (btn.classList.contains('active')) {
    btn.textContent = "📜 顯示全部";
    displayResults(favResults);
  } else {
    btn.textContent = "💛 我的收藏";
    displayResults(cocktails);
  }
});


