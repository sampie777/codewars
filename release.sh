#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
cd "$SCRIPT_DIR"

progname=$(basename "$0")

INITIAL_BRANCH=""
START_COMMIT=""
CREATED_TAG=""
MASTER_PUSHED=false
RELEASED=false

function usage {
  cat << HEREDOC

     Usage: $progname [command]

     commands:
       patch                      Release a patch version (0.0.X)
       minor                      Release a minor version (0.X.0)
       major                      Release a major version (X.0.0)
       setversion <version>       Change version to <version>
       setNextDevelopmentVersion  Bump develop to next development version
       -h, --help                 Show this help message and exit

HEREDOC
}

function rollback {
  local exit_code=$?
  if [ "$RELEASED" = true ] || [ $exit_code -eq 0 ] || [ -z "$INITIAL_BRANCH" ]; then
    return
  fi

  echo ""
  echo "==========================================" >&2
  echo " An error occurred during release! (code: $exit_code)" >&2

  if [ "$MASTER_PUSHED" = true ]; then
    echo " NOTE: Master and Docker image were already pushed successfully." >&2
    echo " The error occurred while setting the next development version on develop." >&2
    echo " You can complete this by running: ./release.sh setNextDevelopmentVersion" >&2
    echo "==========================================" >&2
    return
  fi

  echo " Rolling back local changes to restore state... " >&2
  echo "==========================================" >&2

  # 1. Abort any active merge or rebase
  git merge --abort >/dev/null 2>&1 || true
  git rebase --abort >/dev/null 2>&1 || true

  # 2. Delete local tag if created but not pushed
  if [ -n "$CREATED_TAG" ]; then
    if git tag -l "$CREATED_TAG" | grep -q "$CREATED_TAG"; then
      git tag -d "$CREATED_TAG" >/dev/null 2>&1 || true
      echo "-> Removed local unpushed tag $CREATED_TAG" >&2
    fi
  fi

  # 3. Discard any unstaged changes in package.json or working tree
  git checkout -- . >/dev/null 2>&1 || true

  # 4. If on master, reset master back to origin/master
  local current_branch
  current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ "$current_branch" = "master" ]; then
    echo "-> Resetting master to origin/master" >&2
    git reset --hard origin/master >/dev/null 2>&1 || true
  fi

  # 5. Return to initial branch
  if [ -n "$INITIAL_BRANCH" ]; then
    echo "-> Returning to branch $INITIAL_BRANCH" >&2
    git checkout "$INITIAL_BRANCH" >/dev/null 2>&1 || true
    if [ -n "$START_COMMIT" ]; then
      git reset --hard "$START_COMMIT" >/dev/null 2>&1 || true
    fi
  fi

  echo "Rollback completed. Working directory has been restored to clean state on $INITIAL_BRANCH." >&2
}

trap rollback EXIT

function version_ge {
  [ "$1" = "$2" ] && return 0
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

function checkRequiredTools {
  local tools=("git" "docker" "node" "yarn" "sed" "awk" "cut" "sort")
  for tool in "${tools[@]}"; do
    if ! command -v "$tool" > /dev/null 2>&1; then
      echo "Error: Required tool '$tool' is not installed or not in PATH." >&2
      exit 1
    fi
  done
}

function checkToolVersions {
  local min_node="18.0.0"
  local min_yarn="1.22.0"
  local min_git="2.20.0"
  local min_docker="20.10.0"

  # Node
  local node_ver
  node_ver=$(node -v 2>/dev/null | sed -E 's/^v//')
  if [ -n "$node_ver" ]; then
    if ! version_ge "$node_ver" "$min_node"; then
      echo "Error: Node version $node_ver is lower than required minimum $min_node." >&2
      exit 1
    fi
  fi

  # Yarn
  local yarn_ver
  yarn_ver=$(yarn -v 2>/dev/null | sed -E 's/^v//')
  if [ -n "$yarn_ver" ]; then
    if ! version_ge "$yarn_ver" "$min_yarn"; then
      echo "Error: Yarn version $yarn_ver is lower than required minimum $min_yarn." >&2
      exit 1
    fi
  fi

  # Git
  local git_ver
  git_ver=$(git --version 2>/dev/null | awk '{print $3}' | sed -E 's/^v//')
  if [ -n "$git_ver" ]; then
    if ! version_ge "$git_ver" "$min_git"; then
      echo "Error: Git version $git_ver is lower than required minimum $min_git." >&2
      exit 1
    fi
  fi

  # Docker
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
  local ver
  ver=$(getPackageVersion)
  if [ -z "$ver" ]; then
    echo "Error: Could not extract version from package.json" >&2
    exit 1
  fi
}

function checkDocker {
  if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker before releasing." >&2
    exit 1
  fi
}

function checkGitClean {
  if ! git diff-index --quiet HEAD --; then
    echo "Error: You have uncommitted changes in tracked files. Please commit or stash them before releasing." >&2
    exit 1
  fi
}

function checkCurrentBranch {
  local current_branch
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$current_branch" != "develop" ]; then
    echo "Error: Releases must be started from the 'develop' branch (currently on '$current_branch')." >&2
    exit 1
  fi
}

function checkTagAvailable {
  local tag="v$1"
  if git rev-parse "$tag" >/dev/null 2>&1; then
    echo "Error: Git tag '$tag' already exists locally." >&2
    exit 1
  fi
  if [ -n "$(git ls-remote --tags origin "refs/tags/$tag")" ]; then
    echo "Error: Git tag '$tag' already exists on remote origin." >&2
    exit 1
  fi
}

function retry() {
  local max_attempts=10
  local attempt=1
  until "$@"; do
    if [ $attempt -ge $max_attempts ]; then
      echo "Retry failed after $max_attempts attempts for command: $*" >&2
      return 1
    fi
    echo "Command failed ($*). Retrying attempt $((attempt + 1))/$max_attempts in 3s..."
    sleep 3
    attempt=$((attempt + 1))
  done
}

function getPackageVersion {
  sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' ./package.json
}

function calculateReleaseVersion {
  local type="$1"
  local current
  current=$(getPackageVersion)
  local clean
  clean=$(echo "$current" | sed -E 's/^v//; s/-.*$//')

  local major minor patch
  major=$(echo "$clean" | cut -d'.' -f1)
  minor=$(echo "$clean" | cut -d'.' -f2)
  patch=$(echo "$clean" | cut -d'.' -f3)

  major=${major:-0}
  minor=${minor:-0}
  patch=${patch:-0}

  case "$type" in
    patch)
      echo "${major}.${minor}.$((patch + 1))"
      ;;
    minor)
      echo "${major}.$((minor + 1)).0"
      ;;
    major)
      echo "$((major + 1)).0.0"
      ;;
    *)
      echo "Unknown release type: $type" >&2
      exit 1
      ;;
  esac
}

function calculateNextDevVersion {
  local released="$1"
  local clean
  clean=$(echo "$released" | sed -E 's/^v//; s/-.*$//')
  local major minor
  major=$(echo "$clean" | cut -d'.' -f1)
  minor=$(echo "$clean" | cut -d'.' -f2)
  major=${major:-0}
  minor=${minor:-0}
  echo "${major}.$((minor + 1)).0-SNAPSHOT"
}

function setVersion() {
  local version="$1"
  if sed -i '' -E 's/("version": ")([^"]+)(")/\1'"$version"'\3/' package.json 2>/dev/null; then
    :
  else
    sed -i -E 's/("version": ")([^"]+)(")/\1'"$version"'\3/' package.json
  fi
}

function runRelease {
  local release_type="$1"

  echo "==> Running pre-flight checks..."
  checkRequiredTools
  checkToolVersions
  checkDocker
  checkGitClean
  checkPackageJson
  checkCurrentBranch

  INITIAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  START_COMMIT=$(git rev-parse HEAD)

  # 1. Update develop branch
  echo "==> Updating develop branch..."
  retry git pull origin develop

  # 2. Run tests on develop before touching anything
  echo "==> Running tests on develop..."
  yarn test --pass-with-no-tests

  # 3. Calculate target release version and verify tag doesn't exist
  local release_version
  release_version=$(calculateReleaseVersion "$release_type")
  echo "==> Target release version: ${release_version}"
  checkTagAvailable "${release_version}"

  # 4. Checkout master and update
  echo "==> Switching to master and updating..."
  git checkout master
  retry git pull origin master

  # 5. Merge develop into master
  echo "==> Merging develop into master..."
  git merge --no-edit develop

  # 6. Update version in package.json
  echo "==> Updating package.json to ${release_version}..."
  setVersion "${release_version}"

  echo "==> Running tests on master..."
  yarn test --pass-with-no-tests

  # 7. Validate docker build before tagging and committing
  echo "==> Verifying docker build with version ${release_version}..."
  retry ./docker.sh build

  # 8. Create release commit and tag
  echo "==> Creating release commit and git tag v${release_version}..."
  git add package.json
  git commit -m "version release: ${release_version}"
  CREATED_TAG="v${release_version}"
  git tag "${CREATED_TAG}"

  # 9. Push docker image
  echo "==> Pushing docker image..."
  retry ./docker.sh push

  # 10. Push master branch and tags to origin
  echo "==> Pushing master branch and tag to origin..."
  retry git push -u origin master --tags
  MASTER_PUSHED=true

  # 11. Switch back to develop and bump to next SNAPSHOT version
  echo "==> Updating develop with next development version..."
  git checkout develop
  retry git pull origin develop
  git merge --no-edit master

  local dev_version
  dev_version=$(calculateNextDevVersion "${release_version}")
  echo "==> Setting next development version: ${dev_version}"
  setVersion "${dev_version}"
  git add package.json
  git commit -m "next development version"
  retry git push -u origin develop --tags

  RELEASED=true
  echo ""
  echo "=========================================="
  echo " Release v${release_version} completed successfully!"
  echo " Next development version: ${dev_version}"
  echo "=========================================="
}

function runSetNextDevelopmentVersion {
  echo "==> Running pre-flight checks..."
  checkRequiredTools
  checkToolVersions
  checkGitClean
  checkPackageJson
  checkCurrentBranch

  INITIAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  START_COMMIT=$(git rev-parse HEAD)

  local current_ver
  current_ver=$(getPackageVersion)
  local dev_ver
  dev_ver=$(calculateNextDevVersion "$current_ver")
  echo "==> Setting next development version: ${dev_ver}"
  setVersion "${dev_ver}"
  git add package.json
  git commit -m "next development version"
  retry git push -u origin develop --tags

  RELEASED=true
  echo ""
  echo "=========================================="
  echo " Successfully updated to next development version: ${dev_ver}"
  echo "=========================================="
}

command="${1:-}"
case "$command" in
  patch|minor|major)
    runRelease "$command"
    ;;
  setNextDevelopmentVersion)
    runSetNextDevelopmentVersion
    ;;
  setversion)
    if [ -z "${2:-}" ]; then
      echo "Error: Version argument required for setversion command." >&2
      usage
      exit 1
    fi
    checkPackageJson
    setVersion "$2"
    RELEASED=true
    echo "Version updated to $2 in package.json"
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
