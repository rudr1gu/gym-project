# Gym Tracker

Aplicacao web para acompanhar treinos semanais de musculacao, registrar carga e repeticoes feitas por exercicio e exportar o treino concluido como PDF usando a impressao nativa do navegador.

## Visao geral

O projeto organiza uma rotina de treinos em cards semanais. Cada treino possui uma lista de exercicios com series, repeticoes planejadas, descanso, observacoes e grupo muscular. O usuario pode marcar exercicios como concluidos, registrar a carga usada e informar as repeticoes feitas.

Quando todos os exercicios obrigatorios de um treino sao concluidos, a tela do treino libera a opcao **Exportar PDF**. Ao clicar, o navegador abre a janela de impressao; nela o usuario pode escolher a impressora "Salvar como PDF".

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- lucide-react para icones
- localStorage para persistencia local do progresso

> A dependencia `@supabase/supabase-js` existe no projeto, mas o fluxo atual de treinos/progresso nao usa Supabase.

## Como rodar o projeto

Instale as dependencias:

```bash
npm install
```

Rode em modo desenvolvimento:

```bash
npm run dev
```

Gere a build de producao:

```bash
npm run build
```

Visualize a build localmente:

```bash
npm run preview
```

Valide tipos e lint:

```bash
npm run typecheck
npm run lint
```

## Scripts disponiveis

- `npm run dev`: inicia o servidor Vite em desenvolvimento.
- `npm run build`: compila TypeScript e gera os arquivos finais em `dist`.
- `npm run preview`: serve a build gerada.
- `npm run lint`: executa ESLint no projeto.
- `npm run typecheck`: roda `tsc --noEmit` para validar tipos.

## Estrutura de pastas

```text
src/
  components/              Componentes reutilizaveis de UI
  data/                    Dados mockados dos treinos
  hooks/                   Hooks de estado e persistencia
  pages/                   Telas principais
  services/                Servicos de armazenamento local
  types/                   Tipos TypeScript compartilhados
  utils/                   Funcoes utilitarias
```

Arquivos principais:

- `src/App.tsx`: controla a navegacao simples entre dashboard e detalhes do treino.
- `src/pages/Dashboard.tsx`: mostra resumo semanal e lista de treinos.
- `src/pages/WorkoutDetails.tsx`: mostra exercicios, progresso e exportacao em PDF.
- `src/services/workoutStorage.service.ts`: le e grava progresso no `localStorage`.
- `src/utils/workoutProgress.ts`: calcula conclusao e estatisticas.
- `src/data/workouts.mock.ts`: define os treinos disponiveis.

## Modelo de dados

### Workout

Representa um treino:

- `id`: identificador unico.
- `title`: nome do treino.
- `subtitle`: resumo do agrupamento muscular.
- `focus`: objetivo do treino.
- `dayType`: `fixed` ou `optional`.
- `exercises`: lista de exercicios.

### Exercise

Representa um exercicio:

- `id`: identificador unico.
- `name`: nome do exercicio.
- `sets`: quantidade de series planejadas.
- `reps`: repeticoes planejadas.
- `rest`: descanso recomendado.
- `notes`: observacoes de execucao.
- `muscleGroup`: grupo muscular.
- `isOptional`: indica exercicio opcional quando usado.

### WorkoutProgress

Representa o progresso salvo de um treino:

- `workoutId`: identificador do treino.
- `completedAt`: data ISO registrada quando o treino fica completo.
- `exercisesProgress`: progresso de cada exercicio.

### ExerciseProgress

Representa os dados preenchidos pelo usuario:

- `exerciseId`: identificador do exercicio.
- `completed`: indica se foi feito.
- `weight`: carga usada.
- `repsDone`: repeticoes feitas.
- `notes`: campo reservado para anotacoes futuras.

## Persistencia local

O progresso e salvo no `localStorage` com a chave:

```text
gym-tracker-progress
```

A estrutura salva contem:

- `workoutsProgress`: lista de progresso por treino.
- `lastUpdated`: data ISO da ultima alteracao.

Ao resetar toda a semana, a chave e removida. Ao resetar um treino especifico, apenas o progresso daquele treino e removido.

## Regra de conclusao

Um treino e considerado concluido quando todos os exercicios obrigatorios estao marcados como feitos.

Exercicios com `isOptional: true` nao bloqueiam a conclusao. Treinos com `dayType: optional` continuam usando a mesma regra de exercicios obrigatorios.

Quando um treino passa a concluido:

- `completedAt` recebe a data/hora atual em formato ISO.
- O botao **Exportar PDF** aparece na tela de detalhes.

Quando um treino deixa de estar concluido:

- `completedAt` e removido.
- O botao de exportacao some.

## Exportacao em PDF

A exportacao nao usa bibliotecas externas. O fluxo usa `window.print()`:

1. O usuario conclui o treino.
2. A tela exibe o botao **Exportar PDF**.
3. Ao clicar, o navegador abre a janela de impressao.
4. O usuario escolhe "Salvar como PDF".

Durante a impressao, `src/index.css` esconde a interface normal e exibe apenas um relatorio com:

- Dia do treino.
- Nome e subtitulo do treino.
- Foco do treino.
- Exercicios feitos.
- Series planejadas.
- Repeticoes planejadas.
- Carga usada.
- Repeticoes feitas.

Para treinos antigos que ja estavam completos antes da criacao de `completedAt`, o relatorio usa a data atual como fallback.

## Manutencao

- Para alterar os treinos, edite `src/data/workouts.mock.ts`.
- Para alterar a regra de conclusao, edite `src/utils/workoutProgress.ts`.
- Para alterar o formato do relatorio, edite `src/pages/WorkoutDetails.tsx`.
- Para alterar a aparencia do PDF, edite o bloco `@media print` em `src/index.css`.

## Limitacoes atuais

- Os treinos sao mockados no codigo.
- O progresso fica apenas no navegador do usuario.
- Nao ha sincronizacao em nuvem nem login.
- O PDF depende do fluxo de impressao do navegador.
- O campo `notes` de `ExerciseProgress` existe no modelo, mas ainda nao tem interface de edicao.
