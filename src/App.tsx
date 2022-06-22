import React, { ReactNode, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import { Transition } from "react-transition-group";
import { MdClose } from "react-icons/md";
import { convert } from "./converter/converter";

const App = () => {
  const [selectedStep, setSelectedStep] = useState(1);

  const [file, setFile] = useState<File | null>();
  const [fileContent, setFileContent] = useState<string | null>();
  const [loadingFileContent, setLoadingFileContent] = useState<boolean>();

  /* upload file button */
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const onUpload = () => {
    uploadInputRef.current?.click();
  };
  const onFileUploaded = (event: any) => {
    const targetFile = event.target.files[0] as File;
    setFile(targetFile);
    setLoadingFileContent(true);
    targetFile.text().then((content) => {
      setLoadingFileContent(false);
      setFileContent(content);
    });
  };

  /* remove file button */
  const onFileRemoved = () => {
    uploadInputRef.current && (uploadInputRef.current.value = "");
    setLoadingFileContent(false);
    setFile(null);
    setFileContent(null);
  };

  /* do conversion button */
  const onConvert = () => {
    if (file) {
      convert(file).then(() => {
        // TODO: should make a toast here
        console.log("Complete!");
      });
    }
  };

  return (
    <Container>
      <StepBoardContainer>
        <StepItem
          id={1}
          selected={selectedStep}
          title={"Select the Markdown File"}
          onSelect={() => {
            setSelectedStep(1);
          }}
          disabled={false}
        >
          <input
            ref={uploadInputRef}
            type={"file"}
            name={"file"}
            hidden
            accept={".md, text/markdown, text/plain"}
            onChange={onFileUploaded}
          />
          {loadingFileContent ? (
            <SoftTextContainer>
              <SoftText>Loading...</SoftText>
            </SoftTextContainer>
          ) : fileContent ? (
            <SoftTextContainer>
              <MdClose size={20} color={"#808080"} onClick={onFileRemoved} />
              <SoftText>{file?.name}</SoftText>
            </SoftTextContainer>
          ) : (
            <SoftButton onClick={onUpload}>Select File</SoftButton>
          )}
        </StepItem>

        <StepItem
          id={2}
          selected={selectedStep}
          title={"Edit Your Preferences"}
          onSelect={() => {
            setSelectedStep(2);
          }}
          disabled={!fileContent}
        >
          <SoftTextContainer>
            <SoftText>Under Development ...</SoftText>
          </SoftTextContainer>
        </StepItem>

        <StepItem
          id={3}
          selected={selectedStep}
          title={"Download the Converted File"}
          onSelect={() => {
            setSelectedStep(3);
          }}
          disabled={!fileContent}
        >
          <SoftButton onClick={onConvert}>Download</SoftButton>
        </StepItem>
      </StepBoardContainer>
      <PreviewContainer>
        <ReactMarkdown>{fileContent || ""}</ReactMarkdown>
      </PreviewContainer>
    </Container>
  );
};

type StepItemProps = {
  id: number;
  selected: number;
  title: string;
  disabled: boolean;
  onSelect: () => void;
  suffix?: ReactNode;
  children?: ReactNode;
};

const defaultStyle = {
  transition: `height 500ms ease-in-out`,
  height: "0%",
};

const transitionStyles = {
  entering: { height: "100%" },
  entered: { height: "100%" },
  exiting: { height: "0%" },
  exited: { height: "0%" },
  unmounted: { height: "0%" },
};

const StepItem = (props: StepItemProps) => {
  const onSelect = () => {
    if (!props.disabled) {
      props.onSelect();
    }
  };

  return (
    <>
      <StepItemTitleContainer disabled={props.disabled} onClick={onSelect}>
        <StepItemTitle color={props.disabled ? "#C0C0C0" : "#404040"}>
          <StepItemId>{props.id}</StepItemId>
          {props.title}
        </StepItemTitle>
        {props.suffix}
      </StepItemTitleContainer>
      <Transition in={props.selected === props.id} timeout={200}>
        {(state) => (
          <StepBodyContainer
            style={{ ...defaultStyle, ...transitionStyles[state] }}
          >
            {props.children}
          </StepBodyContainer>
        )}
      </Transition>
    </>
  );
};

const Container = styled.div`
  margin: 4rem auto;
  width: 54rem;
  height: 32rem;

  display: flex;
  flex-direction: row;
  box-shadow: rgba(0, 0, 0, 0.25) 0 25px 50px -12px;
`;

const StepBoardContainer = styled.div`
  width: 40%;
  height: 100%;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

const PreviewContainer = styled.div`
  width: 60%;

  overflow: hidden auto;
  overflow-wrap: break-word;
`;

const StepItemTitleContainer = styled.div<{ disabled?: boolean }>`
  height: 3.2rem;
  justify-content: space-between;
  align-items: center;

  display: flex;
  flex-direction: row;

  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  user-select: none;
  touch-action: manipulation;
`;

const StepItemTitle = styled.h1<{ color?: string }>`
  padding: 0;
  margin: 0;
  height: 100%;

  color: ${(props) => props.color || "#404040"};
  font-size: 1.25em;
  font-family: Roboto, sans-serif;
  font-weight: 500;

  display: flex;
  flex-direction: row;
  align-items: center;

  transition: color 150ms;
`;

const StepItemId = styled.div`
  padding: 0 1.4rem;
  height: 100%;

  line-height: 3.2rem;
  text-align: center;
`;

const StepBodyContainer = styled.div`
  transition: height 200ms ease-in-out;
  overflow: hidden;
`;

const SoftTextContainer = styled.div<{
  direction?: "row" | "column";
  gap?: string;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.gap || "0.5rem"};
`;

const SoftButton = styled.div`
  margin: 0.2rem auto;
  width: 8rem;
  padding: 0.6rem;

  border-radius: 0.5rem;
  white-space: nowrap;

  color: #404040;
  font-family: Roboto, sans-serif;
  font-size: 1.125em;
  font-weight: 500;

  line-height: 1.25rem;
  text-align: center;
  text-decoration: none #d1d5db solid;
  text-decoration-thickness: auto;
  box-shadow: rgba(0, 0, 0, 0.12) 0 4px 6px;

  cursor: pointer;
  user-select: none;
  touch-action: manipulation;

  transition: all 150ms;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0 8px 12px;
  }
`;

const SoftText = styled.div<{ color?: string }>`
  text-align: center;

  color: ${(props) => props.color || "#808080"};
  font-family: Roboto, sans-serif;
  font-size: 1.175em;
`;

export default App;
