# 데이터베이스 연결 문제 해결 가이드

## 문제
"데이터베이스 연결 실패 : SSL/TLS required" 오류 발생

## 원인 분석

가능한 원인:
1. **DATABASE_URL 환경 변수가 설정되지 않음** (가장 가능성 높음)
2. DATABASE_URL이 잘못 설정됨
3. 코드 변경사항이 아직 배포되지 않음

## 해결 방법

### 1단계: Render.com에서 DATABASE_URL 확인 및 설정

#### 백엔드 서비스 환경 변수 확인

1. Render.com 대시보드 → **백엔드 서비스** 클릭
2. **Environment** 탭 클릭
3. `DATABASE_URL` 환경 변수가 있는지 확인

#### DATABASE_URL이 없다면 추가:

1. **PostgreSQL 데이터베이스 서비스**로 이동
2. **Connections** 탭 클릭
3. **Internal Database URL** 복사
   - 예: `postgresql://user:password@host:5432/dbname?sslmode=require`
4. 백엔드 서비스 → **Environment** 탭으로 돌아가기
5. **Add Environment Variable** 클릭
6. 다음 입력:
   ```
   Key: DATABASE_URL
   Value: [복사한 Internal Database URL 전체]
   ```
7. **Save** 클릭

#### DATABASE_URL이 있다면 확인:

- Value가 **Internal Database URL**인지 확인 (External이 아님)
- URL이 완전한지 확인 (끝까지 복사했는지)

### 2단계: 코드 변경사항 배포

1. 변경된 코드를 GitHub에 푸시:
   ```bash
   git add server/config/database.js
   git commit -m "Fix: Add SSL support and debug logging for database connection"
   git push
   ```

2. Render.com에서 재배포:
   - 백엔드 서비스 → **Manual Deploy** → **Deploy latest commit**

### 3단계: 배포 후 로그 확인

배포 완료 후 **Logs** 탭에서 다음 로그 확인:

```
데이터베이스 연결 설정:
  DATABASE_URL 존재: true  ← 이게 true여야 함
  NODE_ENV: production
  DATABASE_URL 사용, SSL 활성화
✅ 데이터베이스 연결 성공: coffee_order_db
```

만약 `DATABASE_URL 존재: false`가 보이면:
- 환경 변수가 제대로 설정되지 않은 것
- 다시 1단계로 돌아가서 확인

## 환경 변수 체크리스트

백엔드 서비스에 다음 환경 변수들이 모두 설정되어 있어야 합니다:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL 전체>
FRONTEND_URL=https://order-app-frontend-pbph.onrender.com
```

## 주의사항

1. **Internal Database URL 사용**
   - External Database URL이 아닌 **Internal Database URL**을 사용해야 합니다
   - Internal은 Render.com 내부 서비스 간 통신용 (더 빠르고 안전)
   - External은 외부에서 접속할 때만 사용

2. **전체 URL 복사**
   - DATABASE_URL은 전체를 복사해야 합니다
   - 예: `postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com/coffee_order_db`

3. **재배포 필수**
   - 환경 변수를 추가/수정한 후 반드시 재배포해야 합니다

## 예상 결과

올바르게 설정되면 로그에 다음과 같이 표시됩니다:

```
데이터베이스 연결 설정:
  DATABASE_URL 존재: true
  NODE_ENV: production
  DATABASE_URL 사용, SSL 활성화
서버가 포트 10000에서 실행 중입니다.
환경: production
✅ 데이터베이스 연결 성공: coffee_order_db
   연결 시간: 2026-02-01T04:27:03.000Z
```

## 추가 디버깅

만약 여전히 문제가 발생한다면:

1. **DATABASE_URL 형식 확인**
   - `postgresql://` 또는 `postgres://`로 시작해야 함
   - 호스트, 포트, 데이터베이스명이 모두 포함되어 있어야 함

2. **데이터베이스 서비스 상태 확인**
   - PostgreSQL 서비스가 실행 중인지 확인
   - 데이터베이스가 삭제되지 않았는지 확인

3. **로그의 전체 에러 메시지 확인**
   - "SSL/TLS required" 외에 다른 에러 메시지가 있는지 확인
