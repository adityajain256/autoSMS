import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api.ts'

type LocationState = {
  phone?: string
  email?: string
  tempToken?: string
}

const OtpVerification: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const loc = (state || {}) as LocationState

  const [otp, setOtp] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState<number>(0)
  const dataa = {
    otp: otp,
    email: loc.email,
  }
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (resendTimer === 0 && timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [resendTimer])

  useEffect(() => {
    // start 60s timer on mount
    setResendTimer(60)
    timerRef.current = window.setInterval(() => {
      setResendTimer((t) => Math.max(0, t - 1))
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!/^[0-9]{4,6}$/.test(otp)) {
      setError('Enter a valid OTP')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', dataa);
      if (res.status !== 200) throw new Error(res.data?.message || 'OTP verification failed')
      navigate('/dashboard')
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    if (resendTimer > 0) return
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-email', { email: loc.email })
      const data = res.data;
      if (res.status !== 200) throw new Error(data?.message || 'Could not resend OTP')
      setResendTimer(60)
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          setResendTimer((t) => Math.max(0, t - 1))
        }, 1000)
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2 text-center">Verify OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Enter the OTP sent to {loc.phone || loc.email || 'your contact'}</p>
        <form onSubmit={verifyOtp}>
          <input
            aria-label="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 text-base border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-md disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={resendOtp} disabled={loading || resendTimer > 0} className="text-sm text-blue-600 hover:underline disabled:opacity-50">
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>
        {error && <div className="text-red-600 mt-3 text-center">{error}</div>}
      </div>
    </div>
  )
}

export default OtpVerification
