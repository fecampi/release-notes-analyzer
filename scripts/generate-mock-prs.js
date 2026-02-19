import fs from "fs";

const mockPRs = [
  {
    id: 1,
    title: "feat: implementar coleta de PRs do GitHub",
    labels: ["feature", "api"],
    mergedAt: "2026-01-15T10:30:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/1"
  },
  {
    id: 2,
    title: "feat: adicionar suporte a múltiplos repositórios",
    labels: ["feature", "enhancement"],
    mergedAt: "2026-01-18T14:20:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/2"
  },
  {
    id: 3,
    title: "fix: corrigir erro ao processar labels vazias",
    labels: ["bug", "fix"],
    mergedAt: "2026-01-20T09:15:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/3"
  },
  {
    id: 4,
    title: "docs: documentar API de análise",
    labels: ["documentation"],
    mergedAt: "2026-01-22T16:45:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/4"
  },
  {
    id: 5,
    title: "refactor: reorganizar estrutura de diretórios",
    labels: ["refactor", "maintenance"],
    mergedAt: "2026-01-25T11:20:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/5"
  },
  {
    id: 6,
    title: "feat: integrar com Claude API",
    labels: ["feature", "ai"],
    mergedAt: "2026-01-28T13:30:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/6"
  },
  {
    id: 7,
    title: "perf: otimizar coleta de dados",
    labels: ["performance", "optimization"],
    mergedAt: "2026-02-01T10:00:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/7"
  },
  {
    id: 8,
    title: "fix: tratar erros de autenticação",
    labels: ["bug", "security"],
    mergedAt: "2026-02-03T15:30:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/8"
  },
  {
    id: 9,
    title: "feat: adicionar cache de respostas",
    labels: ["feature", "performance"],
    mergedAt: "2026-02-05T08:45:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/9"
  },
  {
    id: 10,
    title: "docs: adicionar exemplos de uso",
    labels: ["documentation", "examples"],
    mergedAt: "2026-02-08T12:15:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/10"
  },
  {
    id: 11,
    title: "test: adicionar testes unitários",
    labels: ["testing", "quality"],
    mergedAt: "2026-02-10T09:50:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/11"
  },
  {
    id: 12,
    title: "chore: atualizar dependências",
    labels: ["dependencies", "maintenance"],
    mergedAt: "2026-02-12T14:25:00Z",
    url: "https://github.com/fecampi/release-notes-analyzer/pull/12"
  }
];

const payload = {
  generatedAt: new Date().toISOString(),
  repository: "fecampi/release-notes-analyzer",
  pullRequests: mockPRs
};

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/input-for-ai.json", JSON.stringify(payload, null, 2));
console.log(`✅ Gerado ${mockPRs.length} PRs mock em output/input-for-ai.json`);
