# Guia rápido de estudo

A API centraliza dados de consultores e permite cadastrar e consultar profissionais.

## Conceitos

- **API REST:** interface HTTP que recebe JSON e responde com dados e códigos de status.
- **Rota:** associa um caminho e método HTTP a uma ação, por exemplo `GET /api/consultores`.
- **Controller:** transforma a requisição HTTP em chamada ao serviço e devolve a resposta.
- **Service:** aplica as regras de negócio; aqui, exige nome e pelo menos uma especialidade.
- **Repository:** executa SQL para consultar e persistir consultores.
- **PostgreSQL:** banco relacional que mantém os dados após reiniciar a API.
- **Docker Compose:** inicia API e banco, configura a rede e mantém os dados em volume.

## Arquivos principais

- `src/routes/consultores.routes.js`: declaração das rotas.
- `src/controllers/consultores.controller.js`: manipuladores HTTP.
- `src/services/consultores.service.js`: validação e regras do domínio.
- `src/repositories/consultores.repository.js`: comandos SQL.
- `src/database.js`: conexão com PostgreSQL e criação da tabela.
- `src/server.js`: configuração e inicialização do Express.
- `Dockerfile` e `docker-compose.yml`: execução em containers.

A regra do MVP é que cada consultor tenha pelo menos uma especialidade. A API valida essa regra antes de gravar e o banco também impede registros sem especialidade.
