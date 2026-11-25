#!/bin/sh
# 센니 노트 배포 스크립트
# 사용 전: GitHub에 빈 저장소 seyeonmin6486-hub/senni-note (Public, README 없이) 가 있어야 합니다.
# (Pickle의 GitHub 연결 토큰에는 저장소 생성 권한이 없어서 저장소만 사용자가 직접 만들어 주면 됩니다.)
set -e
cd "$(dirname "$0")"

git add -A
git commit -m "센니 노트 업데이트" || echo "변경 사항 없음"
git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin https://github.com/seyeonmin6486-hub/senni-note.git
else
  git remote add origin https://github.com/seyeonmin6486-hub/senni-note.git
fi

git push -u origin main

# GitHub Pages 활성화 (이미 켜져 있으면 그대로)
gh api -X POST repos/seyeonmin6486-hub/senni-note/pages \
  -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || \
gh api -X PUT repos/seyeonmin6486-hub/senni-note/pages \
  -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true

echo "배포 요청 완료 → https://seyeonmin6486-hub.github.io/senni-note/"
gh api repos/seyeonmin6486-hub/senni-note/pages --jq '.html_url + " | " + .status' 2>/dev/null || true
