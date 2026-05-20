'use client'
import { useEffect, useState } from 'react'
import RegisterForm from '@/components/RegisterForm'
import AlreadyRegistered from '@/components/AlreadyRegistered'

const STORAGE_KEY = 'gogogo_preregistered'

export default function PreRegisterPage() {
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
    return (
      <AlreadyRegistered
        title="이미 사전등록되었어요! 😊"
        buttonLabel="👬 같이온 친구 사전등록하기"
        onRegisterCompanion={() => {
          localStorage.setItem(STORAGE_KEY, 'false')
          setAlreadyDone(false)
        }}
      />
    )
  }

  return (
    <RegisterForm
      registrationKind="preregister"
      eventLabel="사전 등록"
      onSuccess={() => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setAlreadyDone(true)
      }}
    />
  )
}
