# Anotações do projeto

- Geralmente em rota de criação dentro da api, não faz retornos

- Um arquivo com a extenção .d.ts é um arquivo para definição de tipos

## TESTES

- Unitários: Unidade da sua aplicação

- Integração: Comunicação entre duas ou mais unidades

- e2e - ponta a ponta: Simulam um usuário operando na aplicação

e2e -> Front-end: Imagine uma página de login abre a tela de login coloque o email renansaravalli@email no campo de id email e pressione o botão de login
no Back end: o usuário da aplicação é o front-end então nesse caso seria as requisições HTTP, websockets
Verificar se as portas de entrada da nossa aplicação back end funciona de ponta a ponta

- Pirâmide de testes: E2E -> (Não depende de tecnologia) (Não depende de arquitetura) (Qualquer pessoa pode fazer) (Testes Extremamente lentos)

- Todo teste deve obrigatoriamente se excluir de qualquer contexto
- Jamais, Nunca, devemos escrever um teste que depende de outro teste

# Deploy

- Nenhuma plataforma de deploy em node vai entender código ts

1. Converter nosso código para js
   - podemos compilar na mão com compilador do ts: npx tsc (configurar no arquivo tsconfig o rootDir e outDir)
   - Processo lento ainda mais se nossa codebase for grande

2. Ferramenta tsup
   - npm i tsup -D
   - Trabalhar com o TS em relação ao processo de build
   - Usa por de baixo dos panos o esBuild
   - Configurar no package.json o comando de build:
     - "build": "tsup src"
     - "build": "tsup src --out-dir build" (Troca o nome de dist para build)
     - rodar o comando npm run build
   - Agora devo conseguir rodar meu servidor normalmente em js: node build/server.js
   - O nosso eslint está reclamando do arquivo build, mas não faz sentido ele ficar verificando o arquivo de build, para fazer com que ele ignore criamos um arquivo .eslintignore e colocamos o nome da pasta
   - A pasta de build precisa estar no gitignore
