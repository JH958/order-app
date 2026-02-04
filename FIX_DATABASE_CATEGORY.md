# 데이터베이스 category 컬럼 추가 가이드

## 문제
백엔드에서 `"column m.category does not exist"` 오류 발생

## 원인
`menus` 테이블에 `category` 컬럼이 없습니다. 코드는 `category` 컬럼을 사용하지만, 데이터베이스 스키마에는 이 컬럼이 없습니다.

## 해결 방법

### 방법 1: Render.com Shell에서 스크립트 실행 (권장)

1. Render.com 대시보드 → **백엔드 서비스** 클릭
2. **Shell** 탭 클릭
3. 다음 명령어 실행:

```bash
cd server
npm run add:category
```

만약 스크립트가 없다면 직접 실행:

```bash
cd server
node scripts/add-category-column.js
```

### 방법 2: 로컬에서 실행

1. 로컬 `server/.env` 파일에 `DATABASE_URL` 추가 (Render.com의 External Database URL 사용)
2. 다음 명령어 실행:

```bash
cd server
node scripts/add-category-column.js
```

### 방법 3: SQL 직접 실행

Render.com 데이터베이스 서비스 → **Connections** → **psql** 또는 **Query Editor**에서:

```sql
-- category 컬럼이 있는지 확인
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'menus' AND column_name = 'category';

-- category 컬럼 추가 (없는 경우)
ALTER TABLE menus 
ADD COLUMN category VARCHAR(50) DEFAULT 'coffee'
CHECK (category IN ('coffee', 'non-coffee', 'etc'));

-- 기존 메뉴의 category 설정
UPDATE menus SET category = 'coffee' WHERE category IS NULL;
```

## 수정된 파일

1. `server/scripts/create-schema.js` - 새 테이블 생성 시 `category` 컬럼 포함
2. `server/scripts/add-category-column.js` - 기존 테이블에 `category` 컬럼 추가 (DATABASE_URL 지원)

## 다음 단계

1. 위 방법 중 하나로 `category` 컬럼 추가
2. 프론트엔드 사이트 새로고침
3. 메뉴가 정상적으로 로드되는지 확인

## 예상 결과

`category` 컬럼을 추가한 후:
- ✅ 백엔드 API가 정상 작동
- ✅ 메뉴 데이터가 정상적으로 로드됨
- ✅ 500 오류가 사라짐
