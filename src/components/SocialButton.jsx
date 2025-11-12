import React from "react";
import styled from "styled-components";

export default function SocialButton({
  iconSrc,
  children,
  onClick,
  $bg = "#fff",
  $color = "#111",
  $border,
}) {
  return (
    <Btn
      onClick={onClick}
      $bg={$bg}
      $color={$color}
      $border={$border}
      type="button"
    >
      {iconSrc && <img src={iconSrc} alt="" />}
      {children}
    </Btn>
  );
}

const Btn = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: ${(p) => (p.$border ? "1px solid #e5e7eb" : "none")};
  transition: transform 0.08s ease, filter 0.15s ease;
  img {
    position: absolute;
    left: 16px;
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  &:hover {
    filter: brightness(0.97);
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }
`;
