import { stockImagePosition, stockImages, type StockImage } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { cn } from '@/lib/utils';
import { Carousel } from './Carousel';

interface AlbumProps {
  title: string;
  credit: string;
  items: { image: StockImage; alt: string; credit: string }[];
}

/** Formatos alternados — arco, retrato e quadrado — como fotos presas num mural de camarim. */
const SHAPES = ['aspect-[4/5] rounded-t-full', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5] rounded-t-full', 'aspect-[5/4]'];

/**
 * Álbum da casa: fotos reais num carrossel que o visitante percorre de lado
 * (setas, arrastar, deslizar ou teclado) — todas as fotos ficam alcançáveis.
 */
export function Album({ title, credit, items }: AlbumProps) {
  const { ui } = useContent();
  return (
    <div className="mx-[calc(50%-50vw)] mt-20 lg:mt-28">
      <p className="label-caps mb-6 px-4 text-center text-muted-foreground">
        {title} <span className="px-1 text-[var(--ouro)]">·</span> {credit}
      </p>
      <Carousel label={title} prevLabel={ui.previous} nextLabel={ui.next} trackClassName="items-end gap-4 sm:gap-6">
        {items.map((item, i) => (
          <figure key={item.image} className={cn('relative w-[68vw] shrink-0 snap-start sm:w-[36vw] lg:w-[min(24vw,22rem)]', i % 2 && 'lg:mb-12')}>
            <div className={cn('relative overflow-hidden', SHAPES[i % SHAPES.length])}>
              <img
                src={stockImages[item.image]}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ objectPosition: stockImagePosition[item.image] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="label-caps mt-2 text-[0.6rem] text-muted-foreground">Foto: {item.credit}</figcaption>
          </figure>
        ))}
      </Carousel>
    </div>
  );
}
