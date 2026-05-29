'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Registration } from '@/lib/supabase'
import RegisterForm from '@/components/RegisterForm'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
    setRegistrations(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  const handleLogin = () => {
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'gogogo2025'
    if (password === adminPw) {
      setAuthed(true)
    } else {
      setPwError('비밀번호가 틀렸어요 🔒')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 등록을 삭제할까요?')) return
    await supabase.from('registrations').delete().eq('id', id)
    fetchData()
  }

  const handleToggleCheckIn = async (registration: Registration) => {
    const nextCheckedIn = !registration.checked_in
    await supabase
      .from('registrations')
      .update({
        checked_in: nextCheckedIn,
        checked_in_at: nextCheckedIn ? new Date().toISOString() : null,
      })
      .eq('id', registration.id)
    fetchData()
  }

  const closeEditor = () => {
    setShowAddForm(false)
    setEditingRegistration(null)
  }

  const getStudentGroupLabel = (registration: Registration) => {
    if (registration.school_level === 'infant') return '영유아부'
    if (registration.school_level === 'middle') return '중고등부'
    return '초등부'
  }

  const getGradeLabel = (registration: Registration) => {
    if (!registration.grade) return ''
    if (registration.school_level === 'infant') return `${registration.grade}세`
    if (registration.school_level === 'middle') {
      if (registration.school_stage === 'high') return `고${registration.grade}`
      return `중${registration.grade}`
    }
    return `${registration.grade}학년`
  }

  const handleExportCSV = () => {
    const headers = ['이름', '학생구분', '등록구분', '등록경로', '현장참석', '소개자', '소속', '방문 계기', '학년/나이', '혼자참석', '친구동반', '보호자동반', '등록시각', '체크시각']
    const rows = registrations.map(r => [
      r.visitor_name,
      getStudentGroupLabel(r),
      r.registration_kind === 'preregister' ? '사전등록' : '현장등록',
      r.registration_source === 'manual' ? '수동등록' : '온라인등록',
      r.checked_in ? '체크완료' : '',
      r.introducer_name || '',
      r.school || '',
      r.visit_path || '',
      getGradeLabel(r),
      r.attending_alone ? '✓' : '',
      r.with_friend ? '✓' : '',
      r.with_guardian ? '✓' : '',
      new Date(r.created_at).toLocaleString('ko-KR'),
      r.checked_in_at ? new Date(r.checked_in_at).toLocaleString('ko-KR') : '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gogogo_등록자_${new Date().toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = registrations.filter(r =>
    r.visitor_name.includes(search) ||
    (r.introducer_name || '').includes(search) ||
    (r.school || '').includes(search) ||
    (r.visit_path || '').includes(search)
  )

  const totalFriend = registrations.filter(r => r.with_friend).length
  const totalGuardian = registrations.filter(r => r.with_guardian).length
  const totalSolo = registrations.filter(r => r.attending_alone).length
  const totalPreregistered = registrations.filter(r => r.registration_kind === 'preregister').length
  const totalOnsite = registrations.filter(r => r.registration_kind === 'onsite').length
  const totalManual = registrations.filter(r => r.registration_source === 'manual').length
  const totalCheckedIn = registrations.filter(r => r.checked_in).length

  // ─── Login Screen ───
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
      }}>
        <div className="card" style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔐</div>
          <div style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '4px' }}>관리자 페이지</div>
          <div style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>어린이 잔치 Go Go Go</div>
          <input
            className="input-field"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ marginBottom: '12px', textAlign: 'center', letterSpacing: '4px' }}
          />
          {pwError && <div style={{ color: '#E53935', fontSize: '13px', marginBottom: '12px' }}>{pwError}</div>}
          <button className="bubble-btn" onClick={handleLogin}>입장하기</button>
        </div>
      </div>
    )
  }

  // ─── Dashboard ───
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', padding: '24px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontWeight: '900', fontSize: '1.5rem', color: '#333' }}>🎉 어린이 잔치 관리자</div>
            <div style={{ color: '#888', fontSize: '13px' }}>Go Go Go · 광흥교회</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchData}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid #DDD', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              🔄 새로고침
            </button>
            <button
              onClick={handleExportCSV}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid #4CAF50', background: '#E8F5E9', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#2E7D32' }}
            >
              📥 CSV 내보내기
            </button>
            <button
              onClick={() => {
                if (showAddForm) {
                  closeEditor()
                  return
                }
                setEditingRegistration(null)
                setShowAddForm(true)
              }}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #FF6EB4, #FF8C42)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              {showAddForm ? '✖ 닫기' : '➕ 수동 등록'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: '총 등록자', value: registrations.length, color: '#FF6EB4', emoji: '👥' },
            { label: '사전등록자', value: totalPreregistered, color: '#FFB300', emoji: '📝' },
            { label: '현장등록자', value: totalOnsite, color: '#FF8C42', emoji: '🏃' },
            { label: '수동등록', value: totalManual, color: '#8E24AA', emoji: '✍️' },
            { label: '현장 체크완료', value: totalCheckedIn, color: '#26A69A', emoji: '✅' },
            { label: '혼자서 참석', value: totalSolo, color: '#5C6BC0', emoji: '🙋' },
            { label: '친구와 함께', value: totalFriend, color: '#4FC3F7', emoji: '👫' },
            { label: '보호자와 함께', value: totalGuardian, color: '#69D46B', emoji: '👨‍👩‍👧' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '1.5rem' }}>{stat.emoji}</div>
              <div style={{ fontWeight: '900', fontSize: '2rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Manual Add Form */}
        {(showAddForm || editingRegistration) && (
          <div style={{ marginBottom: '20px' }}>
            <RegisterForm
              isAdmin
              initialData={editingRegistration || undefined}
              registrationKind="onsite"
              registrationSource="manual"
              onSuccess={() => {}}
              onAdminSave={() => {
                closeEditor()
                fetchData()
              }}
              onCancel={closeEditor}
            />
          </div>
        )}

        {/* Search + Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              className="input-field"
              type="text"
              placeholder="이름, 소개자, 학교, 방문 계기로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: '300px', margin: 0 }}
            />
            <span style={{ color: '#888', fontSize: '13px' }}>{filtered.length}명</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>불러오는 중... 🎈</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              {search ? '검색 결과가 없어요' : '아직 등록자가 없어요 🎈'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F9F9F9' }}>
                    {['#', '방문자', '학생구분', '등록구분', '등록경로', '현장참석', '소개자', '소속', '방문 계기', '학년/나이', '혼자', '친구', '보호자', '등록시각', ''].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#666', fontWeight: '700', whiteSpace: 'nowrap', borderBottom: '1px solid #F0F0F0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '12px 14px', color: '#aaa', fontSize: '12px' }}>{filtered.length - i}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#333' }}>{r.visitor_name}</td>
                      <td style={{ padding: '12px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                        {getStudentGroupLabel(r)}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                        {r.registration_kind === 'preregister' ? '사전등록' : '현장등록'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                        {r.registration_source === 'manual' ? '수동등록' : '온라인등록'}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {r.registration_kind === 'preregister' ? (
                          <button
                            onClick={() => handleToggleCheckIn(r)}
                            style={{
                              border: 'none',
                              borderRadius: '999px',
                              background: r.checked_in ? '#E0F2F1' : '#FFF3E0',
                              color: r.checked_in ? '#00796B' : '#EF6C00',
                              fontWeight: '700',
                              fontSize: '12px',
                              padding: '7px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            {r.checked_in ? '체크완료' : '도착 체크'}
                          </button>
                        ) : (
                          <span style={{ color: '#AAA' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#666' }}>{r.introducer_name || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#666' }}>{r.school || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#666', minWidth: '220px' }}>{r.visit_path || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#666' }}>
                        {getGradeLabel(r) || '-'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {r.attending_alone ? <span style={{ color: '#5C6BC0', fontWeight: '700' }}>✓</span> : '-'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {r.with_friend ? <span style={{ color: '#4FC3F7', fontWeight: '700' }}>✓</span> : '-'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {r.with_guardian ? <span style={{ color: '#69D46B', fontWeight: '700' }}>✓</span> : '-'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#999', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => {
                            setShowAddForm(false)
                            setEditingRegistration(r)
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF8C42', fontSize: '16px', padding: '4px', marginRight: '8px' }}
                          title="수정"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF5350', fontSize: '16px', padding: '4px' }}
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
