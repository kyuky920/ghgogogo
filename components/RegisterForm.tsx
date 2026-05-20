'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onSuccess: () => void
  initialData?: {
    id?: string
    visitor_name?: string
    introducer_name?: string | null
    school?: string | null
    visit_path?: string | null
    grade?: number | null
    with_friend?: boolean
    with_guardian?: boolean
    registration_kind?: 'onsite' | 'preregister'
    registration_source?: 'online' | 'manual'
  }
  isAdmin?: boolean
  onAdminSave?: () => void
  onCancel?: () => void
  registrationKind?: 'onsite' | 'preregister'
  registrationSource?: 'online' | 'manual'
  eventLabel?: string
}

export default function RegisterForm({
  onSuccess,
  initialData,
  isAdmin,
  onAdminSave,
  onCancel,
  registrationKind = 'onsite',
  registrationSource = 'online',
  eventLabel = '어린이 잔치',
}: Props) {
  const presetSchools = ['숲내초등학교', '향동초등학교']
  const presetVisitPaths = [
    '광흥교회에 다니고 있어요.',
    '광흥교회의 친구를 따라 왔어요.',
    '홍보 현수막을 보고 왔어요.',
    '홍보 책자를 받고 왔어요.',
  ]
  const isPresetSchool = initialData?.school ? presetSchools.includes(initialData.school) : false
  const isPresetVisitPath = initialData?.visit_path ? presetVisitPaths.includes(initialData.visit_path) : false

  const [visitorName, setVisitorName] = useState(initialData?.visitor_name || '')
  const [introducerName, setIntroducerName] = useState(initialData?.introducer_name || '')
  const [schoolOption, setSchoolOption] = useState(
    initialData?.school ? (isPresetSchool ? initialData.school : 'other') : ''
  )
  const [customSchool, setCustomSchool] = useState(isPresetSchool ? '' : (initialData?.school || ''))
  const [visitPathOption, setVisitPathOption] = useState(
    initialData?.visit_path ? (isPresetVisitPath ? initialData.visit_path : 'other') : ''
  )
  const [customVisitPath, setCustomVisitPath] = useState(
    isPresetVisitPath ? '' : (initialData?.visit_path || '')
  )
  const [grade, setGrade] = useState<string>(initialData?.grade?.toString() || '')
  const [withFriend, setWithFriend] = useState(initialData?.with_friend || false)
  const [withGuardian, setWithGuardian] = useState(initialData?.with_guardian || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(isAdmin && initialData?.id)
  const effectiveRegistrationKind = initialData?.registration_kind || registrationKind
  const effectiveRegistrationSource = initialData?.registration_source || registrationSource

  const handleSubmit = async () => {
    if (!visitorName.trim()) {
      setError('방문자 이름을 입력해주세요 🙏')
      return
    }
    if (!withFriend && !withGuardian) {
      setError('참석 유형을 하나 이상 선택해주세요 🎈')
      return
    }
    if (schoolOption === 'other' && !customSchool.trim()) {
      setError('학교를 직접 선택했으면 학교 이름을 입력해주세요 🙏')
      return
    }
    if (!visitPathOption.trim()) {
      setError('방문 계기(경로)를 선택해주세요 🙏')
      return
    }
    if (visitPathOption === 'other' && !customVisitPath.trim()) {
      setError('기타 방문 계기를 입력해주세요 🙏')
      return
    }

    const schoolValue =
      schoolOption === 'other' ? customSchool.trim() : schoolOption.trim()
    const visitPathValue =
      visitPathOption === 'other' ? customVisitPath.trim() : visitPathOption.trim()

    setError('')
    setLoading(true)
    try {
      const payload = {
        visitor_name: visitorName.trim(),
        introducer_name: introducerName.trim() || null,
        school: schoolValue || null,
        visit_path: visitPathValue,
        grade: grade ? parseInt(grade) : null,
        with_friend: withFriend,
        with_guardian: withGuardian,
        registration_kind: effectiveRegistrationKind,
        registration_source: effectiveRegistrationSource,
      }
      const { error: dbError } = isEditing
        ? await supabase.from('registrations').update(payload).eq('id', initialData?.id)
        : await supabase.from('registrations').insert(payload)
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
            {eventLabel}
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
            {isEditing ? '🛠️ 등록 정보 수정' : '✏️ 수동 등록'}
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
              placeholder="소개해준 사람의 이름을 입력하세요"
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

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
              🏫 학교 <span style={{ color: '#aaa', fontWeight: '400' }}>(선택)</span>
            </label>
            <div className="compact-choice-grid">
              <label className={`compact-choice-card ${schoolOption === '숲내초등학교' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="school-option"
                  checked={schoolOption === '숲내초등학교'}
                  onChange={() => setSchoolOption('숲내초등학교')}
                />
                <span style={{ fontWeight: '600', fontSize: '14px' }}>숲내초등학교</span>
              </label>
              <label className={`compact-choice-card ${schoolOption === '향동초등학교' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="school-option"
                  checked={schoolOption === '향동초등학교'}
                  onChange={() => setSchoolOption('향동초등학교')}
                />
                <span style={{ fontWeight: '600', fontSize: '14px' }}>향동초등학교</span>
              </label>
              <label className={`compact-choice-card ${schoolOption === 'other' ? 'checked' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <input
                  type="radio"
                  name="school-option"
                  checked={schoolOption === 'other'}
                  onChange={() => setSchoolOption('other')}
                />
                <span style={{ fontWeight: '600', fontSize: '14px' }}>기타 학교 직접 입력</span>
              </label>
            </div>
            {schoolOption === 'other' && (
              <input
                className="input-field"
                type="text"
                placeholder="학교명을 입력하세요"
                value={customSchool}
                onChange={e => setCustomSchool(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
              📚 학년 <span style={{ color: '#aaa', fontWeight: '400' }}>(선택)</span>
            </label>
            <select
              className="input-field"
              value={grade}
              onChange={e => setGrade(e.target.value)}
            >
              <option value="">선택 안함</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
              <option value="5">5학년</option>
              <option value="6">6학년</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#555' }}>
              🚪 방문 계기(경로) <span style={{ color: '#E91E8C' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className={`choice-card ${visitPathOption === '광흥교회에 다니고 있어요.' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="visit-path-option"
                  checked={visitPathOption === '광흥교회에 다니고 있어요.'}
                  onChange={() => setVisitPathOption('광흥교회에 다니고 있어요.')}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>광흥교회에 다니고 있어요.</span>
              </label>
              <label className={`choice-card ${visitPathOption === '광흥교회의 친구를 따라 왔어요.' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="visit-path-option"
                  checked={visitPathOption === '광흥교회의 친구를 따라 왔어요.'}
                  onChange={() => setVisitPathOption('광흥교회의 친구를 따라 왔어요.')}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>광흥교회의 친구를 따라 왔어요.</span>
              </label>
              <label className={`choice-card ${visitPathOption === '홍보 현수막을 보고 왔어요.' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="visit-path-option"
                  checked={visitPathOption === '홍보 현수막을 보고 왔어요.'}
                  onChange={() => setVisitPathOption('홍보 현수막을 보고 왔어요.')}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>홍보 현수막을 보고 왔어요.</span>
              </label>
              <label className={`choice-card ${visitPathOption === '홍보 책자를 받고 왔어요.' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="visit-path-option"
                  checked={visitPathOption === '홍보 책자를 받고 왔어요.'}
                  onChange={() => setVisitPathOption('홍보 책자를 받고 왔어요.')}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>홍보 책자를 받고 왔어요.</span>
              </label>
              <label className={`choice-card ${visitPathOption === 'other' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="visit-path-option"
                  checked={visitPathOption === 'other'}
                  onChange={() => setVisitPathOption('other')}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>기타</span>
              </label>
            </div>
            {visitPathOption === 'other' && (
              <input
                className="input-field"
                type="text"
                placeholder="방문 계기를 입력하세요"
                value={customVisitPath}
                onChange={e => setCustomVisitPath(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          {/* 참석 유형 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#555' }}>
              🎈 참석 유형 <span style={{ color: '#E91E8C' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className={`choice-card ${withFriend ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={withFriend}
                  onChange={e => setWithFriend(e.target.checked)}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>👫 친구와 함께 참석</span>
              </label>
              <label className={`choice-card ${withGuardian ? 'checked' : ''}`}>
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

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {isAdmin && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                border: '2px solid #DDD',
                background: 'white',
                color: '#666',
                borderRadius: '50px',
                padding: '14px 20px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              목록으로
            </button>
          )}
          <button
            className="bubble-btn"
            style={{ marginTop: 0, flex: 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (isEditing ? '저장 중...' : '등록 중...') : isEditing ? '💾 수정 저장' : isAdmin ? '💾 저장하기' : '🎉 등록 완료!'}
          </button>
        </div>
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
