# ProjetoControleDeFluxo

## Visão Geral
O ProjetoControleDeFluxo é um sistema desenvolvido para gerenciar a entrada e saída de alunos, funcionários e visitantes na Escola Técnica do SENAI de Indaiatuba. O objetivo é otimizar o controle de acesso, garantindo segurança e rastreamento eficiente de pessoas nas dependências da escola. O projeto é composto por um frontend construído com Next.js e um backend desenvolvido em .NET 9.0, utilizando o Supabase como banco de dados.

## Estrutura do Projeto
- **Frontend**: Desenvolvido com Next.js, um framework React para renderização no lado do servidor e geração de sites estáticos, oferecendo uma interface responsiva e amigável.
- **Backend**: Construído com .NET 9.0, fornecendo uma API segura para processamento de dados, autenticação e lógica de controle de acesso.
- **Banco de Dados**: Utiliza o Supabase, uma plataforma open-source baseada em PostgreSQL, para armazenamento de dados.
- **Finalidade**: O sistema registra horários de entrada e saída, gerencia permissões de usuários e gera relatórios para a administração da escola.

## Pré-requisitos
Antes de configurar o projeto, certifique-se de ter instalado:
- **Node.js** (versão 18.x ou superior)
- **npm** ou **yarn** (para gerenciar dependências do Next.js)
- **.NET SDK** (versão 9.0)
- **Git** (para clonar o repositório)
- Uma conta no Supabase (para configurar o banco de dados)
- Um editor de código (ex.: Visual Studio Code, Visual Studio)

## Instruções de Configuração

### 1. Clonar o Repositório
Clone o projeto para sua máquina local:
```bash
git clone https://github.com/lucianomenezesjr/ProjetoControleDeFluxo.git
cd ProjetoControleDeFluxo
```

### 2. Configuração do Frontend (Next.js)

#### Instalar Dependências
Navegue até o diretório do frontend (ex.: `frontend` ou a pasta que contém a aplicação Next.js):
```bash
cd frontend
npm install
```
Ou, se estiver usando Yarn:
```bash
cd frontend
yarn install
```

#### Executar a Aplicação Next.js
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Ou com Yarn:
```bash
yarn dev
```
O frontend estará disponível em `http://localhost:3000` (ou outra porta, se especificada).

#### Build para Produção
Para criar um build de produção:
```bash
npm run build
npm run start
```
Ou com Yarn:
```bash
yarn build
yarn start
```

### 3. Configuração do Backend (.NET 9.0)

#### Instalar Dependências
Navegue até o diretório do backend (ex.: `backend` ou a pasta que contém a solução .NET):
```bash
cd backend
dotnet restore
```
Este comando restaura todos os pacotes NuGet especificados no projeto.

#### Configurar Variáveis de Ambiente
Crie um arquivo `appsettings.json` ou `appsettings.Development.json` no diretório do backend (se não estiver presente) para configurar a conexão com o Supabase e outras configurações. Exemplo:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=seu-projeto.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=sua-senha"
  },
  "Supabase": {
    "Url": "https://seu-projeto.supabase.co",
    "AnonKey": "sua-chave-anonima"
  },
  "Jwt": {
    "Key": "sua-chave-jwt-segura",
    "Issuer": "seu-issuer",
    "Audience": "seu-audience"
  }
}
```
- Obtenha a string de conexão e as credenciais do Supabase no painel do Supabase, em **Settings > Database** e **Settings > API**.
- Substitua `sua-senha`, `sua-chave-anonima`, e outros valores pelas credenciais reais.
- Atualize as configurações de JWT, se a autenticação for usada (certifique-se de que a chave seja segura e não compartilhada publicamente).

#### Aplicar Migrações do Banco de Dados
Se o projeto usa Entity Framework Core, aplique as migrações para configurar o banco de dados no Supabase:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
Certifique-se de que o Supabase está acessível e que a string de conexão está correta.

#### Executar a Aplicação .NET
Inicie o servidor do backend:
```bash
dotnet run
```
A API estará disponível em `http://localhost:5000` ou `https://localhost:5001` (verifique a saída do console para a porta exata).

#### Build para Produção
Para criar um build de produção:
```bash
dotnet publish -c Release
```
A saída estará no diretório `bin/Release/net9.0/publish`.

### 4. Executando a Aplicação Completa
1. Inicie o backend (.NET) primeiro para garantir que a API esteja funcionando.
2. Inicie o frontend (Next.js) para conectar-se à API do backend.
3. Acesse a aplicação pelo URL do frontend (ex.: `http://localhost:3000`).
4. Faça login ou registre-se, conforme a configuração de autenticação do sistema.

## Funcionalidades do Projeto
- **Controle de Entrada/Saída**: Registra horários e identidades de pessoas que entram ou saem da escola.
- **Gerenciamento de Usuários**: Gerencia diferentes papéis de usuários (ex.: alunos, funcionários, visitantes) com permissões apropriadas.
- **Monitoramento em Tempo Real**: Fornece um painel para administradores acompanharem o acesso em tempo real.
- **Relatórios**: Gera relatórios de atividades de entrada e saída, úteis para a administração escolar.
- **Segurança**: Implementa autenticação (ex.: JWT) e controle de acesso baseado em papéis para garantir a segurança dos dados.

## Solução de Problemas
- **Problemas no Frontend**: Verifique se `NEXT_PUBLIC_API_URL` corresponde à URL do backend. Confira o console do navegador para erros.
- **Problemas no Backend**: Confirme a conectividade com o Supabase e a configuração correta do `appsettings.json`. Verifique os logs no terminal para erros.
- **Conflitos de Porta**: Se as portas `3000` (Next.js) ou `7292 ou 5274` (.NET) estiverem em uso, altere-as nos arquivos de configuração ou variáveis de ambiente.
- **Dependências**: Certifique-se de que todas as dependências foram instaladas corretamente com `npm install` (ou `yarn install`) para o frontend e `dotnet restore` para o backend.
- **Supabase**: Verifique se as credenciais no Supabase estão corretas e se o serviço está ativo.

## Contribuindo
Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/sua-funcionalidade`).
3. Realize suas alterações e faça o commit (`git commit -m "Adiciona sua funcionalidade"`).
4. Envie para a branch (`git push origin feature/sua-funcionalidade`).
5. Crie um pull request no GitHub.

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato
Para dúvidas ou suporte, entre em contato com o mantenedor do projeto em [seu-email@exemplo.com](mailto:luciano.menezes.jr11@gmail.com) ou abra uma issue no GitHub.
