import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface BackgroundVideoProps {
  mp4: string;
  webm: string;
  poster: string;
  className?: string;
  /** Texto alternativo. Sem ele, o vídeo é decorativo. */
  label?: string;
}

/**
 * Vídeo de fundo silencioso em loop. Só toca na tela (pausa fora dela, para não
 * gastar bateria nem dados) e, no modo suave, fica parado no pôster.
 * Sem `autoPlay` no HTML: quem decide tocar é o efeito, já sabendo a preferência.
 */
export function BackgroundVideo({ mp4, webm, poster, className, label }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    const play = () => void video.play().catch(() => {});
    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? play() : video.pause()), { rootMargin: '100px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('pointer-events-none block h-full w-full object-cover', className)}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
