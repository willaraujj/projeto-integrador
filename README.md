# Projeto Integrador — API de Gestão de Consultores

Projeto acadêmico desenvolvido para a atividade **Desenvolvimento de uma API para um Problema Real**, do Projeto Integrador de Sistemas de Informação / Ciência da Computação da **FACAPE**.

A proposta é construir um MVP (Produto Mínimo Viável) com uma API REST pequena, organizada e capaz de atender a uma necessidade de negócio.

## Problema e solução

Uma empresa de serviços trabalha com diversos consultores e precisa organizar as informações da equipe. A empresa deseja saber quais profissionais estão disponíveis e quais são suas especialidades.

O **Projeto 5 — Gestão de Consultores** atende à necessidade de centralizar essas informações por meio de uma API para cadastro e consulta de profissionais, incluindo especialidade, experiência, disponibilidade e contato.

A API oferece duas operações principais: **cadastrar um consultor** e **listar os consultores cadastrados**. A consulta retorna a disponibilidade e a especialidade de cada profissional para apoiar essa organização.

Os dados são armazenados em um array em memória. Ao reiniciar a aplicação, todos os cadastros são perdidos, conforme previsto nesta etapa da atividade.

## Tecnologias utilizadas

- **Node.js** com módulos CommonJS.
- **Express 5** para as rotas e o tratamento de requisições HTTP.
- **Node Test Runner** (`node:test`) e `node:assert/strict` para os testes.
- **Supertest** para testar os endpoints.
- **npm** para gerenciar as dependências.
- **Git e GitHub** para versionamento.

**Docker** permite construir e executar a API em um container com Node.js 24 Alpine.

## Como executar

### Pré-requisitos

- Node.js **22 ou superior**, recomendado.
- npm.
- Git para clonar o repositório.
- Permissão de acesso ao repositório, caso ele permaneça privado.

### Instalação e inicialização

```bash
git clone https://github.com/willaraujj/projeto-integrador.git
cd projeto-integrador
npm ci
npm start
```

A API estará disponível em **http://localhost:3000**.

A porta está definida como `3000` em `server.js`. Para encerrar a aplicação, pressione `Ctrl+C`.

## Modelo de dados

| Campo | Tipo esperado | Descrição |
| --- | --- | --- |
| `id` | Número | Gerado pela aplicação a partir da quantidade de registros em memória. |
| `nome` | Texto | Nome do consultor. |
| `especialidade` | Texto | Área de atuação do consultor; campo obrigatório e validado. |
| `experiencia` | Número | Experiência em anos completos (inteiro maior ou igual a zero). |
| `disponibilidade` | Booleano | Indica a disponibilidade do profissional. |
| `contato` | Texto | Informação de contato do consultor. |

Todos os campos enviados no exemplo de cadastro são obrigatórios. `nome`, `especialidade` e `contato` devem ser textos não vazios e têm os espaços externos removidos. `experiencia` deve ser um inteiro maior ou igual a zero. `disponibilidade` deve ser um booleano (`true` ou `false`), inclusive para profissionais indisponíveis. O `id` é gerado pela API. O contato pode ser um telefone ou e-mail; seu formato não é validado.

Dados inválidos retornam HTTP 400 e uma mensagem em JSON. JSON malformado também retorna HTTP 400; corpos acima do limite padrão do Express (100 KB) retornam HTTP 413.

## Regra de negócio

**Todo consultor deve possuir uma especialidade.**

O cadastro é rejeitado quando `especialidade`:

- não é informada;
- não é uma string;
- é vazia ou contém apenas espaços.

A validação está em [consultorService.js](src/services/consultorService.js). Espaços no início e no final de uma especialidade válida são removidos antes do armazenamento.

Quando a regra é violada, a API retorna **HTTP 400**:

```json
{
  "mensagem": "O consultor precisa possuir uma especialidade."
}
```

## Endpoints disponíveis

URL base: `http://localhost:3000`.

| Método | Rota | Descrição | Resposta de sucesso |
| --- | --- | --- | --- |
| `POST` | `/consultores` | Cadastra um consultor. | `201 Created` |
| `GET` | `/consultores` | Lista todos os consultores cadastrados. | `200 OK` |
| `GET` | `/` | Exibe uma mensagem de funcionamento da API. | `200 OK` |

A rota raiz é auxiliar. As duas operações principais do MVP são o cadastro e a consulta de consultores.

### Cadastrar um consultor

```bash
curl -X POST http://localhost:3000/consultores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Souza",
    "especialidade": "Tecnologia",
    "experiencia": 3,
    "disponibilidade": true,
    "contato": "ana@example.com"
  }'
```

Exemplo de resposta para o primeiro cadastro após iniciar a aplicação — **201 Created**:

```json
{
  "mensagem": "Consultor cadastrado com sucesso!",
  "consultor": {
    "id": 1,
    "nome": "Ana Souza",
    "especialidade": "Tecnologia",
    "experiencia": 3,
    "disponibilidade": true,
    "contato": "ana@example.com"
  }
}
```

### Consultar os consultores

```bash
curl http://localhost:3000/consultores
```

Exemplo de resposta após o cadastro anterior — **200 OK**:

```json
[
  {
    "id": 1,
    "nome": "Ana Souza",
    "especialidade": "Tecnologia",
    "experiencia": 3,
    "disponibilidade": true,
    "contato": "ana@example.com"
  }
]
```

Se nenhum consultor tiver sido cadastrado, a resposta será `[]`.

### Demonstrar um cadastro inválido

```bash
curl -i -X POST http://localhost:3000/consultores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Silva",
    "experiencia": 2,
    "disponibilidade": true,
    "contato": "carlos@example.com"
  }'
```

A resposta será **400 Bad Request**, com a mensagem da regra de negócio apresentada acima. O consultor não será cadastrado.

## Organização do código e SOLID

```text
projeto-integrador/
├── Dockerfile
├── .dockerignore
├── docs/
│   └── APRESENTACAO.md
├── server.js
├── package.json
├── package-lock.json
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── consultorRoutes.js
│   ├── controllers/
│   │   └── consultorController.js
│   ├── services/
│   │   └── consultorService.js
│   └── repositories/
│       └── consultorRepository.js
└── tests/
    └── consultor.test.js
```

O fluxo das operações é:

```text
Requisição HTTP → Routes → Controller → Service → Repository → Array em memória
```

| Camada | Responsabilidade |
| --- | --- |
| Routes | Associar métodos e caminhos HTTP às funções do controller. |
| Controller | Receber a requisição e devolver a resposta HTTP. |
| Service | Aplicar a regra de negócio e preparar os dados do cadastro. |
| Repository | Armazenar e consultar os registros em memória. |

A separação demonstra o **SRP — Princípio da Responsabilidade Única**, um dos princípios SOLID. Por exemplo, a validação da especialidade fica no service, enquanto o acesso ao array fica no repository. Isso evita concentrar regras de negócio, persistência e respostas HTTP em uma única função e permite alterar cada responsabilidade separadamente.

## Como executar os testes

Depois de instalar as dependências:

```bash
npm test
```

O comando executa `node --test`. Não é necessário iniciar `server.js`: o Supertest utiliza a aplicação exportada por `src/app.js`.

Os três cenários exigidos pela atividade estão em [consultor.test.js](tests/consultor.test.js):

| Cenário | Verificação |
| --- | --- |
| Cadastro válido | Retorna HTTP 201 e o nome do consultor cadastrado. |
| Cadastro inválido | Rejeita a ausência de especialidade com HTTP 400 e mantém o armazenamento vazio. |
| Consulta | Retorna HTTP 200 e o consultor previamente cadastrado. |

A suíte também cobre consulta vazia, especialidades inválidas, tipos incorretos, ausência de corpo, JSON malformado, geração de IDs e normalização dos textos. Confere ainda que disponibilidade `false` e experiência zero são aceitas.

O armazenamento em memória é limpo antes de cada teste para isolar os cenários.

## Execução com Docker

Com o Docker instalado e em execução (com BuildKit, padrão nas versões atuais), na raiz do projeto:

```bash
docker build -t projeto-integrador .
docker run --rm -p 3000:3000 --name api-consultores projeto-integrador
```

Em outro terminal, confirme o acesso:

```bash
curl http://localhost:3000/
curl http://localhost:3000/consultores
```

Os exemplos de cadastro deste README também funcionam com o container. Se a porta 3000 estiver ocupada por uma execução local, encerre-a antes de iniciar o container.

Para encerrar:

```bash
docker stop api-consultores
```

O Dockerfile instala somente as dependências de produção com `npm ci --omit=dev`, copia o código e inicia `server.js` com o usuário `node`. A imagem não inclui testes nem dependências de desenvolvimento. Execute `npm test` no ambiente de desenvolvimento antes da construção.

Em redes com proxy HTTPS que exigem uma autoridade certificadora própria, forneça o certificado público apenas durante o build:

```bash
docker build --secret id=npm_ca,src=/caminho/ca-do-proxy.crt -t projeto-integrador .
```

Esse certificado é opcional, não é copiado para a imagem e não deve ser versionado. Em uma rede comum, utilize o comando de build padrão.

O armazenamento continua em memória: ao reiniciar ou recriar o container, os registros são perdidos. Não há banco de dados nem volume persistente nesta etapa.

## Validação da implementação

Na revisão de 17/11/2026, os **20 testes automatizados passaram**. A imagem Docker foi construída e o container foi verificado pela porta publicada: consulta vazia (200), cadastro válido (201), cadastro inválido (400) e consulta dos dados (200). A execução com o usuário `node` também foi confirmada.

O build neste ambiente utilizou o certificado público do proxy pelo secret opcional `npm_ca`. Nenhum certificado foi incluído no repositório ou na imagem.

## Escopo da atividade

O MVP contempla cadastro, consulta, regra de negócio, armazenamento em memória, organização em camadas e testes automatizados. A entrega também exige Dockerfile e histórico de desenvolvimento no GitHub.

Não são exigidos nesta etapa: frontend, banco de dados, login, JWT, autenticação, autorização, operações PUT e DELETE, upload de arquivos, Kubernetes, microsserviços ou deploy em produção.

## Integrantes da equipe

**A preencher pela equipe — máximo de 6 integrantes, conforme a atividade.**

| Nome | GitHub |
| --- | --- |
| A informar | A informar |

Todos os integrantes devem conhecer a implementação e estar preparados para explicar o código, os testes, a regra de negócio, o uso de Git, Docker e SOLID.

## Checklist para entrega e apresentação

- [x] Documentar o problema conforme o briefing Gestão de Consultores.
- [ ] Informar os integrantes da equipe.
- [ ] Executar `npm test` no ambiente da apresentação.
- [x] Implementar Dockerfile e .dockerignore.
- [ ] Construir a imagem e executar o container no computador da apresentação.
- [ ] Demonstrar o cadastro válido, o cadastro inválido e a consulta.
- [ ] Explicar o modelo de dados e as decisões da solução.
- [ ] Mostrar a aplicação do SRP no código.
- [ ] Apresentar o histórico de commits e garantir acesso do professor ao repositório.

Consulte o [roteiro de apresentação](docs/APRESENTACAO.md) para demonstração e explicação das decisões.

**Data da apresentação:** a ser definida, conforme o enunciado.

## Referência e uso de IA

Este README foi elaborado com base na atividade **Projeto Integrador — Sistemas de Informação / Ciência da Computação — FACAPE** e na implementação disponível neste repositório.

A atividade permite o uso de inteligência artificial, mas a equipe continua responsável por compreender, executar, testar, modificar e explicar toda a solução entregue.
