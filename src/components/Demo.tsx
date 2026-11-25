import { useEffect, useRef, useState } from 'react'
import { Play, Pause, FilmStrip, Check } from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'
import { Reveal, SectionHead } from './ui.tsx'

export function HeroDemo() {
  const { t, ta } = useLang()
  const lengths = ta<string>('demo.lengths')
  const [text, setText] = useState('')
  const [length, setLength] = useState(lengths[0] || '')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current) }, [])
  const generate = () => {
    if (text.trim().length < 3) { setError(t('demo.textError')); return }
    setError(''); setReady(false); setPlaying(false); setProgress(0)
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        if (p === null) return 0
        const next = p + 4
        if (next >= 100) { if (timer.current) window.clearInterval(timer.current); setReady(true); return 100 }
        return next
      })
    }, 90)
  }
  return (
    <div className="rounded-2xl border p-4 sm:p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
      <label htmlFor="video-text" className="caption-4 mb-2 block">{t('demo.textLabel')}</label>
      <div className="flex flex-col gap-4">
        <textarea id="video-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('demo.textPlaceholder')} className="w-full rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }} aria-invalid={!!error} />
        <div className="flex flex-wrap items-center gap-4">
          <select value={length} onChange={(e) => setLength(e.target.value)} aria-label={t('demo.lengthLabel')} className="rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }}>
            {lengths.map((l) => <option key={l} value={l} className="text-black">{l}</option>)}
          </select>
          <button type="button" onClick={generate} disabled={progress !== null && progress < 100} className="btn-primary button-md">
            <FilmStrip size={18} />{progress !== null && progress < 100 ? `${t('demo.generating')} ${progress}%` : t('demo.generate')}
          </button>
        </div>
      </div>
      {error ? <p className="caption-2 mt-2 text-red-400" role="alert">{error}</p> : null}
      <div className="relative mt-8 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-muted)', background: '#000000' }} aria-label={t('demo.playerLabel')}>
        <div className="flex h-48 items-center justify-center sm:h-56">
          {progress === null ? (
            <p className="body-6 px-8 text-center text-white/60">{t('demo.empty')}</p>
          ) : !ready ? (
            <div className="w-full px-8">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'var(--color-accent)', transition: 'width 200ms cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
              <p className="caption-2 mt-4 text-center text-white/70">{t('demo.generating')} {progress}%</p>
            </div>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className={`anim-drift absolute h-24 w-24 rounded-full ${playing ? '' : ''}`} style={{ background: 'var(--color-accent)', opacity: 0.9 }} />
              <div className="absolute bottom-4 start-4 rounded-lg bg-black/70 px-4 py-2">
                <p className="caption-2 text-white">{text.slice(0, 60)}{text.length > 60 ? '…' : ''}</p>
              </div>
              <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? t('demo.pause') : t('demo.play')} className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95">
                {playing ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>
      {ready ? <p className="body-6 mt-4 flex items-center gap-2" role="status"><Check size={16} style={{ color: 'var(--color-accent)' }} />{t('demo.ready')} · {length}</p> : null}
    </div>
  )
}

export function Examples() {
  const { t, ta } = useLang()
  const cases = ta<{ title: string; text: string; points: string[] }>('examples.cases')
  const [active, setActive] = useState(0)
  const current = cases[active]
  if (!current) return null
  return (
    <section id="examples" aria-labelledby="examples-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead eyebrow={t('examples.eyebrow')} title={t('examples.title')} sub={t('examples.sub')} />
      <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label={t('examples.tabLabel')}>
        {cases.map((c, i) => (
          <button key={i} type="button" role="tab" aria-selected={active === i} onClick={() => setActive(i)} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)', background: active === i ? 'var(--color-accent)' : 'transparent', color: active === i ? '#fff' : 'inherit' }}>
            {c.title}
          </button>
        ))}
      </div>
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <article className="rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
          <h3 className="heading-5">{current.title}</h3>
          <p className="body-3 mt-4 opacity-80">{current.text}</p>
          <ul className="mt-8 flex flex-col gap-4">
            {current.points.map((p, i) => (
              <li key={i} className="body-6 flex items-start gap-2"><Check size={16} className="mt-1 shrink-0" style={{ color: 'var(--color-accent)' }} />{p}</li>
            ))}
          </ul>
        </article>
      </Reveal>
    </section>
  )
}
