import { createRoot, hydrateRoot } from 'react-dom/client';
import { createDefaultServices } from './lib/services';
import { localeFromPath } from './lib/seo/seo';
import { Root } from './Root';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado no index.html.');

// O idioma é o da URL: cada idioma tem a sua página pré-renderizada (/ e /es/).
const app = <Root services={createDefaultServices()} locale={localeFromPath(window.location.pathname)} />;

// Em produção o HTML já vem pré-renderizado: só "hidratamos". Em dev, render normal.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
