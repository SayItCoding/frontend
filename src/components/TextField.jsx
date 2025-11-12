import React from "react";
import styled from "styled-components";

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  error,
  autoComplete,
}) {
  return (
    <Field>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && <Err id={`${name}-err`}>{error}</Err>}
    </Field>
  );
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 14px;
    color: #334155;
  }
  input {
    height: 48px;
    padding: 0 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    &:focus {
      outline: 3px solid #93c5fd;
      outline-offset: 2px;
      border-color: #93c5fd;
    }
  }
`;
const Err = styled.div`
  color: #b00020;
  font-size: 12px;
`;
