# Sistema de Cobrança

## 🚀Tecnologias Utilizadas

### Frontend

- React 19 & Vite: Biblioteca principal para criação de interfaces modernas e rápidas.

- Axios: Utilizado para conectar o frontend com a sua API de cobranças.

- HTML5 & CSS3: Estrutura de dados e estilização visual do sistema.

- Hooks (useState, useEffect, useRef): Utilizados para gerenciar o estado das cobranças, carregar dados da API e controlar o foco dos campos de entrada automaticamente.

### Backend

- Java 21: Versão estável mais recente (LTS) com foco em performance.

- Spring Boot 3: Framework para criação da API REST.

- Spring Data JPA: Abstração da camada de banco de dados, incluindo suporte a Pagination & Sorting.

- MySQL: Armazenamento persistente dos dados de cobrança.

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos

- Node.js versão 24.13.0 instalado.
- Java JDK 21.
- MySQL Server rodando.

### 2. Configuração do Banco de Dados

No MySQL, crie o banco de dados:

```
SQL

 CREATE DATABASE cobranca_db;

```

### 3. Executando o Backend

- Navegue até a pasta API Backend.
- Verifique o arquivo src/main/resources/application.properties e ajuste seu usuário/senha do MySQL.
- Execute o projeto via sua IDE (IntelliJ/VS Code) ou pelo terminal:

```
Bash

./mvnw spring-boot:run

```

O servidor estará disponível em: http://localhost:8080

### 4. Executando o Frontend

- Navegue até a pasta APP Frontend.
- Instale as dependências e inicie:

```
Bash

npm install
npm run dev

```

O frontend estará disponível em: http://localhost:5173

## 📌 Funcionalidades Principais

- Máscara de Moeda Dinâmica: O campo de valor formata automaticamente enquanto o usuário digita (R$ 0,00) e bloqueia letras.

- Foco Inteligente: Ao preencher um campo e apertar Enter, o foco pula automaticamente para o próximo campo ou botão.

- Busca em Tempo Real: Filtro de clientes por nome utilizando busca otimizada (startsWith).

- Paginação de Resultados: Listagem otimizada que carrega os dados em partes, garantindo rapidez mesmo com grandes volumes de registros.

- Gestão de Status: Interface intuitiva que permite dar baixa em cobranças com apenas um clique.
- Validação de Dados (Frontend e Backend): Garante a integridade dos dados impedindo cadastros com valores zerados ou nomes vazios, exibindo alertas amigáveis ao usuário.

- Interface e Layout (CSS Grid): Para a exibição das cobranças, utilizei o CSS Grid Layout. Essa escolha foi feita para garantir que o sistema seja totalmente responsivo e organizado.

## 📂 Estrutura de Endpoints (API)

| Método   | Endpoint                  | Descrição                                     |
| :------- | :------------------------ | :-------------------------------------------- |
| **GET**  | `/cobranca?page=0&size=5` | Lista cobranças com paginação                 |
| **POST** | `/cobranca`               | Cria uma nova cobrança (Inicia como PENDENTE) |
| **PUT**  | `/cobranca/{id}`          | Atualiza todos os dados de uma cobrança       |
| **PUT**  | `/cobranca/{id}/pagar/`   | Altera o status para PAGO                     |

## 👩‍💻 Desenvolvido por:

Rosa Mendes - React & Spring Boot Developer
