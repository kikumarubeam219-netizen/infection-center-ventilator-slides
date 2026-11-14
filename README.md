# 感染症センター向け ICU人工呼吸器勉強会 HTMLスライド（ce-slide-hybrid版）

本プロジェクトは、Googleドライブ内の「感染症センター呼吸器勉強会」資料（全35ページのPDF・スライド解析ドキュメント・完全スピーカーノート）を元に、`ce-slide-hybrid` スキル仕様に基づいて忠実に再現・拡張したHTMLプレゼンテーション（全42枚）です。

---

## 📁 ファイル構成

- [`index.html`](index.html) / [`感染症センター_人工呼吸器勉強会_スライド.html`](感染症センター_人工呼吸器勉強会_スライド.html)
  - Reveal.js 5.x ベースの単一HTMLスライド本体（どちらを開いても同じ内容です）
- `assets/`
  - **キャラクター画像（導入・組み込み済み）**
    - `CE_base.jpg`（赤ちゃんCE ベースシート・吹き出しアイコン用自動クロップ対応）
    - `Ns_base.jpg`（新人看護師 ベースシート・吹き出しアイコン用自動クロップ対応）
    - `char_cover.png`（Slide 1 表紙：人工呼吸器を囲む赤ちゃんCE＆新人看護師ペア）
    - `char_thinking.png`（Slide 4・9：腕組みして考える赤ちゃんCE＆新人看護師）
    - `char_supporter.png`（Slide 5：聴診器と盾で肺を守る赤ちゃんCE）
    - `char_modes_step.png`（Slide 19・22・23：換気モードのアシスト比率を示すキャラクター）
    - `char_closing.png`（Slide 40：勉強会まとめ・笑顔でお辞儀するペア）
  - **実機写真・モニター画面キャプチャ・ロゴ・QRコード（導入・組み込み済み）**
    - `rgmc_logo.png`（Slide 1：りんくう総合医療センター ロゴ）
    - `circuit_savina300.jpg`（Slide 13：Dräger Savina 300 回路全体・人工鼻接続写真）
    - `artificial_nose_pall.jpg`（Slide 13：PALL 人工鼻クローズアップ写真）
    - `monitor_pc_ac.png`（Slide 20・21：Savina 300 PC-AC モード実機モニター画面）
    - `icon_spont_lung.png`（Slide 21：自発呼吸トリガー時の白肺アイコン）
    - `monitor_spn_cpap_ps.png`（Slide 24：Savina 300 SPN-CPAP/PS モード実機モニター画面）
    - `survey_qr.jpg`（Slide 40：受講後アンケート QRコード）

---

## 🖥️ スライドの開き方と操作方法

1. [`index.html`](index.html) または [`感染症センター_人工呼吸器勉強会_スライド.html`](感染症センター_人工呼吸器勉強会_スライド.html) を Google Chrome / Microsoft Edge 等のブラウザでダブルクリックして開きます。
2. **キーボードショートカット**：
   - `E` キー（または画面左下の「✏️ 編集モード」ボタン）：**ブラウザ上で文字を直接クリックしてWord感覚で編集できる「直感編集モード」を起動**
   - `→` / `←` または `Space`：前後のスライド（およびフラグメントアニメーション）へ移動
   - `N` キー（または画面左下の「📖 講義台本」ボタン）：画面下部に**完全スピーカーノートパネル**を表示・非表示
   - `S` キー：Reveal.js 標準の別ウィンドウ・スピーカービューを起動
   - `ESC` または `O` キー（または画面左下の「スライド一覧」ボタン）：全42枚のスライド一覧を表示
   - `F` キー：フルスクリーン表示

### ✏️ ブラウザ上での直感編集（WYSIWYG）と保存の手順
1. スライド画面で **`E` キー**（または左下の「✏️ 編集モード (E)」ボタン）を押します。
2. 編集可能な文字（タイトル・説明文・表の数値・スピーカーノート等）に青い点線枠がつきます。
3. **編集したい文字をクリックして、Wordのように直接キーボードで打ち替えます**（太字 `Ctrl+B` なども使用可能）。
4. 編集が終わったら、左下に現れる緑色の **「💾 変更を保存」ボタン** をクリックすると、編集内容を反映した `index.html` がダウンロードされます。
5. ダウンロードしたファイルを元のフォルダに上書きするだけで、変更が永続的に保存されます！

### 🖨️ PDF出力方法
URLの末尾に `?print-pdf` を付与してブラウザで開き（例：`index.html?print-pdf`）、`Ctrl + P`（印刷）から「PDFに保存」（余白なし・背景のグラフィックにチェック）を選択すると、16:9比率のまま高品質なPDFとして出力できます。

---

## 📊 全42枚スライド構成（アジェンダ＋6セクション中扉付き）

| スライド番号 | 元PDF対応 | スライドタイトル |
| :--- | :--- | :--- |
| **Slide 1** | 原本 P.1 | **ICU 人工呼吸器勉強会（表紙）** |
| **Slide 2** | **新規追加** | **本日の講義プログラム（目次・全6部一覧）** |
| **Slide 3** | **新規追加** | **【中扉 01】第1部：導入・人工呼吸器の二面性と呼吸生理の基礎** |
| Slide 4 | 原本 P.2 | 人工呼吸器って、患者さんにとって「良いもの」？それとも「悪いもの」？ |
| Slide 5 | 原本 P.3 | 人工呼吸器：患者さんの命を守る「良きサポーター」としての役割 |
| Slide 6 | 原本 P.4 | 人工呼吸器の役割 〜生体へのメリット〜 |
| Slide 7 | 原本 P.5 | 人工呼吸中の合併症 〜デメリット〜 |
| Slide 8 | 原本 P.6 | 自然呼吸時と人工呼吸時の違い 〜陰圧と陽圧〜 |
| Slide 9 | 原本 P.7 | 人工呼吸器：命を救う「サポーター」か、それとも「害」か？ |
| **Slide 10** | **新規追加** | **【中扉 02】第2部：機器安全と日常・使用中点検の実践** |
| Slide 11 | 原本 P.8 | 使用中点検における必須7項目チェックリスト |
| Slide 12 | 原本 P.9 | 使用中点検① 〜ハードウェア安全（電源と配管）〜 |
| Slide 13 | 原本 P.10 | 呼吸器回路の構造 ＜感染症センター 呼吸器回路（人工鼻）＞ |
| Slide 14 | 原本 P.11 | 使用中点検②-B 〜カフ圧管理の重要性〜 |
| Slide 15 | 原本 P.12 | 使用中点検③-A 〜設定・実測値・警報のトリプルチェック〜 |
| **Slide 16** | **新規追加** | **【中扉 03】第3部：換気様式（VCV / PCV）と換気モード・実機画面の解読** |
| Slide 17 | 原本 P.13 | 送気規定の基礎：従量式（VCV）vs 従圧式（PCV） |
| Slide 18 | 原本 P.14 | 全モードに付加される「PEEP」の光と影 |
| Slide 19 | 原本 P.15 | A/C（Assist/Control）の動作原理と波形 |
| Slide 20 | 原本 P.16 | Dräger Savina 300 実機画面：PC-AC（従圧式補助調節換気） |
| Slide 21 | 原本 P.17 | PC-AC 実機画面の読み解き（吸気・呼気時間計算と自発トリガー） |
| Slide 22 | 原本 P.18 | CPAP（持続的気道陽圧）の特徴 |
| Slide 23 | 原本 P.19 | PSV（圧支持換気）とターミネーション |
| Slide 24 | 原本 P.20 | Dräger Savina 300 実機画面：SPN-CPAP/PS の読み解き |
| Slide 25 | 原本 P.21 | アプニア換気（Apnea Ventilation）の機能 |
| **Slide 26** | **新規追加** | **【中扉 04】第4部：アラーム対応の原則とデュアル・アセスメント** |
| Slide 27 | 原本 P.22 | 「患者」と「回路」のデュアル・アセスメント |
| Slide 28 | 原本 P.23 | 分時換気量（MV）アラームの特定と対応 |
| Slide 29 | 原本 P.24 | 気道内圧アラームの特定と対応 |
| Slide 30 | 原本 P.25 | 無呼吸・頻呼吸アラームの特定と対応 |
| Slide 31 | 原本 P.26 | アラーム原因とアクション・マトリックス |
| **Slide 32** | **新規追加** | **【中扉 05】第5部：データ統合・血液ガスとパラメータ調整のロジック** |
| Slide 33 | 原本 P.27 | フィジカルからデータへの統合的アセスメント |
| Slide 34 | 原本 P.28 | P/F比の評価とPEEP / FiO₂の調整 |
| Slide 35 | 原本 P.29 | 血液ガスデータとpHのバランス |
| Slide 36 | 原本 P.30 | 酸塩基平衡のメカニズム：pHシーソーモデル |
| Slide 37 | 原本 P.31 | PCO₂を目標とした人工呼吸器のパラメーター調整 |
| Slide 38 | 原本 P.32 | Key Takeaways（本日の3大鉄則） |
| **Slide 39** | **新規追加** | **【中扉 06】第6部：総括・アンケート ＆ 付録（臨床基準値リファレンス）** |
| Slide 40 | 原本 P.33-34 | お疲れ様でした！ICU呼吸器勉強会 まとめ＆アンケート |
| Slide 41 | 付録① (P.34) | 人工呼吸器の基本設定：圧・換気量パラメータの基準値 |
| Slide 42 | 付録② (P.35) | 肺力学・呼吸生理パラメータ：状態評価とウィーニング（離脱）の指標 |

---

## 🎨 後から差し替え可能な医学図解プレースホルダー一覧（任意・全15点）

現在、実機写真・モニター画面・キャラクター画像以外の医学図解枠には、**そのままでも美しく表示されるインラインSVG図解＋プレースホルダー枠**を内蔵していますが、`assets/` フォルダに以下のファイル名で画像を配置すると、HTMLを書き換えることなく自動的に画像へ切り替わる仕組み（`onerror` フォールバック付き）になっています。別で作成したイラストを入れる場合は、以下のファイル名で `assets/` に保存してください。

| 配置ファイル名 | 使用スライド | 図解の内容 | 画像生成用プロンプト例 |
| :--- | :--- | :--- | :--- |
| `assets/fig_gas_exchange.png` | Slide 6 | 肺胞と毛細血管のガス交換（O₂取り込みとCO₂排出） | `Clean medical vector diagram of pulmonary alveolus and capillary gas exchange, O2 red arrows entering blood, CO2 blue arrows leaving, soft muted colors, white background, no text.` |
| `assets/fig_complications.png` | Slide 7 | 陽圧換気による合併症（VILI・VAP・循環抑制） | `Clean medical infographic diagram showing mechanical ventilation complications: barotrauma/volutrauma in lungs, VAP bacteria along endotracheal tube, and decreased venous return to heart, flat vector style, white background, no text.` |
| `assets/fig_neg_pressure.png` | Slide 8 | 自然呼吸（陰圧呼吸：横隔膜収縮と静脈還流促進） | `Clean medical diagram of normal negative pressure breathing, diaphragm contracting downward, ribcage expanding, blue arrows showing air drawn into lungs and venous return to heart, white background, no text.` |
| `assets/fig_pos_pressure.png` | Slide 8 | 人工呼吸（陽圧換気：機械によるガス押し込み） | `Clean medical diagram of positive pressure mechanical ventilation, ventilator pushing air into lungs via endotracheal tube, intrathoracic pressure increasing, orange/red arrows, white background, no text.` |
| `assets/fig_power_check.png` | Slide 12 | 非常用電源（赤コンセント）とバッテリー確認 | `Clean medical hospital illustration of a red emergency power outlet (3-prong hospital grade) with a ventilator power plug securely connected and a green battery charging icon, flat vector style, white background, no text.` |
| `assets/fig_gas_check.png` | Slide 12 | 医療ガス配管（酸素・圧縮空気）の接続点検 | `Clean medical illustration of hospital wall medical gas outlets (Yellow for O2, White/Black for Medical Air in JIS color code) securely connected with high-pressure hoses, flat vector style, white background, no text.` |
| `assets/fig_cuff_low.png` | Slide 14 | カフ圧不足（20 cmH₂O未満：垂れ込み・VAP・リーク） | `Medical cross-section diagram of trachea and endotracheal tube with an under-inflated cuff (<20 cmH2O), showing pooled secretions dripping past the cuff into the lungs and air leak arrows upward, flat vector, white background, no text.` |
| `assets/fig_cuff_high.png` | Slide 14 | カフ圧過剰（30 cmH₂O超：気管粘膜虚血・潰瘍） | `Medical cross-section diagram of trachea and endotracheal tube with an over-inflated cuff (>30 cmH2O), pressing tightly against tracheal mucosa causing red/purple ischemic zones, flat vector, white background, no text.` |
| `assets/fig_vcv.png` | Slide 17 | 従量式（VCV）：巨大シリンジによる定量送気イメージ | `Clean medical conceptual diagram of Volume Controlled Ventilation (VCV), a large calibrated syringe pushing a fixed volume (500mL) of air into a lung model, flat vector style, muted blue palette, white background, no text.` |
| `assets/fig_pcv.png` | Slide 17 | 従圧式（PCV）：送風ファンと圧力計による定圧送気イメージ | `Clean medical conceptual diagram of Pressure Controlled Ventilation (PCV), a constant-pressure blower fan and pressure gauge maintaining 20 cmH2O into a lung model, flat vector style, muted green palette, white background, no text.` |
| `assets/fig_peep_effect.png` | Slide 18 | PEEPの作用（呼気終末の肺胞虚脱防止ビフォーアフター） | `Clean medical comparison diagram of alveoli at end-expiration: collapsed atelectatic alveolus without PEEP on the left vs open inflated alveolus maintained by PEEP positive pressure arrows on the right, flat vector, white background, no text.` |
| `assets/fig_integrated_assess.png` | Slide 33 | フィジカル所見・バイタル・血液ガスの統合アセスメント | `Clean medical diagram showing integration of bedside physical assessment (stethoscope, chest inspection), vital signs monitor (SpO2, EtCO2), and arterial blood gas syringe leading to ventilator optimization, flat vector, white background, no text.` |
| `assets/fig_alveoli_o2.png` | Slide 34 | P/F比と酸素化（FiO₂とPEEPによる肺胞リクルートメント） | `Clean medical diagram of pulmonary oxygenation showing FiO2 increasing oxygen concentration inside alveolus and PEEP recruiting collapsed alveoli to increase capillary gas exchange surface area, flat vector, white background, no text.` |
| `assets/fig_ph_seesaw.png` | Slide 36 | 酸塩基平衡（pH 7.40 シーソーとHCO₃⁻ / PaCO₂のバランス） | `Clean medical educational diagram of a balance seesaw representing blood pH 7.40 equilibrium, with metabolic HCO3- (kidneys) on the left and respiratory PaCO2 (lungs) on the right, flat vector style, white background, no text.` |
| `assets/fig_lung_mechanics.png` | Slide 42 | 肺力学（コンプライアンス＝肺の柔らかさ・レジスタンス＝気道抵抗） | `Clean medical diagram of respiratory mechanics showing airway resistance (Raw) in the bronchial tubes and lung compliance (Cst) as elastic expansion of the alveoli, flat vector style, white background, no text.` |
