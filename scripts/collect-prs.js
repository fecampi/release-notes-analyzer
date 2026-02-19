import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;

const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?state=closed&per_page=50`;

const res = await fetch(API_URL, {
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
});

if (!res.ok) {
  const error = await res.json();
  console.error("GitHub API Error:", error);
  process.exit(1);
}

const prs = await res.json();

if (!Array.isArray(prs)) {
  console.error("Expected array from GitHub API, got:", typeof prs);
  process.exit(1);
}

const payload = {
  generatedAt: new Date().toISOString(),
  repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
  pullRequests: prs.filter(p => p.merged_at).map(p => ({
    id: p.number,
    title: p.title,
    labels: p.labels.map(l => l.name),
    mergedAt: p.merged_at,
    url: p.html_url
  }))
};

fs.writeFileSync("output/input-for-ai.json", JSON.stringify(payload, null, 2));
console.log("OK");
