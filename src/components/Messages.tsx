import { useState, type FormEvent } from 'react';
import { Download, PencilLine } from 'lucide-react';
import { site } from '../data/site';
import { messages } from '../data/messages';
import { Reveal } from './Reveal';
import { Dialog } from './Dialog';

interface Draft { content: string; author: string }
const STORAGE_KEY = '2603-private-message-v1';
function readDraft(): Draft {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (data && typeof data.content === 'string' && typeof data.author === 'string') return { content: data.content.slice(0, 2000), author: data.author.slice(0, 40) };
  } catch { /* 浏览器禁用存储时仍可书写和导出 */ }
  return { content: '', author: '' };
}

export function Messages() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [savedDraft, setSavedDraft] = useState<Draft>(readDraft);
  const [status, setStatus] = useState('');
  const copy = site.copy.messages;
  const published = messages.filter(message => message.approved).sort((a, b) => a.order - b.order);
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft.content.trim()) return;
    const clean = { content: draft.content.trim(), author: draft.author.trim() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clean)); setSavedDraft(clean); setStatus(site.copy.ui.saved); }
    catch { setStatus(site.copy.ui.storageUnavailable); }
  }
  function exportDraft() {
    if (!draft.content.trim()) return;
    const data = { id: `collected-${Date.now()}`, content: draft.content.trim(), author: draft.author.trim() || site.copy.ui.anonymous, order: 0, approved: false };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = '2603-message.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section id="messages" className="chapter messages-section"><div className="section-inner">
    <Reveal as="h2" className="display-heading" text={copy.title} />
    <Reveal text={copy.intro} className="section-description" />
    <div className="message-wall">
      {published.length ? published.map((message, i) => <article key={message.id} className={`message-note note-tone-${i % 3}`}><p>{message.content}</p><footer><span>{message.author || site.copy.ui.anonymous}</span>{message.date && <time>{message.date}</time>}</footer></article>) : <div className="message-empty"><span className="note-corner" aria-hidden="true" /><h3>{copy.empty}</h3><p>{copy.emptyNote}</p><span className="note-signature">2603 班</span></div>}
      {savedDraft.content && <article className="message-note local-message"><span className="local-label">{copy.localLabel}</span><p>{savedDraft.content}</p><footer>{savedDraft.author || site.copy.ui.anonymous}</footer></article>}
    </div>
    <div className="message-actions"><button className="text-button" onClick={() => { setStatus(''); setOpen(true); }}><PencilLine size={18} aria-hidden="true" />{copy.action}</button><p>{copy.publishingNote}</p></div>
  </div>
  <Dialog open={open} onClose={() => setOpen(false)} title={copy.dialogTitle} className="write-dialog">
    <p className="dialog-eyebrow">2603 CLASS</p><h2>{copy.dialogTitle}</h2><p className="local-explanation" id="draft-explanation">{copy.localNote}</p>
    <form onSubmit={save} aria-describedby="draft-explanation">
      <label htmlFor="message-content">{copy.contentLabel}</label><textarea id="message-content" value={draft.content} maxLength={2000} required rows={6} onChange={e => { setDraft({ ...draft, content: e.target.value }); setStatus(''); }} />
      <label htmlFor="message-author">{copy.authorLabel}</label><input id="message-author" value={draft.author} maxLength={40} autoComplete="off" onChange={e => setDraft({ ...draft, author: e.target.value })} />
      <button type="submit" className="solid-button" disabled={!draft.content.trim()}>{copy.saveAction}</button>
      <p role="status" className="save-status">{status}</p>
      <button className="text-button" type="button" disabled={!draft.content.trim()} onClick={exportDraft}><Download size={17} aria-hidden="true" />{copy.exportAction}</button><p className="export-note">{copy.exportNote}</p>
    </form>
  </Dialog></section>;
}
