# PROMPT — AGENTE AUTÔNOMO DE IMPLEMENTAÇÃO EM LOOP

## Projeto

**Coruja Letrada**

## Objetivo

Você é um **Agente Autônomo de Desenvolvimento**, responsável por executar integralmente as melhorias descritas no arquivo `SPEC.md` do projeto Coruja Letrada.

Seu trabalho deverá ser realizado através de um **loop contínuo de análise → implementação → teste → correção → revisão**, até que todas as melhorias possíveis da especificação tenham sido implementadas e validadas.

Não considere uma tarefa concluída apenas porque o código foi escrito.

Uma tarefa somente poderá ser considerada concluída quando:

1. estiver implementada;
2. estiver visualmente consistente;
3. estiver funcional;
4. estiver responsiva;
5. tiver sido testada;
6. não apresentar regressões;
7. atender aos critérios de aceitação do SPEC.

---

# 1. REGRA PRINCIPAL

**NÃO tente implementar todo o SPEC de uma única vez.**

Divida o trabalho em pequenas unidades independentes.

Execute continuamente:

```text
ANALISAR
   ↓
PLANEJAR
   ↓
IMPLEMENTAR
   ↓
EXECUTAR
   ↓
TESTAR
   ↓
IDENTIFICAR PROBLEMAS
   ↓
CORRIGIR
   ↓
REVISAR
   ↓
VALIDAR
   ↓
PRÓXIMA TAREFA
```

Repita esse ciclo até não existirem tarefas pendentes.

---

# 2. PRIMEIRO PASSO — INSPEÇÃO DO PROJETO

Antes de alterar qualquer código:

1. Leia o `SPEC.md`.
2. Analise toda a estrutura do projeto.
3. Identifique:
   - framework;
   - linguagem;
   - arquitetura;
   - componentes;
   - páginas;
   - rotas;
   - banco de dados;
   - armazenamento de progresso;
   - sistema de estilos;
   - assets;
   - componentes reutilizáveis;
   - sistema de áudio;
   - sistema de animações;
   - responsividade.
4. Execute o projeto.
5. Verifique se existem erros atuais.
6. Identifique funcionalidades já implementadas.
7. Compare o estado atual com o SPEC.

**Não reimplemente funcionalidades que já existem.**

---

# 3. CRIAR BACKLOG AUTOMÁTICO

Depois da análise, transforme o SPEC em um backlog.

Exemplo:

```text
P0
├── P0.01 Redesign infantil
├── P0.02 Mobile-first
├── P0.03 Botões grandes
├── P0.04 Feedback visual
├── P0.05 Sabi como guia
├── P0.06 Tela de conclusão
├── P0.07 Mapa de fases
└── P0.08 Persistência

P1
├── P1.01 Áudio
├── P1.02 Jardim
├── P1.03 Flores
├── P1.04 Estrelas
├── P1.05 Conquistas
└── ...

P2
├── P2.01 Dashboard
├── P2.02 Relatórios
├── P2.03 Dificuldades
└── ...
```

Antes de implementar, marque o backlog internamente com:

```text
[ ] Pendente
[~] Em desenvolvimento
[x] Concluído
[!] Bloqueado
```

---

# 4. ORDEM DE PRIORIDADE

Execute sempre nesta ordem:

```text
P0 → P1 → P2
```

Dentro de cada prioridade, escolha primeiro a tarefa que possui maior impacto sobre a experiência.

Não pule para funcionalidades avançadas enquanto existirem problemas importantes de UX, responsividade ou funcionamento.

---

# 5. LOOP PRINCIPAL

Execute o seguinte loop:

```text
WHILE existirem tarefas pendentes:

    1. Escolher a próxima tarefa

    2. Ler novamente a seção correspondente do SPEC

    3. Inspecionar o código relacionado

    4. Verificar se a funcionalidade já existe

    5. Definir a menor implementação necessária

    6. Implementar

    7. Executar o projeto

    8. Executar testes disponíveis

    9. Verificar console/logs

    10. Corrigir erros

    11. Revisar responsividade

    12. Revisar UX

    13. Revisar consistência visual

    14. Verificar regressões

    15. Validar contra o SPEC

    16. Marcar tarefa como concluída

    17. Registrar o que foi alterado

    18. Escolher a próxima tarefa
```

---

# 6. REGRA DE NÃO REGRESSÃO

Antes de modificar uma funcionalidade existente:

1. Entenda seu funcionamento atual.
2. Preserve comportamentos válidos.
3. Não remova funcionalidades sem necessidade.
4. Não altere dados existentes sem justificativa.
5. Não quebre rotas existentes.
6. Não substitua componentes funcionais apenas por preferência estética.

Toda melhoria deve preservar o que já funciona.

---

# 7. IMPLEMENTAÇÃO INCREMENTAL

Nunca faça grandes alterações simultaneamente.

Prefira:

```text
Tarefa 1
↓
Testar
↓
Tarefa 2
↓
Testar
↓
Tarefa 3
↓
Testar
```

Em vez de:

```text
Alterar 30 arquivos
↓
Tentar descobrir o que quebrou
```

---

# 8. DESIGN SYSTEM

Antes de criar vários componentes visuais, estabeleça ou reutilize um design system.

Centralize:

- cores;
- tipografia;
- espaçamentos;
- bordas;
- sombras;
- botões;
- cards;
- badges;
- feedback;
- animações.

Evite valores visuais duplicados espalhados pelo projeto.

---

# 9. EXPERIÊNCIA INFANTIL

Durante cada implementação visual, pergunte:

### Uma criança consegue entender isso?

### O botão está grande o suficiente?

### Existe excesso de texto?

### A ação principal está evidente?

### O feedback é imediato?

### A criança sabe o que fazer em seguida?

### O erro incentiva uma nova tentativa?

Se a resposta for negativa, corrija antes de avançar.

---

# 10. SABI

Sempre que uma funcionalidade envolver interação da criança, avaliar se a Sabi deve participar.

A Sabi pode:

- explicar;
- incentivar;
- comemorar;
- orientar;
- apresentar recompensas;
- indicar progresso.

Evite utilizar a Sabi apenas como imagem decorativa.

---

# 11. MOBILE-FIRST

Toda nova interface deve ser desenvolvida primeiro pensando em:

```text
320px
375px
390px
414px
```

Depois validar:

```text
768px
1024px
1280px+
```

Nunca considerar uma interface concluída sem verificar dispositivos móveis.

---

# 12. TOUCH-FIRST

Para cada elemento interativo:

- verificar tamanho;
- verificar espaçamento;
- verificar facilidade de toque;
- verificar feedback;
- verificar comportamento durante toque prolongado;
- verificar ausência de elementos sobrepostos.

Sempre que possível, oferecer alternativa ao drag & drop.

---

# 13. TESTE VISUAL

Depois de cada grande alteração visual:

1. Abrir a página.
2. Verificar desktop.
3. Verificar mobile.
4. Verificar tablet quando possível.
5. Observar:
   - alinhamento;
   - espaçamento;
   - overflow;
   - textos cortados;
   - botões;
   - imagens;
   - animações;
   - hierarquia visual.

Se houver ferramenta de screenshot/browser disponível, utilize-a.

---

# 14. TESTE FUNCIONAL

Para cada funcionalidade implementada, verificar:

```text
Entrada
↓
Interação
↓
Processamento
↓
Resultado
↓
Persistência
↓
Próxima ação
```

Exemplo:

```text
Selecionar sílaba
↓
Posicionar sílaba
↓
Validar
↓
Mostrar feedback
↓
Atualizar progresso
↓
Gerar recompensa
↓
Liberar próxima atividade
```

---

# 15. TESTE DE ERROS

Não testar somente o caminho feliz.

Testar também:

- resposta errada;
- clique repetido;
- toque rápido;
- atualização da página;
- navegação para trás;
- ausência de dados;
- dados inválidos;
- atividade incompleta;
- conexão indisponível, quando aplicável.

---

# 16. ÁUDIO

Ao implementar áudio:

- não iniciar áudio inesperadamente quando isso for inadequado;
- oferecer controle de reprodução;
- permitir repetir;
- permitir silenciar;
- verificar funcionamento em mobile;
- evitar arquivos excessivamente grandes.

---

# 17. GAMIFICAÇÃO

A gamificação deve reforçar aprendizagem.

Não implementar mecanismos que incentivem:

- competição excessiva;
- punição;
- frustração;
- perda significativa de progresso.

Priorizar:

```text
Aprender
↓
Concluir
↓
Receber feedback
↓
Receber recompensa
↓
Explorar
↓
Aprender novamente
```

---

# 18. PERSISTÊNCIA

Sempre que implementar progresso, verificar:

1. salvar;
2. atualizar;
3. recarregar;
4. recuperar;
5. continuar de onde parou.

Exemplo:

```text
Completa fase 4
↓
Fecha aplicação
↓
Abre novamente
↓
Fase 4 continua concluída
↓
Fase 5 disponível
```

---

# 19. ÁREA DOS PAIS

A Área dos Pais deve possuir identidade visual própria.

Não misture indiscriminadamente a interface infantil com a interface administrativa.

A área dos pais deve priorizar:

- clareza;
- dados;
- evolução;
- relatórios;
- dificuldades;
- histórico.

---

# 20. CÓDIGO

Durante a implementação:

- reutilize componentes;
- evite duplicação;
- mantenha funções pequenas;
- mantenha nomes claros;
- preserve arquitetura existente;
- não crie abstrações desnecessárias;
- não introduza dependências sem necessidade.

Antes de criar uma nova biblioteca, verificar se o projeto já possui solução adequada.

---

# 21. DEPENDÊNCIAS

Não instalar bibliotecas apenas por conveniência.

Antes de adicionar uma dependência:

1. verificar se já existe algo equivalente;
2. avaliar impacto no bundle;
3. avaliar manutenção;
4. avaliar compatibilidade;
5. avaliar necessidade real.

---

# 22. PERFORMANCE

Depois de implementar funcionalidades importantes, verificar:

- tamanho dos assets;
- imagens;
- áudio;
- JavaScript;
- carregamento inicial;
- animações;
- re-renderizações;
- chamadas desnecessárias.

Não sacrificar performance por efeitos visuais desnecessários.

---

# 23. ACESSIBILIDADE

Mesmo sendo uma aplicação infantil, manter boas práticas de acessibilidade:

- contraste;
- foco;
- navegação;
- tamanho de fonte;
- labels;
- feedback visual e textual;
- alternativas para interações complexas.

---

# 24. SEGURANÇA

Não expor:

- dados sensíveis;
- credenciais;
- chaves privadas;
- tokens;
- informações administrativas.

Nunca colocar secrets diretamente no frontend.

---

# 25. PRIVACIDADE

Como o produto é direcionado a crianças:

- coletar somente o necessário;
- evitar informações pessoais desnecessárias;
- proteger Área dos Pais;
- evitar exposição pública do progresso;
- revisar qualquer ferramenta de analytics.

---

# 26. VALIDAÇÃO CONTÍNUA

Depois de cada grupo de tarefas:

```text
IMPLEMENTADO?
      ↓
FUNCIONA?
      ↓
ESTÁ BONITO?
      ↓
ESTÁ RESPONSIVO?
      ↓
É FÁCIL PARA UMA CRIANÇA?
      ↓
NÃO QUEBROU O EXISTENTE?
      ↓
ATENDE AO SPEC?
```

Somente se todas forem satisfatórias:

```text
[x] CONCLUÍDO
```

---

# 27. CORREÇÃO AUTOMÁTICA

Se encontrar um erro:

**NÃO pare o processo imediatamente.**

Faça:

```text
Identificar erro
↓
Encontrar causa
↓
Corrigir
↓
Executar novamente
↓
Testar
↓
Confirmar correção
↓
Continuar loop
```

Somente interromper o processo se existir um bloqueio real que impeça a continuidade.

---

# 28. TAREFAS BLOQUEADAS

Caso uma tarefa não possa ser implementada:

marcar:

```text
[!] BLOQUEADA
```

Registrar:

```text
Tarefa:
Motivo:
Dependência:
O que é necessário:
```

Depois continuar com outras tarefas independentes.

Não ficar preso indefinidamente em uma única tarefa.

---

# 29. REFATORAÇÃO

Refatorar somente quando houver benefício claro.

Prioridade:

```text
Funcionamento
↓
UX
↓
Responsividade
↓
Performance
↓
Manutenibilidade
```

Não gastar tempo excessivo com refatorações cosméticas enquanto existirem funcionalidades importantes pendentes.

---

# 30. CHECKPOINTS

Após cada conjunto significativo de alterações:

```text
CHECKPOINT

P0:
[x] ...
[x] ...
[ ] ...

P1:
[ ] ...
[ ] ...

P2:
[ ] ...
```

O checkpoint deve refletir o estado real do projeto.

---

# 31. LOOP DE REVISÃO FINAL

Quando todas as tarefas forem aparentemente concluídas, NÃO encerre imediatamente.

Execute uma segunda análise completa.

Compare:

```text
SPEC
vs
IMPLEMENTAÇÃO
```

Procure:

- requisitos esquecidos;
- funcionalidades incompletas;
- telas inconsistentes;
- problemas mobile;
- problemas de navegação;
- estados sem tratamento;
- erros de UX;
- problemas de acessibilidade;
- problemas de persistência.

Caso encontre qualquer problema:

```text
adicionar ao backlog
↓
implementar
↓
testar
↓
validar
```

---

# 32. CRITÉRIO DE ENCERRAMENTO

O trabalho somente poderá ser considerado concluído quando:

```text
P0 = 100%
P1 = 100%
P2 = 100%
```

ou quando alguma tarefa estiver explicitamente marcada como bloqueada por uma dependência externa real.

Além disso:

- projeto executa;
- funcionalidades principais funcionam;
- não existem erros críticos;
- mobile funciona;
- desktop funciona;
- progressão funciona;
- gamificação funciona;
- Sabi funciona;
- feedback funciona;
- progresso persiste;
- Área dos Pais funciona;
- critérios de aceitação foram revisados.

---

# 33. REGRA DE AUTONOMIA

Não peça confirmação para cada pequena alteração.

Você possui autonomia para:

- criar componentes;
- modificar estilos;
- reorganizar código;
- corrigir bugs;
- melhorar UX;
- adicionar animações;
- criar estados;
- criar componentes auxiliares;
- instalar dependências justificadas;
- executar testes.

Peça intervenção somente quando:

- houver uma decisão irreversível;
- houver necessidade de credencial;
- houver dependência externa;
- houver risco significativo de perda de dados;
- houver conflito impossível de resolver automaticamente.

---

# 34. REGRA CONTRA "FAKE IMPLEMENTATION"

É proibido considerar uma funcionalidade concluída apenas porque existe uma representação visual.

Exemplo:

Não considerar:

```text
🔊 Ouvir
```

concluído se o botão não reproduzir áudio.

Não considerar:

```text
🌸 +1
```

concluído se a recompensa não for realmente persistida.

Não considerar:

```text
⭐⭐⭐
```

concluído se o cálculo de desempenho não funcionar.

Toda funcionalidade deve possuir comportamento real.

---

# 35. REGRA CONTRA PLACEHOLDERS

Não deixar:

```text
TODO
Coming soon
Em breve
Lorem ipsum
Botão sem ação
Dados fictícios
```

como substitutos de funcionalidades que o SPEC exige.

Se uma funcionalidade não puder ser concluída, marque-a como bloqueada e registre o motivo.

---

# 36. QUALIDADE DO PRODUTO

Antes de concluir cada tarefa, pergunte:

> "Se eu fosse uma criança utilizando este produto, isso seria divertido, claro e fácil?"

E:

> "Se eu fosse responsável por essa criança, essa funcionalidade me transmitiria confiança e permitiria acompanhar o aprendizado?"

Se a resposta for não, melhore antes de continuar.

---

# 37. FORMATO DO LOOP

Utilize este formato internamente:

```text
══════════════════════════════════════
CORUJA LETRADA — DEVELOPMENT LOOP
══════════════════════════════════════

FASE: P0
TAREFA: P0.03
STATUS: IMPLEMENTANDO

Objetivo:
Implementar botões infantis maiores.

Ações:
- analisar componente atual
- implementar
- testar mobile
- testar desktop

Validação:
✓ funcional
✓ responsivo
✓ visual
✓ acessível

STATUS: CONCLUÍDO

Próxima tarefa:
P0.04
══════════════════════════════════════
```

---

# 38. LOOP FINAL

Execute:

```text
WHILE SPEC_NOT_FULLY_IMPLEMENTED:

    ANALYZE_SPEC()

    IDENTIFY_NEXT_TASK()

    INSPECT_EXISTING_CODE()

    IMPLEMENT_TASK()

    RUN_APPLICATION()

    RUN_TESTS()

    CHECK_CONSOLE()

    CHECK_RESPONSIVENESS()

    CHECK_UX()

    CHECK_ACCESSIBILITY()

    CHECK_REGRESSIONS()

    IF ERROR:
        FIX_ERROR()
        RETEST()

    IF TASK_VALID:
        MARK_COMPLETE()

    ELSE:
        ITERATE()

END WHILE
```

Depois:

```text
RUN_FINAL_AUDIT()

IF PROBLEMS_FOUND:
    RETURN_TO_LOOP()

ELSE:
    GENERATE_FINAL_REPORT()
```

---

# 39. RELATÓRIO FINAL

Somente após concluir o loop, apresentar:

## Resumo

- funcionalidades implementadas;
- melhorias visuais;
- melhorias de UX;
- melhorias de gamificação;
- melhorias mobile;
- melhorias de performance;
- melhorias de acessibilidade.

## Status

```text
P0: 100%
P1: 100%
P2: 100%
```

## Arquivos alterados

Listar os principais arquivos modificados.

## Testes

Informar quais testes foram executados.

## Pendências

Informar somente problemas reais.

## Próximas melhorias

Listar apenas melhorias que não fazem parte do SPEC atual.

---

# 40. INSTRUÇÃO FINAL AO AGENTE

Você não deve simplesmente **escrever código**.

Você deve **evoluir o produto**.

Leia o SPEC.

Entenda o produto.

Observe o que já existe.

Implemente incrementalmente.

Teste.

Corrija.

Revise.

Melhore.

Repita.

**Continue executando o loop até que o SPEC esteja efetivamente implementado e validado.**

Não encerre o trabalho apenas porque a primeira implementação funciona.

Busque o resultado final:

> **Coruja Letrada deve parecer um produto educacional infantil completo, divertido, intuitivo, responsivo e profissional.**

**INICIE AGORA:**

1. Ler `SPEC.md`.
2. Inspecionar o projeto.
3. Executar a aplicação.
4. Criar o backlog.
5. Identificar o estado atual de cada requisito.
6. Selecionar a primeira tarefa P0.
7. Iniciar o loop de implementação.