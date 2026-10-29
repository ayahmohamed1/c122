'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import type { GiftData } from '@/lib/giftData'
import {
  defaultLoveLetterParagraphs,
  defaultAnniversaryMessage,
  defaultOurBestMemories,
  defaultImportantDates,
} from '@/lib/giftData'

interface Props {
  data: GiftData
}

export type ScreenType =
  | 'intro'
  | 'password'
  | 'anniversary'
  | 'bucketList'
  | 'loveLetter'
  | 'memories'
  | 'importantDates'
  | 'video'
  | 'music'
  | 'card'
  | 'photoStory'
  | 'birthdayMessage'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

export default function GiftClient({ data }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [screen, setScreen] = useState<ScreenType>('intro')
  const [introExiting, setIntroExiting] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00')
  const [durationStr, setDurationStr] = useState('0:00')

  // Password state
  const [enteredPin, setEnteredPin] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [unlockSuccess, setUnlockSuccess] = useState(false)

  // Counter state from 15/11/2025
  const targetDateStr = data.anniversaryTargetDate || '2025-11-15T00:00:00'
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const wasMusicPlayingBeforeVideoRef = useRef(false)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Audio setup
  useEffect(() => {
    if (data.musicUrl) {
      const audio = new Audio(data.musicUrl)
      audio.loop = true
      audio.volume = 0.65
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDurationStr(formatTime(audio.duration))
      })

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100)
          setCurrentTimeStr(formatTime(audio.currentTime))
        }
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [data.musicUrl])

  // Live Counter interval (Counting time together since 15/11/2025)
  useEffect(() => {
    const calculateCountdown = () => {
      const parsedTarget = new Date(targetDateStr).getTime()
      const target = isNaN(parsedTarget)
        ? new Date(2025, 10, 15, 0, 0, 0).getTime()
        : parsedTarget
      const now = Date.now()
      const diff = Math.abs(now - target)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds, isComplete: false })
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    return () => clearInterval(timer)
  }, [targetDateStr])

  const navigateTo = useCallback((newScreen: ScreenType) => {
    try {
      if (typeof window !== 'undefined' && window.history?.pushState) {
        window.history.pushState({ screen: newScreen }, '')
      }
    } catch {
      // Safe fallback for restricted webviews
    }
    setScreen(newScreen)
  }, [])

  // Auto-focus input when password screen is reached
  useEffect(() => {
    if (screen === 'password') {
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 350)
    }
  }, [screen])

  // Reset scroll on screen transition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      const activeScreens = document.querySelectorAll('.screen')
      activeScreens.forEach((el) => {
        el.scrollTop = 0
      })
    }
  }, [screen])

  // History Popstate Handling
  useEffect(() => {
    if (!isMounted) return
    try {
      window.history.replaceState({ screen: 'intro' }, '')
    } catch {
      // ignore
    }
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setScreen(event.state.screen)
      } else {
        setScreen('intro')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isMounted])

  // Confetti trigger helper
  const triggerCelebrationConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#0e2044', '#1e3870', '#8b1538', '#dfc08f', '#ffffff'],
      })
      setTimeout(() => {
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#dfc08f', '#0e2044', '#8b1538'],
        })
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#0e2044', '#dfc08f', '#ffffff'],
        })
      }, 300)
    } catch (e) {
      // Safe fallback
    }
  }, [])

  // Confetti trigger when reaching birthday message screen
  useEffect(() => {
    if (screen === 'birthdayMessage') {
      triggerCelebrationConfetti()
    }
  }, [screen, triggerCelebrationConfetti])

  // Envelope Click: transition to PASSWORD screen
  const handleEnvelopeClick = useCallback(() => {
    if (screen !== 'intro') return
    setIntroExiting(true)
    setTimeout(() => {
      navigateTo('password')
      setIntroExiting(false)
    }, 550)
  }, [screen, navigateTo])

  // Validate entered password
  const checkPassword = useCallback(
    (pin: string) => {
      if (pin === '414') {
        setPasswordError(false)
        setUnlockSuccess(true)

        // Play song immediately!
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setMusicPlaying(true)
          }).catch(() => {
            setMusicPlaying(true)
          })
        }

        // Celebrate
        triggerCelebrationConfetti()

        // Transition smoothly to the anniversary screen
        setTimeout(() => {
          navigateTo('anniversary')
          setUnlockSuccess(false)
        }, 700)
      } else {
        setIsShaking(true)
        setPasswordError(true)
        setTimeout(() => {
          setIsShaking(false)
        }, 600)
        setTimeout(() => {
          setEnteredPin('')
          setPasswordError(false)
        }, 1400)
      }
    },
    [navigateTo, triggerCelebrationConfetti]
  )

  // Handle password input changes
  const handlePinInput = useCallback(
    (value: string) => {
      if (unlockSuccess) return
      // Allow only numbers, max 6
      const sanitized = value.replace(/[^0-9]/g, '').slice(0, 6)
      setEnteredPin(sanitized)
      setPasswordError(false)

      if (sanitized === '414') {
        checkPassword(sanitized)
      } else if (sanitized.length >= 3 && sanitized !== '414') {
        // Automatically check if 3 digits are entered
        checkPassword(sanitized)
      }
    },
    [unlockSuccess, checkPassword]
  )

  // Keypad button click
  const handleKeypadPress = useCallback(
    (key: string) => {
      if (unlockSuccess) return
      if (key === 'clear') {
        setEnteredPin('')
        setPasswordError(false)
      } else if (key === 'backspace') {
        setEnteredPin((prev) => prev.slice(0, -1))
        setPasswordError(false)
      } else {
        const next = (enteredPin + key).slice(0, 6)
        setEnteredPin(next)
        setPasswordError(false)
        if (next === '414') {
          checkPassword(next)
        } else if (next.length >= 3) {
          checkPassword(next)
        }
      }
    },
    [unlockSuccess, enteredPin, checkPassword]
  )

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().catch(() => { })
      setMusicPlaying(true)
    }
  }, [musicPlaying])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProgress(val)
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (val / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setCurrentTimeStr(formatTime(newTime))
    }
  }, [])

  // Video and Background Music Mutual Exclusion
  const handleVideoPlay = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      wasMusicPlayingBeforeVideoRef.current = true
      audioRef.current.pause()
      setMusicPlaying(false)
    }
  }, [])

  const handleVideoPause = useCallback(() => {
    if (wasMusicPlayingBeforeVideoRef.current && audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setMusicPlaying(true))
          .catch(() => { })
      }
      wasMusicPlayingBeforeVideoRef.current = false
    }
  }, [])

  // When leaving the video screen: pause video and resume music if needed
  useEffect(() => {
    if (screen !== 'video') {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause()
      }
      if (wasMusicPlayingBeforeVideoRef.current && audioRef.current) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setMusicPlaying(true))
            .catch(() => { })
        }
        wasMusicPlayingBeforeVideoRef.current = false
      }
    }
  }, [screen])

  if (!isMounted) {
    return null
  }

  const anniversaryMsg = data.anniversaryLetterMessage || defaultAnniversaryMessage

  return (
    <div className="gift-page">
      {/* Ambient background particles / glow */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* Floating Music Control (Available once unlocked or on-demand) */}
      {screen !== 'intro' && screen !== 'password' && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`floating-audio-widget ${musicPlaying ? 'playing' : 'paused'}`}
          aria-label={musicPlaying ? 'Pause Music' : 'Play Music'}
          title={musicPlaying ? 'Pause Music' : 'Play Music'}
        >
          <span className="vinyl-disc">💿</span>
          <span className="music-note-icon">{musicPlaying ? '🎵' : '🔇'}</span>
        </button>
      )}

      {/* ── SCREEN 1: INTRO (الظرف) ── */}
      <section
        className={`screen intro-screen ${screen === 'intro' ? (introExiting ? 'exit' : 'visible') : 'hidden'
          }`}
        onClick={handleEnvelopeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleEnvelopeClick()
          }
        }}
      >
        <div className="intro-content">
          <p className="handwritten intro-heading">hey babe!</p>
          <div className="envelope-wrapper">
            <Image
              src={data.envelopeImage}
              alt="Wax Sealed Envelope"
              width={290}
              height={205}
              className="envelope-image"
              priority
            />
          </div>
          <p className="handwritten intro-subtitle">you've got new emails</p>
          <button
            type="button"
            className="open-envelope-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleEnvelopeClick()
            }}
          >
            tap anywhere to open ✨
          </button>
        </div>
      </section>

      {/* ── SCREEN 2: PASSWORD (بيدج enter the password) ── */}
      <section
        className={`screen password-screen ${screen === 'password' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div
            className={`stationery-card password-card ${isShaking ? 'shake-animation' : ''} ${unlockSuccess ? 'success-unlock' : ''
              }`}
          >
            <div className="navy-badge-tag">SECRET ACCESS 🔒</div>

            <h2 className="handwritten password-title">enter the password</h2>

            <p className="password-subtitle">
              Enter our secret 3-digit code to unlock 🤍
            </p>

            {/* Hidden masked password input field (user types, text is hidden) */}
            <div className="password-input-wrapper">
              <input
                ref={passwordInputRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => handlePinInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    checkPassword(enteredPin)
                  }
                }}
                className="hidden-accessible-input"
                autoComplete="off"
                aria-label="Enter password"
              />

              {/* Visual masked indicator dots */}
              <div
                className="pin-dots-display"
                onClick={() => passwordInputRef.current?.focus()}
              >
                {[0, 1, 2].map((idx) => {
                  const isFilled = enteredPin.length > idx
                  return (
                    <div
                      key={idx}
                      className={`pin-dot-box ${isFilled ? 'filled' : ''} ${unlockSuccess ? 'success' : ''
                        }`}
                    >
                      {isFilled ? '●' : '○'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Status Feedback Message */}
            {passwordError && (
              <p className="password-feedback-msg error-msg">
                Incorrect password 🤍 Try again!
              </p>
            )}
            {unlockSuccess && (
              <p className="password-feedback-msg success-msg">
                Welcome home my love! ✨ Playing our song...
              </p>
            )}

            {/* On-screen Keypad (Perfect for touch devices and quick input) */}
            <div className="keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  className="keypad-btn"
                  onClick={() => handleKeypadPress(digit)}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                className="keypad-btn keypad-action-btn"
                onClick={() => handleKeypadPress('clear')}
                title="Clear"
              >
                C
              </button>
              <button
                type="button"
                className="keypad-btn"
                onClick={() => handleKeypadPress('0')}
              >
                0
              </button>
              <button
                type="button"
                className="keypad-btn keypad-action-btn"
                onClick={() => handleKeypadPress('backspace')}
                title="Backspace"
              >
                ⌫
              </button>
            </div>

            <div className="card-footer mt-4">
              <button
                type="button"
                className="navy-action-btn unlock-btn"
                onClick={() => checkPassword(enteredPin)}
              >
                <span>{unlockSuccess ? 'unlocked! ✨' : 'unlock 🤍'}</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 3: NEW ANNIVERSARY PAGE (بيدج HAPPY 1ST ANNIVERSARY) ── */}
      <section
        className={`screen anniversary-screen ${screen === 'anniversary' ? 'visible' : 'hidden'
          }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card anniversary-card">
            {/* 1. Header: HAPPY 1ST ANNIVERSARY */}
            <div className="anniversary-header-wrap">
              <div className="navy-badge-tag">OUR SPECIAL MILESTONE</div>
              <h1 className="anniversary-headline">
                {data.anniversaryTitle || 'HAPPY 1ST ANNIVERSARY'}
              </h1>
              <p className="anniversary-date-tag">15 November 2025 ✦ Our Forever Date</p>
            </div>

            {/* 2. Photo frame loaded from public folder */}
            <div className="anniversary-photo-section">
              <div className="anniversary-photo-frame">
                <Image
                  src={data.anniversaryImage || '/images/anniversary.jpg'}
                  alt="Happy 1st Anniversary Photo"
                  width={420}
                  height={420}
                  className="anniversary-photo-img"
                  priority
                />
                <div className="frame-gold-border" />
                <span className="photo-tape-top" />
              </div>
            </div>

            {/* 3. Live Counter from 15/11/2025 */}
            <div className="countdown-section">
              <p className="countdown-subtitle handwritten">
                {typeof window !== 'undefined' && Date.now() < new Date(targetDateStr).getTime()
                  ? 'Counting down to 15/11/2025 ✨'
                  : 'Together since 15/11/2025 ✨'}
              </p>
              <div className="countdown-timer-grid">
                <div className="countdown-unit-card">
                  <span className="countdown-digit">{timeLeft.days}</span>
                  <span className="countdown-label">DAYS</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-unit-card">
                  <span className="countdown-digit">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="countdown-label">HOURS</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-unit-card">
                  <span className="countdown-digit">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="countdown-label">MINS</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-unit-card">
                  <span className="countdown-digit">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="countdown-label">SECS</span>
                </div>
              </div>
            </div>

            {/* 4. Heartfelt Letter Styled as a Sheet of Paper */}
            <div className="stationery-sheet-letter">
              <div className="sheet-pin-accent">📌</div>
              <div className="sheet-header">
                <span className="handwritten sheet-msg-label">Msg:</span>
                <h2 className="handwritten sheet-anniversary-title">
                  {data.anniversaryLetterTitle || 'HAPPY 1st ANNIVERSARY NOSYYYY.'}
                </h2>
              </div>

              <div className="sheet-ruled-lines">
                <p className="handwritten sheet-content-paragraph">
                  {anniversaryMsg}
                </p>
              </div>

              <div className="sheet-footer-stamp">
                <span className="sheet-heart-icon">Forever & Always ♥️</span>
              </div>
            </div>

            {/* 5. Button to Things We Wanna Do */}
            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('bucketList')
                }}
              >
                <span>things we wanna do</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 4: THINGS WE WANNA DO TOGETHER (بيدج things we wanna do) ── */}
      <section
        className={`screen bucket-screen ${screen === 'bucketList' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card bucket-list-card">
            <div className="navy-badge-tag">Our Bucket List</div>
            <h2 className="handwritten bucket-title">things we wanna do together</h2>

            <ul className="things-bullet-list">
              {data.thingsWeWannaDo &&
                data.thingsWeWannaDo.map((item, idx) => (
                  <li key={idx} className="things-bullet-item">
                    <span className="bullet-dot">•</span>
                    <span className="bullet-text">{item}</span>
                  </li>
                ))}
            </ul>

            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('loveLetter')
                }}
              >
                <span>the little things... 💌</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 5: LOVE LETTER (The little things I love about you) ── */}
      <section
        className={`screen love-letter-screen ${screen === 'loveLetter' ? 'visible' : 'hidden'
          }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card love-letter-card">
            <h2 className="handwritten letter-header-title">
              {data.loveLetterTitle || 'Things i love about you'}
            </h2>

            <p className="handwritten letter-salutation">
              {data.loveLetterSubtitle || 'To My Anas, With All My Love <3'}
            </p>

            <div className="letter-body-paragraphs handwritten">
              {(data.loveLetterParagraphs || defaultLoveLetterParagraphs).map(
                (para, idx) => (
                  <p key={idx} className="letter-para">
                    <span className="bullet-dot">•</span> {para}
                  </p>
                )
              )}
            </div>

            <div className="letter-decor-footer">
              <span className="letter-heart-divider">✦ ❦ ✦</span>
            </div>

            <div className="card-footer mt-8">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('memories')
                }}
              >
                <span>our best memories 📸</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 6: OUR BEST MEMORIES (بيدج our best memories) ── */}
      <section
        className={`screen memories-screen ${screen === 'memories' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card memories-card">
            <div className="navy-badge-tag">MOMENTS WE CHERISH 💫</div>
            <h2 className="handwritten memories-title">our best memories</h2>
            <p className="memories-subtitle handwritten">
              every little moment with you is my favorite memory 🤍
            </p>

            <ul className="memories-bullet-list">
              {(data.ourBestMemories || defaultOurBestMemories).map((item, idx) => (
                <li key={idx} className="memory-bullet-item">
                  <span className="memory-bullet-heart">✦</span>
                  <span className="memory-bullet-text handwritten">{item}</span>
                </li>
              ))}
            </ul>

            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('importantDates')
                }}
              >
                <span>our important dates 🗓️</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 7: OUR MOST IMPORTANT DATES (بيدج our most important dates) ── */}
      <section
        className={`screen dates-screen ${screen === 'importantDates' ? 'visible' : 'hidden'
          }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card dates-card">
            <div className="navy-badge-tag">TIMELINE OF US 🗓️</div>
            <h2 className="handwritten dates-title">our most important dates</h2>
            <p className="dates-subtitle handwritten">

            </p>

            <ul className="memories-bullet-list">
              {(data.importantDates || defaultImportantDates).map((dateStr, idx) => (
                <li key={idx} className="memory-bullet-item">
                  <span className="memory-bullet-heart">✦</span>
                  <span className="memory-bullet-text handwritten">{dateStr}</span>
                </li>
              ))}
            </ul>

            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn always-forever-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('video')
                }}
              >
                <span>always and forever</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 8: OUR SPECIAL VIDEO (بيدج الفيديو) ── */}
      <section
        className={`screen video-screen ${screen === 'video' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card video-card">
            <div className="navy-badge-tag">ALWAYS & FOREVER 🎬</div>
            <h2 className="handwritten video-page-title">always and forever</h2>
            <p className="video-subtitle handwritten">
              a special memory captured in motion 🤍
            </p>

            {/* Luxury Video Player Container (Larger Frame) */}
            <div className="luxury-video-container">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="auto"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoPause}
                className="luxury-video-player"
              >
                <source src={`${data.videoUrl || '/video.mp4'}#t=0.001`} type="video/mp4" />
                <source src="/video.mp4#t=0.001" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-gold-rim" />
            </div>

            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('anniversary')
                }}
              >
                <span>back to the start 🤍</span>
                <span className="pulse-arrow">↺</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXTRA SCREENS KEPT FOR BACKWARDS COMPATIBILITY ── */}
      {/* SCREEN: TO / FROM CARD */}
      <section className={`screen card-screen ${screen === 'card' ? 'visible' : 'hidden'}`}>
        <div className="screen-scroll-container">
          <div className="stationery-card from-to-card">
            <div className="card-header">
              <p className="handwritten line-from">
                <span className="label-navy">From:</span> {data.senderName}
              </p>
              <p className="handwritten line-to">
                <span className="label-navy">To:</span> {data.receiverName}
              </p>
            </div>
            <div className="card-body">
              <p className="handwritten message-label">Message:</p>
              <p className="handwritten message-text">{data.cardMessage}</p>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('photoStory')
                }}
              >
                <span>see attachment</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN: PHOTO STORY */}
      <section
        className={`screen photo-screen ${screen === 'photoStory' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card story-card">
            <div className="story-image-frame">
              <Image
                src={data.birthdayImage}
                alt={`${data.receiverName} Photo`}
                width={380}
                height={380}
                className="story-image"
                priority
              />
            </div>
            <div className="story-text-container">
              <h2 className="handwritten story-title">{data.birthdayTitle}</h2>
              <p className="handwritten story-paragraph">{data.birthdayText}</p>
            </div>
            <div className="card-footer mt-4">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('birthdayMessage')
                }}
              >
                <span>birthday message</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN: BIRTHDAY MESSAGE */}
      <section
        className={`screen birthday-message-screen ${screen === 'birthdayMessage' ? 'visible' : 'hidden'
          }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card birthday-wishes-card">
            <div className="birthday-hero-duo">
              <div className="duo-balloon-wrap">
                <Image
                  src="/images/ballon.png"
                  alt="Birthday 20 Balloons"
                  width={210}
                  height={270}
                  className="hero-balloon-img"
                  priority
                />
              </div>
              <div className="duo-cat-wrap">
                <Image
                  src="/images/cat.png"
                  alt="Birthday Cat with Cake"
                  width={180}
                  height={280}
                  className="hero-cat-img"
                  priority
                />
              </div>
            </div>

            <div className="birthday-message-content">
              <div className="navy-badge-tag">Happy Birthday</div>
              <h2 className="handwritten birthday-wishes-title">
                {data.birthdayWishesTitle}
              </h2>
              <p className="handwritten birthday-wishes-body">
                {data.birthdayWishesMessage}
              </p>
            </div>

            <div className="card-footer mt-4">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('bucketList')
                }}
              >
                <span>things we wanna do</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}