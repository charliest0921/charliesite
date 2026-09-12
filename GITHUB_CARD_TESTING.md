# 抽卡系統 GitHub Pages 測試步驟

這份流程是給抽卡系統用的。留言板繼續使用原本的 `firebase-config.js`，不要改。

## 1. 確認抽卡 Firebase 設定

抽卡系統只讀這個檔案：

```text
card-firebase-config.js
```

目前這個檔案已經是 `cardsystem-dbac1` 的設定。不要把 Firebase Console 給的整段 npm 程式碼貼進去，只要保留 `export const cardFirebaseConfig = { ... }` 這種格式。

## 2. 發布 Firestore Rules

到 Firebase Console 的 `cardsystem-dbac1` 專案：

1. Firestore Database
2. Rules
3. 把 `card-firestore.rules` 的內容全部貼上
4. Publish

這份規則會讓學生可讀卡片狀態，但只有 `card-firestore.rules` 裡的教師信箱可以寫入、匯入、抽卡、升級。

## 3. 開啟 Google 登入

到 Firebase Console 的 `cardsystem-dbac1` 專案：

1. Authentication
2. Sign-in method
3. 啟用 Google

## 班網網址

目前班網網址：

```text
https://charliest0921.github.io/charliesite/
```

抽卡區：

```text
https://charliest0921.github.io/charliesite/card-draw.html
```

目前卡片狀態區：

```text
https://charliest0921.github.io/charliesite/card-status.html
```

## 4. 加入 GitHub Pages 授權網域

到 Firebase Console 的 `cardsystem-dbac1` 專案：

1. Authentication
2. Settings
3. Authorized domains
4. 加入你的 GitHub Pages 網域

請直接加入：

```text
charliest0921.github.io
```

只要加網域，不要加 `https://`，也不要加 `/charliesite/`。

## 5. 放到 GitHub

把整個 `教學系統` 資料夾推到 GitHub repo。

GitHub repo 裡至少要有這些檔案：

```text
card-draw.html
card-status.html
card-firebase-config.js
card-seed-0912.js
card-firestore.rules
class-console-files/cards/
```

圖片之後放在：

```text
class-console-files/cards/12.jpg
class-console-files/cards/11.jpg
```

其他卡片依此類推。

## 6. 開啟 GitHub Pages

到 GitHub repo：

1. Settings
2. Pages
3. Source 選 `Deploy from a branch`
4. Branch 選 `main`
5. Folder 選 `/root`
6. Save

等待 GitHub Pages 顯示網址。

## 7. 測試網址

抽卡區：

```text
https://charliest0921.github.io/charliesite/card-draw.html
```

目前卡片狀態區：

```text
https://charliest0921.github.io/charliesite/card-status.html
```

## 8. 匯入 0912 備份

1. 打開 `card-status.html`
2. 按「教師登入編輯」
3. 用 `a776663@st.tc.edu.tw` 或 `card-firebase-config.js` 裡 `cardTeacherEmails` 列出的教師信箱登入
4. 按「匯入0912備份」

匯入後 Firebase 會出現：

```text
student_card_records
card_inventory
```

## 9. 後續抽卡流程

1. 打開 `card-draw.html`
2. 教師登入
3. 先輸入學生編號
4. 開始抽卡
5. 匯出本次紀錄

系統會把資料寫到 Firebase，並跳回目前卡片狀態區。
