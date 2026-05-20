export function generateReply(q) {
  const low = q.toLowerCase();

  if (/nozzle|magenta|amarelo|ciano|preto/.test(low)) {
    return {
      type: 'list',
      intro: 'Entendido — falha de nozzle. Antes de sugerir ação, preciso saber:',
      items: [
        'A linha faltante é <code>contínua</code> ou <code>intermitente</code> ao longo do test bar?',
        'Apareceu <code>de repente</code> ou foi piorando ao longo de dias?',
        'Quanto tempo a máquina ficou parada antes do último nozzle check?',
      ],
    };
  }

  if (/converter|conversão|solvente|sublimática|sublimatica|uv/.test(low)) {
    return {
      type: 'list',
      intro: 'Conversão é viável. Vou precisar de:',
      items: [
        'Modelo e marca exatos da impressora atual',
        'Tinta que está rodando hoje (fabricante e código)',
        'Tinta de destino (fabricante e código)',
        'Idade aproximada dos cabeçotes',
      ],
      outro: 'Com isso eu monto o checklist de peças, voltagens e calibragem.',
    };
  }

  if (/setup|instala|primeira|nova/.test(low)) {
    return {
      type: 'text',
      text: 'Ótimo — máquina nova. Confirma o modelo exato e me diz se já está energizada e nivelada. A sequência típica é: verificação física → energização → carga de tinta → nozzle check → calibração de cabeçotes → calibração de avanço. Te guio em cada passo.',
    };
  }

  if (/voltagem|waveform|dx5|dx7|epson|kyocera/.test(low)) {
    return {
      type: 'text',
      text: 'Pra Epson <code>DX5</code> a voltagem típica fica entre <code>22–28V</code> com waveform padrão de fábrica. Pra <code>DX7</code>, faixa <code>30–36V</code>. Me diz qual cabeça exata e qual tinta você está rodando que eu refino o número.',
    };
  }

  return {
    type: 'text',
    text: 'Recebi. Em produção, aqui vem a resposta da IA com diagnóstico específico, referência técnica ou checklist prático pro que você descreveu. Quer que eu siga em modo <code>diagnóstico</code>, <code>conversão</code> ou <code>setup</code>?',
  };
}

export function nowStamp() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}
