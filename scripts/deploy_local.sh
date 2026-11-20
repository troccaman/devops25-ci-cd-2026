#!/bin/bash
set -e

echo "=== Starting local deployment ==="

echo "Building Docker image..."
sudo docker build -t cicd-projekt .

echo "Removing previous container if it exists..."
sudo docker rm -f cicd-projekt 2>/dev/null || true

echo "Starting application..."
sudo docker run -d --name cicd-projekt -p 8000:8000 cicd-projekt

echo "=== Deployment started ==="
