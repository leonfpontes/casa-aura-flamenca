# Sistema visual — o tablao

A linguagem de design vem do portfólio (cenas, tons por seção, fios de 1px, cantos retos, sem cards genéricos).
A **identidade**, porém, vem da própria casa:

- da logo do Aura das Artes, com letras creme, bailarina e traço dourados sobre veludo vinho;
- das artes do Instagram: cortina de teatro vinho, dourado, creme e o vermelho flamenco dos cartazes de turma.

## Fundamentos

| Elemento | Escolha | Token |
|---|---|---|
| Paleta | **marfim** (as letras), **areia**, **vinho** (a cortina), **carmim** (o vestido), **ouro** (o traço da bailarina), **tinto** e **noite** (o tablao no escuro) | `--marfim`, `--areia`, `--vinho`, `--carmim`, `--ouro`, `--tinto`, `--noite` |
| Tons de cena | marfim, areia, vinho, carmim, ouro, noite | `.tone-*` |
| Títulos | **Marcellus**: serifa de traço alargado, parente do "AURA" e do "das artes" da logo | `display`, `font-display` |
| Texto e rótulos | **Archivo**, com rótulos em caixa alta bem espaçados, como o "CENTRO CULTURAL" | `label-caps` |
| Destaque | A palavra em cor de sinal com o **traço dourado** da logo por baixo | `highlight` |
| Bordas | Fios de 1px e cantos retos; o círculo só aparece no que é redondo (lunar, roda do compás, avatar) | `--radius: 0` |

O modo escuro transforma as cenas claras na noite do tablao. Vinho e carmim se mantêm.

## Arte que conta algo

- **Lunares** (`art/Lunares`): as bolinhas do vestido de flamenca.
  - Uma onda percorre os 12 tempos da soleá.
  - Nos acentos (3, 6, 8, 10 e 12) os lunares crescem e ficam dourados.
  - O cursor abre uma roda de pontos maiores.
- **Roda do compás** (`art/CompasWheel`): o "relógio" de 12 tempos que o aluno aprende a contar.
  - Nas aulas, ela conta em silêncio o ciclo de cada modalidade.
  - Na seção Compás, toca palmas sintetizadas (WebAudio), mais fortes nos acentos, e só começa com um clique.
- **Azulejos andaluzes** (`art/Azulejo`): estrela de oito pontas, quadrifólio, arco mourisco, lunar e leque. Um azulejo gira de tempos em tempos, e o que está sob o cursor também.
- **Foto que se revela** (`art/Halftone`): a foto entra em retícula (lunares) e se funde em duotônico vinho sobre marfim.
- **Logo desenhada** (hero): as letras sobem e o traço dourado corre da bailarina até a ponta.
- **Vídeos de fundo** (`art/BackgroundVideo`):
  - tocam só quando estão na tela;
  - no modo suave, ficam parados no pôster.

## Cenas

| Cena | Tom | Coreografia |
|---|---|---|
| Início | vinho | Vídeo de palco tingido de vinho, lunares, logo desenhada, números que contam, faixa de modalidades |
| A casa | marfim | História que "acende" na leitura, foto em retícula com placa de citação, pilares |
| Aulas | carmim | **Fixa**: uma aula por passo, com foto que troca e roda do compás contando o ciclo da aula; no celular, vira trilho horizontal |
| Compás | noite | Palos em abas, roda interativa com palmas e guitarra em vídeo ao fundo |
| Professores | areia | Ficha técnica de programa de espetáculo, em linhas com fios |
| Vozes | ouro | **Fixa**: um depoimento por passo, com a aspa girando como carimbo |
| Agenda | vinho | O próximo festival como cartaz com foto; o resto como programa de temporada |
| Dúvidas | marfim | `<details>` nativo |
| Visite | carmim | Título por caracteres, telefone grande, botão magnético e faixa de azulejos |

## O que evitamos

O que já valia no portfólio continua valendo:

- gradientes decorativos e "glassmorphism";
- cards idênticos com ícone;
- emojis;
- botão flutuante de WhatsApp (no celular há uma barra discreta no rodapé).

Também evitamos depoimentos ou dados inventados. O que não foi confirmado está marcado com `// CONFIRMAR` no conteúdo.
