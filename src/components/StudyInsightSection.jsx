// src/components/StudyInsightSection.jsx
import React from "react";
import styled from "styled-components";

export default function StudyInsightSection({
  summary,
  loading,
  error,
  mode, // 'week' | 'overall'
  onChangeMode,
}) {
  if (loading) {
    return (
      <Card>
        <HeaderRow>
          <Title>학습 분석</Title>
        </HeaderRow>
        <LoadingText>분석 중입니다...</LoadingText>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <HeaderRow>
          <Title>학습 분석</Title>
        </HeaderRow>
        <ErrorText>{error}</ErrorText>
      </Card>
    );
  }

  if (!summary) return null;

  const {
    period,
    totalUserMessages,
    globalIntentStats = [],
    questionTypeStats = [],
    loopIntentRate = 0,
    ambiguityRate = 0,
    topAmbiguityTypes = [],
    strengths = [],
    suggestions = [],
  } = summary;

  // 기간 표시용 텍스트
  let periodLabel = "";
  if (period?.from && period?.to) {
    const from = new Date(period.from);
    const to = new Date(period.to);
    const fmt = (d) =>
      d.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
      });
    periodLabel = `${fmt(from)} ~ ${fmt(to)}`;
  }

  return (
    <Card>
      {/* 상단 헤더 */}
      <HeaderRow>
        <Title>학습 분석</Title>
        <RightControls>
          <ToggleGroup>
            <ToggleButton
              type="button"
              active={mode === "week"}
              onClick={() => onChangeMode?.("week")}
            >
              이번 주
            </ToggleButton>
            <ToggleButton
              type="button"
              active={mode === "overall"}
              onClick={() => onChangeMode?.("overall")}
            >
              전체 기간
            </ToggleButton>
          </ToggleGroup>
          {periodLabel && <PeriodText>{periodLabel}</PeriodText>}
        </RightControls>
      </HeaderRow>

      {/* 요약 숫자 3개 */}
      <SummaryRow>
        <StatBox>
          <StatLabel>분석된 발화 수</StatLabel>
          <StatValue>{totalUserMessages ?? 0}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>루프 의도 비율</StatLabel>
          <StatValue>{Math.round((loopIntentRate ?? 0) * 100)}%</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>모호한 표현 비율</StatLabel>
          <StatValue>{Math.round((ambiguityRate ?? 0) * 100)}%</StatValue>
        </StatBox>
      </SummaryRow>

      {/* 메인 2컬럼 영역: 왼쪽(행동 패턴), 오른쪽(강점/추천/모호) */}
      <MainGrid>
        <LeftColumn>
          <SectionTitle>학습 행동 패턴</SectionTitle>

          <SubSection>
            <SubTitle>발화 유형 (Global Intent)</SubTitle>
            {globalIntentStats.length === 0 && (
              <SmallText>분석된 발화 유형 데이터가 아직 없습니다.</SmallText>
            )}
            {globalIntentStats.map((g) => (
              <BarRow key={g.key}>
                <BarLabel>{g.key}</BarLabel>
                <Bar>
                  <BarFill style={{ width: `${(g.ratio ?? 0) * 100}%` }} />
                </Bar>
                <BarValue>{Math.round((g.ratio ?? 0) * 100)}%</BarValue>
              </BarRow>
            ))}
          </SubSection>

          <SubSection>
            <SubTitle>질문 유형</SubTitle>
            {questionTypeStats.length === 0 && (
              <SmallText>질문 관련 발화가 거의 없습니다.</SmallText>
            )}
            {questionTypeStats.map((q) => (
              <BarRow key={q.key}>
                <BarLabel>{q.key}</BarLabel>
                <Bar>
                  <BarFill style={{ width: `${(q.ratio ?? 0) * 100}%` }} />
                </Bar>
                <BarValue>{Math.round((q.ratio ?? 0) * 100)}%</BarValue>
              </BarRow>
            ))}
          </SubSection>
        </LeftColumn>

        <RightColumn>
          <SectionTitle>강점 요약</SectionTitle>
          {strengths.length === 0 ? (
            <SmallText>분석된 강점 정보가 아직 충분하지 않습니다.</SmallText>
          ) : (
            <BulletList>
              {strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </BulletList>
          )}

          <SectionTitle>추천 학습 방향</SectionTitle>
          {suggestions.length === 0 ? (
            <SmallText>
              현재 데이터 기준으로 특별한 개선 제안은 없습니다.
            </SmallText>
          ) : (
            <BulletList>
              {suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </BulletList>
          )}

          {topAmbiguityTypes.length > 0 && (
            <>
              <SectionTitle>자주 나타나는 모호한 패턴</SectionTitle>
              <TagRow>
                {topAmbiguityTypes.map((a) => (
                  <Tag key={a.key}>
                    {a.key} ({a.count}회)
                  </Tag>
                ))}
              </TagRow>
            </>
          )}
        </RightColumn>
      </MainGrid>
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #232339;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  border-radius: 999px;
  background: #f3f3f3;
  padding: 2px;
`;

const ToggleButton = styled.button`
  border: none;
  background: ${({ active }) => (active ? "#3e3e3e" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : "#555")};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
`;

const PeriodText = styled.span`
  font-size: 12px;
  color: #666;
`;

const LoadingText = styled.p`
  font-size: 13px;
  color: #777;
  margin-top: 8px;
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 13px;
  margin-top: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 160px;
  background: #f7f8ff;
  border-radius: 12px;
  padding: 10px 12px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #777;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1.1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;
const RightColumn = styled.div``;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const SubSection = styled.div`
  margin-bottom: 14px;
`;

const SubTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const BarLabel = styled.div`
  font-size: 11px;
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bar = styled.div`
  flex: 1;
  height: 8px;
  background: #f1f3ff;
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: #6273ff;
`;

const BarValue = styled.div`
  font-size: 11px;
  width: 40px;
  text-align: right;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #777;
  margin: 4px 0 0;
`;

const BulletList = styled.ul`
  font-size: 13px;
  margin: 4px 0 8px 16px;
  padding: 0;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff1f1;
  color: #e05a5a;
`;
