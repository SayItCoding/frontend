// MissionResultModal.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";

const successImg = "/assets/images/missionSucceed.png";
const failImg = "/assets/images/missionFailed.png";

export default function MissionResultModal({
  open,
  type, // "success" | "fail"
  title,
  description,
  hasStyleIssue, // true면 반복문 조언 보여주기
  onClose,
  onRetry,
  onNext,
}) {
  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isSuccess = type === "success";

  let defaultTitle = "";
  let defaultDesc = "";

  if (!isSuccess) {
    defaultTitle = "미션 실패";
    defaultDesc = "아쉽지만 괜찮아요. 어디서 막혔는지 같이 다시 살펴볼까요?";
  } else if (isSuccess && hasStyleIssue) {
    // 도달은 했는데 스타일 이슈 있음 (반복문 권장)
    defaultTitle = "미션 성공!";
    defaultDesc = "반복문을 사용해서 중복된 절차를 줄여보는 건 어떤가요?";
  } else {
    // 도달 + 스타일도 깔끔
    defaultTitle = "미션 성공!";
    defaultDesc = "너무 잘했어요! 다음 미션도 도전해 볼까요?";
  }

  const showStyleTip = isSuccess && hasStyleIssue;

  return (
    <Backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <ModalCard>
        <CloseButton onClick={onClose}>
          <IoClose size={24} />
        </CloseButton>
        <ImageArea $isSuccess={isSuccess}>
          <img
            src={isSuccess ? successImg : failImg}
            alt={isSuccess ? "성공" : "실패"}
          />
        </ImageArea>

        <Title>{title || defaultTitle}</Title>
        <Description>{description || defaultDesc}</Description>

        {/*showStyleTip && (
          <StyleTipBox>
            <TipTitle>반복문으로 더 깔끔하게 만들기</TipTitle>
            <TipText>
              같은 블록이 2번 이상 연달아 나온다면,
              <strong> 반복 블록</strong>을 써서 “~을 몇 번 반복하기” 형태로
              묶어 보세요. 나중에 코드(절차)를 읽기 훨씬 쉬워져요.
            </TipText>
          </StyleTipBox>
        )*/}

        <ButtonRow>
          {/* 공통 닫기 버튼 (필요 없으면 제거 가능) */}
          <GhostButton onClick={onClose}>닫기</GhostButton>
          {!isSuccess && onRetry && (
            <SecondaryButton onClick={onRetry}>다시 도전하기</SecondaryButton>
          )}

          {isSuccess && onNext && (
            <PrimaryButton onClick={onNext}>다음 미션으로</PrimaryButton>
          )}
        </ButtonRow>
      </ModalCard>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* 현재 ChatPane의 z-index가 1000
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 28px 24px 20px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
  }
`;

const ImageArea = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 4px;
  border-radius: 50%;
  background: ${({ $isSuccess }) =>
    $isSuccess ? "rgba(34, 197, 94, 0.12)" : "rgba(248, 113, 113, 0.12)"};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
  }
`;
const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const BaseButton = styled.button`
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  min-width: 120px;
`;

const PrimaryButton = styled(BaseButton)`
  background: #2563eb;
  color: #ffffff;

  &:hover {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #4b7bec;
  color: #ffffff;

  &:hover {
    background: #1d4ed8;
  }
`;

const GhostButton = styled(BaseButton)`
  background: #f3f4f6;
  color: #4b5563;

  &:hover {
    background: #e5e7eb;
  }
`;

const StyleTipBox = styled.div`
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  text-align: left;
`;

const TipTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const TipText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #4b5563;

  strong {
    font-weight: 700;
    color: #1d4ed8;
  }
`;
