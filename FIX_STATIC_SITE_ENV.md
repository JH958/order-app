# Render.com Static Site 환경 변수 문제 해결

## 현재 문제
- 환경 변수는 Render.com에 올바르게 설정됨
- 재배포를 했지만 여전히 `VITE_API_BASE_URL env: undefined`
- Static Site에서 환경 변수가 빌드 시점에 주입되지 않음

## 원인
Render.com의 Static Site는 빌드 시점에 환경 변수를 주입해야 하는데, 때로는 제대로 작동하지 않을 수 있습니다.

## 해결 방법

### 방법 1: 빌드 명령어 수정 (권장)

Render.com 프론트엔드 서비스에서:

1. **Settings** 탭 클릭
2. **Build Command** 섹션 찾기
3. 현재 빌드 명령어 확인:
   ```
   npm install && npm run build
   ```
4. 빌드 명령어를 다음으로 변경:
   ```
   npm install && VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build
   ```
   또는 더 명시적으로:
   ```
   npm install && export VITE_API_BASE_URL=$VITE_API_BASE_URL && npm run build
   ```
5. **Save Changes** 클릭
6. **Manual Deploy** → **Deploy latest commit** 클릭

### 방법 2: 빌드 스크립트 수정

`ui/package.json`의 빌드 스크립트를 수정:

1. `ui/package.json` 파일 열기
2. `build` 스크립트 수정:
   ```json
   "scripts": {
     "build": "vite build",
     "build:render": "echo 'VITE_API_BASE_URL='$VITE_API_BASE_URL && vite build"
   }
   ```
3. Render.com에서 Build Command를 다음으로 변경:
   ```
   npm install && npm run build:render
   ```

### 방법 3: Render.com 빌드 로그 확인

1. 프론트엔드 서비스 → **Logs** 탭
2. 최근 배포의 빌드 로그 확인
3. 다음 로그 찾기:
   ```
   === Vite 빌드 설정 ===
   VITE_API_BASE_URL: [값 또는 NOT SET]
   ```
4. `NOT SET`이 표시되면 환경 변수가 빌드 시점에 전달되지 않은 것

### 방법 4: 환경 변수 재확인

1. 프론트엔드 서비스 → **Environment** 탭
2. `VITE_API_BASE_URL` 환경 변수 확인:
   - Key: 정확히 `VITE_API_BASE_URL` (대소문자 구분)
   - Value: `https://order-app-backend-i18w.onrender.com/api`
3. 환경 변수가 없다면 다시 추가
4. 환경 변수 수정 후 재배포

### 방법 5: Web Service로 변경 (최후의 수단)

Static Site에서 환경 변수가 제대로 작동하지 않는다면, Web Service로 배포하는 것을 고려:

1. 새 Web Service 생성
2. 설정:
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Environment Variables**: `VITE_API_BASE_URL=https://order-app-backend-i18w.onrender.com/api`
3. Web Service는 런타임에도 환경 변수에 접근 가능

## 디버깅 단계

### 1단계: 빌드 로그 확인
- **Logs** 탭에서 빌드 과정 확인
- `=== Vite 빌드 설정 ===` 로그 찾기
- `VITE_API_BASE_URL:` 값 확인

### 2단계: 환경 변수 확인
- Render.com에서 환경 변수가 설정되어 있는지 확인
- Key와 Value가 정확한지 확인

### 3단계: 빌드 명령어 확인
- Build Command가 올바른지 확인
- 환경 변수를 명시적으로 전달하는지 확인

## 예상 결과

올바르게 설정되면 빌드 로그에 다음과 같이 표시됩니다:

```
=== Vite 빌드 설정 ===
VITE_API_BASE_URL: https://order-app-backend-i18w.onrender.com/api
NODE_ENV: production
```

그리고 배포 후 콘솔에:
```
API_BASE_URL: https://order-app-backend-i18w.onrender.com/api
VITE_API_BASE_URL env: https://order-app-backend-i18w.onrender.com/api
```

## 추가 팁

### Render.com Static Site의 제한사항
- Static Site는 빌드 시점에만 환경 변수를 사용할 수 있습니다
- 런타임에는 환경 변수에 접근할 수 없습니다
- 빌드 시점에 환경 변수가 주입되지 않으면 작동하지 않습니다

### 해결책
1. 빌드 명령어에서 환경 변수를 명시적으로 전달
2. 빌드 스크립트에서 환경 변수 확인 및 로깅
3. 필요시 Web Service로 변경
