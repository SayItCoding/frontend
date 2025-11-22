import React from "react";
import styled, { css } from "styled-components";
import { IoClose } from "react-icons/io5";

/**
 * props:
 *  - label: string
 */
export function ChatTag({ label }) {
  return (
    <TagWrap>
      <Label>{label}</Label>

      <RemoveButton
        type="button"
        aria-label="태그 삭제"
        data-allow-propagation="true"
      >
        <IoClose size={14} />
      </RemoveButton>
    </TagWrap>
  );
}

const TagWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 3px solid;
  border-color: #fff400;
  background: #ad3efb;
  color: #374151;
  font-size: 11px;
  max-width: 100%;
`;

const Label = styled.span`
  white-space: nowrap;
  color: #fce7fe;
`;

const RemoveButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 2px;
  border-radius: 999px;
  color: #fce7fe;

  &:hover {
    color: #111827;
  }
`;
