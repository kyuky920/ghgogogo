'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onSuccess: () => void
  initialData?: {
    visitor_name?: string
    introducer_name?: string
    school?: string
    grade?: number | null
    with_friend?: boolean
    with_guardian?: boolean
  }
  isAdmin?: boolean
  onAdminSave?: () => void
}

export default function RegisterForm({ onSuccess, initialData, isAdmin, onAdminSave }: Props) {
  const [visitorName, setVisitorName] = useState(initialData?.visitor_name || '')
  const [introducerName, setIntroducerName] = useState(initialData?.introducer_name || '')
  const [school, setSchool] = useState(initialData?.school || '')
  const [grade, setGrade] = useState<string>(initialData?.grade?.toString() || '')
  const [withFriend, setWithFriend] = useState(initialData?.with_friend || false)
  const [withGuardian, setWithGuardian] = useState(initialData?.with_guardian || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!visitorName.trim()) {
      setError('방문자 이름을 입력해주세요 🙏')
      return
    }
    if (!withFriend && !withGuardian) {
      setError('참석 유형을 하나 이상 선택해주세요 🎈')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: dbError } = await supabase.from('registrations').insert({
        visitor_name: visitorName.trim(),
        introducer_name: introducerName.trim() || null,
        school: school.trim() || null,
        grade: grade ? parseInt(grade) : null,
        with_friend: withFriend,
        with_guardian: withGuardian,
      })
      if (dbError) throw dbError
      if (isAdmin && onAdminSave) {
        onAdminSave()
      } else {
        onSuccess()
      }
    } catch {
      setError('등록 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      {!isAdmin && (
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '6px', fontWeight: '500' }}>
            대한예수교장로회 광흥교회
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #FF6EB4, #FFD600, #4FC3F7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.2rem',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            어린이 잔치
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px',
            marginBottom: '12px',
          }}>
            {['믿', '웃', '크'].map((char, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#999', marginBottom: '1px' }}>{char}</div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: ['#4FC3F7', '#69D46B', '#FF8C42'][i],
                  textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                }}>Go</div>
              </div>
            ))}
          </div>
          <div style={{
            background: '#FFF3F9',
            border: '2px solid #FFCCE8',
            borderRadius: '50px',
            display: 'inline-block',
            padding: '6px 20px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#E91E8C',
          }}>
            📅 5월 30일(토) 오후 2시~5시
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="card" style={{ marginBottom: '16px' }}>
        {isAdmin && (
          <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '20px', color: '#333' }}>
            ✏️ 수동 등록
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 소개자 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
              🩷 소개자 이름 <span style={{ color: '#aaa', fontWeight: '400' }}>(선택)</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="우리 아이를 소개해준 분"
              value={introducerName}
              onChange={e => setIntroducerName(e.target.value)}
            />
          </div>

          {/* 방문자 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
              💚 방문자 이름 <span style={{ color: '#E91E8C' }}>*</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="어린이 이름을 입력하세요"
              value={visitorName}
              onChange={e => setVisitorName(e.target.value)}
            />
          </div>

          {/* 학교 / 학년 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
                🏫 학교 <span style={{ color: '#aaa', fontWeight: '400' }}>(선택)</span>
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="학교명"
                value={school}
                onChange={e => setSchool(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
                📚 학년(세) <span style={{ color: '#aaa', fontWeight: '400' }}>(선택)</span>
              </label>
              <input
                className="input-field"
                type="number"
                placeholder="예: 3"
                min="1"
                max="20"
                value={grade}
                onChange={e => setGrade(e.target.value)}
              />
            </div>
          </div>

          {/* 참석 유형 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#555' }}>
              🎈 참석 유형 <span style={{ color: '#E91E8C' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className={`checkbox-card ${withFriend ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={withFriend}
                  onChange={e => setWithFriend(e.target.checked)}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>👫 친구와 함께 참석</span>
              </label>
              <label className={`checkbox-card ${withGuardian ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={withGuardian}
                  onChange={e => setWithGuardian(e.target.checked)}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>👨‍👩‍👧 보호자와 함께 참석</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            background: '#FFF0F0',
            border: '1px solid #FFD0D0',
            borderRadius: '12px',
            color: '#D32F2F',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {error}
          </div>
        )}

        <button
          className="bubble-btn"
          style={{ marginTop: '24px' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '등록 중...' : isAdmin ? '💾 저장하기' : '🎉 등록 완료!'}
        </button>
      </div>

      {!isAdmin && (
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#aaa', lineHeight: 1.6 }}>
          광흥교회 · 오후 1시부터 접수 시작<br />
          친구, 가족과 함께 오셔서 즐거운 시간 되세요 🎊
        </div>
      )}
    </div>
  )
}
