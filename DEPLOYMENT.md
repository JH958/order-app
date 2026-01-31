# Render.com 배포 가이드

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성

1. Render.com 대시보드에 로그인
2. **New +** 버튼 클릭 → **PostgreSQL** 선택
3. 데이터베이스 설정:
   - **Name**: `coffee-order-db` (원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: `postgres` (기본값)
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전
   - **Plan**: Free tier 선택 (또는 유료 플랜)
4. **Create Database** 클릭
5. 데이터베이스가 생성되면 **Connections** 탭에서 다음 정보 확인:
   - **Internal Database URL**: 백엔드에서 사용
   - **External Database URL**: 로컬에서 연결 시 사용

### 2단계: 백엔드 서버 배포

1. Render.com 대시보드에서 **New +** 버튼 클릭 → **Web Service** 선택
2. GitHub 저장소 연결:
   - 저장소를 GitHub에 푸시했는지 확인
   - Render에서 GitHub 계정 연결
   - 저장소 선택
3. 서비스 설정:
   - **Name**: `coffee-order-server` (원하는 이름)
   - **Region**: 데이터베이스와 동일한 지역
   - **Branch**: `main` (또는 `master`)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier 선택
4. 환경 변수 설정 (Environment Variables):
   - **방법 1 (권장)**: `DATABASE_URL` 사용
     ```
     NODE_ENV=production
     PORT=10000
     DATABASE_URL=<Internal Database URL 전체>
     ```
     - 데이터베이스의 **Connections** 탭에서 **Internal Database URL** 복사
     - 전체 URL을 그대로 `DATABASE_URL`에 입력
   
   - **방법 2**: 개별 환경 변수 사용
     ```
     NODE_ENV=production
     PORT=10000
     DB_HOST=<데이터베이스 호스트>
     DB_PORT=5432
     DB_NAME=coffee_order_db
     DB_USER=<데이터베이스 사용자>
     DB_PASSWORD=<데이터베이스 비밀번호>
     ```
     - Internal Database URL을 파싱하여 개별 변수로 입력
5. **Create Web Service** 클릭
6. 배포 완료 후 서비스 URL 확인 (예: `https://coffee-order-server.onrender.com`)

### 3단계: 데이터베이스 스키마 및 초기 데이터 설정

백엔드 서버가 배포된 후, 데이터베이스를 초기화해야 합니다.

**방법 1: Render Shell 사용 (권장)**
1. 백엔드 서비스의 **Shell** 탭으로 이동
2. 다음 명령어를 순차적으로 실행:
   ```bash
   cd server
   npm run create:schema
   npm run seed
   npm run update:images:auto
   ```

**방법 2: 로컬에서 실행**
1. 데이터베이스의 **External Database URL** 복사
2. 로컬 `server/.env` 파일에 다음 추가:
   ```
   DATABASE_URL=<External Database URL 전체>
   ```
3. 다음 명령어를 순차적으로 실행:
   ```bash
   cd server
   npm run create:schema
   npm run seed
   npm run update:images:auto
   ```

### 4단계: 프론트엔드 배포

**방법 1: Static Site로 배포 (권장)**
1. Render.com 대시보드에서 **New +** 버튼 클릭 → **Static Site** 선택
2. GitHub 저장소 연결:
   - 동일한 저장소 선택
3. 빌드 설정:
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Branch**: `main` (또는 `master`)
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://coffee-order-server.onrender.com/api
   ```
   - 백엔드 서비스 URL을 입력 (2단계에서 확인한 URL)
5. **Create Static Site** 클릭
6. 배포 완료 후 프론트엔드 URL 확인

**방법 2: Web Service로 배포**
1. Render.com 대시보드에서 **New +** 버튼 클릭 → **Web Service** 선택
2. GitHub 저장소 연결:
   - 동일한 저장소 선택
3. 서비스 설정:
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Region**: 백엔드와 동일한 지역
   - **Branch**: `main` (또는 `master`)
   - **Root Directory**: `ui`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Plan**: Free tier 선택
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://coffee-order-server.onrender.com/api
   ```
   - 백엔드 서비스 URL을 입력
5. **Create Web Service** 클릭
6. 배포 완료 후 프론트엔드 URL 확인

### 5단계: CORS 설정 확인

백엔드 서버의 CORS 설정이 프론트엔드 도메인을 허용하는지 확인합니다.

## 환경 변수 요약

### 백엔드 (Web Service)
**방법 1: DATABASE_URL 사용 (권장)**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL 전체>
```

**방법 2: 개별 환경 변수 사용**
```
NODE_ENV=production
PORT=10000
DB_HOST=<데이터베이스 호스트>
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=<데이터베이스 사용자>
DB_PASSWORD=<데이터베이스 비밀번호>
```

> 💡 **권장**: `DATABASE_URL`을 사용하면 Render가 자동으로 연결을 관리합니다.

### 프론트엔드 (Static Site)
```
VITE_API_BASE_URL=https://coffee-order-server.onrender.com/api
```

## 주의사항

1. **무료 플랜 제한사항**:
   - 서비스가 15분간 비활성화되면 자동으로 sleep 상태가 됩니다
   - 첫 요청 시 약 30초 정도의 cold start 시간이 소요됩니다
   - 월 750시간 제한

2. **데이터베이스 연결**:
   - 백엔드 서버는 **Internal Database URL**을 사용해야 합니다
   - 외부에서 접근할 때만 **External Database URL**을 사용합니다

3. **이미지 파일**:
   - `ui/public/images/` 폴더의 이미지는 빌드 시 포함됩니다
   - 이미지 파일이 Git에 포함되어 있는지 확인하세요

4. **환경 변수**:
   - 프론트엔드 환경 변수는 `VITE_` 접두사가 필요합니다
   - 환경 변수 변경 후 재배포가 필요합니다

## 트러블슈팅

### 백엔드 연결 오류
- `DATABASE_URL` 환경 변수가 올바른지 확인 (Internal Database URL 전체)
- 데이터베이스가 같은 지역에 있는지 확인
- 데이터베이스가 실행 중인지 확인 (Render 대시보드에서 확인)
- 백엔드 서비스의 로그를 확인하여 구체적인 오류 메시지 확인

### 프론트엔드 API 오류
- `VITE_API_BASE_URL` 환경 변수가 올바른지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정이 올바른지 확인

### 이미지가 표시되지 않음
- 이미지 파일이 `ui/public/images/` 폴더에 있는지 확인
- Git에 이미지 파일이 포함되어 있는지 확인
- 빌드 후 `dist/images/` 폴더에 이미지가 있는지 확인
