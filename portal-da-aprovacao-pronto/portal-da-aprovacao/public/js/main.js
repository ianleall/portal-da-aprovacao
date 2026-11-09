// ===== main.js — liga tudo quando a página abre =====

// Troca de aba. Também é chamada pelos botões da página inicial (onclick no HTML).
function irPara(aba) {
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.t === aba));
  document.querySelectorAll("section").forEach((s) => s.classList.toggle("on", s.id === aba));
  if (aba === "hist") desenharHistorico(); // o histórico é redesenhado toda vez que abre
  window.scrollTo(0, 0);
}

// Clique nas abas do menu
document.querySelectorAll("#nav button").forEach((botao) => {
  botao.onclick = () => irPara(botao.dataset.t);
});

// Barra de pesquisa do topo: abre a aba Disciplinas e filtra os temas
$("busca").oninput = () => {
  if (!$("comecar").classList.contains("on")) irPara("comecar");
  desenharTemas($("busca").value);
};

// Ordem de inicialização
carregarLocal();      // util.js    — lê o histórico guardado no navegador
desenharDisciplinas(); // estudar.js — cards das matérias
desenharTemas();      // estudar.js — temas da matéria escolhida
iniciarRedacao();     // redacao.js — as 3 sub-abas
mostrarMenu();        // simulado.js
iniciarCronometro();  // timer.js
