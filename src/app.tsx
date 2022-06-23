import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { Transition } from "react-transition-group";
import { MdClose } from "react-icons/md";
import { convert, ConverterConfig } from "./utils/converter";
import Checkbox from "./components/checkbox";
import BlockFormula from "./block-formula-example.svg";
import InlineFormula from "./inline-formula-example.svg";
import { useImmer } from "use-immer";
import { TitleBlock } from "./components/block";
import Slider from "./components/slider";
import { tex2svg, defaultScale } from "./utils/tex2svg";
import Markdown from "./components/markdown";

const App = () => {
  const [selectedStep, setSelectedStep] = useState(1);

  const [file, setFile] = useState<File | null>();
  const [fileContent, setFileContent] = useState<string | null>();
  const [loadingFileContent, setLoadingFileContent] = useState<boolean>();

  // converter configs
  const [config, setConfig] = useImmer<ConverterConfig>({
    displayMode: "auto",
    scale: defaultScale,
  });

  /* upload file button */
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const onUpload = () => {
    uploadInputRef.current?.click();
  };
  const onFileUploaded = (event: any) => {
    const targetFile = event.target.files[0] as File;
    setFile(targetFile);
    setLoadingFileContent(true);

    // load file content
    targetFile.text().then((content) => {
      setLoadingFileContent(false);
      setFileContent(content);

      // turn to next step
      setSelectedStep(2);
    });
  };

  /* remove file button */
  const onFileRemoved = () => {
    uploadInputRef.current && (uploadInputRef.current.value = "");
    setLoadingFileContent(false);
    setFile(null);
    setFileContent(null);
  };

  /* change scaling config*/
  const scalePreviewRef = useRef<HTMLDivElement>(null);
  const onScaleChanged = useCallback(
    (value: number) => {
      const svg = tex2svg(
        `${value}\\mathrm\{px\}=1\\mathrm\{em\}` +
          (value === defaultScale ? "\\space \\mathrm{(default)}" : ""),
        {
          scale: value,
        }
      );

      if (scalePreviewRef.current) {
        scalePreviewRef.current.innerHTML = "";
        scalePreviewRef.current.appendChild(svg);
        setConfig((config) => {
          config.scale = value;
        });
      }
    },
    [setConfig, scalePreviewRef]
  );
  // initialize
  useEffect(() => {
    onScaleChanged(defaultScale);
  }, []);

  /* do conversion button */
  const onConvert = () => {
    if (file) {
      convert(file, config).then(() => {
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
            <Flexbox>
              <SoftText>Loading...</SoftText>
            </Flexbox>
          ) : fileContent ? (
            <Flexbox>
              <MdClose size={20} color={"#808080"} onClick={onFileRemoved} />
              <SoftText>{file?.name}</SoftText>
            </Flexbox>
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
          <TitleBlock title={"Rendering Mode"}>
            <Flexbox direction={"column"} alignment={"start"}>
              <Checkbox
                checked={config.displayMode === "auto"}
                onClick={() =>
                  setConfig((config) => {
                    config.displayMode = "auto";
                  })
                }
              >
                <SoftText alignment={"start"} size={"1em"}>
                  auto (by formula type)
                </SoftText>
              </Checkbox>
              <Flexbox direction={"row"} gap={"2rem"}>
                <Checkbox
                  checked={config.displayMode === "inline"}
                  onClick={() =>
                    setConfig((config) => {
                      config.displayMode = "inline";
                    })
                  }
                >
                  <Image
                    width={"52px"}
                    src={InlineFormula}
                    alt={"inline-formula"}
                  />
                </Checkbox>
                <Checkbox
                  checked={config.displayMode === "block"}
                  onClick={() =>
                    setConfig((config) => {
                      config.displayMode = "block";
                    })
                  }
                >
                  <Image
                    width={"24px"}
                    src={BlockFormula}
                    alt={"block-formula"}
                  />
                </Checkbox>
              </Flexbox>
            </Flexbox>
          </TitleBlock>
          <TitleBlock title={"Image Scaling"}>
            <Slider
              min={4}
              max={32}
              value={config.scale || defaultScale}
              onChange={onScaleChanged}
            />
            <ScalePreviewContainer ref={scalePreviewRef} />
          </TitleBlock>
          <TitleBlock title={"Output Format"}>
            <Flexbox direction={"column"} alignment={"start"} gap={"0.6rem"}>
              <Checkbox checked={true}>
                <SoftText alignment={"start"} size={"1em"}>
                  SVG (vector graphics)
                </SoftText>
              </Checkbox>
              <Checkbox checked={false} disabled={true}>
                <SoftText alignment={"start"} size={"1em"}>
                  PNG (raster graphics)
                </SoftText>
              </Checkbox>
            </Flexbox>
          </TitleBlock>
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
        <Markdown>{fileContent || ""}</Markdown>
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
  margin: 0 auto;
  padding: 1rem 0.4rem;
  width: 54rem;
  height: 32rem;

  background-color: #fefefe;

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
  padding: 0 1.4rem;

  transition: height 200ms ease-in-out;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Flexbox = styled.div<{
  alignment?: "center" | "start" | "end" | "stretch";
  direction?: "row" | "column";
  gap?: string;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: center;
  align-items: ${(props) => props.alignment || "center"};
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

const SoftText = styled.div<{
  size?: string;
  color?: string;
  alignment?: "center" | "start" | "end" | "stretch";
}>`
  text-align: ${(props) => props.alignment || "center"};

  color: ${(props) => props.color || "#808080"};
  font-family: Roboto, sans-serif;
  font-size: ${(props) => props.size || "1.175em"};

  transition: color 100ms;
`;

const ScalePreviewContainer = styled.div`
  margin-top: 1rem;
  width: 14rem;
  height: 3rem;
  overflow: hidden;
`;

const Image = styled.img``;

export default App;
