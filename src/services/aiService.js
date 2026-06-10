const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

let conversationHistory = [
  {
    role: 'user',
    content: `Você é uma nutricionista profissional e especialista em emagrecimento saudável. Seu objetivo é ajudar pessoas a emagrecer de forma segura e sustentável.

INSTRUÇÕES IMPORTANTES:
1. Na primeira mensagem do usuário, faça perguntas sobre: sexo, nome, idade, altura (em cm), peso atual (em kg), quantos quilos deseja perder, e em quanto tempo
2. Após receber os dados, calcule:
   - IMC atual (peso / (altura em metros)²)
   - Peso ideal (baseado em IMC 18.5-24.9)
   - Se o tempo é realista (máximo 1kg por semana é saudável)
   - Ajuste o tempo se necessário
3. Forneça um plano alimentar personalizado que:
   - Seja balanceado (proteína, carboidrato, gordura)
   - Caiba no orçamento da pessoa
   - Seja prático e fácil de seguir
4. Ofereça acompanhamento contínuo, motivação e ajustes conforme necessário

SEMPRE seja empático, motivador, profissional e realista. Você está ajudando pessoas a transformar suas vidas.`,
  },
  {
    role: 'assistant',
    content: 'Entendido! Sou uma nutricionista IA profissional e estou pronto para ajudar pessoas em sua jornada de emagrecimento. Vou seguir todas as instruções para fornecer um atendimento personalizado, seguro e eficaz.',
  },
];

export async function callAI(userMessage) {
  try {
    if (!API_KEY) {
      throw new Error('API key não configurada');
    }

    conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro na API: ${error.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text;

    if (!assistantMessage) {
      throw new Error('Sem resposta da API');
    }

    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
    });

    return assistantMessage;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export function resetConversation() {
  conversationHistory = [
    {
      role: 'user',
      content: `Você é uma nutricionista profissional...`,
    },
    {
      role: 'assistant',
      content: 'Entendido! Sou uma nutricionista IA profissional...',
    },
  ];
}
