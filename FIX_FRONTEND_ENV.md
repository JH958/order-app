# 프론트엔드 환경 변수 설정 가이드

## 현재 문제
- 콘솔에 `VITE_API_BASE_URL env: undefined` 표시
- `API_BASE_URL: /api` (상대 경로 사용)
- `/api/menus`와 `/api/orders`에 404 오류 발생

## 원인
프론트엔드의 `VITE_API_BASE_URL` 환경 변수가 Render.com에 설정되지 않았거나, 재배포를 하지 않아서 빌드에 반영되지 않았습니다.

## 해결 방법

### 1단계: Render.com 프론트엔드 서비스로 이동

1. Render.com 대시보드에 로그인
2. **프론트엔드 서비스** 찾기 (예: `order-app-frontend-pbph`)
3. 프론트엔드 서비스 클릭

### 2단계: Environment 탭으로 이동

1. 프론트엔드 서비스 대시보드에서
2. 상단 또는 왼쪽 메뉴에서 **"Environment"** 탭 클릭
   - 또는 **"환경 변수"**, **"Environment Variables"** 라고 표시될 수 있습니다

### 3단계: 환경 변수 확인

현재 설정된 환경 변수 목록을 확인합니다.

### 4단계: VITE_API_BASE_URL 환경 변수 추가/수정

#### 환경 변수가 없는 경우:
1. **"Add Environment Variable"** 또는 **"Add Variable"** 버튼 클릭
   - 또는 **"+"** 버튼 클릭

2. **Key** 필드에 입력:
   ```
   VITE_API_BASE_URL
   ```
   - ⚠️ **중요**: 대소문자 정확히 `VITE_API_BASE_URL` (모두 대문자)
   - `VITE_` 접두사 필수

3. **Value** 필드에 입력:
   ```
   https://order-app-backend-i18w.onrender.com/api
   ```
   - 백엔드 URL: `https://order-app-backend-i18w.onrender.com`
   - 끝에 `/api` 추가
   - `https://`로 시작
   - 마지막 슬래시(`/`) 없이 입력

4. **"Save"** 또는 **"Add"** 버튼 클릭

#### 환경 변수가 있는 경우:
1. `VITE_API_BASE_URL` 옆의 **"Edit"** 또는 **"✏️"** 아이콘 클릭
2. **Value** 필드 확인:
   - 올바른 값: `https://order-app-backend-i18w.onrender.com/api`
   - 잘못된 값 예시:
     - `/api` (상대 경로)
     - `https://order-app-backend-i18w.onrender.com` (`/api` 없음)
     - `http://order-app-backend-i18w.onrender.com/api` (`http` 사용)
3. 필요시 수정 후 **"Save"** 클릭

### 5단계: 재배포 (필수!)

환경 변수를 추가/수정한 후 **반드시 재배포**해야 합니다:

1. 프론트엔드 서비스 대시보드에서
2. 상단의 **"Manual Deploy"** 버튼 클릭
3. **"Deploy latest commit"** 선택
4. 배포 완료 대기 (약 2-3분)
   - 빌드 로그에서 성공 메시지 확인

### 6단계: 배포 후 확인

1. 배포 완료 후 프론트엔드 사이트 접속: `https://order-app-frontend-pbph.onrender.com`
2. **강력 새로고침** (Ctrl + Shift + R)
3. **F12**로 개발자 도구 열기
4. **Console** 탭에서 다음 로그 확인:

```
API_BASE_URL: https://order-app-backend-i18w.onrender.com/api  ← 이렇게 나와야 함!
VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api
Fetching menus from: https://order-app-backend-i18w.onrender.com/api/menus
Response status: 200  ← 404가 아닌 200이어야 함!
Menus loaded: [숫자] items
```

## 환경 변수 설정 예시

### ✅ 올바른 설정
```
Key: VITE_API_BASE_URL
Value: https://order-app-backend-i18w.onrender.com/api
```

### ❌ 잘못된 설정 예시
```
❌ Key: vite_api_base_url (소문자)
❌ Key: API_BASE_URL (VITE_ 접두사 없음)
❌ Value: /api (상대 경로)
❌ Value: https://order-app-backend-i18w.onrender.com (/api 없음)
❌ Value: http://order-app-backend-i18w.onrender.com/api (http 사용)
❌ Value: https://order-app-backend-i18w.onrender.com/api/ (마지막 슬래시)
```

## 중요 사항

### 1. Vite 환경 변수 특성
- Vite는 **빌드 시점**에 환경 변수를 코드에 주입합니다
- 환경 변수를 추가/수정한 후 **반드시 재배포**해야 합니다
- 배포 후 환경 변수를 변경해도 이미 빌드된 파일에는 반영되지 않습니다

### 2. VITE_ 접두사 필수
- Vite는 `VITE_`로 시작하는 환경 변수만 클라이언트에 노출합니다
- `VITE_` 접두사 없이는 작동하지 않습니다

### 3. 재배포 필수
- 환경 변수만 추가/수정하면 적용되지 않습니다
- 반드시 재배포해야 빌드에 반영됩니다

## 문제 해결 체크리스트

- [ ] `VITE_API_BASE_URL` 환경 변수가 추가되었는가?
- [ ] Key가 정확히 `VITE_API_BASE_URL`인가? (대소문자 구분)
- [ ] Value가 `https://order-app-backend-i18w.onrender.com/api`인가?
- [ ] 환경 변수 추가/수정 후 재배포를 했는가?
- [ ] 재배포가 완료되었는가? (빌드 로그 확인)
- [ ] 브라우저에서 강력 새로고침을 했는가? (Ctrl + Shift + R)

## 예상 결과

올바르게 설정하고 재배포하면:

1. ✅ 콘솔에 `API_BASE_URL: https://order-app-backend-i18w.onrender.com/api` 표시
2. ✅ `VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api` 표시
3. ✅ `/api/menus` 대신 `https://order-app-backend-i18w.onrender.com/api/menus`로 요청
4. ✅ 메뉴가 정상적으로 로드됨
5. ✅ 404 오류가 사라짐
