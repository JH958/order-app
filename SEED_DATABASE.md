# 데이터베이스 시드(Seed) 실행 가이드

## 문제
로그에서 `📊 현재 메뉴 개수: 0개`가 확인되었습니다. 데이터베이스에 메뉴 데이터가 없어서 프론트엔드에서 메뉴를 불러올 수 없습니다.

## 해결 방법: Render.com Shell에서 Seed 스크립트 실행

### 방법 1: Render.com Shell 사용 (권장)

1. **Render.com 대시보드** 접속
2. **백엔드 서비스** 클릭 (order-app-backend-i18w)
3. 상단 메뉴에서 **Shell** 탭 클릭
4. 다음 명령어들을 순서대로 실행:

```bash
cd server
npm run seed
```

### 방법 2: 수동 실행

Shell에서 직접 실행:

```bash
cd server
node scripts/seed-data.js
```

## 예상 결과

성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
✅ 메뉴 데이터 삽입 완료: X개
✅ 옵션 데이터 삽입 완료: Y개
✅ 데이터베이스 시드 완료!
```

## 실행 후 확인

1. **백엔드 로그 확인**:
   - 서버가 재시작되면 `📊 현재 메뉴 개수: X개` (0이 아닌 숫자)가 표시되어야 합니다.

2. **프론트엔드 확인**:
   - 프론트엔드 사이트를 새로고침하면 메뉴가 정상적으로 표시됩니다.

## 주의사항

- `DATABASE_URL`은 **백엔드에서만** 사용하는 환경 변수입니다.
- 프론트엔드에는 **VITE_API_BASE_URL**만 필요합니다.
- Seed 스크립트는 데이터를 추가하므로, 중복 실행해도 안전합니다 (UNIQUE 제약 조건으로 중복 방지).

## 문제 해결

만약 seed 스크립트 실행 중 오류가 발생하면:

1. **환경 변수 확인**:
   - Render.com 백엔드 서비스 → Environment 탭
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` 또는 `DATABASE_URL`이 설정되어 있는지 확인

2. **데이터베이스 연결 확인**:
   ```bash
   cd server
   npm run test:db
   ```

3. **스키마 확인**:
   ```bash
   cd server
   npm run create:schema
   ```
