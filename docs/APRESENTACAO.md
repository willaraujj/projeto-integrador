# Roteiro de demonstração

1. Inicie os serviços na raiz com `docker compose up --build`.
2. Consulte `http://localhost:3000/health` para mostrar a conexão com o banco.
3. Cadastre um consultor usando o exemplo do README.
4. Liste os consultores em `GET /api/consultores` e consulte um pelo ID.
5. Tente cadastrar sem especialidade para demonstrar a validação HTTP 400.
6. Explique o fluxo `Routes → Controller → Service → Repository → PostgreSQL`.
7. Mostre que o volume do PostgreSQL mantém os dados depois de `docker compose down` e nova inicialização.
