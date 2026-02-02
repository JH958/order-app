#!/bin/bash
# 빌드 전 환경 변수 확인 스크립트

echo "=== 빌드 전 환경 변수 확인 ==="
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL:-'NOT SET'}"
echo "NODE_ENV: ${NODE_ENV:-'NOT SET'}"

if [ -z "$VITE_API_BASE_URL" ]; then
  echo "⚠️  WARNING: VITE_API_BASE_URL is not set!"
  echo "빌드가 실패할 수 있습니다."
  exit 1
fi

echo "✅ 환경 변수가 설정되었습니다."
echo "빌드를 시작합니다..."
