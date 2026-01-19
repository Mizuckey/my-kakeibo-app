'use client'

import React from 'react'

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md',
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden">
      <div
        className="absolute inset-0 modal-overlay bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full px-4">
        <div
          className={`modal-content bg-white dark:bg-gray-800 p-4 rounded shadow-lg relative mx-auto w-full ${maxWidth} box-border overflow-hidden`}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="閉じる"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 text-lg"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}