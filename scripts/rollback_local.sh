#!/bin/bash
set -e

echo "=== Starting rollback ==="
sudo docker image inspect cicd-projekt:v1 > /dev/null

sudo docker rm -f cicd-projekt 2>/dev/null || true
sudo docker run -d \
    --name cicd-projekt \
    -p 8000:8000 \
    cicd-projekt:v1

bash scripts/verify.sh
sudo docker inspect --format '{{.Config.Image}}' cicd-projekt
echo "=== Rollback completed ==="