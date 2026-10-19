import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Roda do compás — o "relógio" que todo aluno de flamenco aprende a contar.
 *
 * Os tempos ficam num círculo, como os números de um relógio; os acentuados
 * aparecem maiores e dourados. Com `current`, o tempo que soa se acende e um
 * ponteiro aponta para ele. A contagem e as palmas ficam em `useCompas`.
 */
export interface CompasWheelProps {
  /** Número de tempos do ciclo (12 na soleá; 4 nos tangos; 3 nas sevilhanas). */
  beats: number;
  /** Tempos acentuados, contados a partir de 1. */
  accents: readonly number[];
  /** Tempo que está soando (base 0); -1 parado. */
  current?: number;
  className?: string;
}

const pad = (n: number) => String(n);

export function CompasWheel({ beats, accents, current = -1, className }: CompasWheelProps) {
  const accentSet = new Set(accents);
  const R = 78;
  // O ciclo de 12 começa "no 12", como no relógio: o 12 fica no alto.
  const angleOf = (i: number) => ((i + 1) / beats) * Math.PI * 2 - Math.PI / 2;

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={cn('block size-full overflow-visible', className)}>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.6" />
      {current >= 0 && (
        <line
          x1="100"
          y1="100"
          x2={100 + Math.cos(angleOf(current)) * 56}
          y2={100 + Math.sin(angleOf(current)) * 56}
          stroke="var(--ouro)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
      <circle cx="100" cy="100" r="3" fill="var(--ouro)" />
      {Array.from({ length: beats }, (_, i) => {
        const a = angleOf(i);
        const x = 100 + Math.cos(a) * R;
        const y = 100 + Math.sin(a) * R;
        const accent = accentSet.has(i + 1);
        const on = i === current;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g style={on ? { animation: 'palma 0.35s ease-out' } : undefined}>
              <circle
                r={accent ? 12 : 8}
                fill={accent ? 'var(--ouro)' : 'none'}
                fillOpacity={on ? 1 : accent ? 0.85 : 0}
                stroke="currentColor"
                strokeOpacity={accent ? 0 : on ? 1 : 0.45}
                strokeWidth="0.8"
              />
              {on && !accent && <circle r="8" fill="currentColor" />}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="font-display"
                style={{ fontSize: accent ? 12 : 8.5 }}
                fill={accent ? '#2b0307' : 'currentColor'}
                fillOpacity={accent || on ? 1 : 0.7}
              >
                {pad(i + 1)}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** Palma sintetizada: um estalo de ruído filtrado (forte nos acentos, "surda" nos demais). */
function clap(audio: AudioContext, strong: boolean) {
  const length = Math.floor(audio.sampleRate * 0.08);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, strong ? 3 : 5);
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = strong ? 1500 : 900;
  filter.Q.value = 0.9;
  const gain = audio.createGain();
  gain.gain.value = strong ? 0.9 : 0.28;
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start();
}

interface UseCompasOptions {
  beats: number;
  accents: readonly number[];
  bpm: number;
  playing: boolean;
  /** Toca as palmas (WebAudio). Sem som, só a roda gira. */
  sound?: boolean;
}

/** Conta o compás em tempo real e, se pedido, bate as palmas. Devolve o tempo atual (base 0). */
export function useCompas({ beats, accents, bpm, playing, sound = true }: UseCompasOptions): number {
  const [current, setCurrent] = useState(-1);
  const audioRef = useRef<AudioContext | null>(null);
  const accentKey = accents.join(',');

  useEffect(() => {
    if (!playing) {
      setCurrent(-1);
      return;
    }
    if (sound && !audioRef.current && typeof AudioContext !== 'undefined') {
      try {
        audioRef.current = new AudioContext();
      } catch {
        audioRef.current = null;
      }
    }
    void audioRef.current?.resume();
    const accentSet = new Set(accents);
    let beat = 0;
    const play = () => {
      setCurrent(beat);
      if (sound && audioRef.current) clap(audioRef.current, accentSet.has(beat + 1));
      beat = (beat + 1) % beats;
    };
    play();
    const id = window.setInterval(play, 60000 / bpm);
    return () => window.clearInterval(id);
    // accentKey representa `accents` (arrays novos a cada render não reiniciam a contagem).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, beats, accentKey, bpm, sound]);

  useEffect(() => () => void audioRef.current?.close(), []);

  return current;
}
