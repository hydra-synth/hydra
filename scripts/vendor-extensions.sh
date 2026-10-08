#!/usr/bin/env bash
# Copies the bundled hydra extensions into public/extensions/ from their upstream
# repositories, pinned to the commits below. Files are copied unmodified.
#
# To update: change a commit hash, run `npm run vendor-extensions`, then check that
# src/extensions/registry.js still lists the right function names.
set -euo pipefail

HYPER_HYDRA_REPO="https://github.com/geikha/hyper-hydra"
HYPER_HYDRA_COMMIT="e48aacbe775cd6731c50cc327ed86cd7e7beab6c"

EXTRA_SHADERS_REPO="https://gitlab.com/metagrowing/extra-shaders-for-hydra.git"
EXTRA_SHADERS_COMMIT="a0a2898b2a4048ae78b671a006f1fbd64c92a9ee"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/extensions"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fetch() { # repo commit dir
  git init -q "$3"
  git -C "$3" fetch -q --depth 1 "$1" "$2"
  git -C "$3" checkout -q FETCH_HEAD
}

fetch "$HYPER_HYDRA_REPO" "$HYPER_HYDRA_COMMIT" "$TMP/hyper-hydra"
rm -rf "$DEST/hyper-hydra" && mkdir -p "$DEST/hyper-hydra"
cp "$TMP"/hyper-hydra/hydra-*.js "$TMP/hyper-hydra/LICENSE" "$DEST/hyper-hydra/"
echo "$HYPER_HYDRA_REPO/tree/$HYPER_HYDRA_COMMIT" > "$DEST/hyper-hydra/SOURCE"

fetch "$EXTRA_SHADERS_REPO" "$EXTRA_SHADERS_COMMIT" "$TMP/extra-shaders"
rm -rf "$DEST/extra-shaders" && mkdir -p "$DEST/extra-shaders"
cp "$TMP"/extra-shaders/lib/lib-*.js "$TMP/extra-shaders/LICENSE" "$DEST/extra-shaders/"
echo "${EXTRA_SHADERS_REPO%.git}/-/tree/$EXTRA_SHADERS_COMMIT" > "$DEST/extra-shaders/SOURCE"

echo "vendored extensions into $DEST"
