import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface BackgroundVideoProps {
  mp4: string;
  webm: string;
  poster: string;
  /** Versão vertical para telas em retrato (celular). */
  portrait?: { mp4: string; webm: string; poster: string };
  className?: string;
  /** Texto alternativo. Sem ele, o vídeo é decorativo. */
  label?: string;
}

/**
 * Vídeo de fundo silencioso em loop. Só toca na tela (pausa fora dela, para não
 * gastar bateria nem dados) e, no modo suave, fica parado no pôster.
 * Sem `autoPlay` no HTML: quem decide tocar é o efeito, já sabendo a preferência,
 * e só depois que a página terminou de carregar.
 */
export function BackgroundVideo({ mp4, webm, poster, portrait, className, label }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    const play = () => void video.play().catch(() => {});
    // O vídeo só começa a baixar depois que a página carregou e o navegador ficou ocioso:
    // o pôster ocupa o lugar antes, e a primeira tela não disputa banda com ele.
    const start = () => {
      if (cancelled) return;
      video.preload = 'auto';
      if (typeof IntersectionObserver === 'undefined') return play();
      observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? play() : video.pause()), { rootMargin: '100px' });
      observer.observe(video);
    };
    const idle = () => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 1200);
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener('load', idle);
    };
  }, [reduced]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('pointer-events-none block h-full w-full object-cover', className)}
    >
      {portrait && <source src={portrait.webm} type="video/webm" media="(orientation: portrait)" />}
      {portrait && <source src={portrait.mp4} type="video/mp4" media="(orientation: portrait)" />}
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
