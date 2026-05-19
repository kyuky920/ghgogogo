-- ============================================
-- 광흥교회 어린이 잔치 Go Go Go
-- Supabase SQL Setup Script
-- ============================================

-- 1. registrations 테이블 생성
CREATE TABLE IF NOT EXISTS registrations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name    TEXT        NOT NULL,
  introducer_name TEXT,
  school          TEXT,
  grade           INTEGER,
  with_friend     BOOLEAN     NOT NULL DEFAULT false,
  with_guardian   BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 3. 누구나 INSERT 가능 (등록 폼에서 사용)
CREATE POLICY "Anyone can insert"
  ON registrations FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. anon 키로 SELECT 가능 (Admin 대시보드에서 사용)
CREATE POLICY "Anyone can select"
  ON registrations FOR SELECT
  TO anon
  USING (true);

-- 5. anon 키로 DELETE 가능 (Admin에서 삭제)
CREATE POLICY "Anyone can delete"
  ON registrations FOR DELETE
  TO anon
  USING (true);

-- 6. 인덱스 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_registrations_created_at
  ON registrations(created_at DESC);
