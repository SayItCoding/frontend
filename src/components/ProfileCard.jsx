// src/components/ProfileCard.jsx
import React from "react";
import styled from "styled-components";

export default function ProfileCard({ userName, loading }) {
  if (loading) {
    return <ProfileCardSkeleton />;
  }

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
  justify-content: center; /* 필요하면 flex-start로 변경 가능 */
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

const skeletonColor = "#eceff3";

const SkeletonBlock = styled.div`
  height: ${({ height }) => height || "16px"};
  width: ${({ width }) => width || "100%"};
  border-radius: 8px;
  background: ${skeletonColor};
`;

const SkeletonCircle = styled.div`
  width: ${({ size }) => size || "56px"};
  height: ${({ size }) => size || "56px"};
  border-radius: 50%;
  background: ${skeletonColor};
`;

// Skeleton Card 컴포넌트
function ProfileCardSkeleton() {
  return (
    <Card>
      <ProfileArea>
        <SkeletonCircle size="56px" />

        <div style={{ flex: 1 }}>
          <SkeletonBlock width="120px" height="20px" />
          <SkeletonBlock
            width="200px"
            height="14px"
            style={{ marginTop: "8px" }}
          />
        </div>
      </ProfileArea>
    </Card>
  );
}
