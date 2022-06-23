import React, { ReactNode } from "react";
import styled from "@emotion/styled";

type CheckboxProps = {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
  color?: string;
  children?: ReactNode;
};

const Checkbox = (props: CheckboxProps) => (
  <CheckboxContainer onClick={props.onClick} disabled={props.disabled}>
    <CheckboxItem
      type={"checkbox"}
      disabled={props.disabled}
      color={props.color}
      checked={props.checked}
    />
    <CheckboxBodyContainer>{props.children}</CheckboxBodyContainer>
  </CheckboxContainer>
);

const CheckboxContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;

  opacity: ${(props) => props.disabled && "0.4"};

  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const CheckboxItem = styled.input<{ color?: string; disabled?: boolean }>`
  appearance: none;

  width: 1rem;
  height: 1rem;
  margin: 0;

  background-color: #fff;
  color: ${(props) => props.color || "#A0A0A0"};
  border: 2px solid ${(props) => props.color || "#A0A0A0"};
  border-radius: 0.12em;
  transform: translateY(-0.075em);

  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:checked {
    background-color: ${(props) => props.color || "#A0A0A0"};
  }
  transition: background-color 150ms;
`;

const CheckboxBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Checkbox;
