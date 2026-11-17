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
function iniciarEscrita() {
  const campo = $("txt");
  const contador = $("cnt");
  if (!campo || !contador) return;
  campo.oninput = () => {
    const palavras = campo.value.trim().split(/\s+/).filter(Boolean).length;
    contador.textContent = palavras + " palavras";
  };
}
function iniciarRedacao() {
  iniciarSubAbas();
  desenharCompetencias();
  iniciarEstrutura();
  iniciarEscrita();
}
