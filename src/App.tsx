import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { BookOpen, List, Mail, RotateCcw } from 'lucide-react';
import { mediaUrl, site } from './data/site';
import { timeline } from './data/memories';
import { motionTokens as tokens } from './motion/tokens';
import { GentleContext, Reveal, useGentleMotion } from './components/Reveal';
import { Dialog } from './components/Dialog';
import { MemoryArchive, MemoryImage } from './components/MemoryArchive';
import { Messages } from './components/Messages';

function deviceNeedsGentleMotion() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || Boolean(nav.connection?.saveData);
}
function readIntroSeen() { try { return sessionStorage.getItem('2603-intro-seen') === 'yes'; } catch { return false; } }

function Header({ active, onMenu }: { active: number; onMenu: () => void }) {
  const { scrollYProgress } = useScroll();
  return <>
    <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    <header className={`site-header ${active === 0 || active >= 6 ? 'on-dark' : ''}`}>
      <a className="brand" href="#opening" aria-label={site.title}><span className="brand-class">2603<span>CLASS</span></span><span className="brand-title">THE NEXT<br />CHAPTER</span></a>
      <div className="header-right"><span className="current-chapter">{String(active).padStart(2, '0')}<span> / 07</span></span><button className="menu-button" onClick={onMenu} aria-label={site.copy.ui.directory}><span>{site.copy.ui.directory}</span><List size={20} aria-hidden="true" /></button></div>
    </header>
  </>;
}

function Opening({ replay }: { replay: number }) {
  const gentle = useGentleMotion();
  const [intro, setIntro] = useState(() => !readIntroSeen());
  const [line, setLine] = useState(0);
  const { scrollY } = useScroll();
  function endIntro() { setIntro(false); try { sessionStorage.setItem('2603-intro-seen', 'yes'); } catch { /* 可跳过 */ } }
  useMotionValueEvent(scrollY, 'change', value => { if (value > 80 && intro) endIntro(); });
  useEffect(() => { if (replay > 0) { setIntro(true); setLine(0); } }, [replay]);
  useEffect(() => {
    if (!intro) return;
    if (gentle) { endIntro(); return; }
    const timers = [setTimeout(() => setLine(1), 1250), setTimeout(() => setLine(2), 2500), setTimeout(endIntro, 4000)];
    return () => timers.forEach(clearTimeout);
  }, [intro, gentle, replay]);
  return <section id="opening" className="chapter hero">
    <img className="hero-light" src={mediaUrl(site.media.hero)} alt="日落般的抽象暖色光影" fetchPriority="high" width={1536} height={1024} />
    <div className="hero-scrim" aria-hidden="true" />
    <div className="hero-inner">
      <p className="hero-gift">{site.copy.gift}</p>
      <motion.div className="hero-title-block" animate={{ opacity: intro ? 0 : 1, y: intro ? 14 : 0, filter: intro ? 'blur(7px)' : 'blur(0px)' }} transition={{ duration: gentle ? 0 : 1.15, ease: tokens.ease }} aria-hidden={intro}>
        <h1><span>戴老师的</span><span>下一站<span className="title-period">。</span></span></h1>
        <p className="hero-english">{site.englishTitle}</p>
      </motion.div>
      <AnimatePresence>{intro && <motion.div className="intro-copy" key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <AnimatePresence mode="wait"><motion.p key={line} initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: tokens.ease }}>{site.intro[line]}</motion.p></AnimatePresence>
        <button className="intro-skip" onClick={endIntro}>{site.copy.ui.skip}</button>
      </motion.div>}</AnimatePresence>
      <div className="hero-bottom"><a className="hero-start" href="#reserved" onClick={endIntro}><BookOpen size={18} aria-hidden="true" />{site.copy.start}</a><span className="hero-dedication">献给戴能斌老师</span></div>
    </div>
  </section>;
}

function ReservedCard() {
  const [flipped, setFlipped] = useState(false);
  const gentle = useGentleMotion();
  const copy = site.copy.reserved;
  return <section id="reserved" className="chapter reserved"><div className="section-inner reservation-layout">
    <div className="reservation-copy"><p className="section-kicker">戴总预备役</p><Reveal text={copy.premise} className="section-description" /><Reveal text={copy.quote} className="reservation-quote" /><p className="quiet-lead">{copy.lead}</p><Reveal as="h2" text={copy.title} className="reservation-title" /></div>
    <div className="card-scene"><button className={`reservation-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(value => !value)} aria-label={copy.cardTitle} aria-pressed={flipped}>
      <motion.div className="card-rotor" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: gentle ? 0 : tokens.duration.card, ease: tokens.ease }}>
        <div className="card-face card-front" aria-hidden={flipped}><div className="card-top"><span>THE NEXT CHAPTER</span><span>2603</span></div><p className="card-name">{site.teacher}<span>预留称号</span></p><p className="card-honor">戴总</p><div className="card-bottom"><span>认证单位 / {site.className}</span><span>RESERVED</span></div></div>
        <div className="card-face card-back" aria-hidden={!flipped}><p>{copy.reverse}</p><motion.div className="class-stamp" animate={{ scale: flipped ? 1 : 1.4, opacity: flipped ? 1 : 0, rotate: flipped ? -12 : -20 }} transition={{ delay: gentle ? 0 : 0.45, duration: gentle ? 0 : 0.35, ease: tokens.ease }}><span>2603 班</span><strong>特别认证</strong><span>称号预留中</span></motion.div><p className="card-back-note">{copy.reverseNote}</p></div>
      </motion.div>
    </button><div className="card-footnote"><span>{flipped ? copy.flipped : copy.flip}</span><span aria-hidden="true">↻</span></div><p className="reserved-state">{copy.note}</p></div>
  </div></section>;
}

function TimeThought({ text, index, progress }: { text: string; index: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const start = index * 0.22;
  const opacity = useTransform(progress, [start, start + 0.05, start + 0.19, Math.min(start + 0.25, 1)], [0, 1, 1, index === 3 ? 1 : 0]);
  const y = useTransform(progress, [start, start + 0.06, start + 0.22], [18, 0, -8]);
  return <motion.p className="time-thought" style={{ opacity, y }}>{text}</motion.p>;
}
function TimeChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const gentle = useGentleMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 0.75, 1], [0.94, 1.05, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [12, -20]);
  const copy = site.copy.time;
  const events = timeline.filter(event => event.consent).sort((a, b) => a.order - b.order);
  return <section id="time" className={`chapter time-chapter ${gentle ? 'gentle' : ''}`}>
    <div ref={ref} className="time-scroll"><div className="time-sticky"><Reveal as="h2" text={copy.title} className="time-question" /><motion.p className="time-word" style={gentle ? undefined : { scale, y }}>{copy.word}</motion.p><div className="time-thoughts">{copy.thoughts.map((text, index) => gentle ? <p key={text}>{text}</p> : <TimeThought key={text} text={text} index={index} progress={scrollYProgress} />)}</div></div></div>
    <div className="section-inner time-memories">{events.length ? <ol className="memory-timeline">{events.map(event => <li key={event.id}>{event.date && <time>{event.date}</time>}<h3>{event.title}</h3><p>{event.body}</p>{event.photo && <MemoryImage memory={event} />}{event.caption && <p className="caption">{event.caption}</p>}</li>)}</ol> : <div className="timeline-empty"><span className="timeline-node" aria-hidden="true" /><div><h3>{copy.emptyTitle}</h3><p>{copy.emptyBody}</p><a className="inline-link" href="#archive">去记忆档案看看</a></div></div>}</div>
  </section>;
}

const brickPositions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]];
function Brick({ index, row, column, progress, gentle }: { index: number; row: number; column: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; gentle: boolean }) {
  const start = Math.min(index * 0.025, 0.35);
  const x = useTransform(progress, [start, start + 0.32], [(column - 2) * 70 + (index % 2 ? 60 : -60), 0]);
  const y = useTransform(progress, [start, start + 0.32], [(row - 2) * 65 + 110, 0]);
  const opacity = useTransform(progress, [start, start + 0.12], [0.1, 1]);
  const rotate = useTransform(progress, [start, start + 0.32], [index % 2 ? 9 : -9, 0]);
  return <motion.span className="brick" style={{ gridRow: row + 1, gridColumn: column + 1, ...(gentle ? {} : { x, y, opacity, rotate }) }} />;
}
function TogetherChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const gentle = useGentleMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const left = useTransform(scrollYProgress, [0, 0.65], [-35, 0]);
  const right = useTransform(scrollYProgress, [0, 0.65], [35, 0]);
  const coreOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const copy = site.copy.together;
  return <section id="together" className={`chapter together ${gentle ? 'gentle' : ''}`}>
    <div ref={ref} className="together-scroll"><div className="together-sticky"><div className="together-words"><motion.h2 style={gentle ? undefined : { x: left }}>{copy.first}<span>，</span></motion.h2><motion.p style={gentle ? undefined : { x: right }}>{copy.second}<span>。</span></motion.p></div><div className="brick-composition" aria-hidden="true">{brickPositions.map(([row, column], index) => <Brick key={index} index={index} row={row} column={column} progress={scrollYProgress} gentle={gentle} />)}<motion.div className="brick-center" style={gentle ? undefined : { opacity: coreOpacity }}><span>2603</span><small>一起，把回忆砌好。</small></motion.div></div><p className="together-source">戴老师说过的一句话</p></div></div>
    <div className="section-inner together-reflection"><div>{copy.lines.map((text, index) => <Reveal key={text} text={text} className={index === 3 ? 'reflection-final' : ''} delay={index * 0.05} />)}<p className="reflection-credit">{copy.attribution}</p></div></div>
  </section>;
}

function NextChapter() {
  const copy = site.copy.next;
  return <section id="next" className="chapter next-chapter"><div className="section-inner next-inner"><Reveal text={copy.opening} className="next-opening" /><Reveal text={copy.wish} className="next-opening" /><Reveal as="h2" text={copy.reunion} className="next-reunion" /><div className="next-quiet"><Reveal text={copy.quiet} className="quiet-lead" /><Reveal text={copy.core} className="next-core" />{copy.lines.map(line => <Reveal key={line} text={line} className="next-wish" />)}<Reveal text={site.endings[site.state].line} className="state-ending" /></div></div></section>;
}

function Harbor({ onReplay }: { onReplay: () => void }) {
  const [letterOpen, setLetterOpen] = useState(false);
  const copy = site.copy.harbor;
  const finale = site.media.finale;
  return <section id="harbor" className="chapter harbor">
    {finale.src && finale.consent ? <img className="harbor-photo" src={mediaUrl(finale.src)} alt={finale.alt} loading="lazy" /> : <div className="harbor-light" aria-hidden="true" />}
    <div className="section-inner harbor-inner"><Reveal text={copy.lead} className="harbor-lead" /><Reveal text={copy.thought} className="harbor-thought" /><div className="harbor-core"><Reveal text={copy.core[0]} className="harbor-first" /><Reveal as="h2" text={copy.core[1]} className="harbor-last" delay={0.18} /></div><Reveal text={copy.signature} className="harbor-signature" delay={0.28} /><button className="letter-button" onClick={() => setLetterOpen(true)}><Mail size={17} aria-hidden="true" />{copy.letterAction}</button>{finale.src && finale.consent && finale.caption && <p className="harbor-caption">{finale.caption}</p>}<footer className="site-footer"><span>THE NEXT CHAPTER<br /><small>2603 CLASS</small></span><button className="replay-button" onClick={onReplay}><RotateCcw size={15} aria-hidden="true" />{copy.replay}</button></footer></div>
    <Dialog open={letterOpen} onClose={() => setLetterOpen(false)} title={copy.letterAction} className="letter-dialog"><article className="letter"><p className="letter-label">一封来自 2603 班的信</p><h2>{site.letter.greeting}</h2><p>{site.endings[site.state].letterOpening}</p>{site.letter.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="letter-signature">{site.letter.signature}</p><span className="letter-seal" aria-hidden="true">2603</span></article></Dialog>
  </section>;
}

export default function App() {
  const [gentle] = useState(deviceNeedsGentleMotion);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    // 小范围的观察区让章节切换对应读者正在看的内容，连续滚动不写入 React state。
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const index = site.chapters.findIndex(chapter => chapter.id === entry.target.id);
        if (index >= 0) setActive(index);
      }
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll<HTMLElement>('main > section.chapter').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function replaySite() { window.scrollTo({ top: 0, behavior: 'instant' }); setReplay(value => value + 1); }
  return <GentleContext.Provider value={gentle}><a className="skip-link" href="#reserved">跳到正文</a><Header active={active} onMenu={() => setMenu(true)} /><main><Opening replay={replay} /><ReservedCard /><TimeChapter /><TogetherChapter /><MemoryArchive /><Messages /><NextChapter /><Harbor onReplay={replaySite} /></main>
    <Dialog open={menu} onClose={() => setMenu(false)} title={site.copy.ui.directory} className="directory-dialog"><p className="dialog-eyebrow">THE NEXT CHAPTER</p><h2>{site.copy.ui.directory}</h2><nav aria-label={site.copy.ui.directory}>{site.chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={() => setMenu(false)} aria-current={active === index ? 'location' : undefined}><span className="directory-number">{String(index).padStart(2, '0')}</span><span>{chapter.title}<small>{chapter.english}</small></span></a>)}</nav><p className="directory-signature">献给戴能斌老师 / 来自 2603 班</p></Dialog>
  </GentleContext.Provider>;
}
