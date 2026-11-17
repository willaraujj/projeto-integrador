# Guia de estudo — Gestão de Consultores
Data da apresentação: **17/11/2026**.

Este guia explica o projeto a partir do zero. Leia com os arquivos abertos e execute os comandos. As falas sugeridas ajudam a organizar a apresentação; cada integrante deve conseguir explicar o que demonstra.

## 1. O problema antes do código

Uma empresa de serviços trabalha com consultores e precisa centralizar quem são eles, suas especialidades e se estão disponíveis. Nossa solução é uma API para cadastrar e consultar esses profissionais.

MVP significa Produto Mínimo Viável: a menor solução que atende à necessidade escolhida. O enunciado pede somente duas operações principais, armazenamento em memória, uma regra de negócio, testes, organização, SOLID, GitHub e Docker. Por isso não implementamos tela, login, banco de dados, alteração ou exclusão.

Fala sugerida: “Nossa API centraliza os consultores de uma empresa de serviços. Permite cadastrar profissionais e consultar especialidade e disponibilidade. Limitamos a solução ao MVP definido na atividade.”

## 2. Vocabulário essencial

| Termo | Significado no projeto |
| --- | --- |
| Programa | Conjunto de instruções executadas pelo computador. |
| Linguagem | JavaScript, usada nos arquivos .js. |
| Node.js | Ambiente que executa JavaScript fora do navegador. Não é a linguagem. |
| Backend | Parte que recebe pedidos, aplica regras e devolve dados. |
| Frontend | Interface visual para o usuário. Não é exigida aqui. |
| API | Interface por meio da qual um programa solicita ações ou informações de outro. |
| HTTP | Protocolo que define como requisições e respostas são trocadas. |
| REST | Estilo de arquitetura de APIs. Usamos recursos e métodos HTTP, como GET e POST. |
| Recurso | A informação tratada pela API: consultores. |
| Rota | Caminho atendido pela aplicação, como /consultores. |
| Endpoint | Uma operação acessível na API; aqui, a combinação de método e caminho. |
| JSON | Formato textual usado para trocar os dados. Não é banco de dados nem linguagem de programação. |
| Framework | Ferramenta que fornece estrutura e recursos recorrentes. Express cuida das rotas HTTP. |
| Dependência | Pacote de que o projeto precisa, como Express. |
| npm | Ferramenta que instala pacotes e executa os scripts do projeto. |
| Terminal | Interface onde digitamos comandos. Os comandos não são escritos dentro dos arquivos JavaScript. |
| Servidor | Processo que fica aguardando requisições; também pode designar a máquina que o hospeda. |
| localhost | Nome que aponta para o próprio computador de quem faz a requisição. |
| Porta | Número que identifica onde um serviço recebe conexões, aqui 3000. |
| Git | Sistema que registra versões e alterações do código. |
| GitHub | Serviço que hospeda o repositório Git e facilita colaboração. |
| Commit | Registro de uma alteração no histórico. |
| Branch | Linha de desenvolvimento; a principal do repositório se chama main. |

## 3. O que acontece em uma requisição

Considere este endereço:

~~~text
http://localhost:3000/consultores
~~~

- http é o protocolo.
- localhost é a máquina de destino.
- :3000 informa a porta.
- /consultores é o caminho do recurso.

O mesmo caminho tem duas operações:

- POST /consultores: envia um novo consultor para cadastro.
- GET /consultores: pede a lista dos consultores.

O navegador, quando você digita uma URL na barra de endereço, normalmente faz GET. Para demonstrar POST, use o curl do README, Postman ou outro cliente HTTP.

Uma requisição pode conter método, endereço, cabeçalhos e corpo. No POST, o cabeçalho Content-Type: application/json informa o formato do corpo.

~~~json
{
  "nome": "Ana Souza",
  "especialidade": "Tecnologia",
  "experiencia": 3,
  "disponibilidade": true,
  "contato": "ana@example.com"
}
~~~

nome, especialidade e contato são strings (textos); experiencia é número; disponibilidade é booleano. true e false não usam aspas. "false", com aspas, seria um texto e o cadastro seria rejeitado.

A resposta inclui um status HTTP e um corpo:

| Status | Quando aparece |
| --- | --- |
| 200 | Consulta realizada. |
| 201 | Consultor criado. |
| 400 | Dados inválidos ou JSON malformado. |
| 413 | Corpo acima do limite aceito. |
| 500 | Erro interno inesperado. |

Um erro 400 não significa que o teste falhou: em um teste de dados inválidos, receber 400 é o resultado correto.

## 4. Pastas e arquivos

| Arquivo/pasta | Para que serve |
| --- | --- |
| README.md | Página inicial de documentação: objetivo, instalação, uso, exemplos e equipe. |
| docs/ | Abreviação de documents/documentation; pasta de documentação. Não é executada pela API. |
| docs/APRESENTACAO.md | Roteiro para demonstrar e explicar o trabalho. |
| docs/GUIA_DE_ESTUDO.md | Este material de estudo. |
| .md | Extensão de Markdown, formato de texto com títulos, listas, links e blocos de código. |
| src/ | Abreviação de source; guarda o código da aplicação. |
| server.js | Inicia o servidor na porta 3000. |
| src/app.js | Monta a aplicação, lê JSON, registra rotas e trata erros. |
| src/routes/consultorRoutes.js | Liga método e caminho à função responsável. |
| src/controllers/consultorController.js | Recebe a requisição e constrói a resposta HTTP. |
| src/services/consultorService.js | Valida dados e aplica a regra de negócio. |
| src/repositories/consultorRepository.js | Guarda e consulta o array em memória. |
| tests/consultor.test.js | Testes automatizados. |
| package.json | Nome, scripts, dependências e requisitos do projeto. |
| package-lock.json | Registra a resolução exata das dependências para instalações reproduzíveis. |
| node_modules/ | Pacotes instalados pelo npm; gerados localmente, não versionados. |
| .gitignore | Indica arquivos que o Git deve ignorar ao adicionar arquivos novos. |
| Dockerfile | Receita para construir a imagem da aplicação. |
| .dockerignore | Exclui arquivos do contexto enviado ao build Docker. |

O ponto no começo de .gitignore e .dockerignore faz parte do nome; em sistemas Unix, nomes iniciados por ponto são normalmente ocultos.

## 5. JavaScript necessário para ler o código

### Variáveis, funções e objetos

~~~js
const PORT = 3000;
~~~

const declara uma variável que não pode receber uma nova atribuição depois. PORT é o nome; = atribui 3000; ; encerra a instrução. Letras maiúsculas aqui são uma convenção para uma constante de configuração.

~~~js
function listar() {
    return repository.listarTodos();
}
~~~

function declara uma função, isto é, um conjunto de instruções reutilizável. listar é seu nome; os parênteses recebem parâmetros quando necessários. As chaves delimitam o corpo. return devolve um valor e encerra essa chamada da função.

~~~js
const consultor = { nome: 'Ana', disponibilidade: false };
~~~

Um objeto reúne propriedades. nome e disponibilidade são propriedades; os dois-pontos separam nome e valor. A vírgula separa propriedades. consultor.nome acessa o nome.

~~~js
const consultores = [];
consultores.push(consultor);
~~~

[] cria um array, uma lista. push adiciona um item ao final. const impede trocar a variável por outro array, mas permite alterar o conteúdo do array existente.

### Símbolos que o professor pode perguntar

| Símbolo | Significado conforme o contexto |
| --- | --- |
| = | Atribuição: guarda um valor numa variável ou propriedade. |
| === | Comparação estrita: compara valores sem conversão automática entre tipos. |
| !== | Diferença estrita. |
| ! | Negação; converte o valor para booleano e inverte. |
| && | E lógico; só avalia a expressão à direita se a da esquerda for verdadeira em contexto booleano. |
| \|\| | OU lógico; só avalia a expressão à direita se a da esquerda for falsa em contexto booleano. |
| > e < | Maior que e menor que. |
| + | Soma, ou concatenação se usado com textos; no ID soma 1. |
| () | Parâmetros, chamada de função ou agrupamento de expressão. |
| {} | Bloco de instruções, objeto ou desestruturação, conforme a posição. |
| [] | Array, acesso por índice ou propriedade calculada, conforme a posição. |
| . | Acesso a propriedade ou método: dados.nome, texto.trim(). |
| , | Separa propriedades, argumentos ou itens. |
| : | Separa propriedade e valor em objetos/JSON; em URLs separa host e porta; em node:test identifica módulo interno. |
| ; | Finaliza uma instrução JavaScript; também separa comandos de shell. |
| 'texto' e "texto" | Strings. JSON exige aspas duplas nas chaves e nos textos. |
| => | Cria uma arrow function, uma forma de escrever função. |
| ... | Nos testes, spread: copia propriedades de um objeto para outro. |
| // | Inicia comentário JavaScript até o fim da linha. |
| # | Comentário no Dockerfile; título no Markdown. |
| / | Separador em caminhos e URLs; o significado depende do contexto. |
| ../ | Sobe um diretório em um caminho relativo. |
| ./ | Parte do diretório atual; em require, relativa ao arquivo que faz a importação. |
| - | Pode ser subtração, hífen de um nome ou início de opção de terminal. |
| -- | Costuma iniciar uma opção longa de terminal, como --test. |
| \ | Nos comandos de shell do README/Dockerfile, continua a instrução na linha seguinte. |

O significado depende de onde o símbolo aparece. O hífen em projeto-integrador é parte do nome. Em -p é uma opção do Docker. Em node --test, os dois hífens iniciam a opção que ativa o executor de testes.

As crases usadas em server.js criam uma template string. Dentro dela, a expressão entre dólar e chaves insere o valor de PORT na mensagem.

## 6. Leitura de cada parte da aplicação

### server.js: ligar o servidor

~~~js
const app = require('./src/app');
const PORT = 3000;
~~~

require carrega outro módulo. './src/app' aponta para app.js dentro de src. O Node resolve a extensão .js nesse caso.

app.listen(PORT, callback) começa a escutar conexões. O callback, escrito com () =>, é a função chamada quando o servidor começa a escutar. console.log mostra uma mensagem no terminal; não envia essa mensagem para o cliente HTTP.

Se o professor perguntar por que app e server estão separados: app monta a aplicação; server abre a porta fixa. Os testes importam app para testar a API sem iniciar server.js. Supertest pode abrir uma porta temporária internamente.

### app.js: montar a aplicação

~~~js
const express = require('express');
const app = express();
app.use(express.json());
~~~

A primeira linha importa o pacote Express. A segunda cria a aplicação. A terceira registra um middleware: uma função que participa do processamento da requisição.

express.json() interpreta corpos JSON compatíveis com o Content-Type e coloca o resultado em req.body. Isso não valida as regras do consultor.

app.get('/', ...) registra a mensagem de funcionamento da raiz. app.use(consultorRoutes) conecta as rotas de consultores à aplicação.

O middleware de erros usa quatro parâmetros: erro, req, res, next. Essa assinatura faz o Express reconhecê-lo como tratador de erros. next é o nome convencional para a função que encaminha o processamento, mas não é usada nesse tratador porque ele encerra a resposta.

entity.parse.failed identifica JSON malformado; entity.too.large identifica corpo excessivo. Outros erros que chegam ali recebem 500 e uma mensagem genérica.

module.exports = app disponibiliza essa aplicação para server.js e para os testes. require e module.exports são o sistema de módulos CommonJS.

### routes: escolher a operação

~~~js
router.post('/consultores', controller.cadastrar);
router.get('/consultores', controller.listar);
~~~

express.Router() cria um agrupador de rotas. Para POST, chama cadastrar; para GET, chama listar.

controller.cadastrar aparece sem parênteses porque estamos entregando a função para o Express chamar quando chegar a requisição. Escrever controller.cadastrar() tentaria executá-la imediatamente na configuração.

### controller: entrada e saída HTTP

~~~js
const consultor = service.cadastrar(req.body);
return res.status(201).json({
    mensagem: 'Consultor cadastrado com sucesso!',
    consultor
});
~~~

req é request (requisição); res é response (resposta). req.body contém os dados enviados.

O controller solicita o cadastro ao service e responde com status 201 e JSON. A escrita consultor dentro do objeto é abreviação de consultor: consultor.

status(201).json(...) encadeia chamadas: status configura o código e devolve o objeto de resposta; json envia o corpo.

try tenta executar o bloco. Se o service lançar um erro com throw, catch recebe esse erro. erro.status || 500 usa o status do erro quando ele tem um valor verdadeiro em contexto booleano; caso contrário, usa 500. Não significa que todo erro seja 500.

### service: validar e cadastrar

~~~js
return typeof valor === 'string' && valor.trim().length > 0;
~~~

textoValido verifica duas coisas: o valor deve ser texto e, após remover espaços das pontas, deve ter pelo menos um caractere.

O && faz curto-circuito: se não for texto, a segunda parte não é executada. Isso evita tentar usar trim em um número ou em null.

~~~js
if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    rejeitar('Envie um objeto JSON com os dados do consultor.');
}
~~~

if significa “se”. A condição recusa ausência de dados, tipos inadequados e arrays. !dados também cobre null, que exige cuidado porque typeof null em JavaScript retorna 'object'. Arrays também têm typeof 'object', por isso há Array.isArray.

Depois, o service valida:
- especialidade, nome e contato como textos não vazios;
- experiencia como número inteiro não negativo;
- disponibilidade como booleano.

Number.isInteger rejeita frações e textos numéricos. '3' não é o número 3.

Não usamos simplesmente if (!dados.disponibilidade), porque false é um valor válido para indicar que o profissional está indisponível. O mesmo cuidado vale para experiencia zero.

rejeitar cria um Error, adiciona status 400 e o lança com throw. A execução do cadastro para ali e o controller captura o erro.

Se tudo estiver correto, repository.adicionar recebe um objeto novo. Campos extras enviados pelo cliente não são automaticamente copiados. O ID é calculado pela quantidade atual mais 1. Os textos são normalizados com trim.

Essa geração de ID é suficiente para este exercício sem exclusão e com uma única instância. Não deve ser tratada como solução universal para sistemas distribuídos.

### repository: guardar em memória

~~~js
const consultores = [];
~~~

O array fica no módulo. O cache de módulos do Node faz as importações desse mesmo módulo no processo utilizarem o mesmo armazenamento.

listarTodos devolve a lista. adicionar usa push e devolve o consultor adicionado. limpar define length como 0, esvaziando o mesmo array, e é usada pelos testes. Não existe rota pública para limpar cadastros.

Ao encerrar o processo, esse estado se perde. Não há persistência em arquivo ou banco. A atividade exige isso.

## 7. SOLID: o princípio realmente aplicado

SOLID é um conjunto de cinco princípios de design de software. O enunciado pede demonstrar pelo menos um. Nosso exemplo é SRP: Responsabilidade Única.

Não significa “uma função por arquivo”. Significa organizar cada parte em torno de uma responsabilidade, evitando misturar motivos diferentes de alteração.

- Alterar uma rota: routes.
- Alterar o formato da resposta HTTP: controller.
- Alterar uma regra de cadastro: service.
- Alterar como acessamos os dados: repository.

Fala sugerida: “Aplicamos o SRP ao separar transporte HTTP, regras de negócio e armazenamento. A regra de especialidade fica no service, enquanto o array fica no repository. Assim, uma mudança de regra não exige mexer na resposta HTTP.”

Não afirmem que todos os cinco princípios foram demonstrados ou que existe banco de dados, filtro ou autenticação: esses recursos não estão implementados.

## 8. Como os testes funcionam

Teste automatizado é código que executa uma ação e compara o resultado com o esperado.

node:test fornece test e beforeEach. node:assert/strict fornece verificações que falham quando o resultado diverge. Supertest faz requisições para a aplicação.

~~~js
beforeEach(() => {
    repository.limpar();
});
~~~

Antes de cada teste, a lista é esvaziada. Um teste não depende do cadastro criado em outro.

~~~js
const resposta = await request(app)
    .post('/consultores')
    .send(dadosValidos);

assert.equal(resposta.status, 201);
~~~

async declara uma função assíncrona. await aguarda a conclusão da operação antes de continuar nessa função; não bloqueia todo o servidor.

request(app) fornece a aplicação ao Supertest; post define método e rota; send envia o corpo. assert.equal compara valores. assert.deepEqual compara a estrutura de objetos e arrays. Os métodos vêm do assert/strict.

Os três cenários obrigatórios são cadastro válido, cadastro inválido e consulta. A suíte tem 20 testes, contando casos adicionais gerados por laços for...of.

Outros símbolos usados nos testes:
- const { test, beforeEach } extrai propriedades de um objeto: desestruturação.
- const [campo, valor] extrai posições de um array.
- { ...dadosValidos, disponibilidade: false } copia os campos e substitui disponibilidade, porque a propriedade posterior prevalece.
- [campo]: valor usa o conteúdo da variável campo como nome da propriedade.
- resposta.body[0] acessa o primeiro item; índices começam em zero.
- JSON.stringify converte um valor JavaScript em texto JSON.
- 'a'.repeat(110 * 1024) cria um texto grande para testar o limite do corpo.

Fala sugerida: “O teste inválido verifica 400, a mensagem e que a lista continua vazia. Isso prova que a informação foi recusada antes de ser armazenada.”

## 9. package.json e comandos npm

package.json descreve o projeto; não é o código do servidor.

- name e description identificam o pacote.
- version é a versão do projeto.
- main aponta para a entrada do pacote; quem liga a API em npm start é o script start.
- scripts define comandos: start executa node server.js; test executa node --test.
- type: commonjs informa o sistema de módulos.
- dependencies contém Express, necessário em execução.
- devDependencies contém Supertest, necessário para desenvolvimento e testes.
- engines indica Node >=22; >= significa maior ou igual. Isso declara compatibilidade e não instala o Node automaticamente.
- ^ nas versões permite atualizações compatíveis segundo as regras de versão semântica; o lock registra a resolução exata.
- keywords e author são metadados. O campo license declara ISC; não é uma dependência ou funcionalidade da API.

npm ci instala conforme o lock, recria node_modules e falha se o lock estiver incompatível com package.json. npm install também pode atualizar o lock ao alterar dependências.

Nunca altere o lock apenas para fingir uma versão de biblioteca: use o npm quando mudar dependências.

## 10. Docker, linha por linha

Docker empacota a aplicação e o ambiente de execução. Imagem é o pacote construído; container é uma instância dessa imagem em execução. Não é necessário instalar o Node do projeto diretamente na máquina para executar a imagem, mas é necessário ter Docker funcionando.

| Instrução | Explicação |
| --- | --- |
| FROM node:24-alpine | Usa como base uma imagem com Node 24 e Linux Alpine. Os dois-pontos separam nome e tag. |
| WORKDIR /app | Define o diretório de trabalho dentro da imagem. Não é a pasta /app do computador do apresentador. |
| ENV NODE_ENV=production | Define uma variável indicando ambiente de produção. |
| COPY --chown=node:node ... ./ | Copia arquivos para o diretório atual e define proprietário e grupo node. |
| RUN ... | Executa comandos durante a construção da imagem. |
| npm ci --omit=dev | Instala as dependências de execução sem as de desenvolvimento. |
| npm cache clean --force | Limpa o cache npm usado na construção; --force autoriza essa limpeza. |
| USER node | Define um usuário sem privilégios de root para executar a aplicação. |
| EXPOSE 3000 | Documenta a porta; não publica a porta no computador. |
| CMD ["node", "server.js"] | Comando padrão quando o container é iniciado; é uma lista de argumentos, não uma função JavaScript. |

O trecho opcional do RUN existe para redes com proxy HTTPS:
- --mount=type=secret,id=npm_ca disponibiliza temporariamente um arquivo de certificado fornecido ao build.
- if [ -f ... ]; then ...; fi é sintaxe de shell, não JavaScript. -f verifica a existência de um arquivo regular.
- export NODE_EXTRA_CA_CERTS=... informa ao Node onde está a autoridade certificadora extra.
- Não desativa HTTPS e não grava o certificado na imagem.
- Sem esse secret, o build segue com os certificados padrão.
- && só executa a limpeza do cache se a instalação tiver sucesso.
- A barra invertida ao fim da linha continua a instrução na próxima linha.

~~~bash
docker build -t projeto-integrador .
~~~

build constrói a imagem; -t dá um nome/tag; o ponto final é o diretório usado como contexto do build.

~~~bash
docker run --rm -p 3000:3000 --name api-consultores projeto-integrador
~~~

run cria e inicia o container. --rm remove o container quando ele termina. -p publica a porta: à esquerda, a porta do computador; à direita, a porta dentro do container. --name define o nome do container. O último argumento é a imagem.

Se a porta local 3000 estiver ocupada, pode usar -p 3001:3000 e acessar localhost:3001. A aplicação dentro do container continua na porta 3000.

Não rode npm start e o container ao mesmo tempo usando a mesma porta local. docker stop api-consultores encerra o container.

## 11. Ler os comandos curl do README

~~~bash
curl -i -X POST http://localhost:3000/consultores \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana","especialidade":"Tecnologia","experiencia":0,"disponibilidade":false,"contato":"ana@example.com"}'
~~~

- curl faz uma requisição HTTP.
- -i inclui os cabeçalhos da resposta, permitindo mostrar o status.
- -X POST escolhe o método POST.
- -H envia um cabeçalho.
- -d envia o corpo de dados.
- Aspas simples externas preservam o texto JSON no shell; aspas duplas internas pertencem ao JSON.
- A barra invertida no fim da linha continua o comando em shells como Bash.

No PowerShell, prefira curl.exe em uma linha para evitar diferenças de alias e continuação de linha. Também é possível usar Postman e selecionar Body > raw > JSON.

## 12. Plano para a apresentação de hoje

Sugestão de divisão entre os cinco nomes recebidos; não descreve contribuições individuais passadas:

| Integrante | Parte sugerida |
| --- | --- |
| Willyan Barbosa Araujo | Contexto, problema, MVP e visão geral do fluxo. |
| Julio Cesar Coelho Barbosa | Modelo de dados, rotas e demonstração de POST e GET. |
| João Vinicius dos Santos Amaro | Controller, service, validações e demonstração do erro 400. |
| Gabriel de Sousa Dias | Repository, memória, SRP e testes automatizados. |
| Angelo Antonio Ribeiro | Dockerfile, execução do container e histórico no GitHub. |

Todos devem saber o fluxo completo, porque o professor pode perguntar a qualquer integrante.

Sequência prática:
1. Abra o README, o código e o terminal.
2. Execute npm ci e npm test antes da apresentação.
3. Prepare a imagem com docker build -t projeto-integrador . antes, para não depender do download ao vivo.
4. Inicie o container e mostre GET vazio.
5. Faça POST válido, depois GET.
6. Faça POST sem especialidade e mostre 400; repita GET para comprovar que nada inválido entrou.
7. Mostre service, repository e controller para explicar SRP.
8. Execute npm test e explique os três cenários mínimos.
9. Mostre Dockerfile e histórico GitHub.
10. Encerre o container.

## 13. Perguntas prováveis e respostas

**Por que não tem banco?** O enunciado exige armazenamento em memória nesta etapa.

**Se fechar o programa, perde os dados?** Sim. O array está na memória do processo e não foi persistido.

**Por que precisa de especialidade?** A empresa precisa identificar a área de atuação dos profissionais; é a regra principal escolhida.

**O sistema filtra disponíveis?** A consulta retorna todos, com o campo disponibilidade. Não há filtro implementado.

**Por que aceitar false?** Porque representa um profissional cadastrado, mas indisponível.

**Por que não tem tela?** O produto solicitado é uma API; frontend não é exigido.

**Por que separar em camadas?** Para separar responsabilidades HTTP, validação e armazenamento e facilitar mudanças.

**Por que 201 no POST e 200 no GET?** 201 informa criação de recurso; 200 informa sucesso da consulta.

**Por que testar o inválido?** Para comprovar que a regra é respeitada e o dado recusado não é salvo.

**Qual a diferença entre RUN e CMD?** RUN acontece no build; CMD define o comando padrão de execução do container.

**EXPOSE publica a porta?** Não. Quem publica no comando mostrado é -p.

**Por que limpar antes de cada teste?** Para impedir que os dados de um teste alterem o resultado de outro.

**O que mudaria para exigir dois anos de experiência?** No service, a condição de experiencia passaria a rejeitar valores menores que 2; também seria necessário atualizar testes, mensagens e documentação. É uma hipótese de exercício, não a regra atual.

**Por que existem 20 testes se pediram três?** Três são o mínimo; os adicionais conferem casos de limite e erros.

**Podemos dizer que implementamos tudo do SOLID?** Não. A explicação demonstrada é SRP.

## 14. Exercício final de compreensão

Sem ler as respostas acima, cada integrante deve conseguir:
1. Explicar a necessidade da empresa em uma frase.
2. Dizer qual arquivo recebe POST e qual valida a especialidade.
3. Seguir o caminho de um cadastro até o array e de volta à resposta.
4. Explicar por que false e zero são válidos.
5. Explicar require, const, return, throw, try/catch e module.exports.
6. Identificar o significado de -, --, /, ./, ../, {}, [] e => em um trecho real.
7. Executar um teste e explicar a verificação feita.
8. Diferenciar imagem de container e RUN de CMD.

Se algum passo não estiver claro, volte ao arquivo correspondente e pratique com uma requisição. Compreender um exemplo executável ajuda mais do que decorar uma definição.
