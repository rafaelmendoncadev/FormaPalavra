# Jogo das Sílabas

Aplicativo web para praticar leitura de sílabas simples, baseado no material
"Lápis da Leitura – Sílabas Simples". A criança vê uma imagem representando a
palavra e arrasta as sílabas embaralhadas até os espaços vazios, na ordem
certa, para montar a palavra. Só avança para a próxima palavra depois de
completar corretamente todos os espaços da palavra atual.

## Demo

Clone o repositório, dê dois cliques em `iniciar.bat` (Windows) ou rode um
servidor local (ver [Como rodar localmente](#como-rodar-localmente)) e abra no
navegador.

## Requisitos

- Qualquer navegador moderno com suporte a Pointer Events (Chrome, Edge,
  Firefox, Safari, desktop ou celular).
- Não é necessário microfone nem conexão com a internet para jogar — todo o
  jogo funciona localmente, sem reconhecimento de voz ou narração falada.

## Como rodar localmente


**Opção mais fácil - clique duas vezes em `iniciar.bat`:**

O arquivo `iniciar.bat` (nesta mesma pasta) inicia o servidor local e abre o
jogo automaticamente no navegador. Requer Python instalado no Windows.

- Se aparecer a mensagem "não está abrindo" ou o navegador não conseguir
  acessar `localhost`, o servidor provavelmente não está mais rodando (ex.:
  você fechou a janela preta minimizada, ou reiniciou o computador). Basta
  clicar em `iniciar.bat` de novo.
- Para **parar** o jogo, feche a janela preta minimizada do servidor que fica
  na barra de tarefas (procure por "cmd.exe" ou "python").
- Enquanto essa janela estiver aberta, você pode voltar a acessar o jogo a
  qualquer momento em `http://localhost:8000`.

**Opção A - com Python instalado (manual):**

```
python -m http.server 8000
```

Depois abra `http://localhost:8000` no Chrome/Edge.

**Opção B - com Node.js instalado:**

```
npx serve .
```

Abra o endereço mostrado no terminal (algo como `http://localhost:3000`).

## Como jogar

1. A palavra atual aparece com uma imagem representando seu significado.
2. As sílabas da palavra aparecem embaralhadas em uma bandeja, abaixo dos
   espaços vazios (um por sílaba, na ordem correta).
3. Arraste cada sílaba da bandeja até o espaço correspondente.
4. Se acertar: a sílaba se encaixa no espaço, toca um som de acerto e o
   mascote comemora.
5. Se errar: a sílaba volta para a bandeja, toca um som de erro e o mascote
   fica triste; a criança pode tentar de novo quantas vezes for preciso. Após
   3 erros seguidos na mesma palavra, a sílaba certa pisca na bandeja como
   dica.
6. Só passa para a próxima palavra depois de preencher **todos** os espaços
   corretamente.
7. Ao concluir todas as palavras de uma ilha/nível, uma tela de conclusão
   mostra o resumo e libera a próxima ilha no mapa.

## Estrutura do projeto

```
index.html   - estrutura da página
style.css    - visual colorido e responsivo
words.js     - lista das 160 palavras com divisão silábica e imagem
sfx.js       - efeitos sonoros curtos sintetizados (Web Audio API), sem voz
app.js       - lógica do jogo (arrastar e soltar sílabas)
home.js      - mapa/trilha de níveis, mascote e área dos pais
progress.js  - persistência do progresso (localStorage)
assets/images/words/*.png - ícones ilustrativos de cada palavra
iniciar.bat  - inicia o servidor local e abre o jogo automaticamente (Windows)
```

