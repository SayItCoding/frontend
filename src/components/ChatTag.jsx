// src/components/ChatTag.jsx
import styled from "styled-components";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ChatTag({
  label,
  color = "#2b65f5",
  icon = <IoCloseCircleOutline size={16} />, // ✅ 기본 아이콘 설정
  onIconClick = null, // 아이콘 클릭 시 동작
  onClick = null, // 태그 본체 클릭 시 동작
  style = {},
}) {
  return (
    <Tag
      $color={color}
      onClick={onClick}
      style={style}
      role="button"
      aria-label={`Tag ${label}`}
    >
      <Label>{label}</Label>
      {icon && (
        <IconWrap
          onClick={(e) => {
            e.stopPropagation(); // 태그 전체 클릭과 구분
            onIconClick?.(label);
          }}
        >
          {icon}
        </IconWrap>
      )}
    </Tag>
  );
}

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px 3px 9px;
  margin: 2px;
  font-size: 14px;
  border-radius: 8px;
  line-height: 1.4;
  font-weight: 500;
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}22;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  user-select: none;

  &:hover {
    background: ${(p) => p.$color}33;
    transform: translateY(-1px);
  }
`;

const Label = styled.span`
  white-space: nowrap;
`;

const IconWrap = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 0;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;
