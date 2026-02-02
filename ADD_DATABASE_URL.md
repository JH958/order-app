# Render.com에서 DATABASE_URL 환경 변수 추가하기

## 단계별 가이드

### 1단계: PostgreSQL 데이터베이스에서 Internal Database URL 복사

1. Render.com 대시보드에 로그인
2. 왼쪽 사이드바 또는 메인 화면에서 **PostgreSQL 데이터베이스 서비스** 찾기
   - 이름이 `coffee-order-db` 또는 비슷한 이름일 것입니다
3. 데이터베이스 서비스 클릭
4. 상단 탭에서 **"Connections"** 또는 **"연결"** 탭 클릭
5. **"Internal Database URL"** 섹션 찾기
6. URL 옆에 있는 **복사 버튼** 클릭 (또는 URL 전체를 선택해서 Ctrl+C)
   - 예시: `postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com/coffee_order_db`
   - ⚠️ **중요**: "Internal Database URL"을 사용해야 합니다 (External이 아님!)

### 2단계: 백엔드 서비스로 이동

1. Render.com 대시보드로 돌아가기
2. **백엔드 서비스** 찾기 (예: `coffee-order-server` 또는 `order-app-backend-i18w`)
3. 백엔드 서비스 클릭

### 3단계: Environment 탭으로 이동

1. 백엔드 서비스 대시보드에서
2. 상단 또는 왼쪽 메뉴에서 **"Environment"** 탭 클릭
   - 또는 **"환경 변수"**, **"Environment Variables"** 라고 표시될 수 있습니다

### 4단계: 환경 변수 추가

1. **"Add Environment Variable"** 또는 **"Add Variable"** 버튼 클릭
   - 또는 **"+"** 버튼 클릭
2. **Key** 필드에 입력:
   ```
   DATABASE_URL
   ```
   - 대소문자 정확히: `DATABASE_URL` (모두 대문자)
3. **Value** 필드에 입력:
   - 1단계에서 복사한 **Internal Database URL** 붙여넣기
   - 예시: `postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com/coffee_order_db`
4. **"Save"** 또는 **"Add"** 버튼 클릭

### 5단계: 확인

환경 변수 목록에 다음이 표시되어야 합니다:
```
DATABASE_URL | postgresql://user:password@...
```

### 6단계: 재배포 (필수!)

환경 변수를 추가한 후 **반드시 재배포**해야 합니다:

1. 백엔드 서비스 대시보드에서
2. 상단의 **"Manual Deploy"** 버튼 클릭
3. **"Deploy latest commit"** 선택
4. 배포 완료 대기 (약 2-3분)

### 7단계: 배포 후 로그 확인

배포 완료 후 **"Logs"** 탭에서 다음을 확인:

```
데이터베이스 연결 설정:
  DATABASE_URL 존재: true  ← 이게 true여야 함!
  NODE_ENV: production
  DATABASE_URL 사용, SSL 활성화
✅ 데이터베이스 연결 성공: coffee_order_db
```

## 주의사항

### ✅ 올바른 설정
- **Internal Database URL** 사용
- 전체 URL 복사 (처음부터 끝까지)
- Key는 정확히 `DATABASE_URL` (대소문자 구분)

### ❌ 잘못된 설정
- External Database URL 사용
- URL 일부만 복사
- Key를 `database_url` 또는 `Database_Url`로 입력

## 문제 해결

### Internal Database URL을 찾을 수 없나요?

1. 데이터베이스 서비스 → **"Info"** 또는 **"정보"** 탭 확인
2. 또는 **"Settings"** 탭 확인
3. 여전히 없다면:
   - 데이터베이스가 아직 생성 중일 수 있음
   - 데이터베이스 서비스 상태 확인

### 환경 변수를 추가했는데도 연결이 안 되나요?

1. **재배포를 했는지 확인** (환경 변수 추가만으로는 적용 안 됨)
2. **Internal Database URL을 사용했는지 확인** (External이 아님)
3. **URL이 전체인지 확인** (일부만 복사하지 않았는지)
4. **Logs 탭에서 에러 메시지 확인**

## 예상 결과

올바르게 설정하고 재배포하면:

1. ✅ 로그에 "DATABASE_URL 존재: true" 표시
2. ✅ "데이터베이스 연결 성공" 메시지 표시
3. ✅ 프론트엔드에서 메뉴가 정상적으로 로드됨
