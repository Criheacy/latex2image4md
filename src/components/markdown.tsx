import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";

type MarkdownProps = {
  children: string;
};

const Markdown = (props: MarkdownProps) => {
  return (
    <StyledMarkdown>
      <ReactMarkdown>{props.children}</ReactMarkdown>
    </StyledMarkdown>
  );
};

const StyledMarkdown = styled.div`
  color: #404040;
  & > p {
    font-family: Roboto sans-serif;
    color: #606060;
  }
`;

export default Markdown;
