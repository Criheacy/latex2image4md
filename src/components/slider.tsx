import styled from "@emotion/styled";
import { ChangeEvent } from "react";

type SliderProps = {
  min: number;
  max: number;
  value: number;
  onChange?: (value: number) => void;
};

const Slider = (props: SliderProps) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange(+event.target.value);
  };

  return (
    <SliderItem
      type={"range"}
      min={props.min}
      max={props.max}
      value={props.value}
      onChange={onChange}
    />
  );
};

const SliderItem = styled.input<{ color?: string }>`
  appearance: none;
  width: 14rem;
  height: 2px;
  background-color: ${(props) => props.color || "#D0D0D0"};
  border-radius: 0.12em;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 0.12em;
    background: ${(props) => props.color || "#A0A0A0"};
    cursor: pointer;
  }
`;

export type { SliderProps };
export default Slider;
