#!/usr/bin/env bash
# Collect *real* Coursera submission evidence from Srushti's running bookstore API.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/final_project"
BASE="${BOOKSTORE_API_URL:-http://localhost:5000}"
BASE="${BASE%/}"
OUT="$ROOT/evidence"
mkdir -p "$OUT"
COOKIE="$(mktemp)"
trap 'rm -f "$COOKIE"; if [[ "${STARTED_SERVER:-0}" == 1 ]]; then kill "$SERVER_PID" 2>/dev/null || true; fi' EXIT

if ! curl -fsS "$BASE/" >/dev/null 2>&1; then
  echo "Starting the bookstore API locally..."
  npm install
  npm start > "$OUT/server.log" 2>&1 &
  SERVER_PID=$!
  STARTED_SERVER=1
  for _ in $(seq 1 30); do
    if curl -fsS "$BASE/" >/dev/null 2>&1; then break; fi
    sleep 1
  done
  if ! curl -fsS "$BASE/" >/dev/null 2>&1; then
    echo "Server failed to start. Read $OUT/server.log" >&2
    exit 1
  fi
fi

echo "Capturing genuine API responses from $BASE"
printf '$ curl -sS https://api.github.com/repos/srushtikaudewar24/expressBookReviews\n' > "$OUT/githubrepo"
curl -sS https://api.github.com/repos/srushtikaudewar24/expressBookReviews >> "$OUT/githubrepo"
printf '\n' >> "$OUT/githubrepo"
printf '$ curl -sS %s/\n' "$BASE" > "$OUT/getallbooks"
curl -sS "$BASE/" >> "$OUT/getallbooks"
printf '\n' >> "$OUT/getallbooks"
printf '$ curl -sS %s/isbn/1\n' "$BASE" > "$OUT/getbooksbyISBN"
curl -sS "$BASE/isbn/1" >> "$OUT/getbooksbyISBN"
printf '\n' >> "$OUT/getbooksbyISBN"
printf '$ curl -sS %s/author/Jane%%20Austen\n' "$BASE" > "$OUT/getbooksbyauthor"
curl -sS "$BASE/author/Jane%20Austen" >> "$OUT/getbooksbyauthor"
printf '\n' >> "$OUT/getbooksbyauthor"
printf '$ curl -sS %s/title/Pride%%20and%%20Prejudice\n' "$BASE" > "$OUT/getbooksbytitle"
curl -sS "$BASE/title/Pride%20and%20Prejudice" >> "$OUT/getbooksbytitle"
printf '\n' >> "$OUT/getbooksbytitle"
printf '$ curl -sS %s/review/1\n' "$BASE" > "$OUT/getbookreview"
curl -sS "$BASE/review/1" >> "$OUT/getbookreview"
printf '\n' >> "$OUT/getbookreview"
USER_NAME="srushti_course_$(date +%s)"
USER_PASS="demo_course_password_$(date +%s)"
printf '$ curl -sS -X POST %s/register -H "Content-Type: application/json" -d "{\"username\":\"%s\",\"password\":\"[redacted]\"}"\n' "$BASE" "$USER_NAME" > "$OUT/register"
curl -sS -X POST "$BASE/register" -H "Content-Type: application/json" -d "{\"username\":\"$USER_NAME\",\"password\":\"$USER_PASS\"}" >> "$OUT/register"
printf '\n' >> "$OUT/register"
printf '$ curl -sS -c cookies.txt -X POST %s/customer/login -H "Content-Type: application/json" -d "{\"username\":\"%s\",\"password\":\"[redacted]\"}"\n' "$BASE" "$USER_NAME" > "$OUT/login"
curl -sS -c "$COOKIE" -X POST "$BASE/customer/login" -H "Content-Type: application/json" -d "{\"username\":\"$USER_NAME\",\"password\":\"$USER_PASS\"}" | sed -E 's/"accessToken":"[^"]+"/"accessToken":"[redacted]"/' >> "$OUT/login"
printf '\n' >> "$OUT/login"
printf '$ curl -sS -b cookies.txt -X PUT %s/customer/auth/review/1?review=Excellent%%20classic\n' "$BASE" > "$OUT/reviewadded"
curl -sS -b "$COOKIE" -X PUT "$BASE/customer/auth/review/1?review=Excellent%20classic" >> "$OUT/reviewadded"
printf '\n' >> "$OUT/reviewadded"
printf '$ curl -sS -b cookies.txt -X DELETE %s/customer/auth/review/1\n' "$BASE" > "$OUT/deletereview"
curl -sS -b "$COOKIE" -X DELETE "$BASE/customer/auth/review/1" >> "$OUT/deletereview"
printf '\n' >> "$OUT/deletereview"
echo "Evidence saved at $OUT"
echo "Inspect all ten files before submitting. Never submit real passwords or access tokens."
