'use client'
import { useEffect, useState } from 'react'
import RegisterForm from '@/components/RegisterForm'
import AlreadyRegistered from '@/components/AlreadyRegistered'

const STORAGE_KEY = 'gogogo_registered'

export default function Home() {
  const [alreadyDone, setAlreadyDone] = useState<boolean | null>(null)

  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY)
    setAlreadyDone(val === 'true')
  }, [])

  if (alreadyDone === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>🎈</div>
      </div>
    )
  }

  if (alreadyDone) {
    return <AlreadyRegistered />
  }

  return (
    <RegisterForm
      onSuccess={() => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setAlreadyDone(true)
      }}
    />
  )
}
