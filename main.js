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
  generateMediaElements()
  initAudio()
  initMagneticButton()
  initAnimations()
})

// --- Smooth Scrolling (Lenis) ---
function initLenis() {
  const lenis = new Lenis({
    duration: 0.8, // reduced for snappier, less laggy feel
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
  
  const particleCount = 20 // reduced for performance
  
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
      ease: "sine.inOut",
      force3D: true
    })
  }
}

// --- Dynamic Media Generation & 3D Hover ---
function generateMediaElements() {
  const galleryContainer = document.getElementById('gallery-items-container')
  const videoContainer = document.getElementById('video-grid-container')
  
  const images = ["19e8720c-3030-43de-a674-4de7cabd1836_Original.jpg", "3D41FF04-CED5-4131-92F1-30652810984F_Original.jpg", "44B006F9-FFEC-4760-B493-D46E670C199C_Original.jpg", "IMG_0796_Original.jpg", "IMG_0911_Original.jpg", "IMG_1220_Original.jpg", "IMG_1473_Original.jpg", "IMG_1515_Original.jpg", "IMG_3394_Original.jpg", "IMG_3396_Original.jpg", "IMG_3830_Original.jpg", "IMG_5926_Original.jpg", "IMG_6725_Original.jpg", "IMG_6831_Original.jpg", "IMG_6832_Original.jpg", "IMG_7428_Original.jpg", "IMG_7432_Original.jpg", "IMG_7917_Original.jpg", "IMG_7928_Original.jpg"]
  
  const videos = ["1AFB0BFC-C8D4-49E4-81C6-564D81AD3D03.mov", "53B61082-114C-43F6-8B14-F69A6DB3F736.mov", "6ABF0AA1-7403-4CC8-806C-8F6DA98E0543.mov", "6D610E71-9531-487A-A825-3800DECBC869.mov", "7552DD72-BB41-49A4-9B0F-94F449B03127.mov", "9B425C3C-E072-4EDC-8A11-6323501035DD.mov", "9B995DE6-026F-4F9A-9136-B954D70A9699.mov", "A9E940C9-1427-408D-A7F0-1CC4AF031A75.mov", "D6EF10CD-2C0D-4A14-B805-06CBF567B4B0.mov", "EEA7EEB7-5A87-4EBB-AC41-35DC51FB24AF.mov", "Snapchat-889795888.mov"]

  if (galleryContainer) {
    images.forEach((imgFile) => {
      const item = document.createElement('div')
      item.className = 'gallery-item'
      item.innerHTML = `<img src="/media/${imgFile}" alt="Beautiful moment" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" />`
      galleryContainer.appendChild(item)
      
      // Add 3D Tilt Effect
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = ((y - centerY) / centerY) * -15 // max 15 deg tilt
        const rotateY = ((x - centerX) / centerX) * 10
        
        gsap.to(item, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.4,
          force3D: true
        })
      })
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          rotationX: 0,
          rotationY: 0,
          ease: "power2.out",
          duration: 0.4,
          force3D: true
        })
      })
    })
  }
  
  if (videoContainer) {
    videos.forEach((vidFile, index) => {
      const card = document.createElement('div')
      // Alternate parallax speeds
      const speed = index % 2 === 0 ? 0.95 : 1.05
      card.className = 'video-card glass-panel parallax-card'
      card.setAttribute('data-speed', speed)
      
      const video = document.createElement('video')
      video.src = `/media/${vidFile}`
      video.autoplay = true
      video.loop = true
      video.muted = true // Must be muted for mobile autoplay
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.objectFit = 'cover'
      video.style.borderRadius = 'inherit'
      video.style.display = 'block'
      
      // Force play request
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => console.warn('Video auto-play blocked:', e))
      }
      
      card.appendChild(video)
      videoContainer.appendChild(card)
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
    const startAudio = () => {
      if (isPlaying) return
      const playPromise = bgMusic.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true
          iconPause.style.display = 'block'
          iconPlay.style.display = 'none'
          // Remove event listeners once playing successfully
          document.removeEventListener('click', startAudio)
          document.removeEventListener('touchstart', startAudio)
        }).catch(e => console.warn("Audio play blocked by browser:", e))
      }
    }

    // Try to auto-play immediately (browsers usually block this)
    startAudio()

    // Add interaction listeners: play music on first click or touch anywhere!
    document.addEventListener('click', startAudio)
    document.addEventListener('touchstart', startAudio)
    
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation() // Prevent triggering the document click
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
  const tlHero = gsap.timeline({ delay: 0.1 })
  
  tlHero.to('.hero .split-text .char', {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.6,
    stagger: 0.015,
    ease: "power3.out",
    force3D: true
  })
  .to('.hero .split-text-script .char', {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 0.8,
    stagger: 0.03,
    ease: "back.out(1.5)",
    force3D: true
  }, "-=0.3")
  .fromTo('.scroll-line', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")

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
      duration: 0.6,
      stagger: 0.015,
      ease: "power3.out",
      force3D: true
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
      duration: 0.8,
      stagger: 0.03,
      ease: "back.out(1.5)",
      force3D: true
    })
  })

  // 4. Parallax Elements
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 1
    gsap.to(el, {
      y: () => (1 - speed) * window.innerHeight * 0.5,
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
