import React, { useEffect, useRef, useState } from 'react';
export default function CircleClock() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const hitSoundRef = useRef(null);
  const missSoundRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Create audio elements
    hitSoundRef.current = new Audio('/audio/hitmarker.mp3');
    missSoundRef.current = new Audio('/audio/hitmarker.mp3'); // Using same sound for now
    hitSoundRef.current.volume = 0.3;
    missSoundRef.current.volume = 0.2;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Game constants
    const GAME_SIZE = 100;
    const START_SPEED = 0.004;
    const MAX_SPEED = 0.012;
    const ZOOM_DURATION = 300;
    const ZOOM_STRENGTH = 0.05;
    const RING_MARGIN = 5;
    const BALL_RADIUS = 5;
    const RING_RADIUS = GAME_SIZE / 2 - BALL_RADIUS - RING_MARGIN;
    const INNER_SIZE = 0.75;
    const PARTICLE_MAX_AGE = 0.1;

    // Setup canvas
    function setupCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      const parent = canvas.parentElement;
      const minSide = Math.min(parent.clientWidth, parent.clientHeight);
      canvas.style.width = canvas.style.height = minSide + 'px';
      canvas.width = canvas.height = minSide * window.devicePixelRatio;
      ctx.resetTransform();
      const scale = (minSide / GAME_SIZE) * window.devicePixelRatio;
      ctx.scale(scale, scale);
      ctx.lineCap = 'round';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 10px sans-serif';
      return ctx;
    }

    const angleToPos = (angle) => ({
      x: 50 + RING_RADIUS * Math.cos(angle),
      y: 50 + RING_RADIUS * Math.sin(angle),
    });

    let ctx = setupCanvas(canvas);
    
    const handleResize = () => {
      ctx = setupCanvas(canvas);
    };
    
    window.addEventListener('resize', handleResize);

    // Game state
    const state = {
      type: 'instructions',
      score: 0,
      ballAngle: 0,
      particles: [],
      dir: -1,
      targetAngle: Math.random() * 2 * Math.PI,
      zoom: 0,
      elapsedTime: 0,
    };

    function isOnTarget() {
      const playerPos = angleToPos(state.ballAngle);
      const targetPos = angleToPos(state.targetAngle);
      const dist = Math.hypot(playerPos.x - targetPos.x, playerPos.y - targetPos.y);
      return dist < BALL_RADIUS * 2;
    }

    const drawCircle = (ctx, x, y, r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
      ctx.fill();
    };

    function draw(ctx) {
      if (state.type === 'instructions') {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('click or press space', 50, 50);
        ctx.fillText('to start', 50, 58);
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.clearRect(0, 0, GAME_SIZE, GAME_SIZE);
      
      if (state.zoom > 0) {
        const zoom = 1 + state.zoom ** 2 * ZOOM_STRENGTH;
        ctx.translate(GAME_SIZE / 2, GAME_SIZE / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-GAME_SIZE / 2, -GAME_SIZE / 2);
      }
      
      const fgColor = state.type === 'gameover' ? 'white' : 'black';
      const bgColor = state.type === 'gameover' ? 'black' : 'white';
      
      ctx.fillStyle = state.type === 'gameover' ? 'black' : 'white';
      ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

      const MIN_RADIUS = 1;
      state.particles.forEach((p) => {
        const radius = BALL_RADIUS * (1 - p.age / PARTICLE_MAX_AGE);
        const pos = angleToPos(p.angle);
        if (radius > MIN_RADIUS) drawCircle(ctx, pos.x, pos.y, radius, fgColor);
      });

      const onTarget = isOnTarget();
      const pos1 = angleToPos(state.targetAngle);
      drawCircle(ctx, pos1.x, pos1.y, BALL_RADIUS, fgColor);
      const pos2 = angleToPos(state.ballAngle);
      drawCircle(ctx, pos2.x, pos2.y, BALL_RADIUS, fgColor);
      
      if (onTarget) {
        drawCircle(ctx, pos1.x, pos1.y, BALL_RADIUS * INNER_SIZE, bgColor);
        drawCircle(ctx, pos2.x, pos2.y, BALL_RADIUS * INNER_SIZE, bgColor);
      }
      
      ctx.fillStyle = fgColor;
      ctx.fillText(state.score.toString(), 50, 50);
      
      // Draw timer at the top right
      ctx.save();
      ctx.font = 'bold 6px sans-serif';
      ctx.textAlign = 'right';
      const seconds = (state.elapsedTime / 1000).toFixed(1);
      ctx.fillText(seconds + 's', GAME_SIZE - 5, 10);
      ctx.restore();
      
      ctx.restore();
    }

    const curSpeed = (score) => MAX_SPEED - (MAX_SPEED - START_SPEED) / (1 + score * 0.01);

    function tick(dt, ctx) {
      if (state.type === 'playing') {
        state.ballAngle += dt * curSpeed(state.score) * state.dir;
        state.elapsedTime += dt;
      }
      if (state.zoom > 0) state.zoom -= dt / ZOOM_DURATION;
      
      state.particles.push({
        age: 0,
        angle: state.ballAngle,
      });
      
      state.particles.forEach((p) => (p.age += dt / 1000));
      state.particles = state.particles.filter((p) => p.age <= PARTICLE_MAX_AGE);
      draw(ctx);
    }

    function press() {
      if (state.type === 'instructions') {
        state.type = 'playing';
        return;
      }

      if (state.type === 'gameover') {
        state.type = 'playing';
        state.score = 0;
        state.elapsedTime = 0;
      } else if (isOnTarget()) {
        // HIT! Play success sound
        if (hitSoundRef.current) {
          hitSoundRef.current.currentTime = 0;
          hitSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
        state.zoom = 1;
        state.score++;
        state.dir = -state.dir;
        state.targetAngle = Math.random() * 2 * Math.PI;
      } else {
        // MISS! Play miss sound
        if (missSoundRef.current) {
          missSoundRef.current.currentTime = 0;
          missSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
        state.zoom = 1;
        state.type = 'gameover';
        
        if (
          localStorage['circleclock-high-score'] === undefined ||
          state.score > Number(localStorage['circleclock-high-score'])
        ) {
          localStorage['circleclock-high-score'] = state.score.toString();
        }
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        press();
      }
    };

    const handleContainerClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      press();
    };

    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('click', handleContainerClick);

    let lastTime = performance.now();
    let animationId;
    
    function loop() {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      tick(dt, ctx);
      animationId = requestAnimationFrame(loop);
    }
    
    setIsLoading(false);
    animationId = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('click', handleContainerClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'white',
        cursor: 'pointer'
      }}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        {isLoading && (
          <div style={{ 
            color: '#333', 
            fontSize: '18px',
            fontFamily: 'sans-serif'
          }}>
            Loading...
          </div>
        )}
        <canvas 
          ref={canvasRef}
          style={{ 
            display: isLoading ? 'none' : 'block'
          }}
        />
      </div>
    </div>
  );
}

export function displayCircleClock() {
  return <CircleClock />;
}
