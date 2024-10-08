import React, { useEffect, useRef } from 'react';
import './Cursor.css';

const Cursor = () => {
  // 1. Cria uma referência para o elemento canvas.
  const canvasRef = useRef(null);

  // 2. useEffect para configurar o canvas e os listeners de eventos.
  useEffect(() => {
    // 2.1 Obtém o elemento canvas da referência.
    const canvas = canvasRef.current;
    // 2.2 Obtém o contexto 2D do canvas para desenhar.
    const ctx = canvas.getContext('2d');

    // 2.3 Define a posição inicial do ponteiro (centro da tela).
    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    // 2.4 Define os parâmetros da animação.
    const params = {
      pointsNumber: 25,  // Número de pontos na trilha do cursor
      widthFactor: 0.3, // Fator de largura da linha
      mouseThreshold: 0.6, // Limiar de movimento do mouse
      spring: 0.4,        // Intensidade da mola (efeito de "puxão")
      friction: 0.5,      // Fricção (resistência ao movimento)
    };

    // 2.5 Cria a trilha do cursor como um array de pontos.
    const trail = new Array(params.pointsNumber);
    for (let i = 0; i < params.pointsNumber; i++) {
      trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
      };
    }

    // 2.6 Função para atualizar a posição do ponteiro.
    const updateMousePosition = (eX, eY) => {
      pointer.x = eX;
      pointer.y = eY;
    };

    // 2.7 Função para configurar o canvas (definir largura e altura).
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 2.8 Define as funções de manipulação de eventos DENTRO do useEffect
    const handleMouseClick = (e) => {
      updateMousePosition(e.pageX, e.pageY);
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e.pageX, e.pageY);
    };

    const handleTouchMove = (e) => {
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    };

    // 2.9 Função para animar o cursor.
    const animate = () => {
      // 2.9.1 Limpa o canvas a cada frame.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2.9.2 Atualiza a posição de cada ponto na trilha.
      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1]; // Define o ponto anterior
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring; // Ajuste para o primeiro ponto
        p.dx += (prev.x - p.x) * spring; // Calcula a diferença horizontal (x)
        p.dy += (prev.y - p.y) * spring; // Calcula a diferença vertical (y)
        p.dx *= params.friction; // Aplica a fricção à velocidade horizontal
        p.dy *= params.friction; // Aplica a fricção à velocidade vertical
        p.x += p.dx; // Atualiza a posição horizontal
        p.y += p.dy; // Atualiza a posição vertical

        // 2.9.3 Ajusta a posição do primeiro ponto para centralizar o cursor.
        if (pIdx === 0) {
          p.x = pointer.x - ctx.lineWidth / 2;
          p.y = pointer.y - ctx.lineWidth / 2;
        }
      });

      // 2.9.4 Define o estilo da linha.
      ctx.lineCap = 'round'; // Ponta arredondada
      ctx.strokeStyle = '#e5b75a'; // Cor do cursor

      // 2.9.5 Inicia o desenho do cursor.
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y); // Move para o primeiro ponto

      // 2.9.6 Desenha a trilha do cursor.
      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc); // Desenha a curva
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i); // Largura da linha
        ctx.stroke(); // Desenha a linha
      }

      // 2.9.7 Desenha a última linha até o último ponto da trilha.
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      // 2.9.8 Agenda a próxima chamada da função animate (loop de animação).
      requestAnimationFrame(animate);
    };

    // 2.10 Configura o canvas e inicia a animação.
    setupCanvas();
    animate();

    // 2.11 Adiciona os listeners de eventos.
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', setupCanvas);

    // 2.12 Remove os listeners de eventos quando o componente desmontar.
    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', setupCanvas);
    };
  }, []); // Executa o useEffect apenas uma vez, quando o componente é montado.

  // 3. Renderiza o canvas.
  return <canvas ref={canvasRef} id="cursorCanvas" />; 
};

export default Cursor;