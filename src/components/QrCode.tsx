import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const options = {
  margin: 1,
  color: { dark: '#0E2E2A', light: '#FFFFFF' },
  errorCorrectionLevel: 'M' as const,
}

export function qrDataUrl(value: string, width = 1024): Promise<string> {
  return QRCode.toDataURL(value, { ...options, width })
}

/** Downloads the QR as a PNG — one click, one file, printable for the folder. */
export async function downloadQr(value: string, filename: string) {
  const url = await qrDataUrl(value)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default function QrCode({
  value,
  size = 240,
  className = '',
}: {
  value: string
  size?: number
  className?: string
}) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let live = true
    qrDataUrl(value, size * 2).then((url) => {
      if (live) setSrc(url)
    })
    return () => {
      live = false
    }
  }, [value, size])

  return (
    <img
      src={src}
      alt={`QR code for ${value}`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-xl bg-paper ${className}`}
    />
  )
}
