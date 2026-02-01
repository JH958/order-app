# 환경 변수 설정 가이드 (수정 필요)

## 현재 문제
- 프론트엔드가 `/api/menus`로 요청 (상대 경로)
- 404 오류 발생
- 환경 변수가 빌드에 포함되지 않았거나 잘못 설정됨

## 해결 방법

### 프론트엔드 환경 변수 설정

Render.com 프론트엔드 서비스에서:

1. **Environment** 탭으로 이동
2. 다음 환경 변수 확인/추가:

```
Key: VITE_API_BASE_URL
Value: https://order-app-backend-i18w.onrender.com/api
```

**중요:**
- Key는 정확히 `VITE_API_BASE_URL` (대소문자 구분)
- Value는 `https://order-app-backend-i18w.onrender.com/api` (백엔드 URL + `/api`)
- 마지막 슬래시 없이 입력

3. 환경 변수 추가/수정 후:
   - **반드시 재배포 필요**
   - **Manual Deploy** → **Deploy latest commit** 클릭
   - 배포 완료 대기 (약 2-3분)

### 백엔드 환경 변수 확인

Render.com 백엔드 서비스에서:

1. **Environment** 탭으로 이동
2. 다음 환경 변수 확인:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL>
FRONTEND_URL=https://order-app-frontend-pbph.onrender.com
```

3. `FRONTEND_URL`이 없다면 추가:
   - Key: `FRONTEND_URL`
   - Value: `https://order-app-frontend-pbph.onrender.com`

4. 환경 변수 수정 후:
   - **Manual Deploy** → **Deploy latest commit** 클릭
   - 배포 완료 대기

## 재배포 후 확인

1. 프론트엔드 재배포 완료 대기
2. 브라우저에서 **강력 새로고침** (Ctrl + Shift + R)
3. 개발자 도구 콘솔에서 다음 로그 확인:
   - `API_BASE_URL: https://order-app-backend-i18w.onrender.com/api`
   - `Fetching menus from: https://order-app-backend-i18w.onrender.com/api/menus`

## 예상 결과

재배포 후:
- ✅ 콘솔에 `API_BASE_URL:` 로그가 올바른 URL로 표시됨
- ✅ `/api/menus` 대신 `https://order-app-backend-i18w.onrender.com/api/menus`로 요청
- ✅ 메뉴가 정상적으로 로드됨
