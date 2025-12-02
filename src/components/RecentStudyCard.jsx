import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function RecentStudyCard({ recentMissions }) {
  const navigate = useNavigate();

  const handleClick = (missionId) => {
    navigate(`/mission?missionId=${missionId}`);
  };

  return (
    <SectionCard>
      <HeaderRow>
        <Title>최근 학습 기록</Title>
        <SubTitle>
          어떤 미션에서 어떤 개념을 연습했는지 한눈에 볼 수 있어요.
        </SubTitle>
      </HeaderRow>

      <List>
        {recentMissions.map((m) => (
          <Item key={m.id} onClick={() => handleClick(m.id)}>
            <Left>
              <ItemTitle>{m.title}</ItemTitle>
              <Meta>
                <Date>{m.date}</Date>
                <Tag>{m.skillTag}</Tag>
              </Meta>
            </Left>
            <Status $status={m.status}>{m.status}</Status>
          </Item>
        ))}
      </List>
    </SectionCard>
  );
}

const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  width: 100%;
`;

const HeaderRow = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #8e92b0;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  padding: 12px 14px;
  border-radius: 16px;
  background: #f7f8ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #2d3050;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Date = styled.div`
  font-size: 11px;
  color: #a0a3c0;
`;

const Tag = styled.div`
  padding: 3px 8px;
  border-radius: 999px;
  background: #fff4e5;
  color: #c97a2c;
  font-size: 11px;
`;

const Status = styled.div`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  white-space: nowrap;
  ${({ $status }) =>
    $status === "성공"
      ? `
    background: #e7f9f1;
    color: #2c9a5b;
  `
      : `
    background: #fff1f1;
    color: #e05a5a;
  `}
`;
