'use client'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxProps {
  isOpen: boolean
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  alt?: string
}

export default function ImageLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  alt = 'Image'
}: ImageLightboxProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle arrow keys for navigation
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrevious()
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNext()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleArrowKeys)
    }

    return () => {
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [isOpen, currentIndex, images.length, onPrevious, onNext])

  if (!isOpen) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '1rem', sm: '2rem' }
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <Box
        component="button"
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: { xs: '1rem', sm: '2rem' },
          right: { xs: '1rem', sm: '2rem' },
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: { xs: '40px', sm: '48px' },
          height: { xs: '40px', sm: '48px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 10000,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.1)'
          }
        }}
      >
        <X size={24} color="#ffffff" />
      </Box>

      {/* Image Counter */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '1rem', sm: '2rem' },
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            fontFamily: 'MarioFont, sans-serif',
            fontSize: { xs: '14px', sm: '16px' },
            zIndex: 10000
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      )}

      {/* Main Image Container */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component="img"
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          sx={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: { xs: '0.5rem', sm: '1rem' }
          }}
        />
      </Box>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <Box
            component="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
            }}
            disabled={currentIndex === 0}
            sx={{
              position: 'absolute',
              left: { xs: '0.5rem', sm: '2rem' },
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: { xs: '48px', sm: '64px' },
              height: { xs: '48px', sm: '64px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.3 : 1,
              transition: 'all 0.2s',
              '&:hover': {
                background: currentIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                transform: currentIndex === 0 ? 'translateY(-50%)' : 'translateY(-50%) scale(1.1)'
              }
            }}
          >
            <ChevronLeft size={32} color="#ffffff" />
          </Box>

          {/* Next Button */}
          <Box
            component="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            disabled={currentIndex === images.length - 1}
            sx={{
              position: 'absolute',
              right: { xs: '0.5rem', sm: '2rem' },
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: { xs: '48px', sm: '64px' },
              height: { xs: '48px', sm: '64px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentIndex === images.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === images.length - 1 ? 0.3 : 1,
              transition: 'all 0.2s',
              '&:hover': {
                background: currentIndex === images.length - 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                transform: currentIndex === images.length - 1 ? 'translateY(-50%)' : 'translateY(-50%) scale(1.1)'
              }
            }}
          >
            <ChevronRight size={32} color="#ffffff" />
          </Box>
        </>
      )}
    </Box>
  )
}
