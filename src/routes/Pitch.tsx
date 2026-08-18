import { Link } from 'react-router-dom'
import QrCode from '../components/QrCode'
import { PRODUCT_NAME, guestUrl } from '../lib/links'
import ResetDemo from '../components/ResetDemo'

const DEMO_TOKEN = 'villa-serena-0811'

export default function Pitch() {
  const url = guestUrl(DEMO_TOKEN)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-stone px-6 py-12 text-center">
      <h1 className="font-display text-5xl text-deep sm:text-6xl">{PRODUCT_NAME}</h1>
      <p className="mt-4 max-w-xl text-xl text-deep/75 sm:text-2xl">
        Everything a family needs, arranged before they arrive.
      </p>

      <div className="mt-12 rounded-3xl bg-paper p-5 shadow-none">
        <QrCode value={url} size={272} />
      </div>
      <p className="tnum mt-4 text-[15px] text-deep/50">{url}</p>

      <Link to="/agency" className="mt-10 text-[15px] text-water underline underline-offset-4">
        Agency console
      </Link>

      <div className="mt-12">
        <ResetDemo />
      </div>
    </div>
  )
}
