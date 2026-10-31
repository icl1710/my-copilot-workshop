![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 我的待辦清單 Web App

這是我在 GitHub Copilot 實戰工作坊完成的待辦清單 Web App，實作日常事項管理、狀態篩選與瀏覽器端資料保存，並支援深淺色主題。

## 線上展示

GitHub Pages：`https://icl1710.github.io/my-copilot-workshop/`

## 功能

- 新增待辦事項，並略過空白內容。
- 勾選或取消勾選事項，標示完成狀態。
- 刪除待辦事項。
- 依「全部」、「未完成」或「已完成」篩選清單。
- 顯示未完成事項數量，並在清單或篩選結果為空時提供提示。
- 將待辦事項及手動選擇的主題偏好保存於 `localStorage`。
- 可手動切換淺色與深色模式；未手動選擇時依作業系統的色彩偏好顯示。
- 支援窄螢幕版面，並提供鍵盤焦點提示與螢幕閱讀器標籤。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript，沒有引入框架或套件。
- 使用瀏覽器 `localStorage` 保存待辦事項與手動主題偏好。
- 透過 CSS 變數管理色彩，並以 `prefers-color-scheme` 回應系統深色模式偏好。

## 開發方式

- 使用 GitHub Copilot Agent Mode 協助依需求拆解工作、實作功能與修正問題。
- 透過 MCP 連接 Microsoft Learn 與 GitHub；查閱官方文件，並取得 GitHub issue 的需求脈絡。
- 使用 `.github/prompts/fix-issue.prompt.md` 定義可重複的 issue 修復流程，包含先提出計畫並等待確認、建立分支、執行必要修改、在瀏覽器驗證，以及提交、推送與建立 Pull Request。

## 我學到什麼

- 把需求拆成明確步驟，能讓 AI 協作範圍更容易掌握。
- 先閱讀 issue 並確認修改計畫，有助於避免偏離問題或進行不必要的重構。
- 使用 `localStorage` 與瀏覽器原生 API，可以在不增加套件的情況下保存使用者資料與偏好。
- 透過 `prefers-color-scheme`，讓介面配合使用者的系統色彩偏好。
- 依照重現步驟在瀏覽器實際操作，能確認修正是否符合使用者預期。