from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import json

# 1️⃣ 建立 FastAPI app
app = FastAPI()

# 2️⃣ 靜態檔案支援（index.html, app.js, manifest.json）
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# 3️⃣ 載入 cocktails.json
with open("cocktails.json", "r", encoding="utf-8") as f:
    cocktails = json.load(f)
print("Loaded cocktails:", len(cocktails))

# 4️⃣ API 路徑
@app.get("/cocktails")
async def get_cocktails():
    return cocktails
