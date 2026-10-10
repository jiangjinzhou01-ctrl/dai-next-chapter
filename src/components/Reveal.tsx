import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionTokens as tokens } from '../motion/tokens';

export const GentleContext = createContext(false);
export function useGentleMotion() {
  const reduced = useReducedMotion();
  const gentleDevice = useContext(GentleContext);
  return Boolean(reduced) || gentleDevice;
}

export function Reveal({ text, as = 'p', className = '', delay = 0 }: {
  text: string | string[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  delay?: number;
}) {
  const gentle = useGentleMotion();
  const Tag = as;
  const lines = Array.isArray(text) ? text : [text];
  return <Tag className={className}>
    {lines.map((line, i) => <motion.span
      key={`${i}-${line}`}
      className={lines.length > 1 ? 'reveal-line' : 'reveal-text'}
      initial={gentle ? false : { opacity: 0.08, filter: `blur(${tokens.blur}px)`, y: tokens.distance }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: gentle ? 0 : tokens.duration.reveal, ease: tokens.ease, delay: gentle ? 0 : delay + i * tokens.stagger }}
    >{line}</motion.span>)}
  </Tag>;
}
