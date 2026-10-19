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
| Formas | Arcos de meio ponto em fotos e retratos; botões em pílula com filete dourado; fios dourados | `rounded-t-full`, `rounded-full` |

O modo escuro transforma as cenas claras na noite do tablao. Vinho e carmim se mantêm.

## O site como um espetáculo

Cada seção é um **ato** ("Ato III · Compás", em algarismos romanos, como num programa de teatro), aberto pelo
**remate**: um fio dourado com um cravo ao centro. Os títulos são centrados, como a página de um programa.

## Motivos espanhóis

Não usamos azulejos geométricos, que lembram o modernismo brasileiro do portfólio. No lugar deles:

- **Telón** (`art/Telon`): a cortina de veludo vinho, em duas folhas com franja dourada.
  - Abre o site na entrada.
  - Volta a se fechar até virar moldura no último ato.
- **Arcos andaluzes**: fotos, retratos e o palco moram em arcos de meio ponto com moldura dourada dupla.
- **Abanico** (`art/Abanico`): o leque abre preso ao scroll, nos pilares da casa e atrás da roda do compás.
- **Mantón de Manila** (`art/Manton`): a faixa de seda com rosas e cravos bordados que fecha a página.
  - Os flecos balançam com o "vento" do scroll e se abrem à passagem do cursor.
- **Lunares** (`art/Lunares`): as bolinhas do vestido, pulsando nos acentos do compás de 12 tempos.
- **Roda do compás** (`art/CompasWheel`): o relógio de 12 tempos.
  - Toca palmas sintetizadas (WebAudio) na seção Compás.
  - Também aparece no pé de cada aula.
- **Foto que se revela** (`art/Halftone`): a foto chega em retícula de lunares e vira duotônico vinho sobre marfim.

## Experiência de scroll

| Ato | Tom | O que o scroll faz |
|---|---|---|
| Início | vinho | Telón abre; a logo é desenhada; **cena fixa**: o palco (vídeo) se recolhe num arco andaluz e a logo sobe |
| I · A casa | marfim | O arco da foto se abre com a leitura; a citação desliza; o leque abre e os pilares acendem |
| II · Aulas | carmim | **Trilho horizontal fixo** (desktop e celular): uma galeria de arcos corre para o lado, com parallax das fotos |
| III · Compás | noite | O leque abre e a roda gira até o lugar; palos em fila; tablao em vídeo ao fundo |
| IV · Professores | areia | Retratos em arco sobem como cortina; a diretora em destaque |
| V · Vozes | ouro | Duas fileiras de avaliações reais do Google correm em sentidos opostos |
| VI · Agenda | vinho | **Cena fixa**: o festival começa num arco pequeno e cresce até a tela inteira; o cartel sobe por cima |
| VII · Dúvidas | marfim | `<details>` nativo |
| VIII · Visite | carmim | O telón se fecha em moldura; o mantón balança na beira do palco |

As cenas só têm **entrada** (fade curto), sem saída: nenhuma tela fica vazia entre atos.

No celular as cenas fixas viram efeitos leves e os trilhos têm encaixe. No modo suave, nada se desloca.

## O que evitamos

O que já valia no portfólio continua valendo:

- gradientes decorativos e "glassmorphism";
- cards idênticos com ícone;
- emojis;
- botão flutuante de WhatsApp (no celular há uma barra discreta no rodapé).

Também evitamos depoimentos ou dados inventados. O que não foi confirmado está marcado com `// CONFIRMAR` no conteúdo.
