import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger)

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initLenis()
  createParticles()
  generateGalleryPlaceholders()
  initAudio()
  initMagneticButton()
  initAnimations()
})

// --- Smooth Scrolling (Lenis) ---
function initLenis() {
  const lenis = new Lenis({
    duration: 1.5, // slightly longer for more ethereal feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

// --- Floating Particles ---
function createParticles() {
  const container = document.getElementById('particles-container')
  if (!container) return
  
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    
    // Randomize size, position, and opacity
    const size = Math.random() * 8 + 2
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}vw`
    particle.style.top = `${Math.random() * 100}vh`
    particle.style.opacity = Math.random() * 0.5 + 0.1
    
    container.appendChild(particle)
    
    // Animate them independently
    gsap.to(particle, {
      y: `-=${Math.random() * 200 + 100}`,
      x: `+=${Math.random() * 100 - 50}`,
      rotation: Math.random() * 360,
      duration: Math.random() * 10 + 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }
}

// --- Dynamic Gallery Generation & 3D Hover ---
function generateGalleryPlaceholders() {
  const container = document.getElementById('gallery-items-container')
  if (!container) return

  for (let i = 1; i <= 30; i++) {
    const item = document.createElement('div')
    item.className = 'gallery-item'
    
    item.innerHTML = `
      <div class="gallery-item-placeholder-text">Media ${i}</div>
      <!-- <img src="/media/${i}.jpg" alt="Memory ${i}" loading="lazy" /> -->
    `
    container.appendChild(item)
    
    // Add 3D Tilt Effect
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -15 // max 15 deg tilt
      const rotateY = ((x - centerX) / centerX) * 15
      
      gsap.to(item, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5
      })
    })
    
    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out",
        duration: 0.5
      })
    })
  }
}

// --- Audio Controls ---
function initAudio() {
  const audioToggle = document.getElementById('audio-toggle')
  const bgMusic = document.getElementById('bg-music')
  const iconPlay = document.getElementById('icon-play')
  const iconPause = document.getElementById('icon-pause')

  let isPlaying = false

  if (audioToggle && bgMusic) {
    audioToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause()
        iconPause.style.display = 'none'
        iconPlay.style.display = 'block'
      } else {
        bgMusic.play().catch(e => console.warn("Audio play blocked:", e))
        iconPause.style.display = 'block'
        iconPlay.style.display = 'none'
      }
      isPlaying = !isPlaying
    })
    
    bgMusic.pause()
    iconPause.style.display = 'none'
    iconPlay.style.display = 'block'
  }
}

// --- Magnetic Button Effect ---
function initMagneticButton() {
  const magnetic = document.querySelector('.magnetic')
  if (!magnetic) return
  
  magnetic.addEventListener('mousemove', (e) => {
    const rect = magnetic.getBoundingClientRect()
    const h = rect.width / 2
    
    const x = e.clientX - rect.left - h
    const y = e.clientY - rect.top - h
    
    gsap.to(magnetic, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: "power3.out"
    })
  })
  
  magnetic.addEventListener('mouseleave', () => {
    gsap.to(magnetic, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)"
    })
  })
}

// --- Core GSAP Animations & SplitType ---
function initAnimations() {
  // 1. Text Splitting
  const standardText = new SplitType('.split-text', { types: 'lines, words, chars' })
  const scriptText = new SplitType('.split-text-script', { types: 'chars' })
  
  // Hide chars initially for reveal
  gsap.set(standardText.chars, { opacity: 0, y: 50, rotateX: -90 })
  gsap.set(scriptText.chars, { opacity: 0, scale: 0, rotation: -15 })

  // 2. Hero Reveal
  const tlHero = gsap.timeline({ delay: 0.2 })
  
  tlHero.to('.hero .split-text .char', {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 1,
    stagger: 0.02,
    ease: "back.out(1.2)"
  })
  .to('.hero .split-text-script .char', {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 1.2,
    stagger: 0.05,
    ease: "elastic.out(1, 0.4)"
  }, "-=0.5")
  .fromTo('.scroll-line', { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "power2.out" }, "-=0.5")

  // 3. Scroll Reveals for split text in other sections
  document.querySelectorAll('.slide-section:not(.hero) .split-text').forEach((el) => {
    const chars = el.querySelectorAll('.char')
    gsap.to(chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "back.out(1.2)"
    })
  })
  
  document.querySelectorAll('.slide-section:not(.hero) .split-text-script').forEach((el) => {
    const chars = el.querySelectorAll('.char')
    gsap.to(chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: "elastic.out(1, 0.4)"
    })
  })

  // 4. Parallax Elements
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 1
    gsap.to(el, {
      y: () => (1 - speed) * (ScrollTrigger.maxScroll(window) - ScrollTrigger.maxScroll(window) * 0.5),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  })

  // 5. Horizontal Scroll for Gallery
  const galleryWrapper = document.querySelector('.gallery-wrapper')
  const galleryTrack = document.querySelector('.gallery-track')

  if (galleryWrapper && galleryTrack) {
    setTimeout(() => {
      const trackWidth = galleryTrack.scrollWidth
      const viewportWidth = window.innerWidth
      const scrollDistance = trackWidth - viewportWidth + 100
      
      gsap.to(galleryTrack, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: galleryWrapper,
          start: "center center",
          end: () => "+=" + scrollDistance,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      })
    }, 200)
  }
}
