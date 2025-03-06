// Simple test to verify our shim works
const { render } = require('@testing-library/react')
const React = require('react')
const { describe, it, expect } = require('vitest')
const Hue = require('./color-hue-shim.js')

describe('Hue Shim', () => {
  it('renders without crashing', () => {
    const { container } = render(
      React.createElement(Hue, { hue: 180, onChange: () => {} })
    )
    expect(container).toBeTruthy()
  })
})