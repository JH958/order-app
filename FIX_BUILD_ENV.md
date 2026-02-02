# 빌드 환경 변수 문제 해결

## 현재 문제
빌드 로그에 `VITE_API_BASE_URL: NOT SET`이 표시됨

## 원인
1. `.env.production` 파일이 Git에 커밋되지 않았거나
2. Render.com의 빌드 환경에서 `.env.production` 파일을 읽지 못하거나
3. Render.com의 환경 변수가 빌드 시점에 전달되지 않음

## 해결 방법

### 방법 1: vite.config.js에서 환경 변수 하드코딩 (가장 확실한 방법)

`vite.config.js` 파일을 수정하여 프로덕션 환경에서 기본값을 설정했습니다.

**장점:**
- 가장 확실하고 안정적
- Git에 커밋되어 버전 관리 가능
- 빌드 시점에 항상 환경 변수가 주입됨

**단점:**
- 백엔드 URL 변경 시 코드 수정 필요

### 방법 2: Render.com 빌드 명령어 수정

Render.com 프론트엔드 서비스에서:

1. **Settings** 탭 클릭
2. **Build Command** 수정:
   ```
   npm install && VITE_API_BASE_URL=https://order-app-backend-i18w.onrender.com/api npm run build
   ```
3. **Save Changes** 클릭
4. 재배포

### 방법 3: .env.production 파일 Git에 추가

1. `.env.production` 파일이 있는지 확인
2. Git에 추가:
   ```bash
   git add ui/.env.production
   git commit -m "Add .env.production"
   git push
   ```
3. 재배포

## 권장 해결 방법

**방법 1 (vite.config.js 수정)**을 권장합니다. 이미 코드를 수정했으므로:

1. Git에 커밋 및 푸시
2. Render.com에서 재배포
3. 빌드 로그 확인

## 다음 단계

1. 변경사항을 Git에 커밋:
   ```bash
   git add ui/vite.config.js
   git commit -m "Fix: Set VITE_API_BASE_URL in vite.config.js for production"
   git push
   ```

2. Render.com에서 재배포:
   - 프론트엔드 서비스 → **Manual Deploy** → **Deploy latest commit**

3. 빌드 로그 확인:
   - 이제 `VITE_API_BASE_URL: https://order-app-backend-i18w.onrender.com/api`가 표시되어야 함

4. 배포 후 확인:
   - 콘솔에 `VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api` 표시
   - 메뉴가 정상적으로 로드됨
