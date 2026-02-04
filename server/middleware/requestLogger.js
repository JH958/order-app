// 요청 로깅 미들웨어
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // 응답 로깅을 위한 원본 메서드 저장
  const originalJson = res.json;
  res.json = function(data) {
    if (req.path === '/api/menus') {
      console.log(`📤 /api/menus 응답: ${Array.isArray(data) ? data.length + '개 메뉴' : '에러 발생'}`);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   첫 번째 메뉴: ${data[0].name || '이름 없음'}`);
      }
    }
    return originalJson.call(this, data);
  };
  
  next();
};
