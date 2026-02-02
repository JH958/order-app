# 재배포 확인 가이드

## 현재 상황
- 환경 변수는 올바르게 설정됨: `VITE_API_BASE_URL = https://order-app-backend-i18w.onrender.com/api`
- 하지만 콘솔에 `VITE_API_BASE_URL env: undefined` 표시
- 이는 환경 변수가 빌드에 반영되지 않았다는 의미

## 원인
Vite는 **빌드 시점**에 환경 변수를 코드에 주입합니다. 환경 변수를 추가한 후 재배포를 하지 않으면 빌드에 반영되지 않습니다.

## 해결 방법

### 1단계: 재배포 확인

Render.com 프론트엔드 서비스에서:

1. **"Events"** 또는 **"배포 이력"** 탭 확인
2. 환경 변수를 추가한 **이후**에 재배포가 있었는지 확인
3. 마지막 배포 시간 확인

### 2단계: 재배포 실행

환경 변수를 추가한 후 재배포를 하지 않았다면:

1. 프론트엔드 서비스 대시보드에서
2. 상단의 **"Manual Deploy"** 버튼 클릭
3. **"Deploy latest commit"** 선택
4. 배포 시작 대기

### 3단계: 빌드 로그 확인

배포가 시작되면 **"Logs"** 탭에서 빌드 과정 확인:

1. **"Logs"** 탭 클릭
2. 빌드 과정 확인:
   ```
   ==> Building...
   ==> Installing dependencies...
   ==> Building application...
   ```
3. 빌드 성공 메시지 확인:
   ```
   ==> Build successful
   ```

### 4단계: 환경 변수 주입 확인 (선택사항)

빌드 로그에서 환경 변수가 제대로 주입되었는지 확인할 수 있습니다. 하지만 일반적으로 Vite는 빌드 로그에 환경 변수를 표시하지 않으므로, 배포 후 실제 사이트에서 확인하는 것이 더 정확합니다.

### 5단계: 배포 완료 후 확인

1. 배포 완료 대기 (약 2-3분)
2. 프론트엔드 사이트 접속: `https://order-app-frontend-pbph.onrender.com`
3. **강력 새로고침** (Ctrl + Shift + R)
   - 또는 개발자 도구 → Network 탭 → "Disable cache" 체크 → 새로고침
4. **F12**로 개발자 도구 열기
5. **Console** 탭에서 다음 로그 확인:

```
API_BASE_URL: https://order-app-backend-i18w.onrender.com/api  ← 이렇게 나와야 함!
VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api  ← undefined가 아닌 URL이 나와야 함!
Fetching menus from: https://order-app-backend-i18w.onrender.com/api/menus
```

## 문제 해결 체크리스트

- [ ] 환경 변수를 추가한 **이후**에 재배포를 했는가?
- [ ] 재배포가 완료되었는가? (빌드 로그 확인)
- [ ] 브라우저에서 **강력 새로고침**을 했는가? (Ctrl + Shift + R)
- [ ] 브라우저 캐시를 비웠는가? (개발자 도구 → Network → Disable cache)

## 여전히 문제가 발생한다면

### 가능한 원인 1: 빌드 실패
- **Logs** 탭에서 빌드 오류 확인
- 빌드가 실패했다면 오류 메시지 확인

### 가능한 원인 2: 브라우저 캐시
- 브라우저 캐시를 완전히 비우기
- 시크릿 모드에서 테스트
- 다른 브라우저에서 테스트

### 가능한 원인 3: 환경 변수 Key 오타
- Render.com에서 환경 변수 Key를 다시 확인
- 정확히 `VITE_API_BASE_URL`인지 확인 (대소문자 구분)

### 가능한 원인 4: Static Site 설정 문제
- Static Site로 배포한 경우, 빌드 시점에만 환경 변수가 주입됨
- Web Service로 배포한 경우, 런타임에도 환경 변수 사용 가능

## 추가 디버깅

만약 재배포 후에도 여전히 `undefined`가 표시된다면:

1. **Render.com에서 환경 변수 다시 확인**
   - Key가 정확히 `VITE_API_BASE_URL`인지
   - Value가 정확히 `https://order-app-backend-i18w.onrender.com/api`인지
   - 공백이나 특수문자가 없는지

2. **빌드 로그 확인**
   - 빌드가 성공적으로 완료되었는지
   - 빌드 중 오류가 없는지

3. **다른 환경 변수 테스트**
   - 임시로 다른 환경 변수 추가 (예: `VITE_TEST=test`)
   - 재배포 후 콘솔에서 확인
   - 이것도 작동하지 않으면 Render.com 설정 문제일 수 있음
