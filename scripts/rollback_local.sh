#!/bin/bash
set -e

echo "=== Starting rollback ==="
sudo docker image inspect devops25-app:v1 > /dev/null

sudo docker rm -f devops25-app 2>/dev/null || true
sudo docker run -d \
    --name devops25-app \
    -p 8000:8000 \
    devops25-app:v1

bash scripts/verify.sh
sudo docker inspect --format '{{.Config.Image}}' devops25-app
echo "=== Rollback completed ==="