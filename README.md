# Release Notes Analyzer

Projeto para coletar dados de Pull Requests e preparar uma entrada
estruturada para análise por IA.

# 🤖 IA Local com Ollama (LLM)

Este projeto utiliza IA rodando localmente, sem depender de APIs externas, usando o Ollama.

A LLM recomendada é o **Llama 3.1 (8B)**, que oferece um excelente equilíbrio entre qualidade, velocidade e consumo de recursos.

---

## 🧠 Modelo escolhido — Llama 3.1 (8B)

- **Tamanho em disco:** ~4,7 GB  
- **Parâmetros:** 8 bilhões  
- **Performance:** Muito boa em CPU e excelente com GPU  
- **Ideal para:**
  - Release notes
  - Resumo de issues (Jira / Git)
  - Textos em linguagem não técnica
  - Uso interno por times de produto e engenharia

Modelos menores tendem a gerar textos fracos, e modelos maiores exigem muito mais recursos sem ganho relevante para esse uso.

---

## 📋 Requisitos

- Linux x64
- 8 GB de RAM (mínimo recomendado)
- ~6 GB livres em disco
- (Opcional) GPU AMD ou NVIDIA

---

## 🚀 Instalação do Ollama

### 1. Instalar o Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verifique a instalação:

```bash
ollama --version
```

---

## 📥 Instalar o modelo de IA

### 2. Baixar a LLM

```bash
ollama pull llama3.1:8b
```

O download possui aproximadamente 4,7 GB.

---

### 3. Executar o modelo

```bash
ollama run llama3.1:8b
```

Teste com:

```
Explique em uma frase o que são release notes para um time.
```

---

## 🔌 Uso via API

O Ollama sobe um servidor local automaticamente:

- URL: http://localhost:11434
- Modelo: llama3.1:8b

Exemplo de payload:

```json
{
  "model": "llama3.1:8b",
  "prompt": "Resuma essas issues em linguagem não técnica"
}
```

---

## 🛠️ Comandos úteis

```bash
ollama list
ollama rm llama3.1:8b
systemctl stop ollama
```

---

## ✅ Benefícios

- Dados não saem da máquina
- Sem custo por token
- Baixa latência
- Total controle do modelo