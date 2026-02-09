'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { vw } from 'src/utils/scaling'

interface InfiniteCarouselProps {
  images: string[]
  speedPxPerSec?: number
  className?: string
  imageClassName?: string
}

export default function InfiniteCarousel({
  images,
  speedPxPerSec = 50,
  className = '',
  imageClassName = ''
}: InfiniteCarouselProps) {
  const midpoint = Math.ceil(images.length / 2)
  const firstHalf = images.slice(0, midpoint)
  const secondHalf = images.slice(midpoint)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: 'rotate(-12deg)',
        width: '150%',
        marginLeft: '-25%'
      }}
    >
      <CarouselRow
        images={firstHalf}
        direction="rtl"
        speedPxPerSec={speedPxPerSec}
        imageClassName={imageClassName}
      />
      <CarouselRow
        images={secondHalf}
        direction="ltr"
        speedPxPerSec={speedPxPerSec}
        imageClassName={imageClassName}
      />
    </div>
  )
}

function CarouselRow({
  images,
  direction,
  speedPxPerSec = 50,
  imageClassName = ''
}: {
  images: string[]
  direction: 'rtl' | 'ltr'
  speedPxPerSec?: number
  imageClassName?: string
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const firstCycleRef = useRef<HTMLDivElement | null>(null)

  const [viewportW, setViewportW] = useState(0)
  const [cycleW, setCycleW] = useState(0)
  const [gapPx, setGapPx] = useState(-50) // -50px gap
  const [isMobile, setIsMobile] = useState(false)

  // Track screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        setViewportW(viewportRef.current.clientWidth)
      }
      if (firstCycleRef.current) {
        setCycleW(firstCycleRef.current.scrollWidth)
      }
    }

    const resizeObserver = new ResizeObserver(measure)
    if (viewportRef.current) resizeObserver.observe(viewportRef.current)
    if (firstCycleRef.current) resizeObserver.observe(firstCycleRef.current)

    requestAnimationFrame(measure)
    return () => resizeObserver.disconnect()
  }, [images])

  const repeats = useMemo(() => {
    if (!cycleW || !viewportW) return 3
    const need = (viewportW * 2.2) / cycleW // Small buffer beyond 2×
    return Math.max(3, Math.ceil(need))
  }, [cycleW, viewportW])

  const translatePx = Math.max(1, cycleW + gapPx)
  const durationSec = Math.max(1, translatePx / speedPxPerSec)

  const animationStyle = direction === 'rtl'
    ? {
        animation: `slideRtl ${durationSec}s linear infinite`,
      }
    : {
        animation: `slideLtr ${durationSec}s linear infinite`,
      }

  const Cycle = ({
    refCb,
    ariaHidden = false,
    style = {}
  }: {
    refCb?: (el: HTMLDivElement | null) => void
    ariaHidden?: boolean
    style?: React.CSSProperties
  }) => (
    <div
      ref={refCb}
      aria-hidden={ariaHidden || undefined}
      className="flex"
      style={style}
    >
      {images.map((img, i) => (
        <div
          key={`${i}-${ariaHidden ? 'dup' : 'main'}`}
          className={`flex-shrink-0 carousel-image-container ${imageClassName}`}
          style={
            isMobile
              ? {
                  marginLeft: i === 0 ? vw(15, 'mobile') : vw(-35, 'mobile'),
                  width: vw(300, 'mobile'),
                  height: 'auto',
                  minWidth: vw(300, 'mobile')
                }
              : {
                  marginLeft: i === 0 ? '0' : vw(-50),
                  width: vw(400),
                  height: 'auto',
                  minWidth: vw(400)
                }
          }
        >
          <img
            src={img}
            alt={ariaHidden ? '' : `Carousel image ${i + 1}`}
            aria-hidden={ariaHidden ? true : undefined}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes slideRtl {
          from { transform: translateX(0); }
          to   { transform: translateX(-${translatePx}px); }
        }
        @keyframes slideLtr {
          from { transform: translateX(-${translatePx}px); }
          to   { transform: translateX(0); }
        }
        .carousel-image-container {
          width: calc(100vw * 300 / 390) !important;
          min-width: calc(100vw * 300 / 390) !important;
          height: auto !important;
        }
        .carousel-image-container:first-child {
          margin-left: calc(100vw * 20 / 390) !important;
        }
        .carousel-image-container:not(:first-child) {
          margin-left: calc(100vw * -30 / 390) !important;
        }
        @media (min-width: 768px) {
          .carousel-image-container {
            width: calc(100vw * 400 / 1512) !important;
            min-width: calc(100vw * 400 / 1512) !important;
            height: auto !important;
          }
          .carousel-image-container:first-child {
            margin-left: 0 !important;
          }
          .carousel-image-container:not(:first-child) {
            margin-left: calc(100vw * -50 / 1512) !important;
          }
        }
      `}</style>

      <div
        ref={viewportRef}
        className="overflow-hidden w-full relative mb-4"
      >
        <div
          ref={trackRef}
          className="flex items-stretch w-max"
          style={{
            ...animationStyle,
            willChange: 'transform',
            marginLeft: isMobile ? vw(-50, 'mobile') : vw(-50)
          }}
        >
          <Cycle refCb={(el) => (firstCycleRef.current = el)} />
          {Array.from({ length: repeats - 1 }).map((_, idx) => (
            <Cycle key={`dup-${idx}`} ariaHidden style={{ marginLeft: isMobile ? vw(-50, 'mobile') : vw(-50) }} />
          ))}
        </div>
      </div>
    </>
  )
}
