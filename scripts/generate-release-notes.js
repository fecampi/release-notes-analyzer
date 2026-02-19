import fs from "fs";
import fetch from "node-fetch";

// ========== CONFIGURAÇÕES ==========
const CONFIG = {
  // Endpoint do Ollama local
  ollamaEndpoint: "http://localhost:11434/api/generate",
  
  // Modelo a usar
  model: "llama3.1:8b",
  
  // Temperatura (0-1: 0 = determinístico, 1 = criativo)
  temperature: 0.7,
  
  // Número máximo de tokens a gerar
  numPredict: 1024
};

const inputFile = "output/input-for-ai.json";
const outputFile = "output/release-notes.md";

// ========== VERIFICAR SE ARQUIVO EXISTE ==========
if (!fs.existsSync(inputFile)) {
  console.error(`❌ Arquivo não encontrado: ${inputFile}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// ========== CONSTRUIR PROMPT ==========
function buildPrompt(data) {
  const { repository, commits = [], pullRequests = [], issues = [], releases = [] } = data;
  
  let prompt = `# Gerar Release Notes para ${repository}\n\n`;
  
  if (commits.length > 0) {
    prompt += `## Commits recentes:\n`;
    commits.forEach(c => {
      prompt += `- ${c.sha}: ${c.message}\n`;
    });
    prompt += `\n`;
  }
  
  if (pullRequests.length > 0) {
    prompt += `## Pull Requests:\n`;
    pullRequests.forEach(pr => {
      prompt += `- #${pr.id}: ${pr.title} (${pr.labels.join(", ")})\n`;
    });
    prompt += `\n`;
  }
  
  if (issues.length > 0) {
    prompt += `## Issues:\n`;
    issues.forEach(issue => {
      prompt += `- #${issue.id}: ${issue.title} (${issue.state})\n`;
    });
    prompt += `\n`;
  }
  
  prompt += `Com base no histórico acima, gere uma release note técnica em Markdown com:
1. Resumo: descrição técnica das mudanças implementadas
2. Novas Funcionalidades: lista de features com detalhes técnicos
3. Correções: bugs resolvidos
4. Melhorias: otimizações e refatorações
5. Detalhes técnicos: mudanças na arquitetura, dependências ou breaking changes se houver

Tone profissional, técnico, direto. Sem exageros ou expressões informais. Em português.`;
  
  return prompt;
}

const prompt = buildPrompt(data);

// ========== CHAMAR OLLAMA ==========
async function generateReleaseNotes() {
  console.log("🤖 Gerando release notes com Llama 3.1...\n");
  
  try {
    const response = await fetch(CONFIG.ollamaEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CONFIG.model,
        prompt: prompt,
        temperature: CONFIG.temperature,
        num_predict: CONFIG.numPredict,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    const releaseNotes = result.response;
    
    // Salvar release notes
    fs.writeFileSync(outputFile, releaseNotes);
    console.log(`✅ Release notes geradas com sucesso!\n`);
    console.log("📄 Saída:\n");
    console.log(releaseNotes);
    console.log(`\n📁 Salvo em: ${outputFile}`);
    
  } catch (error) {
    console.error(`❌ Erro ao conectar com Ollama:`);
    console.error(`   ${error.message}`);
    console.error(`\n💡 Dica: Verifique se Ollama está rodando:`);
    console.error(`   curl http://localhost:11434/api/tags`);
    process.exit(1);
  }
}

await generateReleaseNotes();
