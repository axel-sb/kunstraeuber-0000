import { useCallback, useEffect, useRef, useState } from 'react'

interface SimpleHuePickerProps {
  className?: string
  hue?: number
  onChange: (newHue: { h: number }) => void
}

export function SimpleHuePicker({ className = '', hue = 0, onChange }: SimpleHuePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate hue value from mouse position
  const calculateHue = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const position = clientX - rect.left
    const width = rect.width

    // Calculate hue (0-360) based on position
    let newHue = Math.round((position / width) * 360)
    newHue = Math.max(0, Math.min(newHue, 360))

    onChange({ h: newHue })
  }, [onChange])

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    calculateHue(e.clientX)
  }

  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    if (e.touches[0]) {
      calculateHue(e.touches[0].clientX)
    }
  }

  // Set up event listeners for mouse/touch move and up/end
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        calculateHue(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        calculateHue(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, calculateHue])

  return (
    <div
      ref={containerRef}
      role="presentation"
      className={`relative h-8 p-2 cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
        borderRadius: '4px'
      }}
    >
      <div
        className="absolute w-4 h-full top-0 -ml-2 pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.4)',
          borderRadius: '2px'
        }}
      />
    </div>
  )
}

export default SimpleHuePicker