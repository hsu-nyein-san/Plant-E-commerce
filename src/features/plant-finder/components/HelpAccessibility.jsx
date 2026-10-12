import React from 'react'
import Card from './Card'

const HelpAccessibility = () => {
  return (
    <Card className="p-4">
    <h3 className="font-semibold text-gray-900 mb-3">Help & Accessibility</h3>
    <ul className="text-xs text-gray-600 space-y-2">
      <li>Keyboard shortcuts: Tab to navigate, Arrow keys to change choices, Enter to confirm.</li>
      <li>All interactive elements have visible labels and focus states.</li>
      <li>Need plant-matching help? Chat with our experts.</li>
      <li>Beginner Guides • Watering • Repotting</li>
    </ul>
  </Card>

  )
}

export default HelpAccessibility