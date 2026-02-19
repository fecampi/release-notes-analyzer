import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ========== CONFIGURAÇÕES ==========
const CONFIG = {
  // Ativar/desativar coleta de cada tipo de dado
  collectPRs: true,
  collectCommits: true,
  collectIssues: true,
  collectReleases: true,
  
  // Número máximo de itens para cada tipo (1-100)
  perPage: 50,
  
  // Filtros por tipo
  filters: {
    prs: {
      state: "closed",
      sort: "updated",
      direction: "desc"
    },
    commits: {
      sort: "author-date"
    },
    issues: {
      state: "all",
      sort: "updated"
    }
  }
};

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

const result = {
  generatedAt: new Date().toISOString(),
  repository: `${GITHUB_OWNER}/${GITHUB_REPO}`
};

// ========== FUNÇÕES DE COLETA ==========
async function fetchFromAPI(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });

  if (!res.ok) {
    const error = await res.json();
    console.error(`❌ API Error [${url}]:`, error.message);
    return null;
  }

  const data = await res.json();
  return Array.isArray(data) ? data : null;
}

// Coletar PRs
if (CONFIG.collectPRs) {
  console.log("📋 Coletando Pull Requests...");
  const url = `${baseUrl}/pulls?state=${CONFIG.filters.prs.state}&sort=${CONFIG.filters.prs.sort}&direction=${CONFIG.filters.prs.direction}&per_page=${CONFIG.perPage}`;
  const prs = await fetchFromAPI(url);
  
  if (prs) {
    result.pullRequests = prs
      .filter(p => p.merged_at)
      .map(p => ({
        id: p.number,
        title: p.title,
        labels: p.labels.map(l => l.name),
        mergedAt: p.merged_at,
        createdAt: p.created_at,
        url: p.html_url,
        author: p.user.login
      }));
    console.log(`✅ ${result.pullRequests.length} PRs coletados`);
  }
}

// Coletar Commits
if (CONFIG.collectCommits) {
  console.log("📝 Coletando Commits...");
  const url = `${baseUrl}/commits?sort=${CONFIG.filters.commits.sort}&per_page=${CONFIG.perPage}`;
  const commits = await fetchFromAPI(url);
  
  if (commits) {
    result.commits = commits.map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url
    }));
    console.log(`✅ ${result.commits.length} commits coletados`);
  }
}

// Coletar Issues
if (CONFIG.collectIssues) {
  console.log("🐛 Coletando Issues...");
  const url = `${baseUrl}/issues?state=${CONFIG.filters.issues.state}&sort=${CONFIG.filters.issues.sort}&per_page=${CONFIG.perPage}`;
  const issues = await fetchFromAPI(url);
  
  if (issues) {
    result.issues = issues.map(i => ({
      id: i.number,
      title: i.title,
      labels: i.labels.map(l => l.name),
      state: i.state,
      createdAt: i.created_at,
      url: i.html_url,
      author: i.user.login
    }));
    console.log(`✅ ${result.issues.length} issues coletadas`);
  }
}

// Coletar Releases
if (CONFIG.collectReleases) {
  console.log("🚀 Coletando Releases...");
  const url = `${baseUrl}/releases?per_page=${CONFIG.perPage}`;
  const releases = await fetchFromAPI(url);
  
  if (releases) {
    result.releases = releases.map(r => ({
      id: r.id,
      name: r.name || r.tag_name,
      tag: r.tag_name,
      publishedAt: r.published_at,
      url: r.html_url,
      prerelease: r.prerelease
    }));
    console.log(`✅ ${result.releases.length} releases coletadas`);
  }
}

// Salvar resultado
fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/input-for-ai.json", JSON.stringify(result, null, 2));
console.log("\n✨ Todos os dados salvos em output/input-for-ai.json");
