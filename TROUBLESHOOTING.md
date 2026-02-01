# 배포 문제 해결 가이드

## 문제: "메뉴를 불러올 수 없습니다" 오류

### 원인 분석

1. **프론트엔드 환경 변수 미설정**
   - `VITE_API_BASE_URL`이 설정되지 않았거나 잘못 설정됨
   - 빌드 시점에 환경 변수가 주입되지 않음

2. **백엔드 CORS 설정 문제**
   - `FRONTEND_URL` 환경 변수가 설정되지 않아서 CORS 오류 발생

3. **백엔드 서버 슬립 모드**
   - Render.com 무료 플랜은 15분 비활성 시 슬립 모드로 전환
   - 첫 요청 시 깨어나는데 시간이 걸릴 수 있음

---

## 해결 방법

### 1단계: 백엔드 서버 상태 확인

1. Render.com 대시보드에서 백엔드 서비스 찾기
2. 서비스 클릭 → **Logs** 탭 확인
3. 서버가 실행 중인지 확인
4. 서버가 슬립 모드라면:
   - **Manual Deploy** → **Deploy latest commit** 클릭하여 재배포
   - 또는 서비스 URL에 직접 접속하여 깨우기

### 2단계: 백엔드 환경 변수 확인 및 수정

1. 백엔드 서비스 대시보드로 이동
2. **Environment** 탭 클릭
3. 다음 환경 변수들이 설정되어 있는지 확인:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL>
FRONTEND_URL=https://order-app-frontend-pbph.onrender.com
```

4. **`FRONTEND_URL`이 없다면 추가:**
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://order-app-frontend-pbph.onrender.com`
   - (프론트엔드 실제 URL로 변경)

5. 환경 변수 추가/수정 후:
   - **Manual Deploy** → **Deploy latest commit** 클릭하여 재배포

### 3단계: 프론트엔드 환경 변수 확인 및 수정

1. 프론트엔드 서비스 대시보드로 이동
2. **Environment** 탭 클릭
3. 다음 환경 변수가 설정되어 있는지 확인:

```
VITE_API_BASE_URL=https://your-backend-server.onrender.com/api
```

4. **`VITE_API_BASE_URL`이 없다면 추가:**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-server.onrender.com/api`
   - (백엔드 서버 실제 URL로 변경, `/api` 포함)

5. 환경 변수 추가/수정 후:
   - **Manual Deploy** → **Deploy latest commit** 클릭하여 재배포
   - ⚠️ **중요**: Vite는 빌드 시점에 환경 변수를 주입하므로 재배포 필수

### 4단계: 백엔드 API 엔드포인트 테스트

브라우저에서 직접 접속하여 테스트:

```
https://your-backend-server.onrender.com/api/menus
```

- 정상: JSON 형식의 메뉴 데이터가 표시됨
- 오류: 에러 메시지 확인

### 5단계: 프론트엔드 재배포

환경 변수를 수정한 후 반드시 재배포해야 합니다:

1. 프론트엔드 서비스 대시보드
2. **Manual Deploy** → **Deploy latest commit** 클릭
3. 배포 완료 대기 (약 2-3분)
4. 사이트 새로고침

---

## 빠른 체크리스트

- [ ] 백엔드 서버가 실행 중인가?
- [ ] 백엔드에 `FRONTEND_URL` 환경 변수가 설정되어 있는가?
- [ ] 프론트엔드에 `VITE_API_BASE_URL` 환경 변수가 설정되어 있는가?
- [ ] 환경 변수 값이 올바른가? (URL 형식, `/api` 포함 여부)
- [ ] 환경 변수 수정 후 재배포를 했는가?

---

## 추가 디버깅 방법

### 브라우저 개발자 도구 사용

1. 프론트엔드 사이트에서 **F12** 눌러 개발자 도구 열기
2. **Console** 탭에서 오류 메시지 확인
3. **Network** 탭에서 API 요청 확인:
   - 요청 URL이 올바른가?
   - 응답 상태 코드는 무엇인가? (200, 404, 500 등)
   - CORS 오류가 있는가?

### 백엔드 로그 확인

1. 백엔드 서비스 → **Logs** 탭
2. API 요청이 들어오는지 확인
3. 에러 메시지 확인

---

## 예상되는 오류와 해결책

### 오류 1: CORS 오류
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**해결**: 백엔드에 `FRONTEND_URL` 환경 변수 추가 및 재배포

### 오류 2: 404 Not Found
```
GET https://.../api/menus 404
```
**해결**: `VITE_API_BASE_URL` 값 확인 (백엔드 URL + `/api`)

### 오류 3: Network Error
```
Failed to fetch
```
**해결**: 백엔드 서버가 슬립 모드일 수 있음. 재배포 또는 서버 깨우기

### 오류 4: 빌드 시 환경 변수 오류
```
VITE_API_BASE_URL is not defined
```
**해결**: 프론트엔드 환경 변수에 `VITE_API_BASE_URL` 추가 및 재배포
