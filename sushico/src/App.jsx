import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  UtensilsCrossed,
  Flame,
  Leaf,
  Fish,
} from 'lucide-react'

/* ───────────────────────── DATA ───────────────────────── */

const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Subeler', href: '#subeler' },
  { label: 'Hakkimizda', href: '#hakkimizda' },
  { label: 'Iletisim', href: '#iletisim' },
]

const SLIDES = [
  {
    id: 1,
    title: 'Uzak Dogunun Essiz Lezzetleri',
    subtitle: 'Japonya\'dan Tayland\'a, 27 yillik ustalikla sofralarinizda',
    cta: 'Menuyu Kesfet',
    gradient: 'from-sushico-black via-sushico-dark to-sushico-anthracite',
    accent: 'bg-gradient-to-r from-sushico-red/20 to-transparent',
  },
  {
    id: 2,
    title: 'Yeni Sezon Omakase',
    subtitle: 'Sef\'in ozenle sectigi 12 parcalik ozel degustation menusu',
    cta: 'Rezervasyon Yap',
    gradient: 'from-sushico-anthracite via-sushico-dark to-sushico-black',
    accent: 'bg-gradient-to-l from-sushico-gold/15 to-transparent',
  },
  {
    id: 3,
    title: '%30 Indirim Firsati',
    subtitle: 'Ilk online siparisine ozel, minimum 500 TL ve uzeri',
    cta: 'Siparis Ver',
    gradient: 'from-sushico-dark via-sushico-black to-sushico-dark',
    accent: 'bg-gradient-to-r from-sushico-red/25 to-sushico-gold/10',
  },
]

const CUISINES = [
  {
    icon: Fish,
    title: 'Japon Mutfagi',
    desc: 'Sushi, sashimi ve ramen geleneksel tariflerle',
  },
  {
    icon: UtensilsCrossed,
    title: 'Cin Mutfagi',
    desc: 'Wok, dim sum ve noodle cesitleri',
  },
  {
    icon: Leaf,
    title: 'Tayland Mutfagi',
    desc: 'Pad thai, curry ve aromatik tatlar',
  },
  {
    icon: Flame,
    title: 'Kore Mutfagi',
    desc: 'BBQ, bibimbap ve kimchi lezzetleri',
  },
]

const BENTO_ITEMS = [
  {
    title: 'Sushi & Sashimi',
    desc: 'Taze baliklar, usta eller',
    gradient: 'from-rose-900/80 via-sushico-dark to-sushico-black',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Wok & Noodle',
    desc: 'Atesle bulus',
    gradient: 'from-amber-900/80 via-sushico-dark to-sushico-black',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Thai Mutfagi',
    desc: 'Tropikal esinti',
    gradient: 'from-emerald-900/80 via-sushico-dark to-sushico-black',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Kore BBQ',
    desc: 'Dumanlasan lezzetler',
    gradient: 'from-orange-900/80 via-sushico-dark to-sushico-black',
    span: 'md:col-span-2 md:row-span-1',
  },
]

/* ─────────────────── ANIMATION VARIANTS ───────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ──────────────────────── HEADER ──────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-sushico-red text-2xl font-bold tracking-tight font-serif">
            Sushico
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] text-sushico-gold/60 mt-1">
            since 1998
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-sushico-red after:transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="#siparis"
            className="hidden md:inline-flex items-center px-5 py-2 bg-sushico-red hover:bg-sushico-red-dark text-sm font-medium rounded transition-colors"
          >
            Siparis Ver
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/80 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-sushico-dark/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-white/80 hover:text-white transition-colors py-2 border-b border-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#siparis"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center px-5 py-3 bg-sushico-red hover:bg-sushico-red-dark text-sm font-medium rounded transition-colors"
              >
                Siparis Ver
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ──────────────────── HERO SLIDER ─────────────────────── */

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef(null)
  const touchStartX = useRef(0)

  const goTo = useCallback(
    (idx) => {
      setDirection(idx > current ? 1 : -1)
      setCurrent(idx)
    },
    [current],
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((p) => (p + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  /* Auto-play */
  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [next])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 5000)
  }

  const handlePrev = () => { prev(); resetTimer() }
  const handleNext = () => { next(); resetTimer() }

  /* Touch / swipe */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
  }

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const slide = SLIDES[current]

  return (
    <section
      className="relative h-[80vh] min-h-[500px] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          {/* Decorative accent overlay */}
          <div className={`absolute inset-0 ${slide.accent}`} />

          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-sushico-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
            >
              Sushico
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold max-w-4xl leading-tight"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-4 text-white/60 text-base sm:text-lg max-w-xl"
            >
              {slide.subtitle}
            </motion.p>
            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-sushico-red hover:bg-sushico-red-dark text-sm font-medium rounded transition-colors"
            >
              {slide.cta}
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-colors text-white/70 hover:text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-colors text-white/70 hover:text-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { goTo(i); resetTimer() }}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-sushico-red' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ───────────────────── INFO SECTION ───────────────────── */

function InfoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="hakkimizda" className="py-24 sm:py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto text-center">
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-px bg-sushico-gold mx-auto mb-10 origin-center"
        />

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold"
        >
          27 Yillik Lezzet Mirasi
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={1}
          className="mt-6 text-white/50 max-w-2xl mx-auto leading-relaxed"
        >
          1998'den bu yana Turkiye'nin dort bir yaninda, Uzak Dogu'nun zengin
          mutfak kulturunu ozgun yorumlarimizla sofralariniza tasiyoruz.
        </motion.p>

        {/* Cuisines */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {CUISINES.map((c, i) => (
            <motion.div key={c.title} variants={fadeUp} custom={i} className="group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sushico-dark border border-white/5 flex items-center justify-center group-hover:border-sushico-red/30 group-hover:bg-sushico-red/5 transition-all duration-300">
                <c.icon size={24} className="text-sushico-gold group-hover:text-sushico-red transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-medium">{c.title}</h3>
              <p className="mt-2 text-sm text-white/40">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-16 h-px bg-sushico-gold mx-auto mt-16 origin-center"
        />
      </div>
    </section>
  )
}

/* ─────────────────── BENTO GRID ───────────────────────── */

function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="menu" className="py-24 sm:py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <span className="text-sushico-gold text-xs tracking-[0.3em] uppercase">
            Mutfagimiz
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Dort Mutfak, Bir Deneyim
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]"
        >
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.span}`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 group-hover:scale-110`}
              />

              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-sushico-red/0 group-hover:bg-sushico-red/10 transition-colors duration-500" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                <h3 className="font-serif text-xl sm:text-2xl font-semibold group-hover:text-sushico-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-white/40 group-hover:text-white/60 transition-colors duration-300">
                  {item.desc}
                </p>
                <div className="mt-3 h-px w-0 group-hover:w-12 bg-sushico-red transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────────────────── FOOTER ──────────────────────── */

function Footer() {
  return (
    <footer id="iletisim" className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="text-sushico-red text-2xl font-bold font-serif">
              Sushico
            </span>
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              1998'den bu yana Turkiye'nin en buyuk Uzak Dogu restoran zinciri.
              27 yildir damak zevkinize hitap ediyoruz.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
              Iletisim
            </h4>
            <div className="space-y-3 text-sm text-white/40">
              <a href="#" className="flex items-center gap-2 hover:text-white/70 transition-colors">
                <Phone size={14} />
                0850 XXX XX XX
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-white/70 transition-colors">
                <MapPin size={14} />
                50+ Sube - Turkiye Geneli
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
              Bizi Takip Edin
            </h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-sushico-dark border border-white/5 flex items-center justify-center text-white/40 hover:text-sushico-red hover:border-sushico-red/30 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Sushico. Tum haklar saklidir.</span>
          <span>Tasarim & Gelistirme: ZeynStudio</span>
        </div>
      </div>
    </footer>
  )
}

/* ──────────────────────── APP ─────────────────────────── */

export default function App() {
  return (
    <div className="min-h-screen bg-sushico-black">
      <Header />
      <main>
        <HeroSlider />
        <InfoSection />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  )
}
