#!/usr/bin/env bash
# 在你本机执行（需已配置 SSH 免密或能输密码）：
#   bash deploy/deploy.sh root@你的公网IP
#
# 服务器需已安装 nginx，且存在目录 /var/www/sihaoran-portal

set -euo pipefail

TARGET="${1:-}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/sihaoran-portal}"

if [[ -z "$TARGET" ]]; then
  echo "用法: bash deploy/deploy.sh user@ecs-ip"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rsync -avz --delete \
  --exclude '.git' \
  --exclude 'deploy' \
  --exclude '.gitignore' \
  "$ROOT_DIR/" "$TARGET:$REMOTE_DIR/"

echo "已同步到 $TARGET:$REMOTE_DIR"
echo "若首次部署，请把 deploy/nginx.conf.example 拷到服务器并 reload nginx。"
