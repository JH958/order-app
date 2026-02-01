# 디버깅 단계별 가이드

## 현재 상황
환경 변수를 설정했지만 여전히 "메뉴를 불러올 수 없습니다" 오류가 발생합니다.

## 단계별 확인 방법

### 1단계: 브라우저 개발자 도구로 실제 오류 확인

1. 프론트엔드 사이트 접속: `https://order-app-frontend-pbph.onrender.com`
2. **F12** 키를 눌러 개발자 도구 열기
3. **Console** 탭 확인:
   - `API_BASE_URL:` 로그 확인 - 어떤 URL이 사용되고 있는지 확인
   - 빨간색 오류 메시지 확인
   - CORS 오류가 있는지 확인
4. **Network** 탭 확인:
   - `menus` 요청 찾기
   - 요청 URL 확인 (올바른 백엔드 URL인지)
   - 응답 상태 코드 확인 (200, 404, 500, CORS 오류 등)
   - 응답 내용 확인

### 2단계: 백엔드 API 직접 테스트

브라우저에서 백엔드 API에 직접 접속:

```
https://your-backend-server.onrender.com/api/menus
```

**예상 결과:**
- ✅ 정상: JSON 형식의 메뉴 데이터가 표시됨
- ❌ 오류: 에러 메시지가 표시됨

**오류 종류별 해결책:**
- `404 Not Found`: 백엔드 서버가 실행되지 않았거나 URL이 잘못됨
- `500 Internal Server Error`: 백엔드 서버 내부 오류 (로그 확인 필요)
- `Cannot GET /api/menus`: 라우트 설정 문제
- 연결 시간 초과: 서버가 슬립 모드일 수 있음

### 3단계: 백엔드 서버 상태 확인

1. Render.com 대시보드 → 백엔드 서비스
2. **Logs** 탭 확인:
   - 서버가 실행 중인지 확인
   - 에러 메시지가 있는지 확인
   - 데이터베이스 연결이 성공했는지 확인
3. **Metrics** 탭 확인:
   - CPU, 메모리 사용량 확인
   - 요청이 들어오는지 확인

### 4단계: 환경 변수 재확인

#### 프론트엔드 환경 변수
1. 프론트엔드 서비스 → **Environment** 탭
2. 다음이 정확히 설정되어 있는지 확인:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-server.onrender.com/api
   ```
3. **주의사항:**
   - Key는 정확히 `VITE_API_BASE_URL` (대소문자 구분)
   - Value는 백엔드 URL + `/api` (마지막 슬래시 없이)
   - `https://`로 시작해야 함

#### 백엔드 환경 변수
1. 백엔드 서비스 → **Environment** 탭
2. 다음이 설정되어 있는지 확인:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<Internal Database URL>
   FRONTEND_URL=https://order-app-frontend-pbph.onrender.com
   ```
3. **주의사항:**
   - `FRONTEND_URL`은 프론트엔드 URL과 정확히 일치해야 함
   - `https://`로 시작해야 함
   - 마지막 슬래시 없이 입력

### 5단계: 재배포 확인

환경 변수를 수정했다면 **반드시 재배포**해야 합니다:

#### 프론트엔드 재배포
1. 프론트엔드 서비스 → **Manual Deploy** → **Deploy latest commit**
2. 배포 완료 대기 (약 2-3분)
3. 배포 로그에서 빌드 성공 확인

#### 백엔드 재배포
1. 백엔드 서비스 → **Manual Deploy** → **Deploy latest commit**
2. 배포 완료 대기 (약 2-3분)
3. 로그에서 서버 시작 확인

### 6단계: 브라우저 캐시 삭제

브라우저가 이전 버전을 캐시했을 수 있습니다:

1. **Ctrl + Shift + R** (강력 새로고침)
2. 또는 개발자 도구 → **Network** 탭 → **Disable cache** 체크 → 새로고침

## 일반적인 문제와 해결책

### 문제 1: CORS 오류
**증상:** 브라우저 콘솔에 "CORS policy" 오류
**해결:**
- 백엔드에 `FRONTEND_URL` 환경 변수 추가
- 백엔드 재배포

### 문제 2: 404 Not Found
**증상:** Network 탭에서 404 응답
**해결:**
- `VITE_API_BASE_URL` 값 확인 (백엔드 URL + `/api`)
- 프론트엔드 재배포

### 문제 3: Network Error / Failed to fetch
**증상:** 연결 자체가 실패
**해결:**
- 백엔드 서버가 실행 중인지 확인
- 백엔드 서버 URL이 올바른지 확인
- 서버가 슬립 모드라면 재배포로 깨우기

### 문제 4: 환경 변수가 적용되지 않음
**증상:** 콘솔에 `API_BASE_URL: /api` (환경 변수 미적용)
**해결:**
- 환경 변수 Key가 정확히 `VITE_API_BASE_URL`인지 확인
- 프론트엔드 재배포 (Vite는 빌드 시점에 환경 변수 주입)

## 다음 단계

위 단계를 따라 확인한 후, 다음 정보를 알려주세요:
1. 브라우저 콘솔의 오류 메시지
2. Network 탭의 요청 URL과 응답 상태 코드
3. 백엔드 API 직접 접속 결과
4. 백엔드 로그의 에러 메시지

이 정보를 바탕으로 정확한 해결책을 제시하겠습니다.
