import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SimpleHuePicker } from './SimpleHuePicker'

describe('SimpleHuePicker', () => {
  it('renders correctly', () => {
    const onChange = vi.fn()
    render(<SimpleHuePicker hue={180} onChange={onChange} />)

    // Check that the component renders
    const pickerElement = screen.getByRole('presentation', { hidden: true })
    expect(pickerElement).toBeDefined()
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    const { container } = render(<SimpleHuePicker hue={180} onChange={onChange} />)

    // Get the container div
    const pickerElement = container.firstChild as HTMLElement

    // Simulate a click
    if (pickerElement) {
      fireEvent.mouseDown(pickerElement, {
        clientX: 50, // This value doesn't matter much for the test
      })

      // Check that onChange was called
      expect(onChange).toHaveBeenCalled()
    }
  })
})