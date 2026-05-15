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
  initCustomCursor()
  initAmbientMouseTracking()
  
  // Start Preloader first, then initialize the rest
  runPreloader(() => {
    initAudio()
    initMagneticButton()
    initAnimations()
    initTimeline()
    initLightbox()
    initLetterModal()
    initFinalePetals()
    initSwiper()
  })
})

// --- Sticky Navigation Smooth Scroll ---
document.querySelectorAll('.sticky-nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const targetId = this.getAttribute('href')
    const targetSection = document.querySelector(targetId)
    if (targetSection) {
      window.lenis.scrollTo(targetSection, { offset: -50 })
    }
  })
})

// --- Custom Cursor ---
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot')
  const outline = document.querySelector('.cursor-outline')
  if (!dot || !outline) return

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX
    const posY = e.clientY
    
    // Fast update for dot
    dot.style.left = `${posX}px`
    dot.style.top = `${posY}px`
    
    // Smooth trailing update for outline
    outline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" })
  })

  // Add hover states for all interactive cards
  const interactiveElements = document.querySelectorAll('.gallery-item, .video-card, .glass-button')
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.classList.add('hover-active')
      dot.style.opacity = '0'
    })
    el.addEventListener('mouseleave', () => {
      outline.classList.remove('hover-active')
      dot.style.opacity = '1'
    })
  })
}

// --- Preloader ---
function runPreloader(onComplete) {
  const preloader = document.getElementById('preloader')
  const counter = document.querySelector('.preloader-counter')
  
  if (!preloader || !counter) {
    onComplete()
    return
  }

  let progress = { value: 0 }
  
  gsap.to(progress, {
    value: 100,
    duration: 2.5, // 2.5 seconds loading sequence
    ease: "power2.inOut",
    onUpdate: () => {
      counter.innerText = Math.round(progress.value) + "%"
    },
    onComplete: () => {
      // Fade out preloader
      gsap.to(preloader, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          preloader.style.display = 'none'
          onComplete() // Trigger the rest of the site animations
        }
      })
    }
  })
}

// --- Ambient Mouse Tracking ---
function initAmbientMouseTracking() {
  const orbs = document.querySelectorAll('.gradient-orb')
  
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 100 // -50 to 50
    const y = (e.clientY / window.innerHeight - 0.5) * 100
    
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.2 // different speeds for depth
      gsap.to(orb, {
        x: x * speed,
        y: y * speed,
        duration: 2,
        ease: "power2.out"
      })
    })
  })
}

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

// --- Floating Stardust Particles ---
function createParticles() {
  const container = document.getElementById('particles-container')
  if (!container) return
  
  const particleCount = 40 // Increased for richness
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    
    // Randomize size heavily for depth (tiny to small)
    const size = Math.random() * 4 + 1 
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}vw`
    particle.style.top = `${Math.random() * 100}vh`
    
    // Richer opacity
    particle.style.opacity = Math.random() * 0.8 + 0.2
    
    container.appendChild(particle)
    
    // Slower, more majestic drift
    gsap.to(particle, {
      y: `-=${Math.random() * 300 + 100}`,
      x: `+=${Math.random() * 100 - 50}`,
      rotation: Math.random() * 360,
      duration: Math.random() * 15 + 15, // Much slower for cinematic feel
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
  const heroVideo = document.getElementById('hero-bg-video')
  
  const images = ["19e8720c-3030-43de-a674-4de7cabd1836_Original.jpg", "3D41FF04-CED5-4131-92F1-30652810984F_Original.jpg", "44B006F9-FFEC-4760-B493-D46E670C199C_Original.jpg", "IMG_0796_Original.jpg", "IMG_0911_Original.jpg", "IMG_1220_Original.jpg", "IMG_1473_Original.jpg", "IMG_1515_Original.jpg", "IMG_3394_Original.jpg", "IMG_3396_Original.jpg", "IMG_3830_Original.jpg", "IMG_5926_Original.jpg", "IMG_6725_Original.jpg", "IMG_6831_Original.jpg", "IMG_6832_Original.jpg", "IMG_7428_Original.jpg", "IMG_7432_Original.jpg", "IMG_7917_Original.jpg", "IMG_7928_Original.jpg"]
  
  const videos = ["1AFB0BFC-C8D4-49E4-81C6-564D81AD3D03.mov", "53B61082-114C-43F6-8B14-F69A6DB3F736.mov", "6ABF0AA1-7403-4CC8-806C-8F6DA98E0543.mov", "6D610E71-9531-487A-A825-3800DECBC869.mov", "7552DD72-BB41-49A4-9B0F-94F449B03127.mov", "9B425C3C-E072-4EDC-8A11-6323501035DD.mov", "9B995DE6-026F-4F9A-9136-B954D70A9699.mov", "A9E940C9-1427-408D-A7F0-1CC4AF031A75.mov", "D6EF10CD-2C0D-4A14-B805-06CBF567B4B0.mov", "EEA7EEB7-5A87-4EBB-AC41-35DC51FB24AF.mov", "Snapchat-889795888.mov"]

  if (heroVideo && videos.length > 0) {
    heroVideo.src = `/media/${videos[0]}`
  }

  if (galleryContainer) {
    images.forEach((imgFile) => {
      const item = document.createElement('div')
      item.className = 'swiper-slide gallery-item'
      item.innerHTML = `<img src="/media/${imgFile}" alt="Beautiful moment" loading="lazy" />`
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
    // Optimization: Only play videos when they enter the viewport
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video')
        if (!video) return
        
        if (entry.isIntersecting) {
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch(e => console.warn('Video auto-play blocked:', e))
          }
        } else {
          video.pause()
        }
      })
    }, { rootMargin: '200px' })

    videos.forEach((vidFile, index) => {
      const card = document.createElement('div')
      // Alternate parallax speeds
      const speed = index % 2 === 0 ? 0.95 : 1.05
      card.className = 'video-card glass-panel parallax-card'
      card.setAttribute('data-speed', speed)
      
      const video = document.createElement('video')
      video.src = `/media/${vidFile}`
      video.preload = 'none' // MASSIVE OPTIMIZATION: Prevents browser from downloading 11 massive videos at once
      video.loop = true
      video.muted = true // Must be muted for mobile autoplay
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.objectFit = 'cover'
      video.style.borderRadius = 'inherit'
      video.style.display = 'block'
      
      card.appendChild(video)
      videoContainer.appendChild(card)
      videoObserver.observe(card)
    })
  }
}

// --- Audio Controls ---
function initAudio() {
  const audioToggle = document.getElementById('audio-toggle')
  const bgMusic = document.getElementById('bg-music')
  const vinyl = document.querySelector('.vinyl-record')

  let isPlaying = false

  if (audioToggle && bgMusic && vinyl) {
    const startAudio = () => {
      if (isPlaying) return
      const playPromise = bgMusic.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true
          vinyl.classList.add('playing')
          document.removeEventListener('click', startAudio)
          document.removeEventListener('touchstart', startAudio)
        }).catch(e => console.warn("Audio play blocked by browser:", e))
      }
    }

    startAudio()
    document.addEventListener('click', startAudio)
    document.addEventListener('touchstart', startAudio)
    
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation() 
      if (isPlaying) {
        bgMusic.pause()
        vinyl.classList.remove('playing')
      } else {
        bgMusic.play().catch(e => console.warn("Audio play blocked:", e))
        vinyl.classList.add('playing')
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
  
  // Advanced Clipping Mask Initial State: Text is hidden "below" the line
  gsap.set(standardText.chars, { opacity: 0, y: "110%", rotateX: -90 })
  gsap.set(scriptText.chars, { opacity: 0, scale: 0, rotation: -15 })

  // 2. Hero Reveal (Triggered immediately after preloader)
  const tlHero = gsap.timeline({ delay: 0.1 })
  
  tlHero.to('.hero .split-text .char', {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    duration: 0.8,
    stagger: 0.02,
    ease: "power4.out",
    force3D: true
  })
  .to('.hero .split-text-script .char', {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 1,
    stagger: 0.04,
    ease: "back.out(1.5)",
    force3D: true
  }, "-=0.4")
  .fromTo('.scroll-line', { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")

  // 3. Scroll Reveals for split text in other sections
  document.querySelectorAll('.slide-section:not(.hero) .split-text').forEach((el) => {
    const chars = el.querySelectorAll('.char')
    gsap.to(chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      opacity: 1,
      y: "0%",
      rotateX: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "power4.out",
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
      duration: 1,
      stagger: 0.04,
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

// --- Final Wow Features ---

function initTimeline() {
  // Set this to the date they met or started dating (Year, Month (0-indexed), Day)
  // For example: Feb 14, 2023 -> new Date(2023, 1, 14)
  const startDate = new Date(2023, 0, 1) // Default placeholder
  
  const daysEl = document.getElementById('t-days')
  const hoursEl = document.getElementById('t-hours')
  const minsEl = document.getElementById('t-mins')
  const secsEl = document.getElementById('t-secs')

  if (!daysEl) return

  setInterval(() => {
    const now = new Date()
    const diff = now - startDate
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const mins = Math.floor((diff / 1000 / 60) % 60)
    const secs = Math.floor((diff / 1000) % 60)
    
    daysEl.innerText = days
    hoursEl.innerText = hours.toString().padStart(2, '0')
    minsEl.innerText = mins.toString().padStart(2, '0')
    secsEl.innerText = secs.toString().padStart(2, '0')
  }, 1000)
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox')
  const lightboxImg = document.getElementById('lightbox-img')
  const closeBtn = document.getElementById('lightbox-close')
  
  if (!lightbox) return

  // Need to wait slightly for dynamic images to generate
  setTimeout(() => {
    const images = document.querySelectorAll('.gallery-item img')
    images.forEach(img => {
      img.style.cursor = 'pointer' // Override the 'none' cursor for the images so they know they can click
      img.addEventListener('click', () => {
        lightboxImg.src = img.src
        lightbox.classList.add('active')
      })
    })
  }, 1000)

  const closeLightbox = () => lightbox.classList.remove('active')
  
  closeBtn.addEventListener('click', closeLightbox)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-bg')) {
      closeLightbox()
    }
  })
}

function initLetterModal() {
  const modal = document.getElementById('letter-modal')
  const openBtn = document.getElementById('open-letter-btn')
  const closeBtn = document.getElementById('letter-close')
  
  if (!modal || !openBtn) return

  openBtn.addEventListener('click', () => {
    modal.classList.add('active')
  })
  
  const closeModal = () => modal.classList.remove('active')
  
  closeBtn.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('letter-modal-bg')) {
      closeModal()
    }
  })
}

import JSConfetti from 'https://cdn.jsdelivr.net/npm/js-confetti@0.12.0/+esm'
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

function initSwiper() {
  new Swiper('.gallery-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true,
    keyboard: {
      enabled: true
    }
  })
}

function initFinalePetals() {
  const finaleSection = document.querySelector('.finale')
  if (!finaleSection) return
  
  const jsConfetti = new JSConfetti()
  let hasTriggered = false

  ScrollTrigger.create({
    trigger: finaleSection,
    start: "top 60%",
    onEnter: () => {
      if (!hasTriggered) {
        hasTriggered = true
        jsConfetti.addConfetti({
          emojis: ['🌹', '❤️', '✨'],
          emojiSize: 30,
          confettiNumber: 60,
        })
      }
    }
  })
}
