# Gestão de Consultores

API REST acadêmica para centralizar o cadastro e a consulta de consultores. Utiliza Node.js, Express e PostgreSQL, com persistência de dados, validação da regra de especialidade obrigatória e estrutura em camadas.

## Executar com Docker

Requer Docker com Docker Compose. Na raiz do projeto:

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`. O PostgreSQL e a tabela são inicializados pelo Compose. Os dados ficam em volume e permanecem após `docker compose down`. Para apagar também o banco, execute `docker compose down -v`.

## Rotas

| Método | Caminho | Descrição |
| --- | --- | --- |
| GET | `/health` | Verifica API e conexão com PostgreSQL |
| GET | `/api/consultores` | Lista os consultores cadastrados |
| GET | `/api/consultores/:id` | Busca um consultor pelo ID |
| POST | `/api/consultores` | Cadastra um consultor |

Exemplo de cadastro:

```bash
curl.exe -X POST http://localhost:3000/api/consultores -H "Content-Type: application/json" -d '{"nome":"Ana Souza","especialidades":["Gestão de projetos","Processos"],"experiencia":"5 anos em consultoria","disponibilidade":true,"contato":"ana@example.com"}'
```

`nome` e `especialidades` são obrigatórios. A lista de especialidades deve conter pelo menos um texto não vazio. `experiencia` e `contato` são textos opcionais. `disponibilidade` é booleana e assume `true` quando omitida. O cadastro retorna HTTP 201; dados inválidos retornam HTTP 400.

## Estrutura

```text
src/
├── routes/          # Rotas HTTP
├── controllers/     # Tratamento de requisições e respostas
├── services/        # Validações e regras de negócio
├── repositories/    # Consultas e gravações no PostgreSQL
├── database.js      # Conexão e inicialização da tabela
└── server.js        # Inicialização do Express
```

Fluxo: `Routes → Controller → Service → Repository → PostgreSQL`.

O CORS permite por padrão o frontend local em `http://localhost:5173`. Altere `FRONTEND_ORIGIN` no `docker-compose.yml` para usar outra origem.

## Executar sem Docker

Requer Node.js 20+ e PostgreSQL. Defina `DATABASE_URL` para o banco e execute:

```bash
npm install
npm start
```

## Integrantes

- Willyan Barbosa Araujo
- Julio Cesar Coelho Barbosa
- João Vinicius dos Santos Amaro
- Gabriel de Sousa Dias
- Angelo Antonio Ribeiro

Projeto 5 — Gestão de Consultores, Sistemas de Informação / Ciência da Computação, FACAPE.
