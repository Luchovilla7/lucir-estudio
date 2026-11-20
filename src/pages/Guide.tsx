import { Link } from 'react-router-dom';
import { Archive, CalendarDays, CheckCircle2, FlaskConical, Mail, MessagesSquare, Sparkles, Store, Wand2 } from 'lucide-react';
import { useData } from '../lib/store';
import { TONE_LIST } from '../lib/tones';
import { PageHeader, Section } from '../components/ui';

export default function Guide() {
  const { brand, brandPieces, brandSparks, hooks } = useData();
  const steps = [
    { done: !!(brand.name.trim() && brand.description.trim() && brand.audience.trim()), to: '/marca', icon: Store, title: 'Configura tu marca', text: 'Cuenta qué haces, a quién ayudas y cómo suenas. Todo lo que generes parte de esto.' },
    { done: brandSparks.length > 0, to: '/chispas', icon: Sparkles, title: 'Genera tus primeras chispas', text: 'Una tanda de ocho ideas, dos por cada tono, con su apertura terminada.' },
    { done: hooks.saved.length > 0, to: '/aperturas', icon: FlaskConical, title: 'Adapta una apertura', text: 'Elige una plantilla del laboratorio y reescríbela con datos reales de tu negocio.' },
    { done: brandPieces.length > 0, to: '/taller', icon: Wand2, title: 'Crea tu primera pieza', text: 'Carrusel, stories, reel, post o carta. Edítala a tu gusto en el mismo lugar.' },
    { done: brandPieces.some((p) => p.scheduledAt), to: '/agenda', icon: CalendarDays, title: 'Agéndala', text: 'Arrastra la pieza a un día del calendario para no publicar a última hora.' },
  ];
  const doneN = steps.filter((s) => s.done).length;

  return (
    <>
      <PageHeader title="Guía de inicio" sub="Cinco pasos para pasar de la idea suelta a la pieza publicada." />

      <div className="card progress-card">
        <div>
          <span className="eyebrow">Tu avance</span>
          <div className="stat-num">{doneN}/{steps.length}</div>
        </div>
        <div className="bar grow"><i style={{ width: `${(doneN / steps.length) * 100}%` }} /></div>
      </div>

      <div className="steps">
        {steps.map((s, i) => (
          <Link key={s.to} to={s.to} className="card step">
            <span className="step-n">{s.done ? <CheckCircle2 size={20} /> : i + 1}</span>
            <s.icon size={18} className="step-ico" />
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Link>
        ))}
      </div>

      <Section title="Los cuatro tonos" sub="Cada pieza se escribe con un tono narrativo. Alternarlos evita que tu contenido suene siempre igual.">
        <div className="tone-grid">
          {TONE_LIST.map((t) => (
            <div className="tone-card" key={t.id} style={{ ['--tc' as string]: t.color }}>
              <i />
              <h3>{t.name}</h3>
              <b>{t.tagline}</b>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Qué hace cada sección">
        <div className="faq">
          {[
            [Wand2, 'Taller', 'Genera carruseles, stories, reels con guion y posts de texto a partir de una idea.'],
            [FlaskConical, 'Laboratorio', 'Banco de aperturas con plantillas: copia, adapta, rellena los campos y guarda tus versiones.'],
            [MessagesSquare, 'Copiloto IA', 'Conversa tu idea y recibe ganchos, estructura y siguiente paso. Guarda lo que sirva.'],
            [Mail, 'Cartas', 'Escribe una carta (email) con historia, moraleja y propuesta en 300 a 500 palabras.'],
            [Sparkles, 'Chispas', 'Un banco de ideas estratégicas con su apertura y los niveles de consciencia que activan.'],
            [CalendarDays, 'Agenda', 'Calendario mensual con arrastrar y soltar para fijar la fecha de cada pieza.'],
            [Archive, 'Archivo', 'Todo lo que creaste, con filtros, métricas de alcance y guardados, y exportación.'],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Wand2;
            return (
              <div key={t as string} className="faq-row">
                <I size={16} />
                <b>{t as string}</b>
                <span>{d as string}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
