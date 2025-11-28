// MissionResultModal.jsx
import React, { useEffect } from "react";
import styled from "styled-components";

export default function MissionResultModal({
  open,
  type, // "success" | "fail"
  title,
  description,
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

  const defaultTitle = isSuccess ? "미션 성공!" : "미션 실패";
  const defaultDesc = isSuccess
    ? "너무 잘했어요! 다음 미션도 도전해 볼까요?"
    : "아쉽지만 괜찮아요. 어디서 막혔는지 같이 다시 살펴볼까요?";

  return (
    <Backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <ModalCard>
        <IconArea isSuccess={isSuccess}>{isSuccess ? "🎉" : "💭"}</IconArea>

        <Title>{title || defaultTitle}</Title>
        <Description>{description || defaultDesc}</Description>

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
`;

const IconArea = styled.div`
  font-size: 40px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isSuccess }) =>
    isSuccess ? "rgba(34, 197, 94, 0.12)" : "rgba(248, 113, 113, 0.12)"};
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
