import { Link } from 'react-router-dom'
import QrCode, { downloadQr } from '../components/QrCode'
import ResetDemo from '../components/ResetDemo'
import { PRODUCT_NAME, guestUrl } from '../lib/links'
import { data } from '../lib/store'

const DEMO_TOKEN = 'villa-serena-0811'

export default function Pitch() {
  const url = guestUrl(DEMO_TOKEN)
  const stay = data.stays.find((s) => s.token === DEMO_TOKEN)!

  return (
    <div className="min-h-dvh bg-stone p-4 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-[1440px] overflow-hidden rounded-frame lg:min-h-[810px] lg:grid-cols-[1fr_480px]">
        <div className="flex flex-col justify-between gap-10 bg-deep p-8 lg:p-20">
          <p className="text-[13px] font-semibold tracking-[0.14em] text-paper/55 uppercase">
            {data.agency.name}
          </p>

          <div>
            <h1 className="font-display text-[clamp(64px,11vw,132px)] leading-[0.9] font-bold tracking-[-0.045em] text-paper">
              {PRODUCT_NAME}
            </h1>
            <p className="mt-6 max-w-[560px] text-[clamp(19px,2.2vw,26px)] leading-[1.4] text-paper/75">
              Everything a family needs at the villa — arranged by the people who already look
              after the house.
            </p>
          </div>

          <Link
            to={`/s/${DEMO_TOKEN}`}
            className="font-mono text-[15px] break-all text-citron underline-offset-4 hover:underline"
          >
            {url.replace(/^https?:\/\//, '')}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 bg-paper p-8">
          <QrCode value={url} size={300} />
          <p className="text-center text-[17px] text-deep/65">
            Scan for {stay.guestName}'s stay
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-deep/35">
            <button
              type="button"
              onClick={() => downloadQr(url, 'villa-serena-guest-qr.png')}
              className="cursor-pointer underline underline-offset-2"
            >
              Download QR
            </button>
            <Link to="/agency" className="underline underline-offset-2">
              Agency console
            </Link>
            <ResetDemo />
          </div>
        </div>
      </div>
    </div>
  )
}
