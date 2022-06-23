import App from "./app";
import styled from "@emotion/styled";
import LaTeX from "./latex.svg";
import { BsGithub, BsVectorPen } from "react-icons/bs";
import { VscMarkdown } from "react-icons/vsc";
import { HiOutlineMail } from "react-icons/hi";

const Main = () => {
  return (
    <Container>
      <TitleContainer>
        <img src={LaTeX} alt={"LaTeX"} width={"128px"} />
        to
        <BsVectorPen size={"48"} />
        Image for <VscMarkdown size={"72"} />
      </TitleContainer>
      <DescriptionContainer>
        Convert LaTeX formulas in your markdown file into images,
      </DescriptionContainer>
      <DescriptionContainer>
        to publish your markdown files in a more compatible way!
      </DescriptionContainer>
      <AppContainer>
        <App />
      </AppContainer>
      <TextGroup>
        Made by Criheacy
        <Link href={"mailto: criheacy2001@gmail.com"}>
          <HiOutlineMail
            size={"20px"}
            href={"mailto: criheacy2001@gmail.com"}
          />
        </Link>
      </TextGroup>
      <Link href={"https://github.com/Criheacy/latex2image4md"}>
        <TextGroup>
          <BsGithub />
          Criheacy/latex2image4md
        </TextGroup>
      </Link>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
`;

const TitleContainer = styled.h1`
  margin-bottom: 0.8rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  gap: 0.6rem;
`;

const DescriptionContainer = styled.h2`
  margin: 0.3rem 0;

  color: #c0c0c0;
  font-family: Roboto sans-serif;
  font-size: 1.15rem;
  font-weight: normal;
`;

const AppContainer = styled.div`
  margin: 1rem 0 4rem 0;
`;

const TextGroup = styled.h2`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  align-items: center;

  margin: 0.3rem 0;

  color: #c0c0c0;
  font-family: Roboto sans-serif;
  font-size: 1.15rem;
  font-weight: normal;
`;

const Link = styled.a`
  display: flex;
  align-items: end;
  color: #c0c0c0;
`;

export default Main;
