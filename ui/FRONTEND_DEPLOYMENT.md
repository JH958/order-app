# 프론트엔드 Render.com 배포 가이드

## 📋 배포 전 확인사항

### 1. 코드 상태 확인
✅ **이미 완료된 설정:**
- `ui/src/utils/api.js`: 환경 변수 `VITE_API_BASE_URL` 지원
- `ui/package.json`: 빌드 및 preview 스크립트 설정 완료
- API 호출이 환경 변수를 통해 백엔드 URL 설정 가능

### 2. 백엔드 서버 URL 확인
배포 전에 백엔드 서버가 배포되어 있고 URL을 알고 있어야 합니다.
- 예: `https://coffee-order-server.onrender.com`

## 🚀 배포 방법

### 방법 1: Static Site로 배포 (권장)

Static Site는 정적 파일만 서빙하므로 가장 빠르고 비용 효율적입니다.

#### 1단계: Render.com 대시보드 접속
1. [Render.com](https://render.com)에 로그인
2. **New +** 버튼 클릭
3. **Static Site** 선택

#### 2단계: GitHub 저장소 연결
1. **Connect a repository** 클릭
2. GitHub 계정 연결 (아직 안 했다면)
3. 저장소 선택 (`order-app`)

#### 3단계: 빌드 설정
다음 정보를 입력:

- **Name**: `coffee-order-app` (원하는 이름)
- **Branch**: `main` (또는 `master`)
- **Root Directory**: `ui`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### 4단계: 환경 변수 설정
**Environment Variables** 섹션에서 다음 환경 변수 추가:

```
Key: VITE_API_BASE_URL
Value: https://coffee-order-server.onrender.com/api
```

> ⚠️ **중요**: 백엔드 서버 URL을 정확히 입력하세요. `/api`까지 포함해야 합니다.

#### 5단계: 배포
1. **Create Static Site** 클릭
2. 배포가 완료될 때까지 대기 (약 2-3분)
3. 배포 완료 후 제공되는 URL 확인 (예: `https://coffee-order-app.onrender.com`)

---

### 방법 2: Web Service로 배포

Static Site가 작동하지 않거나 Node.js 환경이 필요한 경우 사용합니다.

#### 1단계: Render.com 대시보드 접속
1. **New +** 버튼 클릭
2. **Web Service** 선택

#### 2단계: GitHub 저장소 연결
- 동일한 저장소 선택

#### 3단계: 서비스 설정
- **Name**: `coffee-order-app`
- **Region**: 백엔드와 동일한 지역
- **Branch**: `main` (또는 `master`)
- **Root Directory**: `ui`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Plan**: Free tier 선택

#### 4단계: 환경 변수 설정
```
VITE_API_BASE_URL=https://coffee-order-server.onrender.com/api
PORT=10000
```

#### 5단계: 배포
1. **Create Web Service** 클릭
2. 배포 완료 대기

---

## ✅ 배포 후 확인사항

### 1. 빌드 로그 확인
- Render 대시보드의 **Logs** 탭에서 빌드 과정 확인
- 오류가 있다면 로그에서 확인

### 2. 환경 변수 확인
- **Environment** 탭에서 `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인

### 3. 기능 테스트
배포된 사이트에서 다음을 확인:
- [ ] 메뉴 목록이 표시되는가?
- [ ] 주문이 정상적으로 처리되는가?
- [ ] 관리자 화면이 정상적으로 작동하는가?
- [ ] 이미지가 표시되는가?

### 4. 브라우저 콘솔 확인
- F12를 눌러 개발자 도구 열기
- Console 탭에서 오류 메시지 확인
- Network 탭에서 API 호출이 올바른 URL로 가는지 확인

---

## 🔧 문제 해결

### 문제 1: API 호출 실패
**증상**: 메뉴가 로드되지 않거나 주문이 실패함

**해결 방법**:
1. `VITE_API_BASE_URL` 환경 변수가 올바른지 확인
2. 백엔드 서버가 실행 중인지 확인
3. CORS 설정 확인 (백엔드 서버의 `FRONTEND_URL` 환경 변수)

### 문제 2: 이미지가 표시되지 않음
**증상**: 메뉴 이미지가 보이지 않음

**해결 방법**:
1. `ui/public/images/` 폴더의 이미지가 Git에 포함되어 있는지 확인
2. 이미지 경로가 상대 경로(`/images/...`)로 설정되어 있는지 확인

### 문제 3: 빌드 실패
**증상**: 배포가 실패함

**해결 방법**:
1. 로컬에서 빌드 테스트:
   ```bash
   cd ui
   npm install
   npm run build
   ```
2. 빌드 오류 메시지 확인
3. `package.json`의 의존성 확인

### 문제 4: 환경 변수가 적용되지 않음
**증상**: 여전히 로컬 API로 요청을 보냄

**해결 방법**:
1. 환경 변수 이름이 `VITE_`로 시작하는지 확인
2. 환경 변수 변경 후 **Manual Deploy** → **Deploy latest commit** 실행
3. 빌드 시 환경 변수가 주입되는지 확인

---

## 📝 배포 체크리스트

배포 전:
- [ ] 백엔드 서버가 배포되어 있고 URL을 알고 있음
- [ ] 로컬에서 `npm run build` 성공
- [ ] `ui/public/images/` 폴더의 이미지가 Git에 포함됨
- [ ] GitHub에 최신 코드가 푸시됨

배포 중:
- [ ] Root Directory가 `ui`로 설정됨
- [ ] Build Command가 `npm install && npm run build`로 설정됨
- [ ] Publish Directory가 `dist`로 설정됨
- [ ] `VITE_API_BASE_URL` 환경 변수가 설정됨

배포 후:
- [ ] 사이트가 정상적으로 로드됨
- [ ] API 호출이 성공함
- [ ] 모든 기능이 정상 작동함

---

## 🔄 업데이트 배포

코드를 수정한 후 재배포하려면:

1. GitHub에 푸시:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. Render는 자동으로 재배포합니다 (Auto-Deploy 활성화 시)
3. 또는 수동으로 **Manual Deploy** → **Deploy latest commit** 클릭

---

## 💡 추가 팁

### 커스텀 도메인 설정
1. Render 대시보드에서 서비스 선택
2. **Settings** → **Custom Domain** 섹션
3. 도메인 추가 및 DNS 설정

### 환경별 설정
개발/스테이징/프로덕션 환경을 분리하려면:
- 각 환경별로 별도의 Static Site 생성
- 환경별로 다른 `VITE_API_BASE_URL` 설정

### 성능 최적화
- 이미지 최적화 (WebP 형식 사용)
- 코드 스플리팅 (Vite 자동 처리)
- CDN 사용 (Render Static Site는 자동 CDN 제공)
