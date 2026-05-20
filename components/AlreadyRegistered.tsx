'use client'

interface Props {
  onRegisterCompanion: () => void
  title?: string
  buttonLabel?: string
}

export default function AlreadyRegistered({
  onRegisterCompanion,
  title = '이미 등록되었어요! 😊',
  buttonLabel = '👬 같이온 친구 등록하기',
}: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'linear-gradient(160deg, #FFF0F8 0%, #FFF8E1 50%, #E8F5FF 100%)',
    }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        {/* Balloons */}
        <div style={{ fontSize: '4rem', marginBottom: '8px', lineHeight: 1 }}>
          🎈🎉🎈
        </div>

        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <div style={{
            fontSize: '1.6rem',
            fontWeight: '900',
            color: '#333',
            marginBottom: '8px',
            lineHeight: 1.2,
          }}>
            {title}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #FF6EB4, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '20px',
          }}>
            어린이 잔치 Go Go Go
          </div>

          <div style={{
            background: '#FFF8E1',
            border: '2px solid #FFE082',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontWeight: '700', color: '#F57F17', marginBottom: '4px', fontSize: '15px' }}>
              📅 행사 안내
            </div>
            <div style={{ color: '#555', fontSize: '14px', lineHeight: 1.7 }}>
              <strong>5월 30일 (토)</strong><br />
              오후 2시 ~ 5시<br />
              광흥교회<br />
              <span style={{ color: '#888', fontSize: '13px' }}>* 오후 1시부터 접수 시작</span>
            </div>
          </div>

          <div style={{
            background: '#F0F9FF',
            border: '2px solid #B3E5FC',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '20px',
          }}>
            <div style={{ fontWeight: '700', color: '#0277BD', marginBottom: '4px', fontSize: '14px' }}>
              🚌 차량 운행 정보
            </div>
            <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.8 }}>
              오후 1~5시 / 1시간 간격<br />
              ① DMC두산위브퍼스트 앞<br />
              ② DMC해링턴 플라리스 앞<br />
              ③ 향동 초등학교 정문<br />
              ④ 파피에르콩테 꽃집 앞
            </div>
          </div>

          <div style={{
            background: '#F3E5FF',
            border: '2px solid #CE93D8',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '18px',
          }}>
            <div style={{ fontWeight: '700', color: '#6A1B9A', marginBottom: '4px', fontSize: '14px' }}>
              📞 문의
            </div>
            <div style={{ color: '#555', fontSize: '14px', fontWeight: '700' }}>
              010-8630-0957
            </div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
              문자로 &quot;고고고&quot;라고 보내주시면 안내해 드려요
            </div>
          </div>

          <button
            className="bubble-btn"
            onClick={onRegisterCompanion}
            style={{ width: '100%' }}
          >
            {buttonLabel}
          </button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '13px', color: '#aaa' }}>
          친구, 가족과 함께 오셔서 즐거운 시간 되세요 🎊
        </div>
      </div>
    </div>
  )
}
