'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Ease ────────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-paper/85 backdrop-blur-md' : 'bg-transparent'}`}>
      <Link href="/" className="font-serif text-xl text-ink tracking-wide">shoots.life</Link>
      <Link href="/login" className="font-sans text-[11px] text-ink/50 hover:text-ink transition-colors tracking-widest uppercase">Sign in</Link>
    </nav>
  )
}

// ─── Hero — split layout ──────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-dvh grid md:grid-cols-2 overflow-hidden bg-paper">
      {/* Left — text */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="flex flex-col justify-center px-8 md:px-16 pt-28 pb-16 md:pt-0 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          <p className="font-sans text-ink/30 text-[11px] tracking-widest uppercase mb-8">Private visual diary</p>
        </motion.div>

        <div className="overflow-hidden">
          {['One photo.', 'One day.'].map((line, i) => (
            <motion.h1
              key={line}
              className="block font-serif font-light text-ink leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(3.8rem, 9vw, 8rem)' }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.25 + i * 0.15, ease }}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <motion.p
          className="font-sans text-ink/45 text-sm leading-relaxed mt-10 mb-10 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease }}
        >
          No feed. No likes. No audience.<br />
          Just a growing record of your life, one frame at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="flex items-center gap-5"
        >
          <Link href="/login" className="inline-block bg-amber text-paper font-sans text-[11px] tracking-widest uppercase px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity">
            Begin
          </Link>
          <Link href="#how" className="font-sans text-[11px] text-ink/40 hover:text-ink tracking-widest uppercase transition-colors">
            Learn more ↓
          </Link>
        </motion.div>
      </motion.div>

      {/* Right — hero photo */}
      <div className="relative h-64 md:h-auto overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          <Image
            src="/photos/temple.jpg"
            alt="A moment worth capturing"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient bleed into text side on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-transparent to-transparent md:block hidden" />
          {/* Gradient on mobile (bottom) */}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-transparent md:hidden" />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Photo strip — diary glimpse ──────────────────────────────────────────────
const STRIP_PHOTOS = [
  { src: '/photos/station.jpg', date: 'Jan 12', label: 'Tokyo, dawn.' },
  { src: '/photos/bedroom.jpg', date: 'Jan 19', label: 'Sunday morning.' },
  { src: '/photos/pebbles.jpg', date: 'Jan 23', label: 'Light through leaves.' },
  { src: '/photos/forest.jpg', date: 'Feb 2', label: 'Mist, early walk.' },
  { src: '/photos/temple.jpg', date: 'Feb 8', label: 'The gate.' },
]

function PhotoStrip() {
  return (
    <section className="bg-paper py-24 overflow-hidden">
      <Reveal className="px-8 md:px-16 mb-10">
        <p className="font-sans text-ink/25 text-[11px] tracking-widest uppercase">Your year, one frame at a time</p>
      </Reveal>

      {/* Scrolling strip */}
      <div className="flex gap-3 px-8 md:px-16 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {STRIP_PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.date}
            className="flex-none w-44 md:w-56 snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease }}
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-ink/5">
              <Image src={photo.src} alt={photo.label} fill className="object-cover" />
            </div>
            <div className="flex items-baseline justify-between px-0.5">
              <span className="font-sans text-[10px] text-ink/35 tracking-wide">{photo.label}</span>
              <span className="font-sans text-[10px] text-amber tabular-nums">{photo.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Philosophy — forest bg ───────────────────────────────────────────────────
function Philosophy() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Forest background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image src="/photos/forest.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-ink/75" />
      </motion.div>

      <div className="relative z-10 px-8 md:px-20 lg:px-32 py-32 max-w-6xl">
        <Reveal>
          <blockquote
            className="font-serif font-light italic text-paper/90 leading-tight mb-16"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3.8rem)' }}
          >
            "A year from now you scroll back and see 365 moments you would have otherwise forgotten."
          </blockquote>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 md:gap-24">
          <Reveal delay={0.1}>
            <p className="font-serif text-paper/70 text-xl leading-relaxed font-light">
              In a world optimised for dopamine — infinite feeds, engagement metrics, follower counts — shoots.life does the opposite.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-sans text-paper/45 text-sm leading-loose">
              It removes every social layer and leaves only the act of noticing: one moment, worth capturing, just for yourself.
              <br /><br />
              The value is longitudinal. That is genuinely meaningful in a way no public feed ever is.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Sign up.', body: 'Create your account in seconds. No profile to fill. No followers to find.' },
    { n: '02', title: 'Upload today\'s shot.', body: 'One photo. The best moment from your day. Date-stamped, private, yours.' },
    { n: '03', title: 'Watch your year unfold.', body: 'Come back tomorrow. The archive compounds the longer you use it.' },
  ]

  return (
    <section id="how" className="bg-paper py-36 px-8 md:px-16 lg:px-32">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="font-sans text-ink/25 text-[11px] tracking-widest uppercase mb-20">How it works</p>
        </Reveal>
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-16 py-10 border-t border-ink/[0.06] items-start">
              <span className="font-serif font-light text-ink/10 leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
                {s.n}
              </span>
              <h3 className="font-serif text-ink leading-tight" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
                {s.title}
              </h3>
              <p className="font-sans text-ink/45 text-sm leading-loose col-span-2 md:col-span-1 md:mt-1">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Features — bedroom photo anchor ─────────────────────────────────────────
function Features() {
  const features = [
    {
      title: 'One constraint.',
      body: 'One photo per day. The limit is the point — it makes every upload feel intentional. Not a dump. A decision.',
      right: false,
    },
    {
      title: 'No audience.',
      body: 'No performance anxiety. No curation for others. No engagement loop. Just you, your camera, your day.',
      right: true,
    },
    {
      title: 'The archive compounds.',
      body: 'Day 1 feels small. Day 365 feels like a life. The longer you use it, the more irreplaceable it becomes.',
      right: false,
    },
  ]

  return (
    <section className="bg-ink py-36">
      {/* Bedroom photo — full bleed accent at top */}
      <div className="relative h-[50vh] mb-24 overflow-hidden">
        <Image src="/photos/bedroom.jpg" alt="" fill className="object-cover object-top opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink" />
      </div>

      <div className="px-8 md:px-20 lg:px-32 max-w-5xl mx-auto space-y-28">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={0.05}>
            <div className={`flex flex-col ${f.right ? 'md:items-end md:text-right' : ''} max-w-xl ${f.right ? 'md:ml-auto' : ''}`}>
              <h3 className="font-serif font-light text-paper leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
                {f.title}
              </h3>
              <p className="font-sans text-paper/40 text-sm leading-loose max-w-sm">
                {f.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Final CTA — station bg ───────────────────────────────────────────────────
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section ref={ref} className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden">
      {/* Station bg */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image src="/photos/station.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <Reveal>
          <p className="font-sans text-paper/30 text-[11px] tracking-widest uppercase mb-8">Your year starts now</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            className="font-serif font-light text-paper leading-tight mb-14"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            Start today.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Link href="/login" className="inline-block bg-amber text-paper font-sans text-[11px] tracking-widest uppercase px-10 py-4 rounded-full hover:opacity-90 transition-opacity">
            Create account
          </Link>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="font-sans text-paper/20 text-[10px] mt-16 tracking-wide">
            shoots.life — one photo. one day. just for you.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <PhotoStrip />
      <Philosophy />
      <HowItWorks />
      <Features />
      <FinalCTA />
    </>
  )
}
