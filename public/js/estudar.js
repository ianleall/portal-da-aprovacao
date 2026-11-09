// ===== estudar.js — aba Disciplinas: cards das matérias, temas e pesquisa =====
// Os temas vêm de AREAS (em dados.js). Aqui só montamos o HTML.

let areaAtual = null; // índice da matéria escolhida (null = nenhuma)

// Tira acentos e maiúsculas para a pesquisa achar "matematica" ou "Matemática"
const normalizar = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function linkBotao(texto, url, classe) {
  return `<a class="btn ${classe}" target="_blank" rel="noopener" href="${url}">${texto}</a>`;
}

function cardTema([titulo, dica, busca]) {
  return `
    <div class="card">
      <h3>${titulo}</h3>
      <p class="mut">${dica}</p>
      <p>
        ${linkBotao("▶ Aulas", "https://www.youtube.com/results?search_query=" + paraLink("aula " + busca), "")}
        ${linkBotao("📄 Apostilas", "https://www.google.com/search?q=" + paraLink("apostila pdf " + busca), "alt")}
        ${linkBotao("✅ Questões", "https://www.google.com/search?q=" + paraLink("questões " + busca + " com gabarito"), "alt")}
      </p>
    </div>`;
}

// Cards grandes das matérias (como no protótipo)
function desenharDisciplinas() {
  let html = "";
  AREAS.forEach(([nome, emoji], i) => {
    html += `<button class="disc ${i === areaAtual ? "on" : ""}" data-i="${i}"><span>${emoji}</span>${nome}</button>`;
  });
  html += `<button class="disc" data-ir="red"><span>✍️</span>Redação</button>`;
  html += `<button class="disc" data-ir="sim"><span>📝</span>Simulados</button>`;
  $("discs").innerHTML = html;

  document.querySelectorAll("#discs .disc").forEach((botao) => {
    botao.onclick = () => {
      if (botao.dataset.ir) return irPara(botao.dataset.ir); // Redação e Simulados abrem outra aba
      areaAtual = Number(botao.dataset.i);
      $("busca").value = "";
      desenharDisciplinas();
      desenharTemas();
    };
  });
}

// Temas: da matéria escolhida, ou o resultado da pesquisa
function desenharTemas(termo = "") {
  const busca = normalizar(termo.trim());
  let html = "";

  if (busca) {
    const achados = AREAS.flatMap(([, , temas]) => temas)
      .filter((t) => normalizar(t.join(" ")).includes(busca));
    html = `<h2 class="area">🔎 Resultados para “${termo.trim()}”</h2>`;
    html += achados.length
      ? `<div class="grid">${achados.map(cardTema).join("")}</div>`
      : '<p class="mut">Nenhum tema encontrado. Tente outra palavra.</p>';
  } else if (areaAtual !== null) {
    const [nome, emoji, temas] = AREAS[areaAtual];
    html = `<h2 class="area">${emoji} ${nome}</h2><div class="grid">${temas.map(cardTema).join("")}</div>`;
  } else {
    html = '<p class="mut">Toque em uma matéria para ver os temas.</p>';
  }
  $("temas").innerHTML = html;
}
