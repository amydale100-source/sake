from fastapi import FastAPI, HTTPException
from typing import List, Optional
import json

app = FastAPI()

# 讀取資料庫
with open("cocktails.json", "r", encoding="utf-8") as f:
    cocktails = json.load(f)
print("✅ Loaded cocktails:", len(cocktails))
@app.get("/")
def root():
    return {"message": "AI Bartender API is running 🍸"}

# 取得所有調酒
@app.get("/cocktails")
def get_all_cocktails():
    return cocktails

# 依基酒推薦
@app.get("/cocktails/base/{base}")
def get_by_base(base: str):
    result = [c for c in cocktails if c["base"].lower() == base.lower()]
    if not result:
        raise HTTPException(status_code=404, detail="No cocktails found for this base.")
    return result

# 依酒精濃度推薦
@app.get("/cocktails/abv/{min_abv}")
def get_by_abv(min_abv: float, max_abv: Optional[float] = None):
    if max_abv is None:
        result = [c for c in cocktails if c["abv"] >= min_abv]
    else:
        result = [c for c in cocktails if min_abv <= c["abv"] <= max_abv]

    if not result:
        raise HTTPException(status_code=404, detail="No cocktails found in that ABV range.")

    return result

# 依名稱搜尋（中 or 英）
@app.get("/cocktails/search")
def search_cocktail(name: str):
    keyword = name.lower()
    result = [
        c for c in cocktails
        if keyword in c["name_en"].lower() or keyword in c["name_zh"]
    ]

    if not result:
        raise HTTPException(status_code=404, detail="No cocktails found with that name.")

    return result
