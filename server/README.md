# 커피 주문 앱 백엔드 서버

Express.js 기반 REST API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL
- CORS
- dotenv

## 설치 방법

```bash
# 의존성 설치
npm install
```

## 환경 변수 설정

`.env` 파일을 확인하고 필요한 환경 변수를 설정하세요.

## 실행 방법

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 모든 메뉴 목록 조회

### 주문 관련
- `GET /api/orders` - 모든 주문 목록 조회
- `GET /api/orders/:orderId` - 특정 주문 조회
- `POST /api/orders` - 새 주문 생성
- `PUT /api/orders/:orderId/status` - 주문 상태 업데이트

### 재고 관련
- `GET /api/inventory` - 모든 메뉴의 재고 정보 조회
- `PUT /api/inventory/:menuId` - 특정 메뉴의 재고 수량 업데이트

### 대시보드 관련
- `GET /api/dashboard/stats` - 대시보드 통계 데이터 조회

## 프로젝트 구조

```
server/
├── config/          # 설정 파일
├── controllers/     # 컨트롤러
├── models/         # 데이터 모델
├── routes/         # 라우트 정의
├── middleware/     # 커스텀 미들웨어
├── utils/          # 유틸리티 함수
├── server.js       # 서버 진입점
└── package.json
```
