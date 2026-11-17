// Vercel Serverless Function — correção de redação ENEM
// Cadastre OPENAI_API_KEY nas Environment Variables do projeto Vercel.
const BANDAS = [0, 40, 80, 120, 160, 200];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "Falta cadastrar OPENAI_API_KEY nas variáveis de ambiente do Vercel." });
  }

  const tema = typeof req.body?.tema === "string" ? req.body.tema.trim().slice(0, 500) : "";
  const redacao = typeof req.body?.redacao === "string" ? req.body.redacao.trim() : "";
  if (redacao.length < 100) return res.status(400).json({ error: "Envie uma redação com pelo menos 100 caracteres." });
  if (redacao.length > 12000) return res.status(413).json({ error: "A redação ultrapassa o limite de 12.000 caracteres." });

  const instrucao = \`Você é um avaliador pedagógico especializado na redação do ENEM brasileiro. Avalie com rigor e respeito segundo as cinco competências oficiais. Justifique cada nota com evidências do texto. As notas por competência devem ser escolhidas exclusivamente entre 0, 40, 80, 120, 160 e 200, somando de 0 a 1000. Considere fuga ao tema, tipo textual e extensão insuficiente quando aplicáveis. Não apresente a avaliação como nota oficial. Na competência 5 verifique agente, ação, meio/modo, efeito/finalidade e detalhamento, respeitando os direitos humanos. Responda SOMENTE em JSON válido no formato:
{
 "competencias":[
  {"nota":0,"justificativa":"...","melhoria":"..."},
  {"nota":0,"justificativa":"...","melhoria":"..."},
  {"nota":0,"justificativa":"...","melhoria":"..."},
  {"nota":0,"justificativa":"...","melhoria":"..."},
  {"nota":0,"justificativa":"...","melhoria":"..."}
 ],
 "pontos_fortes":["..."],
 "prioridades":["..."],
 "comentario_geral":"...",
 "intervencao":"..."
}
Use português brasileiro claro.\`;

  try {
    const resposta = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: instrucao },
          { role: "user", content: "Tema informado: " + (tema || "Não informado") + "\n\nRedação do estudante:\n" + redacao }
        ],
        max_output_tokens: 2200
      })
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {
      console.error("OpenAI API error:", resultado);
      return res.status(resposta.status === 429 ? 429 : 502).json({ error: "O serviço de correção não conseguiu responder. Verifique os créditos e a configuração da API." });
    }
    const saida = (resultado.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n").trim();
    if (!saida) return res.status(502).json({ error: "A IA não retornou uma avaliação válida. Tente novamente." });
    const jsonLimpo = saida.replace(/^\\\`\\\`\\\`json\\s*/i, "").replace(/\\s*\\\`\\\`\\\`$/, "");
    const avaliacao = JSON.parse(jsonLimpo);
    if (!Array.isArray(avaliacao.competencias) || avaliacao.competencias.length !== 5) {
      return res.status(502).json({ error: "A resposta da IA veio em formato inesperado. Tente novamente." });
    }
    avaliacao.competencias = avaliacao.competencias.map(item => ({
      nota: BANDAS.includes(Number(item.nota)) ? Number(item.nota) : 0,
      justificativa: String(item.justificativa || ""),
      melhoria: String(item.melhoria || "")
    }));
    return res.status(200).json(avaliacao);
  } catch (error) {
    console.error("Correction function error:", error);
    return res.status(502).json({ error: "Erro ao processar a correção. Tente novamente em instantes." });
  }
}
