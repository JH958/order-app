// 에러 처리 미들웨어
export const errorHandler = (err, req, res, next) => {
  console.error('❌ 에러 발생:', err.message);
  console.error('에러 코드:', err.code);
  console.error('에러 경로:', req.path);
  console.error('에러 상세:', err);
  
  // 데이터베이스 에러 처리
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: true,
      message: '중복된 데이터입니다.',
      code: 'DUPLICATE_ERROR'
    });
  }
  
  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: true,
      message: '참조 무결성 오류가 발생했습니다.',
      code: 'FOREIGN_KEY_ERROR'
    });
  }
  
  // PostgreSQL 컬럼 없음 에러 (42703)
  if (err.code === '42703') {
    console.error('⚠️  데이터베이스 컬럼이 없습니다. 마이그레이션이 필요할 수 있습니다.');
  }
  
  // 기본 에러 응답
  res.status(err.status || 500).json({
    error: true,
    message: err.message || '서버 오류가 발생했습니다.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 핸들러
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: true,
    message: '요청한 리소스를 찾을 수 없습니다.',
    path: req.path
  });
};
