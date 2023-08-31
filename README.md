# Projeto - Processamento Gráfico

_Projeto referente a matéria de Processamento Gráfico, usando a lib Threejs_

#### Integrantes:

- Ariel Sadetsky - [arielsadetsky](https://github.com/arielsadetsky)
- Erik Gabriel Rodrigo da Silva - [EriikGabriel](https://github.com/EriikGabriel)
- Marcelo Augusto Rodrigues da Silva - [Marcelo-Augusto](https://github.com/Marcelo-Augusto)
- Vanderlei Guilherme Andrade de Assis - [dev-Burandelei](https://github.com/dev-Burandelei)

## 📃 Descrição do projeto

O projeto trata-se de uma representação de um quarto que possuí uma janela com vista para o céu, você é capaz de interagir com o telescópio em cena e observar as estrelas e os demais astros presentes na noite.

## 🛠️ Como configurar o projeto

Se você deseja testar e executar o projeto em sua máquina, siga o passo a passo de configuração:

> ⚠ Se você não tiver instalado o gerenciador de pacote **npm** em sua máquina, instale-o atráves do site oficial do [node](https://nodejs.org/pt-br/download). Ele será necessário para instalar as bibliotecas e pacotes que fazem parte do projeto.

1. Em seu terminal, **acesse a pasta raiz do projeto** e execute o seguinte comando para instalar todos os pacotes e dependencias do projeto:
   `npm install`

2. Para rodar o projeto na sua máquina, execute o comando:
   `npm run dev`

Após seguir esses passos e não obter nenhum erro, logo em seguida, um servidor web local deve ser estabelecido na porta padrão `5173` (caso essa porta já esteja ocupada, ele estabelecerá o servidor na porta seguinte disponível), sendo acessível pela url:
[http://localhost:5173/](http://localhost:5173/)

Pronto! Seu projeto está devidamente configurado e rodando...

## 🎮 Controles e interação

- `W` - Mover-se para frente
- `A` - Mover-se para esquerda
- `S` - Mover-se para trás
- `D` - Mover-se para direita
- `Botão esquerdo do mouse` - Interage com objetos em cena
- `Esc` - Abre o menu de pause da cena

## 🎥 Câmeras

- Câmera rotativa - `Erik Gabriel`
- Câmera estática - `Erik Gabriel`

## 📦 Objetos implementados

- Telescópio - `Erik Gabriel`
- Lua - `Marcelo`
- Jupiter - `Ariel`
- Satélite - `Vanderlei`

## 🎨 Shaders

- Satélite - `Vanderlei` (o satélite recebeu um shader próprio)

## Movimento de objeto

- Rotação de jupiter - `Ariel`
- Movimentação do satélite - `Erik`
