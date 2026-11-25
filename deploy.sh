#!/bin/sh
# 센니 노트 배포 스크립트
# 저장소: https://github.com/seyeonmin6486-hub/Sennie-note (Public)
# GitHub Pages는 "Deploy from a branch → main → / (root)" 로 한 번만 켜 두면
# 이후로는 이 스크립트가 push 할 때마다 1~2분 안에 자동 반영됩니다.
# (Pickle의 GitHub 연결에는 Pages 권한이 없어서 Pages 켜기는 사용자가 직접 해야 합니다.)
set -e
cd "$(dirname "$0")"

git add -A
git commit -m "센니 노트 업데이트" || echo "변경 사항 없음"
git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin https://github.com/seyeonmin6486-hub/Sennie-note.git
else
  git remote add origin https://github.com/seyeonmin6486-hub/Sennie-note.git
fi

git push -u origin main

echo "푸시 완료 → https://seyeonmin6486-hub.github.io/Sennie-note/"
gh api repos/seyeonmin6486-hub/Sennie-note/pages --jq '"Pages: " + .status + " | " + .html_url' 2>/dev/null || \
  echo "Pages가 아직 꺼져 있습니다. 저장소 Settings → Pages → Source: Deploy from a branch → main / (root) → Save"
