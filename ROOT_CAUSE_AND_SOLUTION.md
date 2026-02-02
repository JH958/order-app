# 근본 원인 및 해결 방법

## 🔍 근본 원인 분석

### 문제 상황
- 백엔드 서버는 정상 작동: `https://order-app-backend-i18w.onrender.com` ✅
- 프론트엔드 콘솔에 `VITE_API_BASE_URL env: undefined` 표시 ❌
- 모든 API 요청이 404 오류 발생 ❌

### 근본 원인
**Render.com의 Static Site에서 환경 변수가 빌드 시점에 제대로 주입되지 않고 있습니다.**

Vite는 빌드 시점에 환경 변수를 코드에 주입합니다. 하지만 Render.com의 Static Site는:
1. 환경 변수를 빌드 프로세스에 자동으로 전달하지 않을 수 있음
2. 빌드 명령어가 환경 변수를 명시적으로 전달하지 않음
3. `.env` 파일이 없어서 빌드 시점에 환경 변수를 읽을 수 없음

## ✅ 해결 방법

### 방법 1: .env.production 파일 생성 (권장)

`.env.production` 파일을 생성하면 Vite가 빌드 시점에 자동으로 이 파일을 읽어 환경 변수를 주입합니다.

**장점:**
- 가장 확실한 방법
- 빌드 명령어 수정 불필요
- Git에 커밋하여 버전 관리 가능

**단점:**
- 백엔드 URL이 변경되면 파일 수정 필요

### 방법 2: 빌드 명령어 수정

Render.com에서 빌드 명령어를 수정하여 환경 변수를 명시적으로 전달:

```
npm install && VITE_API_BASE_URL=https://order-app-backend-i18w.onrender.com/api npm run build
```

**장점:**
- Render.com에서 직접 관리 가능
- 환경 변수 변경 시 재배포만 하면 됨

**단점:**
- 빌드 명령어가 길어짐
- 환경 변수가 빌드 명령어에 노출됨

### 방법 3: Web Service로 변경

Static Site 대신 Web Service로 배포:

**장점:**
- 런타임에 환경 변수 사용 가능
- 환경 변수 변경 시 재시작만 하면 됨

**단점:**
- 추가 설정 필요
- 무료 플랜에서는 슬립 모드 문제

## 🎯 권장 해결 방법: .env.production 파일 사용

### 1단계: .env.production 파일 생성

`ui/.env.production` 파일을 생성하고 다음 내용 추가:

```
VITE_API_BASE_URL=https://order-app-backend-i18w.onrender.com/api
```

### 2단계: Git에 커밋 및 푸시

```bash
git add ui/.env.production
git commit -m "Add .env.production for production build"
git push
```

### 3단계: Render.com에서 재배포

1. 프론트엔드 서비스 → **Manual Deploy** → **Deploy latest commit**
2. 배포 완료 대기 (약 2-3분)

### 4단계: 확인

배포 완료 후:
1. 프론트엔드 사이트 접속
2. 강력 새로고침 (Ctrl + Shift + R)
3. 콘솔에서 확인:
   ```
   API_BASE_URL: https://order-app-backend-i18w.onrender.com/api
   VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api
   ```

## 📋 체크리스트

- [ ] `ui/.env.production` 파일 생성
- [ ] 파일에 `VITE_API_BASE_URL=https://order-app-backend-i18w.onrender.com/api` 추가
- [ ] Git에 커밋 및 푸시
- [ ] Render.com에서 재배포
- [ ] 배포 후 콘솔에서 환경 변수 확인

## 🔄 백엔드 URL 변경 시

나중에 백엔드 URL이 변경되면:
1. `ui/.env.production` 파일 수정
2. Git에 커밋 및 푸시
3. Render.com에서 재배포

## ⚠️ 주의사항

`.env.production` 파일은:
- Git에 커밋해도 됩니다 (프로덕션 URL이므로)
- 민감한 정보(비밀번호 등)는 포함하지 마세요
- 백엔드 URL만 포함하면 됩니다
