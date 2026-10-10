import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { mediaUrl, site } from '../data/site';
import { fragments, photos, stories, type Memory } from '../data/memories';
import { quotes } from '../data/quotes';
import { Dialog } from './Dialog';
import { Reveal } from './Reveal';

export function MemoryImage({ memory, large = false }: { memory: Memory; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!memory.photo || failed) return <div className="image-unavailable" role="img" aria-label={site.copy.ui.photoUnavailable}>{site.copy.ui.photoUnavailable}</div>;
  return <img src={mediaUrl(memory.photo)} alt={memory.alt || memory.title} loading={large ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

export function MemoryArchive() {
  const [tab, setTab] = useState(0);
  const [view, setView] = useState<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const gallery = photos.filter(p => p.consent && p.photo).sort((a, b) => a.order - b.order);
  const realStories = stories.filter(p => p.consent).sort((a, b) => a.order - b.order);
  const realFragments = fragments.filter(p => p.consent).sort((a, b) => a.order - b.order);
  const counts = [quotes.length, gallery.length, realStories.length];
  const copy = site.copy.archive;
  function moveTab(e: KeyboardEvent, i: number) {
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % 3;
    else if (e.key === 'ArrowLeft') next = (i + 2) % 3;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 2;
    else return;
    e.preventDefault(); setTab(next); tabRefs.current[next]?.focus();
  }
  useEffect(() => {
    if (view === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowRight') setView(i => i === null ? null : (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setView(i => i === null ? null : (i + gallery.length - 1) % gallery.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [view, gallery.length]);
  return <section id="archive" className="chapter archive">
    <div className="section-inner">
      <p className="section-kicker">{copy.intro}</p>
      <Reveal as="h2" text={copy.title} className="display-heading archive-heading" />
      <div className="archive-tabs" role="tablist" aria-label={copy.intro}>
        {copy.tabs.map((label, i) => <button key={label} ref={el => { tabRefs.current[i] = el; }} role="tab" id={`archive-tab-${i}`} aria-controls={`archive-panel-${i}`} aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={e => moveTab(e, i)}>
          {label}<span className="tab-count">{String(counts[i]).padStart(2, '0')}</span>
        </button>)}
      </div>
      <div role="tabpanel" id={`archive-panel-${tab}`} aria-labelledby={`archive-tab-${tab}`} className="archive-panel" tabIndex={0}>
        {tab === 0 && <>
          <div className="quote-rail">
            {[...quotes].sort((a, b) => a.order - b.order).map((quote, i) => <figure className={`quote-sheet quote-sheet-${i}`} key={quote.id}>
              <div className="quote-mark" aria-hidden="true">“</div>
              <blockquote>{quote.text.split('\n').map(line => <span key={line}>{line}</span>)}</blockquote>
              <figcaption><span>{quote.author}</span><span>{quote.note}</span></figcaption>
            </figure>)}
          </div><p className="archive-caption">{copy.quotesCaption}</p>
        </>}
        {tab === 1 && (gallery.length ? <div className="photo-rail">{gallery.map((photo, i) => <figure key={photo.id} className="photo-exhibit">
          <button className="photo-open" onClick={() => setView(i)} aria-label={`查看照片：${photo.title}`}><MemoryImage memory={photo} /><span className="photo-expand"><Maximize2 size={18} /></span></button>
          <figcaption><strong>{photo.title}</strong>{photo.caption && <span>{photo.caption}</span>}</figcaption>
        </figure>)}</div> : <div className="archive-empty photo-empty"><div className="empty-frame" aria-hidden="true"><span>2603</span></div><div><h3>{copy.photoEmpty}</h3><p>{copy.photoNote}</p></div></div>)}
        {tab === 2 && (realStories.length ? <div className="story-list">{realStories.map(story => <details key={story.id} className="story"><summary><span>{story.title}</span>{story.date && <time>{story.date}</time>}</summary><div className="story-content"><p>{story.body}</p>{story.photo && <MemoryImage memory={story} />}{story.caption && <p className="caption">{story.caption}</p>}</div></details>)}</div> : <div className="archive-empty story-empty"><span className="empty-punctuation" aria-hidden="true">“</span><h3>{copy.storyEmpty}</h3><p>{copy.storyNote}</p></div>)}
      </div>
      {realFragments.length > 0 && <div className="fragments">{realFragments.map(fragment => <article key={fragment.id}><Reveal text={fragment.body} />{fragment.photo && <MemoryImage memory={fragment} />}</article>)}</div>}
    </div>
    <Dialog open={view !== null} onClose={() => setView(null)} title={view === null ? copy.intro : gallery[view]?.title || copy.intro} className="image-dialog">
      {view !== null && gallery[view] && <>
        <MemoryImage memory={gallery[view]} large />
        <div className="viewer-caption"><div><strong>{gallery[view].title}</strong><p>{gallery[view].caption}</p></div><span>{view + 1} / {gallery.length}</span></div>
        {gallery.length > 1 && <div className="viewer-controls"><button className="icon-button" onClick={() => setView((view + gallery.length - 1) % gallery.length)} aria-label={site.copy.ui.previousPhoto}><ChevronLeft /></button><button className="icon-button" onClick={() => setView((view + 1) % gallery.length)} aria-label={site.copy.ui.nextPhoto}><ChevronRight /></button></div>}
      </>}
    </Dialog>
  </section>;
}
