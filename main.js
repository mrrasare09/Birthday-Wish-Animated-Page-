import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger)

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initLenis()
  generateGalleryPlaceholders()
  initAudio()
  initAnimations()
})

// --- Smooth Scrolling (Lenis) ---
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like smooth curve
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  // Connect Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

// --- Dynamic Gallery Generation ---
// Generates 30 items for the horizontal scroll section
function generateGalleryPlaceholders() {
  const container = document.getElementById('gallery-items-container')
  if (!container) return

  // The user requested 30 images/videos
  for (let i = 1; i <= 30; i++) {
    const item = document.createElement('div')
    item.className = 'gallery-item'
    
    // Placeholder content - user can replace this logic later with actual img/video tags
    item.innerHTML = `
      <div class="gallery-item-placeholder-text">Media ${i}</div>
      <!-- Example usage once media is uploaded: -->
      <!-- <img src="/media/${i}.jpg" alt="Memory ${i}" loading="lazy" /> -->
    `
    container.appendChild(item)
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
        bgMusic.play().catch(e => console.warn("Audio play blocked by browser:", e))
        iconPause.style.display = 'block'
        iconPlay.style.display = 'none'
      }
      isPlaying = !isPlaying
    })
    
    // Initial state: audio is paused until user interacts
    bgMusic.pause()
    iconPause.style.display = 'none'
    iconPlay.style.display = 'block'
  }
}

// --- GSAP Animations ---
function initAnimations() {
  // 1. Initial Hero Reveal
  const tlHero = gsap.timeline()
  
  tlHero.to('.hero .reveal-text', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
  })

  // 2. Standard Vertical Scroll Reveals (Fade & Slide Up)
  const revealElements = document.querySelectorAll('.reveal-text, .reveal-element')
  
  revealElements.forEach((el) => {
    // Skip if it's in the hero (already animated) or gallery (animated separately)
    if (el.closest('.hero')) return

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Triggers when top of element hits 85% of viewport height
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    })
  })

  // 3. Horizontal Scroll for Gallery
  const galleryWrapper = document.querySelector('.gallery-wrapper')
  const galleryContainer = document.querySelector('.gallery-container')
  const galleryTrack = document.querySelector('.gallery-track')

  if (galleryWrapper && galleryContainer && galleryTrack) {
    // Calculate how far to scroll horizontally
    // It's the total width of the track minus the viewport width
    
    // We use matchMedia or setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      const trackWidth = galleryTrack.scrollWidth
      const viewportWidth = window.innerWidth
      const scrollDistance = trackWidth - viewportWidth + 100 // add a little padding
      
      gsap.to(galleryTrack, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: galleryWrapper,
          start: "center center",
          end: () => "+=" + scrollDistance, // Pin duration based on scroll distance
          pin: true,
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true, // Recalculate on resize
        }
      })
    }, 100) // Small delay to ensure placeholders are generated and layout is calculated
  }
}
