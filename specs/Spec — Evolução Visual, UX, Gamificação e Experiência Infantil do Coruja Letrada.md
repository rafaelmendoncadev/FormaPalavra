# SPEC — Evolução Visual, UX, Gamificação e Experiência Infantil
## Projeto: Coruja Letrada

**Versão:** 1.0  
**Objetivo:** Transformar o Coruja Letrada em uma experiência de alfabetização infantil mais envolvente, intuitiva, acessível e gamificada.

---

# 1. Objetivo Geral

Evoluir o Coruja Letrada de uma aplicação de atividades de alfabetização para uma experiência educativa gamificada.

A criança deve perceber o produto como um **mundo de aventura e descobertas**, e não como uma atividade escolar tradicional.

A experiência deverá combinar:

- alfabetização;
- jogos;
- exploração;
- recompensas;
- personagem guia;
- áudio;
- progressão;
- conquistas;
- acompanhamento pelos responsáveis.

---

# 2. Princípios de UX

Toda a evolução deverá seguir estes princípios:

1. **Infantil em primeiro lugar**
2. **Visual antes do texto**
3. **Poucos elementos por tela**
4. **Botões grandes**
5. **Feedback imediato**
6. **Erros sem punição**
7. **Progressão claramente visível**
8. **Interações adequadas para toque**
9. **Uso de áudio sempre que possível**
10. **A criança deve saber o que fazer sem precisar ler instruções longas**

---

# 3. Identidade Visual

## 3.1 Direção visual

Criar uma identidade visual:

- alegre;
- colorida;
- amigável;
- acolhedora;
- lúdica;
- arredondada;
- com aparência de jogo infantil.

Evitar aparência de:

- sistema administrativo;
- dashboard corporativo;
- formulário;
- aplicativo excessivamente minimalista.

---

# 4. Sistema de Cores

Criar uma paleta consistente.

### Cores principais

```text
Primária:
#6C63FF

Secundária:
#FFD166

Sucesso:
#5CCB8A

Atenção:
#FFB84D

Erro leve:
#FF8A8A

Fundo:
#F7F8FC

Texto:
#333333
```

As cores podem ser ajustadas posteriormente após testes de acessibilidade e percepção infantil.

---

# 5. Componentes Visuais

Todos os componentes devem utilizar:

- bordas arredondadas;
- sombras suaves;
- áreas de toque grandes;
- ícones ilustrativos;
- microanimações;
- estados de hover;
- estados de pressionado;
- estados de sucesso;
- estados de erro.

Evitar excesso de bordas e elementos pequenos.

---

# 6. Personagem Sabi

A Sabi deve deixar de ser apenas um mascote e passar a funcionar como **guia da experiência**.

## 6.1 Estados da personagem

Criar variações visuais:

- normal;
- feliz;
- comemorando;
- pensando;
- incentivando;
- surpresa;
- explicando;
- comemorando conquista.

---

# 7. Sistema de Mensagens da Sabi

A Sabi deverá fornecer feedback contextual.

## Início

> "Oi! Vamos descobrir algumas palavras?"

## Acerto

> "Muito bem! Você conseguiu!"

## Acerto perfeito

> "Uau! Você acertou sem errar!"

## Erro

> "Quase! Vamos tentar novamente?"

## Conclusão

> "Parabéns! Você completou essa ilha!"

## Recompensa

> "Olha só! Uma nova flor apareceu no meu jardim!"

As mensagens devem ser curtas.

---

# 8. Tela Inicial

A Home deve ser visualmente orientada para a criança.

Estrutura:

```text
┌───────────────────────────────┐
│ 🦉 Sabi                       │
│                               │
│ "Olá! Vamos brincar?"         │
│                               │
│        ▶ CONTINUAR            │
│                               │
│       🗺️ MINHA AVENTURA       │
│                               │
│       🌸 MEU JARDIM           │
│                               │
│       🏆 CONQUISTAS            │
└───────────────────────────────┘
```

A opção principal deve ser **Continuar**.

---

# 9. Mapa de Aventura

Substituir a percepção de simples lista de atividades por um mapa de progressão.

Exemplo:

```text
🏝️ ILHA DAS LETRAS

      ⭐
      │
      ⭐
      │
      ⭐
      │
      🌸
      │
      🔒
```

Cada fase deve representar uma atividade.

---

# 10. Sistema de Fases

Cada fase deverá possuir:

- número;
- nome;
- palavra/tema;
- status;
- estrelas;
- recompensa.

Estados:

### Bloqueada

🔒

### Disponível

▶️

### Concluída

✓

### Perfeita

⭐⭐⭐

---

# 11. Progressão

A progressão deverá ser pedagógica.

Exemplo:

## Nível 1 — Primeiras Letras

Atividades muito simples.

## Nível 2 — Sílabas

Formação de palavras simples.

## Nível 3 — Palavras

Palavras com duas sílabas.

## Nível 4 — Palavras maiores

Palavras com três ou mais sílabas.

## Nível 5 — Sílabas complexas

Exemplos:

```text
BRA
PRA
TRA
CRA
```

A dificuldade deverá aumentar gradualmente.

---

# 12. Tela de Atividade

A tela de atividade deverá ser extremamente simples.

Exemplo:

```text
             🦉

      "Vamos montar!"

           🍎

      ┌─────┐ ┌─────┐
      │  MA │ │  CA │
      └─────┘ └─────┘

             ↓

       ┌───────────┐
       │ MA  CA    │
       └───────────┘

          🔊 Ouvir
```

---

# 13. Drag & Drop

Manter a mecânica atual de arrastar sílabas.

Porém, implementar também interação por toque.

## Desktop

Arrastar e soltar.

## Mobile

Permitir:

1. tocar na sílaba;
2. tocar no espaço de destino.

Isso evita problemas de usabilidade para crianças pequenas.

---

# 14. Feedback de Interação

Quando a sílaba for colocada corretamente:

- animação;
- pequeno efeito visual;
- som positivo;
- destaque temporário;
- atualização da palavra.

Quando estiver errada:

- não utilizar punição agressiva;
- não remover pontos;
- não usar sons negativos fortes.

Mostrar incentivo.

---

# 15. Sistema de Áudio

Implementar áudio para:

- instruções;
- sílabas;
- palavras;
- mensagens da Sabi;
- feedback de acerto;
- conclusão.

Exemplo:

```text
MA → 🔊 "MA"

CA → 🔊 "CA"

MACA → 🔊 "MACA"
```

Criar botão:

🔊 Ouvir

O usuário deve poder repetir o áudio.

---

# 16. Acessibilidade Infantil

Adicionar:

- áreas de toque grandes;
- contraste adequado;
- fontes grandes;
- textos curtos;
- suporte a áudio;
- feedback visual;
- alternativa ao drag & drop.

Não depender exclusivamente de cor para indicar estados.

---

# 17. Jardim do Sabi

Expandir o recurso já existente.

O jardim deverá funcionar como um espaço permanente de recompensas.

Cada atividade concluída pode gerar:

🌱 sementes  
🌼 flores  
🌷 plantas  
🌳 árvores

---

# 18. Sistema de Recompensas

Criar três níveis principais:

## Flores

Obtidas ao concluir atividades.

## Estrelas

Obtidas de acordo com desempenho.

```text
⭐⭐⭐
Excelente

⭐⭐
Muito bom

⭐
Concluído
```

## Itens

Desbloquear elementos do jardim:

- flores;
- árvores;
- pedras decorativas;
- bancos;
- fontes;
- borboletas;
- pássaros;
- elementos mágicos.

---

# 19. Conquistas

Criar sistema de badges.

Exemplos:

### 🦉 Primeira Palavra

Completou a primeira atividade.

### 🌱 Primeira Flor

Ganhou a primeira recompensa.

### 🌸 Jardineiro

Ganhou 10 flores.

### 📚 Leitor Iniciante

Completou 25 palavras.

### ⭐ Mestre das Sílabas

Completou determinada quantidade de atividades sem erros.

### 🏝️ Explorador

Completou uma ilha.

---

# 20. Animações

Utilizar animações curtas.

Exemplos:

- botão pressionado;
- sílaba sendo arrastada;
- palavra sendo formada;
- estrelas aparecendo;
- flor crescendo;
- Sabi comemorando;
- confetes na conclusão.

As animações devem ser rápidas e não atrapalhar a atividade.

---

# 21. Tela de Conclusão

Após completar uma atividade:

```text
          🎉

       PARABÉNS!

    Você conseguiu!

          🦉

        ⭐⭐⭐

       🌸 +1

    ┌────────────┐
    │ CONTINUAR  │
    └────────────┘
```

O botão principal deve levar automaticamente para a próxima atividade.

---

# 22. Tela de Conclusão de Ilha

Ao concluir todas as atividades:

```text
🏝️ ILHA CONCLUÍDA!

Você completou
todas as palavras!

⭐⭐⭐

🌸 Nova flor desbloqueada!

      CONTINUAR
```

---

# 23. Área dos Pais

A Área dos Pais deve possuir uma interface visualmente diferente da área infantil.

Objetivo:

- acompanhamento;
- evolução;
- dificuldades;
- histórico.

---

# 24. Dashboard dos Pais

Exibir:

```text
PROGRESSO

████████████░░ 80%

Palavras aprendidas
42

Taxa de acerto
87%

Atividades realizadas
56

Tempo de estudo
1h 32min
```

---

# 25. Relatórios

Criar relatório contendo:

- atividades realizadas;
- palavras aprendidas;
- palavras com dificuldade;
- taxa de acerto;
- quantidade de tentativas;
- evolução;
- tempo de uso;
- últimas atividades.

---

# 26. Identificação de Dificuldades

O sistema deve identificar padrões.

Exemplo:

```text
Dificuldade identificada

A criança apresentou maior dificuldade
nas sílabas:

BRA
TRA
PRA
```

O sistema poderá recomendar atividades adicionais.

---

# 27. Recomendações Personalizadas

Criar uma seção:

### "Recomendado para você"

Exemplo:

> "Vamos praticar mais palavras com BRA?"

Botão:

**Praticar**

Isso cria um ciclo adaptativo de aprendizagem.

---

# 28. Responsividade

O projeto deve ser **mobile-first**.

Prioridade:

1. 📱 Smartphone
2. 📱 Tablet
3. 💻 Desktop

---

# 29. Breakpoints

Garantir funcionamento adequado em:

```text
320px
375px
390px
414px
768px
1024px
1280px+
```

---

# 30. Touch

Todos os elementos interativos devem possuir área de toque confortável.

Recomendação:

```text
mínimo aproximado:
44 × 44 px
```

Para elementos infantis importantes, preferir áreas maiores.

---

# 31. Responsividade do Jogo

O conteúdo central da atividade deve permanecer visível sem necessidade de zoom.

Evitar:

- scroll horizontal;
- elementos cortados;
- botões pequenos;
- textos próximos demais;
- drag & drop com elementos sobrepostos.

---

# 32. Performance

Priorizar carregamento rápido.

Implementar:

- lazy loading de imagens;
- compressão de imagens;
- formatos WebP/AVIF;
- carregamento otimizado de áudio;
- cache;
- redução de JavaScript desnecessário.

---

# 33. PWA

Avaliar transformar o Coruja Letrada em PWA.

Possibilitar:

- instalação no celular;
- ícone na tela inicial;
- carregamento mais rápido;
- experiência semelhante a aplicativo.

---

# 34. Persistência do Progresso

O progresso da criança deverá ser persistido.

Salvar:

```text
fase atual
atividades concluídas
estrelas
flores
conquistas
tempo de uso
acertos
erros
palavras aprendidas
```

---

# 35. Modelo de Dados

Estrutura conceitual:

```text
User
 ├── Profile
 ├── Progress
 ├── Achievements
 ├── Rewards
 └── ActivityHistory
```

Atividades:

```text
Activity
 ├── id
 ├── level
 ├── word
 ├── syllables
 ├── audio
 ├── difficulty
 └── category
```

---

# 36. Sistema de Categorias

Permitir categorizar palavras.

Exemplos:

- animais;
- alimentos;
- brinquedos;
- natureza;
- objetos;
- pessoas;
- lugares.

Isso permite criar ilhas temáticas.

---

# 37. Ilhas Temáticas

Exemplo:

### 🏝️ Ilha dos Animais

GATO  
PATO  
MACACO

### 🌳 Floresta das Palavras

ÁRVORE  
FOLHA  
FLORESTA

### 🧸 Ilha dos Brinquedos

BOLA  
BONECA  
CARRINHO

---

# 38. Microcopy

Substituir textos técnicos por linguagem infantil.

Evitar:

> "Atividade concluída com sucesso."

Preferir:

> "Você conseguiu!"

Evitar:

> "Próxima atividade."

Preferir:

> "Vamos continuar?"

---

# 39. Sistema de Sons

Criar categorias de sons:

```text
ui/
 ├── click
 ├── success
 ├── error-soft
 ├── reward
 ├── level-complete
 └── achievement

voice/
 ├── instructions
 ├── syllables
 ├── words
 └── sabi
```

Permitir silenciar sons nas configurações.

---

# 40. Configurações dos Pais

Adicionar:

- volume;
- sons;
- narração;
- idioma;
- dificuldade;
- gerenciamento de perfil;
- privacidade;
- progresso.

Configurações sensíveis devem ficar protegidas na Área dos Pais.

---

# 41. Segurança

A Área dos Pais não deve ser acessível diretamente pela criança.

Implementar algum mecanismo simples de proteção, como:

- pergunta matemática;
- sequência numérica;
- PIN;
- autenticação.

A solução final deve ser adequada ao nível de segurança necessário para os dados armazenados.

---

# 42. Privacidade Infantil

Como o produto é direcionado a crianças, tratar privacidade como requisito prioritário.

Evitar coleta desnecessária de:

- localização;
- dados pessoais;
- contatos;
- informações sensíveis.

Qualquer coleta de dados deve possuir finalidade clara.

---

# 43. Analytics

Criar métricas para compreender o uso do produto.

Eventos:

```text
activity_started
activity_completed
activity_failed
syllable_selected
audio_played
reward_received
achievement_unlocked
level_completed
session_started
session_finished
```

Na Área dos Pais, transformar essas informações em indicadores úteis.

---

# 44. Gamificação sem excesso

A gamificação deve incentivar aprendizagem, não competição.

Evitar:

- rankings públicos;
- comparação entre crianças;
- punições;
- perda agressiva de pontos;
- pressão por desempenho.

Priorizar:

- progresso pessoal;
- descobertas;
- recompensas;
- incentivo;
- evolução.

---

# 45. Arquitetura de Navegação

## Área infantil

```text
Home
 ├── Continuar
 ├── Mapa
 ├── Jardim
 └── Conquistas
```

## Área dos Pais

```text
Dashboard
 ├── Progresso
 ├── Relatórios
 ├── Dificuldades
 ├── Histórico
 └── Configurações
```

---

# 46. Prioridade de Implementação

## 🔴 P0 — Essencial

Implementar primeiro:

- [ ] redesign da interface infantil;
- [ ] mobile-first;
- [ ] botões maiores;
- [ ] melhoria do fluxo da atividade;
- [ ] feedback visual;
- [ ] Sabi como guia;
- [ ] tela de conclusão;
- [ ] mapa de fases;
- [ ] persistência de progresso.

---

## 🟠 P1 — Alta prioridade

Depois:

- [ ] áudio;
- [ ] Jardim do Sabi;
- [ ] sistema de flores;
- [ ] estrelas;
- [ ] conquistas;
- [ ] animações;
- [ ] ilhas temáticas;
- [ ] alternativa ao drag & drop.

---

## 🟡 P2 — Evolução

Posteriormente:

- [ ] dashboard dos pais;
- [ ] relatórios;
- [ ] identificação de dificuldades;
- [ ] recomendações personalizadas;
- [ ] atividades adaptativas;
- [ ] PWA;
- [ ] analytics.

---

# 47. Critérios de Aceitação

A evolução será considerada concluída quando:

- [ ] A interface puder ser utilizada facilmente por uma criança.
- [ ] O jogo funcionar corretamente em smartphones.
- [ ] Todas as interações principais forem adequadas para toque.
- [ ] A criança conseguir entender o objetivo da atividade sem instruções extensas.
- [ ] A Sabi fornecer feedback durante a experiência.
- [ ] O progresso puder ser visualizado.
- [ ] As fases possuírem progressão clara.
- [ ] O sistema de recompensas funcionar.
- [ ] O Jardim do Sabi refletir o progresso.
- [ ] As atividades fornecerem feedback imediato.
- [ ] O áudio puder ser utilizado para auxiliar a alfabetização.
- [ ] A Área dos Pais apresentar informações úteis.
- [ ] O sistema não utilizar punições que desestimulem a criança.
- [ ] A aplicação apresentar boa performance em dispositivos móveis.

---

# 48. Resultado Esperado

Ao final dessa evolução, o Coruja Letrada deverá deixar de parecer apenas uma aplicação de exercícios de alfabetização e passar a funcionar como:

> **um pequeno universo de aprendizagem onde a criança brinca, explora, aprende palavras, recebe recompensas e acompanha sua própria evolução junto com a Sabi.**

A experiência ideal deve seguir o ciclo:

```text
        🦉 SABI
           ↓
       🎮 JOGAR
           ↓
       📚 APRENDER
           ↓
       ⭐ CONQUISTAR
           ↓
       🌸 RECOMPENSA
           ↓
       🏝️ EXPLORAR
           ↓
       🎮 JOGAR NOVAMENTE
```

O foco principal da próxima versão deve ser **qualidade da experiência**, e não simplesmente quantidade de funcionalidades.