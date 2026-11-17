# Roteiro de apresentação — Gestão de Consultores

## 1. Problema e solução

Uma empresa de serviços precisa centralizar as informações de seus consultores e saber quais estão disponíveis e quais são suas especialidades. O MVP oferece cadastro e consulta por uma API REST, conforme o Projeto 5 do briefing.

## 2. Modelo de dados

Explique os campos `nome`, `especialidade`, `experiencia` (anos completos), `disponibilidade` (booleano) e `contato`. O `id` é gerado pela aplicação. O contato aceita texto, permitindo telefone ou e-mail. A consulta devolve todos os consultores com suas informações; filtros não são necessários ao MVP.

## 3. Demonstração local

1. Execute `npm ci` e `npm start` na raiz do projeto.
2. Em outro terminal, execute `curl http://localhost:3000/consultores`: a lista deve estar vazia após uma inicialização nova.
3. Execute o exemplo de POST válido do README: espere HTTP 201 e o consultor criado.
4. Repita o GET e mostre a disponibilidade e a especialidade.
5. Cadastre outro profissional com `disponibilidade: false` para demonstrar a diferença.
6. Execute o exemplo sem especialidade: espere HTTP 400.
7. Consulte novamente e mostre que o cadastro inválido não entrou na lista.

## 4. Organização e SOLID

Abra os arquivos seguindo o fluxo:

1. `src/routes/consultorRoutes.js`: direciona POST e GET.
2. `src/controllers/consultorController.js`: recebe os dados e define a resposta HTTP.
3. `src/services/consultorService.js`: valida a especialidade e os demais campos, normaliza textos e monta o cadastro.
4. `src/repositories/consultorRepository.js`: acessa o array em memória.

O SRP (Responsabilidade Única) aparece nessa divisão. Uma alteração na regra da especialidade pertence ao service; uma alteração no armazenamento pertence ao repository. A equipe deve explicar isso a partir do código.

Não há banco de dados: encerrar e reiniciar o processo apaga os registros, como previsto na atividade. O ID baseado no tamanho da lista é adequado ao escopo atual, que não possui exclusão nem concorrência entre múltiplas instâncias.

## 5. Testes automatizados

Execute `npm test`. Mostre os cenários obrigatórios de cadastro válido, cadastro inválido e consulta. Explique que Supertest faz as requisições para a aplicação e que `beforeEach` limpa o array antes de cada teste, evitando dependência entre cenários.

Mostre também os testes de disponibilidade falsa, experiência zero e validação de tipos. Eles evitam rejeitar valores válidos ou armazenar informações inconsistentes.

## 6. Docker

Encerre a execução local para liberar a porta 3000. Execute:

```bash
docker build -t projeto-integrador .
docker run --rm -p 3000:3000 --name api-consultores projeto-integrador
```

Em outro terminal, repita as requisições do README. Explique `FROM`, `WORKDIR`, `COPY`, `RUN`, `USER`, `EXPOSE` e `CMD` lendo o Dockerfile. A opção `-p` publica a porta do container; `EXPOSE` apenas documenta a porta utilizada.

Encerre com `docker stop api-consultores`.

## 7. GitHub e entrega

Mostre código, testes, Dockerfile, README e histórico de commits. Garanta que o professor tenha acesso ao repositório privado. Cada integrante deve contribuir com commits identificáveis e conhecer a solução inteira.

## Preparação da equipe

- Preencha os nomes e perfis no README (até 6 integrantes).
- Execute testes e container no computador usado na apresentação.
- Treine explicar e alterar uma validação ou teste.
- Explique o uso de IA com transparência: a responsabilidade pelo código é da equipe.

Não é necessário acrescentar frontend, autenticação, banco, PUT ou DELETE para esta entrega. A data da apresentação será definida pelo professor.
