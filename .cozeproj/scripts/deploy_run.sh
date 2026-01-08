#!/bin/bash
set -Eeuo pipefail

cd "${COZE_WORKSPACE_PATH}"

echo "Starting production server on port ${DEPLOY_RUN_PORT}..."
node server.js
