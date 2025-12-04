// src/components/StudyInsightSection.jsx
import React from "react";
import styled from "styled-components";

// 백엔드에서 오는 globalIntent / questionType / ambiguityType 키 → 한글 라벨 매핑
const GLOBAL_INTENT_LABEL_MAP = {
  TASK_CODE: "절차 작성",
  QUESTION: "질문",
  SMALL_TALK: "잡담/기타 대화",
  OTHER: "기타",
  UNKNOWN: "알 수 없음",
};

const QUESTION_TYPE_LABEL_MAP = {
  WHY_WRONG_MISSION: "미션 해결을 위한 질문",
  WHY_WRONG_GENERAL: "미션 개념에 대한 질문",
  HOW_TO_FIX: "절차 수정 질문",
  WHAT_IS_CONCEPT: "코딩 개념 설명 질문",
  DIFFERENCE_CONCEPT: "코딩 개념간 차이 질문",
  REQUEST_HINT: "미션 힌트 요청",
  REQUEST_EXPLANATION: "현재 절차 설명",
  REQUEST_FEEDBACK: "현재 절차 피드백 요청",
  OTHER: "기타",
  UNKNOWN: "알 수 없음",
};

const AMBIGUITY_TYPE_LABEL_MAP = {
  REPEAT_COUNT_MISSING: "반복 횟수 누락",
  RANGE_SCOPE_VAGUE: "범위 지시 모호",
  DIRECTION_VAGUE: "방향 지시 모호",
  COUNT_OR_LOOP_AMBIGUOUS: "동작 횟수 or 반복 횟수 모호",
  TARGET_BLOCK_VAGUE: "지시 대상 모호",
  LOOP_SCOPE_VAGUE: "반복 범위 모호",
  OTHER: "기타",
  UNKNOWN: "알 수 없음",
};

// 매핑 헬퍼 (매핑에 없으면 원래 key 그대로 노출)
const getGlobalIntentLabel = (key) => GLOBAL_INTENT_LABEL_MAP[key] ?? key;
const getQuestionTypeLabel = (key) => QUESTION_TYPE_LABEL_MAP[key] ?? key;
const getAmbiguityLabel = (key) => AMBIGUITY_TYPE_LABEL_MAP[key] ?? key;

export default function StudyInsightSection({
  summary,
  loading,
  error,
  mode, // 'week' | 'overall'
  onChangeMode,
}) {
  // 로딩 중: 최종 레이아웃 기준 스켈레톤
  if (loading && !summary) {
    return (
      <Card>
        {/* 상단 헤더 스켈레톤 */}
        <HeaderRow>
          <Title>학습 분석</Title>
          <RightControls>
            <SkeletonToggleGroup>
              <SkeletonPill width="64px" height="22px" />
              <SkeletonPill width="72px" height="22px" />
            </SkeletonToggleGroup>
            <SkeletonBlock width="90px" height="14px" />
          </RightControls>
        </HeaderRow>

        {/* 요약 숫자 4개 스켈레톤 */}
        <SummaryRow>
          {Array.from({ length: 4 }).map((_, idx) => (
            <StatBox key={idx}>
              <SkeletonBlock width="60%" height="12px" />
              <SkeletonBlock
                width="40%"
                height="20px"
                style={{ marginTop: 6 }}
              />
            </StatBox>
          ))}
        </SummaryRow>

        {/* 추천 학습 방향 스켈레톤 */}
        <SectionTitle>추천 학습 방향</SectionTitle>
        <SubSection>
          <SkeletonBulletList>
            <SkeletonBlock width="85%" height="13px" />
            <SkeletonBlock width="70%" height="13px" />
          </SkeletonBulletList>
        </SubSection>

        {/* 메인 3컬럼 스켈레톤: 입력 / 질문 / 모호 유형 */}
        <MainGrid>
          {/* 1열: 입력 유형 */}
          <InsightBlock>
            <SectionTitle>입력 유형</SectionTitle>
            <SubSection>
              {Array.from({ length: 3 }).map((_, idx) => (
                <BarRow key={`g-${idx}`}>
                  <SkeletonBlock width="80px" height="11px" />
                  <SkeletonBarTrack>
                    <SkeletonBarFill />
                  </SkeletonBarTrack>
                  <SkeletonBlock width="32px" height="11px" />
                </BarRow>
              ))}
            </SubSection>
          </InsightBlock>

          {/* 2열: 질문 유형 */}
          <InsightBlock>
            <SectionTitle>질문 유형</SectionTitle>
            <SubSection>
              {Array.from({ length: 3 }).map((_, idx) => (
                <BarRow key={`q-${idx}`}>
                  <SkeletonBlock width="80px" height="11px" />
                  <SkeletonBarTrack>
                    <SkeletonBarFill />
                  </SkeletonBarTrack>
                  <SkeletonBlock width="32px" height="11px" />
                </BarRow>
              ))}
            </SubSection>
          </InsightBlock>

          {/* 3열: 모호한 표현 유형 + 태그 */}
          <InsightBlock>
            <SectionTitle>모호한 표현 유형</SectionTitle>
            <SubSection>
              {Array.from({ length: 3 }).map((_, idx) => (
                <BarRow key={`a-${idx}`}>
                  <SkeletonBlock width="90px" height="11px" />
                  <SkeletonBarTrack>
                    <SkeletonBarFill />
                  </SkeletonBarTrack>
                  <SkeletonBlock width="40px" height="11px" />
                </BarRow>
              ))}

              <TagRow>
                <SkeletonTag />
                <SkeletonTag />
                <SkeletonTag />
              </TagRow>
            </SubSection>
          </InsightBlock>
        </MainGrid>
      </Card>
    );
  }

  // 에러 상태
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
    strengths = [], // 구조 유지용
    suggestions = [],
  } = summary;

  // 모호 패턴 비율 계산용 (count 합)
  const totalAmbiguityCount = topAmbiguityTypes.reduce(
    (sum, a) => sum + (a.count ?? 0),
    0
  );

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
        </RightControls>
      </HeaderRow>

      {/* 요약 숫자 4개 */}
      <SummaryRow>
        <StatBox>
          <StatLabel>분석된 발화 수</StatLabel>
          <StatValue>{totalUserMessages ?? 0}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>모호한 표현 비율</StatLabel>
          <StatValue>{Math.round((ambiguityRate ?? 0) * 100)}%</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>반복 의도 비율</StatLabel>
          <StatValue>{Math.round((loopIntentRate ?? 0) * 100)}%</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>조건 의도 비율</StatLabel>
          <StatValue>0%</StatValue>
        </StatBox>
      </SummaryRow>

      {/* 추천 학습 방향 - 전체 폭 */}
      <SectionTitle>추천 학습 방향</SectionTitle>
      <SubSection>
        {suggestions.length === 0 ? (
          <SmallText>학습 미션을 진행하고, 추천 학습을 받아보세요!</SmallText>
        ) : (
          <BulletList>
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </BulletList>
        )}
      </SubSection>

      {/* 메인 3컬럼 영역: 입력 유형 / 질문 유형 / 모호한 표현 유형 */}
      <MainGrid>
        <InsightBlock>
          <SectionTitle>입력 유형</SectionTitle>
          <SubSection>
            {globalIntentStats.length === 0 && (
              <SmallText>분석된 발화 유형 데이터가 아직 없습니다.</SmallText>
            )}
            {globalIntentStats.map((g) => (
              <BarRow key={g.key}>
                <BarLabel>{getGlobalIntentLabel(g.key)}</BarLabel>
                <Bar>
                  <BarFill style={{ width: `${(g.ratio ?? 0) * 100}%` }} />
                </Bar>
                <BarValue>{Math.round((g.ratio ?? 0) * 100)}%</BarValue>
              </BarRow>
            ))}
          </SubSection>
        </InsightBlock>

        <InsightBlock>
          <SectionTitle>모호한 표현 유형</SectionTitle>
          <SubSection>
            {topAmbiguityTypes.length === 0 && (
              <SmallText>
                아직 모호한 표현 패턴이 충분히 누적되지 않았어요.
              </SmallText>
            )}
            {topAmbiguityTypes.map((a) => {
              const ratio =
                totalAmbiguityCount > 0
                  ? (a.count / totalAmbiguityCount) * 100
                  : 0;
              return (
                <BarRow key={a.key}>
                  <BarLabel>{getAmbiguityLabel(a.key)}</BarLabel>
                  <Bar>
                    <BarFill style={{ width: `${ratio}%` }} />
                  </Bar>
                  <BarValue>{a.count}회</BarValue>
                </BarRow>
              );
            })}

            {topAmbiguityTypes.length > 0 && (
              <TagRow>
                {topAmbiguityTypes.map((a) => (
                  <Tag key={`tag-${a.key}`}>{getAmbiguityLabel(a.key)}</Tag>
                ))}
              </TagRow>
            )}
          </SubSection>
        </InsightBlock>

        <InsightBlock>
          <SectionTitle>질문 유형</SectionTitle>
          <SubSection>
            {questionTypeStats.length === 0 && (
              <SmallText>미션을 해결하면서 다양한 질문을 해보세요.</SmallText>
            )}
            {questionTypeStats.map((q) => (
              <BarRow key={q.key}>
                <BarLabel>{getQuestionTypeLabel(q.key)}</BarLabel>
                <Bar>
                  <BarFill style={{ width: `${(q.ratio ?? 0) * 100}%` }} />
                </Bar>
                <BarValue>{Math.round((q.ratio ?? 0) * 100)}%</BarValue>
              </BarRow>
            ))}
          </SubSection>
        </InsightBlock>
      </MainGrid>
    </Card>
  );
}

/* 스타일 정의 */

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 24px 26px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #232339;
  letter-spacing: -0.02em;
`;

const PeriodText = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #9ea2b3;
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
  background: #f5f6ff;
  padding: 2px;
`;

const ToggleButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;

  background: ${({ active }) => (active ? "#6273ff" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : "#6770b7")};

  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? "#5564e6" : "#ecefff")};
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 13px;
  margin-top: 8px;
`;

// 상단 요약 카드들
const SummaryRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 150px;
  background: #f7f8ff;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid #edf0ff;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #777;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  color: #3840a6;
`;

// 메인 3컬럼 그리드
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const InsightBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #232339;
`;

const SubSection = styled.div`
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fafbff;
  border: 1px solid #f0f2ff;
`;

const SubSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const BarLabel = styled.div`
  font-size: 13px;
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555b8c;
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
  background: linear-gradient(90deg, #6273ff, #9f6cff);
`;

const BarValue = styled.div`
  font-size: 11px;
  width: 40px;
  text-align: right;
  color: #555b8c;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #777;
  margin: 4px 0 0;
`;

const BulletList = styled.ul`
  font-size: 13px;
  margin: 4px 0 4px 16px;
  padding: 0;
`;

// 태그
const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 4px 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fff8f8, #ffe2e2);
  color: #d84343;
  border: 1px solid rgba(216, 67, 67, 0.3);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 2px 6px rgba(216, 67, 67, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

// 스켈레톤
const skeletonColor = "#eceff3";

const SkeletonBlock = styled.div`
  border-radius: 999px;
  height: ${({ height }) => height || "14px"};
  width: ${({ width }) => width || "100%"};
  background: ${skeletonColor};
`;

const SkeletonToggleGroup = styled.div`
  display: inline-flex;
  gap: 4px;
`;

const SkeletonPill = styled(SkeletonBlock)`
  border-radius: 999px;
`;

const SkeletonBarTrack = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #f1f3ff;
  overflow: hidden;
`;

const SkeletonBarFill = styled.div`
  width: 70%;
  height: 100%;
  border-radius: inherit;
  background: ${skeletonColor};
`;

const SkeletonBulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 0 4px;
`;

const SkeletonTag = styled.div`
  width: 80px;
  height: 22px;
  border-radius: 999px;
  background: ${skeletonColor};
`;
