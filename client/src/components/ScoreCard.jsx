import { classifyScore } from '../utils/score.js';

export function ScoreCard({ label, score }) {
  const status = classifyScore(score);
  const style = Number.isFinite(score) ? { '--score': `${score * 3.6}deg` } : {};
  return <article className={`score-card ${status.tone}`}><div className="score-ring" style={style}><strong>{Number.isFinite(score) ? score : '—'}</strong></div><div><p>{label}</p><span>{status.label}</span></div></article>;
}

