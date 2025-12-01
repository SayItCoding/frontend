import React from "react";
import styled from "styled-components";

export default function ProfileCard({
  userName,
  solvedMissions,
  totalMissions,
  accuracy,
  aiFixRate,
}) {
  return (
    <Card>
      <ProfileArea>
        <Avatar />
        <div>
          <Name>{userName}님</Name>
          <ProfileSub>
            오늘도 한 문장씩 말하면서 코딩 실력을 키워볼까요?
          </ProfileSub>
        </div>
      </ProfileArea>

      <ProfileStatsRow>
        <ProfileStat>
          <ProfileStatLabel>완료한 미션</ProfileStatLabel>
          <ProfileStatValue>
            {solvedMissions}/{totalMissions}
          </ProfileStatValue>
        </ProfileStat>
        <ProfileStat>
          <ProfileStatLabel>정답률</ProfileStatLabel>
          <ProfileStatValue>{accuracy}%</ProfileStatValue>
        </ProfileStat>
        <ProfileStat>
          <ProfileStatLabel>AI 피드백 해결률</ProfileStatLabel>
          <ProfileStatValue>{aiFixRate}%</ProfileStatValue>
        </ProfileStat>
      </ProfileStatsRow>
    </Card>
  );
}

const Card = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;

  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 너무 가운데면 flex-start로 바꿔도 됨 */
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #dfe3ff;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "👤";
    font-size: 28px;
  }
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const ProfileSub = styled.div`
  font-size: 13px;
  color: #8b8fa8;
  margin-top: 4px;
`;

const ProfileStatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const ProfileStat = styled.div`
  min-width: 120px;
`;

const ProfileStatLabel = styled.div`
  font-size: 12px;
  color: #9ea2b3;
  margin-bottom: 4px;
`;

const ProfileStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #4f5cff;
`;
