# Portal da Aprovação ENEM — mapa do projeto

Site estático: não tem servidor nem banco de dados. O histórico de cada aluno fica salvo
no próprio navegador. Para ver o site, abra `public/index.html` com a extensão Live Preview
ou Live Server do VS Code (ou clique duas vezes no arquivo).

## Arquivos
public/index.html      -> estrutura da página (abas, janelas)
public/css/style.css   -> aparência (cores no começo do arquivo)
public/js/dados.js     -> TODO o conteúdo: temas, questões, estrutura da redação
public/js/util.js      -> ferramentas comuns e o histórico guardado no navegador
public/js/estudar.js   -> aba Disciplinas e pesquisa
public/js/redacao.js   -> aba Redação
public/js/simulado.js  -> simulados
public/js/historico.js -> aba Histórico
public/js/timer.js     -> cronômetro de foco
public/js/main.js      -> liga tudo (comece por aqui para entender)
vercel.json            -> diz à Vercel para publicar só a pasta public

## Onde mexer para...
Mudar cores              -> css/style.css (seção 1)
Adicionar questão        -> js/dados.js (lista QUESTOES)
Adicionar tema de estudo -> js/dados.js (lista AREAS)
Mudar textos da página   -> index.html
