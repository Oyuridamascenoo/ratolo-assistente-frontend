export const slides = [
  {
    label: "Introdução",
    subtitle: "Impressoras de Grande Formato",
    title: "Assistente técnico, no campo, em tempo real.",
    description:
      "IA especializada em diagnóstico, conversão e configuração de impressoras de grande formato. Desenvolvida para técnicos que precisam de resposta rápida, exata e prática.",
    icon: "spark",
  },
  {
    label: "Como funciona",
    subtitle: "Três modos · uma conversa",
    title: "Três modos de operação.",
    description:
      "Diagnóstico em campo, conversão de sistemas de tinta e configuração inicial. Fale naturalmente, mande fotos do test bar ou da placa, receba respostas diretas — sem rodeios.",
    icon: "target",
  },
  {
    label: "Modo Diagnóstico",
    subtitle: "Modo · Diagnóstico",
    title: "Resolva problemas em campo.",
    description:
      "Descreva o sintoma. O assistente faz as perguntas certas, estreita a causa raiz e sugere a próxima ação — peça, calibragem, parâmetro ou teste.",
    icon: "search",
    example: [
      { who: "you", text: "Mimaki CJV150, nozzle check saiu com linhas faltando em magenta." },
      { who: "bot", text: "Essa linha faltante é contínua ou pontual? E apareceu de repente ou vinha piorando aos poucos?" },
    ],
  },
  {
    label: "Modo Conversão",
    subtitle: "Modo · Conversão",
    title: "Mude o sistema de tinta com segurança.",
    description:
      "Informe modelo de origem, tinta atual e tinta de destino. Receba checklist de peças, ajuste eletrônico e sequência de calibração — com o que é crítico marcado.",
    icon: "swap",
    example: [
      { who: "you", text: "Hoson rodando solvente, cliente quer rodar sublimática." },
      { who: "bot", text: "Trocar dampers e mangueiras, voltagem 42–45V, waveform v1, overlap reduzido — passo a passo a seguir." },
    ],
  },
  {
    label: "Modo Setup",
    subtitle: "Modo · Configuração inicial",
    title: "Máquina nova, pronta para rodar.",
    description:
      "Informe modelo e versão. Receba a sequência completa de instalação e calibragem, com checagens críticas destacadas e itens opcionais separados.",
    icon: "setup",
    example: [
      { who: "you", text: "Fedar FD-6194E nova, primeira instalação." },
      { who: "bot", text: "1 · Verificação física  2 · Energização  3 · Carregar tinta  4 · Nozzle check  5 · Calibração de cabeçotes…" },
    ],
  },
  {
    label: "Fotos",
    subtitle: "Anexe imagens",
    title: "Melhor diagnóstico com fotos.",
    description:
      "Tire foto do test bar, da tela de erro, dos LEDs da placa. O assistente analisa a imagem e refina o diagnóstico. Funciona pelo celular, no campo, sem fluxo extra.",
    icon: "camera",
  },
  {
    label: "Referência rápida",
    subtitle: "Trabalhe mais rápido",
    title: "Voltagens, waveforms e parâmetros à mão.",
    description:
      "O assistente conhece referência técnica de várias marcas e modelos. Pergunte voltagem típica de uma cabeça, waveform recomendado ou faixa de overlap — resposta em segundos.",
    icon: "bolt",
  },
  {
    label: "Pronto",
    subtitle: "Tudo pronto",
    title: "Vamos começar.",
    description:
      "Clique em Iniciar chat e descreva o que está acontecendo. O assistente estará ao seu lado, no campo, em qualquer máquina.",
    icon: "check",
  },
];

export const quickActions = [
  {
    label: "Nozzle check com falha",
    query: "Mimaki CJV150 nozzle check com linhas faltando em magenta",
    iconPath: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  },
  {
    label: "Converter solvente → sublimática",
    query: "Tenho impressora com solvente, cliente quer sublimática. O que precisa trocar?",
    iconPath: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
  },
  {
    label: "Setup de máquina nova",
    query: "Máquina nova, primeira instalação. Por onde começo?",
    iconPath: '<path d="M5 12l5 5L20 7"/>',
  },
  {
    label: "Referência rápida de voltagens",
    query: "Quais voltagens típicas pra cabeça Epson DX5?",
    iconPath: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  },
];
