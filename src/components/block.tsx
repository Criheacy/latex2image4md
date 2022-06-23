import { ReactNode } from "react";
import styled from "@emotion/styled";

type TitleBlockProps = {
  title?: string;
  color?: string;
  children?: ReactNode;
};

const TitleBlock = (props: TitleBlockProps) => {
  return (
    <Container>
      {props.title && <TitleContainer>{props.title}</TitleContainer>}
      {props.children && <BodyContainer>{props.children}</BodyContainer>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const TitleContainer = styled.div`
  color: #c0c0c0;

  font-size: 1em;
  font-family: Roboto, sans-serif;
`;

const BodyContainer = styled.div`
  padding: 0 0.6rem;
`;

export type { TitleBlockProps };
export { TitleBlock };
