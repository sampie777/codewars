#!/bin/bash
NAME="sajansen/codewars"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
cd "$SCRIPT_DIR"
progname=$(basename $0)

function usage {
  cat << HEREDOC

     Usage: $progname <command>

     commands:
       run                  Run docker-compose
       build                Build a docker image
       push                 Push current docker image
       version              Print project version

     optional arguments:
       -h, --help           Show this help message and exit

HEREDOC
}

function version_ge {
  [ "$1" = "$2" ] && return 0
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

function checkRequiredTools {
  local tools=("docker" "sed")
  for tool in "${tools[@]}"; do
    if ! command -v "$tool" > /dev/null 2>&1; then
      echo "Error: Required tool '$tool' is not installed or not in PATH." >&2
      exit 1
    fi
  done
}

function checkToolVersions {
  local min_docker="20.10.0"
  local docker_ver
  docker_ver=$(docker version --format '{{.Client.Version}}' 2>/dev/null || docker --version 2>/dev/null | awk '{print $3}' | tr -d ',')
  docker_ver=$(echo "$docker_ver" | sed -E 's/^v//')
  if [ -n "$docker_ver" ]; then
    if ! version_ge "$docker_ver" "$min_docker"; then
      echo "Error: Docker version $docker_ver is lower than required minimum $min_docker." >&2
      exit 1
    fi
  fi
}

function checkPackageJson {
  if [ ! -f "./package.json" ]; then
    echo "Error: package.json not found in $SCRIPT_DIR" >&2
    exit 1
  fi
}

function getPackageVersion {
  checkPackageJson
  local ver
  ver=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' ./package.json)
  if [ -z "$ver" ]; then
    echo "Error: Could not extract version from package.json" >&2
    exit 1
  fi
  echo "$ver"
}

function checkDocker {
  checkRequiredTools
  checkToolVersions
  if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker and try again." >&2
    exit 1
  fi
}

function checkDockerfile {
  if [ ! -f "docker/Dockerfile" ]; then
    echo "Error: Dockerfile not found at docker/Dockerfile." >&2
    exit 1
  fi
}

function run {
  checkDocker
  if [ ! -f "docker/docker-compose.yaml" ]; then
    echo "Error: docker-compose.yaml not found at docker/docker-compose.yaml." >&2
    exit 1
  fi
  if command -v docker-compose > /dev/null 2>&1; then
    docker-compose -f docker/docker-compose.yaml up "$@"
  elif docker compose version > /dev/null 2>&1; then
    docker compose -f docker/docker-compose.yaml up "$@"
  else
    echo "Error: Neither 'docker-compose' nor 'docker compose' is available." >&2
    exit 1
  fi
}

function build {
  checkDocker
  checkDockerfile
  local version
  version=$(getPackageVersion)
  echo "==> Building docker image ${NAME}:${version}..."

  if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    echo "Running inside a GitHub Actions workflow."
    docker build -t "${NAME}" --build-arg APP_VERSION="${version}" -f docker/Dockerfile .
  else
    echo "Not running inside a GitHub Actions workflow."
    docker build -t "${NAME}" --build-arg APP_VERSION="${version}" --platform linux/amd64,linux/arm64 -f docker/Dockerfile .
  fi

  docker tag "${NAME}" "${NAME}:${version}"
  echo "==> Successfully built ${NAME}:${version}"
}

function push {
  checkDocker
  local version
  version=$(getPackageVersion)
  if ! docker image inspect "${NAME}:${version}" > /dev/null 2>&1; then
    echo "Error: Local image '${NAME}:${version}' not found. Please run '$progname build' first." >&2
    exit 1
  fi
  echo "==> Pushing docker image ${NAME}:${version}..."
  docker push "${NAME}:${version}"
  echo "==> Pushing docker image ${NAME} (latest)..."
  docker push "${NAME}"
  echo "==> Successfully pushed ${NAME}:${version} and latest"
}

command="${1:-}"
case "$command" in
  run)
    shift
    run "$@"
    ;;
  build)
    build
    ;;
  push)
    push
    ;;
  version)
    getPackageVersion
    ;;
  -h|--help)
    usage
    ;;
  *)
    echo "Invalid command: '$command'" >&2
    usage
    exit 1
    ;;
esac
