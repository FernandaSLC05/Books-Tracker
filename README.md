# 📚 Books Tracker (Minha Biblioteca Inteligente)

Um sistema Full-Stack desenvolvido para gerenciar leituras de forma automatizada e visual. A aplicação permite buscar obras diretamente na internet, salvando informações detalhadas e capas para organizar sua estante virtual — seja para livros técnicos de programação, romances ou seus Manhwas favoritos.

## 🌐 Acesse o Projeto Online

- **Aplicação (Front-end):** https://books-tracker-rho.vercel.app
- **API (Back-end):** https://books-tracker-siu7.onrender.com

> **Nota:** o back-end está hospedado no plano gratuito do Render, que entra em hibernação após um período sem acessos. A primeira requisição pode levar cerca de 30 a 50 segundos para acordar o servidor; após isso, o uso fica imediato.

## ✨ Funcionalidades Atuais

* **Integração com Google Books API:** Busca automática de título, autor, número de páginas e capa do livro digitando apenas o nome.
* **Organização por Status:** Filtros dinâmicos na interface para separar as leituras em "Quero Ler", "Lendo" e "Já Lido".
* **Gerenciamento Completo:** Cadastro e exclusão de obras da estante virtual com persistência em banco de dados na nuvem e atualização em tempo real na tela.
* **Interface Responsiva e Moderna:** Layout escuro (Dark Mode) desenhado para melhor usabilidade e conforto visual.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* React 19 (Vite)
* JavaScript
* CSS3
* Axios (consumo da API REST)

**Back-end:**
* Java 17
* Spring Boot 4
* Spring Data JPA / Hibernate
* Consumo de API Externa (Google Books API)
* Docker

**Banco de Dados & Deploy:**
* PostgreSQL gerenciado no **Neon** (produção) e suporte a MySQL (local)
* **Vercel** (hospedagem do Front-end)
* **Render** (hospedagem do Back-end via Docker)

## 🚀 Próximos Passos (Evolução do Projeto)

Este projeto está em constante evolução. As próximas atualizações focam em transformar a aplicação em um sistema multiusuário (SaaS):

1. **Sistema de Autenticação (Login):** Implementar o Spring Security no Back-end para criar rotas protegidas e senhas criptografadas.
2. **Sessões Multiusuário:** Vincular os livros cadastrados ao ID do usuário logado, permitindo que várias pessoas tenham suas próprias bibliotecas privadas no mesmo sistema.
3. **Edição de Leituras:** Permitir atualizar o status e o progresso de páginas diretamente pela interface.

## ⚙️ Como rodar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/FernandaSLC05/Books-Tracker.git
   ```
2. **Back-end (`library-tracker/`):**
   - Configure as variáveis de ambiente seguindo o modelo em `library-tracker/.env.example` (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` e `GOOGLE_BOOKS_API_KEY`).
   - Inicie a aplicação Spring Boot na porta `8080` (`./mvnw spring-boot:run`).
3. **Front-end (`front-end/`):**
   - Instale as dependências com `npm install`.
   - Opcionalmente crie um `.env` baseado em `front-end/.env.example` (por padrão aponta para `http://localhost:8080`).
   - Inicie o servidor de desenvolvimento com `npm run dev`.
4. Acesse `http://localhost:5173` no seu navegador.
