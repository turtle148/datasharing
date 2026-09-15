import { useEffect, useRef, type ReactNode } from 'react'

/**
 * The one bottom sheet in the product — a request, or the requests tray. Rises
 * on the 260ms curve over a scrim that fades in over 200ms.
 */
export default function Sheet({
  label,
  onClose,
  children,
  footer,
}: {
  label: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-scrim absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(15,28,34,0.30)' }}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="animate-sheet-up relative flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-sheet bg-paper"
      >
        <div className="flex shrink-0 justify-center pt-3.5 pb-1">
          <span className="h-1 w-9 rounded-full bg-deep/18" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-deep/10 px-4 pt-3.5 pb-[max(1.125rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
