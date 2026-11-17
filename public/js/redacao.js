// ===== redacao.js — aba Redação =====
function iniciarSubAbas() {
  document.querySelectorAll("#rsub button").forEach((botao) => {
    botao.onclick = () => {
      document.querySelectorAll("#rsub button").forEach((b) => b.classList.toggle("on", b === botao));
      document.querySelectorAll(".rp").forEach((painel) => {
        painel.style.display = painel.id === botao.dataset.r ? "block" : "none";
      });
    };
  });
}
function desenharCompetencias() {
  $("comps").innerHTML = COMPETENCIAS.map(([titulo, explicacao]) =>
    '<details><summary>' + titulo + '</summary><p class="mut">' + explicacao + '</p></details>'
  ).join("");
}
function desenharBloco(nomeBloco) {
  const trechos = ESTRUTURA[nomeBloco];
  let texto = "", legenda = "", moldes = "";
  for (const [cor, rotulo, molde, exemplo, alternativa] of trechos) {
    if (!alternativa) {
      texto += '<span style="--c:' + cor + '">' + exemplo + '</span> ';
      legenda += '<span class="chip" style="--c:' + cor + '">' + rotulo + '</span>';
    }
    moldes += '<div class="seg" style="--c:' + cor + '"><span class="chip">' + rotulo +
      '</span><p class="m">Molde: ' + molde + '</p><p style="margin:4px 0">' + exemplo + '</p></div>';
  }
  $("bloco").innerHTML = '<div class="card"><h2>' + nomeBloco +
    ' · redação simulada</h2><p class="mut">Tema de exemplo: desafios para combater a desinformação no Brasil.</p><p class="ess">' +
    texto + '</p><div class="chips">' + legenda + '</div></div><div class="card"><h2>Moldes e variações</h2>' +
    '<p class="mut">Preencha o que está entre colchetes com o seu tema.</p>' + moldes + '</div>';
}
function iniciarEstrutura() {
  const nomes = Object.keys(ESTRUTURA);
  $("blocos").innerHTML = nomes.map((nome, i) =>
    '<button data-k="' + nome + '" ' + (i === 0 ? 'class="on"' : "") + '>' + nome + '</button>'
  ).join("");
  document.querySelectorAll("#blocos button").forEach((botao) => {
    botao.onclick = () => {
      document.querySelectorAll("#blocos button").forEach((b) => b.classList.toggle("on", b === botao));
      desenharBloco(botao.dataset.k);
    };
  });
  if (nomes.length) desenharBloco(nomes[0]);
}
function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function renderizarCorrecao(dados) {
  const competencias = Array.isArray(dados.competencias) ? dados.competencias : [];
  const nomes = [
    "C1 — Domínio da escrita formal", "C2 — Compreensão do tema",
    "C3 — Seleção e organização de argumentos", "C4 — Coesão e mecanismos linguísticos",
    "C5 — Proposta de intervenção"
  ];
  const linhas = nomes.map((nome, i) => {
    const item = competencias[i] || {};
    const nota = Number(item.nota) || 0;
    return '<div class="seg"><b>' + nome + '</b><p><strong>' + nota +
      '/200 pontos</strong></p><p>' + escaparHTML(item.justificativa) +
      '</p><p class="mut"><b>Como melhorar:</b> ' + escaparHTML(item.melhoria) + '</p></div>';
  }).join("");
  const total = competencias.reduce((s, c) => s + (Number(c.nota) || 0), 0);
  $("res").innerHTML = '<div class="card"><h2>Resultado da correção</h2><p class="big">' + total +
    '<span class="mut"> / 1000 pontos</span></p><p class="mut">Estimativa pedagógica gerada por IA; a nota oficial pode ser diferente.</p>' +
    '<h3>Avaliação por competência</h3>' + linhas + '<h3>Pontos fortes</h3><ul>' +
    (dados.pontos_fortes || []).map(x => '<li>' + escaparHTML(x) + '</li>').join("") +
    '</ul><h3>Prioridades para melhorar</h3><ul>' +
    (dados.prioridades || []).map(x => '<li>' + escaparHTML(x) + '</li>').join("") +
    '</ul><h3>Comentário geral</h3><p>' + escaparHTML(dados.comentario_geral) +
    '</p><h3>Proposta de intervenção</h3><p>' + escaparHTML(dados.intervencao) + '</p></div>';
}
function iniciarEscrita() {
  $("txt").oninput = () => {
    const palavras = $("txt").value.trim().split(/\s+/).filter(Boolean).length;
    $("cnt").textContent = palavras + " palavras";
  };
  $("corr").onclick = async () => {
    const texto = $("txt").value.trim();
    const tema = $("tema").value.trim();
    if (texto.length < 100) {
      $("res").innerHTML = '<div class="warn">Escreva pelo menos 100 caracteres antes de solicitar a correção.</div>';
      return;
    }
    const botao = $("corr");
    botao.disabled = true;
    botao.textContent = "⏳ Analisando redação...";
    $("res").innerHTML = '<p class="mut">A IA está avaliando as cinco competências. Isso pode levar alguns segundos.</p>';
    try {
      const resposta = await fetch("/api/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, redacao: texto })
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.error || "Não foi possível corrigir agora.");
      renderizarCorrecao(dados);
    } catch (erro) {
      $("res").innerHTML = '<div class="warn">' + escaparHTML(erro.message) +
        '. Confira se OPENAI_API_KEY foi cadastrada no Vercel e tente novamente.</div>';
    } finally {
      botao.disabled = false;
      botao.textContent = "🤖 Corrigir com IA";
    }
  };
}
function iniciarRedacao() {
  iniciarSubAbas();
  desenharCompetencias();
  iniciarEstrutura();
  iniciarEscrita();
}
