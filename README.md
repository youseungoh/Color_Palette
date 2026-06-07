# Color_Palette

🔗 **[https://youseungoh.github.io/Color_Palette/](https://youseungoh.github.io/Color_Palette/)**

---

## 소개

웹 디자이너 · 크리에이터를 위한 컬러 팔레트 툴입니다.  
원형 컬러휠로 색상을 선택하고, 다양한 팔레트를 자동으로 생성합니다.  
HEX · RGB · HSL · HSB · CMYK 값을 한 번에 확인하고 복사할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 🎨 인터랙티브 컬러휠 | HSB 기반 원형 휠, 드래그로 색상 선택 |
| 💡 밝기 슬라이더 | 명도 실시간 조절 |
| 🔢 HEX 직접 입력 | 프리뷰 카드 & 정보 패널 양쪽에서 입력 가능 |
| 📋 색상값 복사 | HEX / RGB / HSL / HSB / CMYK 클릭 한 번으로 복사 |
| 🎭 팔레트 자동 생성 | 보색 · 유사색 · 트라이어드 · 모노크롬 · 분리보색 |
| ♿ WCAG 접근성 검사 | 흰/검정 배경 대비율, AA · AAA 등급 표시 |
| ⭐ 트렌드 프리셋 | Pantone 2025 등 8종 큐레이션 팔레트 |
| 🎯 추천 색상 | Rose Gold · Mint · Teal 등 16색 빠른 선택 |
| 💾 팔레트 저장 | 브라우저 로컬 저장, 최대 20개 |
| 📤 내보내기 | CSS 변수 / JSON 파일 다운로드 |
| 📱 반응형 | PC · 태블릿 · 모바일 완전 지원 |

---

## 팔레트 유형

- **Complementary (보색)** — 색상환 반대편 색, 강렬한 대비
- **Analogous (유사색)** — 인접한 색, 부드럽고 자연스러운 조화
- **Triadic (트라이어드)** — 120° 간격 3색, 다채롭고 균형 있는 조합
- **Monochromatic (모노크롬)** — 같은 색상의 밝기 단계, 세련된 통일감
- **Split (분리보색)** — 보색 양옆 색, 생동감 있고 부드러운 대비

---

## 사용 방법

1. `index.html`, `style.css`, `script.js` 를 같은 폴더에 저장
2. `index.html` 을 브라우저로 열기 (별도 설치 없음)
3. 컬러휠 클릭·드래그 또는 HEX 값 직접 입력으로 색상 선택
4. 팔레트 유형 선택 → Copy All 또는 Save

---

## 파일 구조

```
Color_Palette/
├── index.html   # 마크업
├── style.css    # 스타일 (반응형 포함)
└── script.js    # 색상 로직 · 인터랙션
```

---

## 기술 스택

- **HTML5** — Canvas API (컬러휠 렌더링)
- **CSS3** — Grid · Flexbox · Media Query
- **Vanilla JS** — 외부 라이브러리 없음

---

## 반응형 브레이크포인트

| 구간 | 레이아웃 |
|------|---------|
| `> 900px` | 사이드바 + 컬러휠 + 정보패널 (3열) |
| `601px ~ 900px` | 컬러휠 + 정보패널 (2열), 사이드바 버튼 |
| `≤ 600px` | 1열 세로 스택, 프리뷰 카드 최상단 |

---

## 크레딧

© Produced by **You Seungoh**  
📧 [yso21@naver.com](mailto:yso21@naver.com)  
▶️ [youtube.com/@pianocanvas](https://youtube.com/@pianocanvas) — healing Pop Music
