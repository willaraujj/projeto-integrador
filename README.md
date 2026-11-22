# API de Gestão de Consultores

API REST acadêmica para centralizar o cadastro e a consulta de consultores. O backend usa Node.js, Express e PostgreSQL; a especialidade é obrigatória e os dados ficam persistidos no banco.

## Executar com Docker

Requer Docker com o plugin Compose. Na raiz deste projeto:

```bash
docker compose up --build
```

A API ficará disponível em `http://localhost:3000`. O CORS permite, por padrão, o frontend local em `http://localhost:5173`; altere `FRONTEND_ORIGIN` no Compose para outro endereço (várias origens podem ser separadas por vírgula). O Compose inicia o PostgreSQL, aguarda o banco ficar saudável e então inicia a API. A tabela é criada automaticamente. Para encerrar, use `docker compose down`; os dados permanecem no volume. Para apagar também os dados persistidos, use `docker compose down -v`.

## Estrutura do código

```text
src/
├── routes/          # Define os caminhos HTTP e associa cada rota ao controller
├── controllers/     # Recebe requisições e monta respostas HTTP
├── services/        # Aplica validações e regras de negócio
├── repositories/    # Executa consultas e gravações no PostgreSQL
├── database.js      # Configura conexão e criação da tabela
└── server.js        # Inicializa Express, middlewares e servidor
```
## Rotas

| Método | Caminho | Descrição |
| --- | --- | --- |
| GET | `/health` | Verifica API e conexão com o banco |
| GET | `/api/consultores` | Lista consultores cadastrados |
| GET | `/api/consultores/:id` | Consulta um consultor pelo identificador |
| POST | `/api/consultores` | Cadastra um consultor |

### Cadastrar consultor

```bash
curl.exe -X POST http://localhost:3000/api/consultores -H "Content-Type: application/json" -d '{"nome":"Ana Souza","especialidades":["Gestão de projetos","Processos"],"experiencia":"5 anos em consultoria","disponibilidade":true,"contato":"ana@example.com"}'
```

Para cadastrar somente uma especialidade, também é possível enviar um texto sem colchetes usando o campo `especialidade`:

```json
{
  "nome": "Júlio",
  "especialidade": "Secretariado Escolar",
  "experiencia": "1 ano",
  "disponibilidade": true,
  "contato": "87 999669396"
}
```

Campos aceitos:

- `nome` (obrigatório): texto de até 160 caracteres.
- `especialidade` (obrigatório para um item): texto sem colchetes; ou `especialidades`: lista de textos com pelo menos um item não vazio.
- `experiencia` (opcional): texto livre.
- `disponibilidade` (opcional): booleano; assume `true` se omitido.
- `contato` (opcional): texto livre, por exemplo e-mail ou telefone.

A criação retorna HTTP `201`. Dados inválidos retornam `400` com os detalhes da validação.

### Listar consultores

```bash
curl http://localhost:3000/api/consultores
```

A resposta contém `dados` (lista) e `total`.

## Desenvolvimento sem Docker

Requer Node.js 20+ e PostgreSQL. Configure `DATABASE_URL`, instale as dependências e inicie:

```bash
npm install
$env:DATABASE_URL="postgres://consultores:consultores@localhost:5432/gestao_consultores"
npm run dev
```

Em shells bash, configure com `export DATABASE_URL=...` no lugar da linha `$env:...`.


