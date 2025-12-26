
# 🤖 ISA 2.5 - Guia de Instalação e Dependências

Este projeto é uma plataforma de Inteligência Operacional de última geração. Siga os passos abaixo para configurar o ambiente de desenvolvimento.

## 📋 Pré-requisitos
- **Node.js**: Versão 18 ou superior.
- **NPM** ou **Yarn**.
- **Chave de API Gemini**: Necessária para o funcionamento do Chat IA.

## 📦 Dependências do Projeto

### Core
- `react` & `react-dom`: Biblioteca base UI.
- `react-router-dom`: Gerenciamento de rotas e navegação.

### Inteligência e Dados
- `@google/genai`: SDK oficial para integração com modelos Gemini 2.5/3.
- `recharts`: Renderização de gráficos financeiros e operacionais.

### Estilização e Ícones
- `tailwindcss`: Framework CSS utilitário.
- `lucide-react`: Pack de ícones vetoriais tecnológicos.

## 🚀 Como Rodar

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz e adicione:
   ```env
   VITE_API_KEY=sua_chave_aqui
   ```

3. **Iniciar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponíveis
- `npm run dev`: Inicia o servidor Vite local.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Visualiza o build de produção localmente.
