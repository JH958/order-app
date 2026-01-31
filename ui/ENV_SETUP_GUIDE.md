# Render.com 환경 변수 설정 상세 가이드

## 5단계: 환경 변수 추가

### 현재 화면 위치
Static Site 생성 화면에서 다음 섹션들을 입력했을 것입니다:
- Name
- Branch
- Root Directory
- Build Command
- Publish Directory

이제 **Environment Variables** 섹션을 찾아야 합니다.

---

## 📍 Environment Variables 섹션 찾기

### 방법 1: 스크롤 다운
1. 현재 입력한 설정들 아래로 스크롤
2. **"Environment Variables"** 또는 **"Environment"** 섹션 찾기
3. 보통 **"Advanced"** 또는 **"Settings"** 섹션 안에 있음

### 방법 2: 탭 확인
- 화면 상단이나 옆에 **"Environment"** 탭이 있을 수 있음
- 클릭하여 환경 변수 설정 화면으로 이동

---

## 🔧 환경 변수 추가 방법

### 1단계: 환경 변수 추가 버튼 찾기
- **"Add Environment Variable"** 버튼 클릭
- 또는 **"+"** 버튼 클릭
- 또는 **"Add Variable"** 링크 클릭

### 2단계: Key 입력
**Key** 필드에 다음을 입력:
```
VITE_API_BASE_URL
```

> ⚠️ **중요**: 
> - 대소문자 구분: `VITE_API_BASE_URL` (정확히 이대로)
> - Vite는 `VITE_`로 시작하는 환경 변수만 클라이언트에 노출
> - 공백 없이 입력

### 3단계: Value 입력
**Value** 필드에 백엔드 서버 URL을 입력:

#### 백엔드 서버 URL 확인 방법
1. Render.com 대시보드에서 백엔드 서비스 찾기
2. 서비스 이름 클릭 (예: `coffee-order-server`)
3. 상단에 표시된 URL 확인
   - 예: `https://coffee-order-server.onrender.com`
4. 이 URL 끝에 `/api` 추가

#### Value 입력 예시
```
https://coffee-order-server.onrender.com/api
```

> ⚠️ **주의사항**:
> - URL은 `https://`로 시작
> - 끝에 `/api` 반드시 포함
> - 마지막에 슬래시(`/`) 없이 입력
> - 예: `https://coffee-order-server.onrender.com/api` ✅
> - 예: `https://coffee-order-server.onrender.com/api/` ❌ (마지막 슬래시 제거)

### 4단계: 저장
- **"Save"** 또는 **"Add"** 버튼 클릭
- 환경 변수가 목록에 추가된 것 확인

---

## ✅ 확인 방법

환경 변수가 올바르게 추가되었는지 확인:

1. **Key**: `VITE_API_BASE_URL`
2. **Value**: `https://your-backend-server.onrender.com/api`
3. 목록에 표시되어 있는지 확인

---

## 🎯 전체 예시

### 올바른 설정 예시
```
Key: VITE_API_BASE_URL
Value: https://coffee-order-server.onrender.com/api
```

### 잘못된 설정 예시
```
❌ Key: vite_api_base_url (소문자)
❌ Key: API_BASE_URL (VITE_ 접두사 없음)
❌ Value: https://coffee-order-server.onrender.com (/api 없음)
❌ Value: http://coffee-order-server.onrender.com/api (http 사용)
❌ Value: https://coffee-order-server.onrender.com/api/ (마지막 슬래시)
```

---

## 📸 화면 구성 예시

Render.com의 환경 변수 섹션은 보통 다음과 같이 보입니다:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│                                         │
│  Key              Value                 │
│  ─────────────────────────────────────  │
│  [입력 필드]      [입력 필드]            │
│                                         │
│  [+ Add Environment Variable]           │
│                                         │
└─────────────────────────────────────────┘
```

또는:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│                                         │
│  VITE_API_BASE_URL                     │
│  https://coffee-order-server...        │
│  [✏️ Edit] [🗑️ Delete]                  │
│                                         │
│  [+ Add Variable]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 환경 변수 수정 방법

나중에 환경 변수를 수정하려면:

1. 서비스 대시보드로 이동
2. **"Environment"** 탭 클릭
3. 환경 변수 옆의 **"Edit"** 또는 **"✏️"** 아이콘 클릭
4. Value 수정
5. **"Save"** 클릭
6. **"Manual Deploy"** → **"Deploy latest commit"** 실행 (재배포 필요)

---

## ⚠️ 주의사항

1. **환경 변수 변경 후 재배포 필요**
   - 환경 변수를 추가/수정한 후에는 재배포해야 적용됨
   - Render가 자동으로 재배포하지 않을 수 있음

2. **빌드 시점에 주입됨**
   - Vite는 빌드 시점에 환경 변수를 코드에 주입
   - 배포 후 환경 변수를 변경해도 이미 빌드된 파일에는 반영 안 됨
   - 환경 변수 변경 후 **반드시 재배포** 필요

3. **대소문자 구분**
   - Key는 정확히 `VITE_API_BASE_URL`로 입력
   - 대소문자 틀리면 작동 안 함

---

## 🚀 다음 단계

환경 변수 추가가 완료되면:

1. 모든 설정이 올바른지 다시 한 번 확인
2. **"Create Static Site"** 또는 **"Deploy"** 버튼 클릭
3. 배포 완료 대기 (약 2-3분)
4. 배포된 URL에서 사이트 확인

---

## 💡 팁

- 환경 변수를 여러 개 추가할 수 있습니다
- 나중에 수정 가능하므로 걱정하지 마세요
- 배포 후 문제가 있으면 환경 변수를 확인하고 재배포하세요
