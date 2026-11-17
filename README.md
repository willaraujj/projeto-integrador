# Projeto Integrador — API de Gestão de Consultores

Projeto acadêmico desenvolvido para a atividade **Desenvolvimento de uma API para um Problema Real**, do Projeto Integrador de Sistemas de Informação / Ciência da Computação da **FACAPE**.

A proposta é construir um MVP (Produto Mínimo Viável) com uma API REST pequena, organizada e capaz de atender a uma necessidade de negócio.

## Problema e solução

O domínio implementado é a gestão de consultores: centralizar o cadastro de profissionais e permitir a consulta de suas informações, como especialidade, experiência, disponibilidade e contato.

A API oferece duas operações principais: **cadastrar um consultor** e **listar os consultores cadastrados**. O detalhamento do cliente e do problema específico deverá ser complementado pela equipe conforme o briefing recebido.

Os dados são armazenados em um array em memória. Ao reiniciar a aplicação, todos os cadastros são perdidos, conforme previsto nesta etapa da atividade.

## Tecnologias utilizadas

- **Node.js** com módulos CommonJS.
- **Express 5** para as rotas e o tratamento de requisições HTTP.
- **Node Test Runner** (`node:test`) e `node:assert/strict` para os testes.
- **Supertest** para testar os endpoints.
- **npm** para gerenciar as dependências.
- **Git e GitHub** para versionamento.

O uso de **Docker** é exigido pela atividade, mas o repositório ainda não possui um `Dockerfile`.

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
node server.js
```

A API estará disponível em **http://localhost:3000**.

A porta está definida como `3000` em `server.js`. Para encerrar a aplicação, pressione `Ctrl+C`.

## Modelo de dados

| Campo | Tipo esperado | Descrição |
| --- | --- | --- |
| `id` | Número | Gerado pela aplicação a partir da quantidade de registros em memória. |
| `nome` | Texto | Nome do consultor. |
| `especialidade` | Texto | Área de atuação do consultor; campo obrigatório e validado. |
| `experiencia` | Número | Experiência do consultor; a unidade deve ser definida pela equipe. |
| `disponibilidade` | Booleano | Indica a disponibilidade do profissional. |
| `contato` | Texto | Informação de contato do consultor. |

Atualmente, somente `especialidade` possui validação de negócio. Os demais campos são recebidos e armazenados sem validação de tipo ou obrigatoriedade.

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

O armazenamento em memória é limpo antes de cada teste para isolar os cenários.

## Execução com Docker — pendente

A atividade exige criar a imagem, executar um container e acessar a API dentro dele. **O Dockerfile ainda precisa ser implementado**, portanto essa forma de execução ainda não está disponível.

Após adicionar um Dockerfile que instale as dependências e execute `node server.js`, os comandos previstos são:

```bash
docker build -t projeto-integrador .
docker run --rm -p 3000:3000 --name api-consultores projeto-integrador
```

Com o container em execução, o acesso deverá ocorrer em `http://localhost:3000/consultores`.

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

- [ ] Complementar a descrição do problema com o briefing específico do cliente.
- [ ] Informar os integrantes da equipe.
- [ ] Executar e conferir os três testes automatizados com `npm test`.
- [ ] Implementar o Dockerfile e validar a construção da imagem e a execução do container.
- [ ] Demonstrar o cadastro válido, o cadastro inválido e a consulta.
- [ ] Explicar o modelo de dados e as decisões da solução.
- [ ] Mostrar a aplicação do SRP no código.
- [ ] Apresentar o histórico de commits e garantir acesso do professor ao repositório.

**Data da apresentação:** a ser definida, conforme o enunciado.

## Referência e uso de IA

Este README foi elaborado com base na atividade **Projeto Integrador — Sistemas de Informação / Ciência da Computação — FACAPE** e na implementação disponível neste repositório.

A atividade permite o uso de inteligência artificial, mas a equipe continua responsável por compreender, executar, testar, modificar e explicar toda a solução entregue.
