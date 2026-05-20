import { useState, useEffect, useCallback } from 'react';
import { slides } from '../../data/slides.js';
import { ICONS } from '../../data/icons.js';
import { pad2 } from '../../utils/chat.js';
import styles from './Onboarding.module.css';

function SlideIcon({ name }) {
  return (
    <div className={styles.slideIconWrap}>
      <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
    </div>
  );
}

function ExampleBox({ example }) {
  if (!example) return null;
  return (
    <div className={styles.example}>
      <div className={styles.exampleHead}>
        <span>Exemplo de Conversa</span>
        <div className={styles.dots}>
          <span /><span /><span />
        </div>
      </div>
      <div className={styles.exampleBody}>
        {example.map((line, i) => (
          <div key={i} className={styles[line.who]}>{line.text}</div>
        ))}
      </div>
    </div>
  );
}

function SideCards({ currentIndex }) {
  let indices = [currentIndex, currentIndex + 1, currentIndex + 2].filter(i => i < slides.length);
  if (indices.length < 3) {
    const start = Math.max(0, slides.length - 3);
    indices = Array.from({ length: Math.min(3, slides.length - start) }, (_, k) => start + k);
  }

  return (
    <div className={styles.sideCardStack}>
      {indices.map(idx => (
        <div key={idx} className={`${styles.miniCard} ${idx === currentIndex ? styles.active : ''}`}>
          <div className={styles.miniCardNum}>{pad2(idx + 1)}</div>
          <div>
            <div className={styles.miniCardTitle}>{slides[idx].label}</div>
            <div className={styles.miniCardSub}>{slides[idx].subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Onboarding({ onStartChat }) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const total = slides.length;
  const pct = ((current + 1) / total) * 100;

  const next = useCallback(() => {
    if (current < total - 1) setCurrent(c => c + 1);
    else onStartChat();
  }, [current, total, onStartChat]);

  const prev = useCallback(() => {
    if (current > 0) setCurrent(c => c - 1);
  }, [current]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <section className={styles.onboarding}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div className={styles.content}>
          <div className={styles.stepRow}>
            <span>
              <span className={styles.numStrong}>{pad2(current + 1)}</span>
              {' / '}
              <span>{pad2(total)}</span>
            </span>
            <span>·</span>
            <span>{slide.label}</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className={styles.slideBody}>
            <SlideIcon name={slide.icon} />
            <div className={styles.slideSubtitle}>{slide.subtitle}</div>
            <h1 className={styles.slideTitle}>{slide.title}</h1>
            <p className={styles.slideDescription}>{slide.description}</p>
            <ExampleBox example={slide.example} />
          </div>

          <div className={styles.footer}>
            <div className={styles.navDots}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : i < current ? styles.dotDone : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <div className={styles.navButtons}>
              <button
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={prev}
                disabled={current === 0}
              >
                <svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
                Anterior
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={next}>
                <span>{current === total - 1 ? 'Iniciar chat' : 'Próximo'}</span>
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className={styles.side}>
          <div>
            <div className={styles.bigNumMeta}>
              <span>STEP</span>
              <span className={styles.sep} />
              <span>{slide.label}</span>
            </div>
            <div className={styles.bigNum}>{pad2(current + 1)}</div>
          </div>
          <SideCards currentIndex={current} />
        </aside>
      </div>
    </section>
  );
}
