# Jogo das Sílabas

Aplicativo web para praticar leitura de sílabas simples, baseado no material
"Lápis da Leitura – Sílabas Simples". A criança clica na sílaba destacada, fala
em voz alta, e o app usa reconhecimento de voz para verificar a pronúncia,
dando feedback e falando a pronúncia correta quando necessário. Só avança de
sílaba/palavra depois de acertar todas as sílabas da palavra atual.

## Demo

Clone o repositório, dê dois cliques em `iniciar.bat` (Windows) ou rode um
servidor local (ver [Como rodar localmente](#como-rodar-localmente)) e abra no
Chrome ou Edge. Permita o uso do microfone quando o navegador pedir.

## Requisitos

- Navegador **Google Chrome** ou **Microsoft Edge** (desktop ou Android). Firefox
  e Safari não suportam bem a API de reconhecimento de voz usada aqui.
- **Microfone** disponível e permissão concedida ao navegador.
- **Conexão com a internet**: o reconhecimento de voz do navegador processa o
  áudio em servidores do Google, então é necessário estar online.

## Como rodar localmente

Por segurança, os navegadores só liberam o microfone/reconhecimento de voz em
um "contexto seguro" (`https://` ou `http://localhost`). Abrir o `index.html`
direto pelo Windows Explorer (`file://`) pode não funcionar. Use um servidor
local simples:

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

Quando o navegador pedir permissão de microfone, clique em **Permitir**.

## Como jogar

1. A palavra atual aparece dividida em sílabas (botões).
2. Apenas a sílaba destacada (laranja, pulsando) pode ser clicada.
3. Clique nela e fale a sílaba em voz alta.
4. Se acertar: a sílaba fica verde com ✓ e o app fala a sílaba (ou a palavra
   inteira, se for a última) antes de liberar a próxima.
5. Se errar: o app fala a pronúncia correta e permite tentar de novo na mesma
   sílaba, quantas vezes for preciso.
6. Só passa para a próxima palavra depois de acertar **todas** as sílabas da
   palavra atual.
7. Use "🔊 Ouvir sílaba" para escutar a sílaba atual sem que isso conte como
   tentativa, ou "📖 Ouvir palavra" para escutar a palavra inteira.
8. Ao concluir todas as palavras, uma tela de parabéns mostra o resumo e
   permite jogar novamente.

## Estrutura do projeto

```
index.html   - estrutura da página
style.css    - visual colorido e responsivo
words.js     - lista das 160 palavras com divisão silábica
speech.js    - wrapper para síntese (TTS) e reconhecimento (STT) de voz
app.js       - lógica do jogo (estado, fluxo de sílabas/palavras)
iniciar.bat  - inicia o servidor local e abre o jogo automaticamente (Windows)
```

## Limitações conhecidas

- O reconhecimento de sílabas isoladas e curtas (ex.: "sa", "la") é menos
  preciso que o de palavras inteiras, pois há pouco áudio para analisar. O app
  usa uma comparação tolerante (ignora acentos/maiúsculas e considera
  alternativas de transcrição) para reduzir falsos negativos, mas erros de
  reconhecimento ainda podem ocorrer.
- Funciona melhor em ambientes silenciosos, com o microfone próximo à criança.
- Requer internet ativa durante o uso.
