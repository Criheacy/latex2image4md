import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { convert } from "./converter/converter";

const App = () => {
  const [fileContent, setFileContent] = useState<string>();

  const changeHandler = (event: any) => {
    const file = event.target.files[0] as File;
    file.text().then(setFileContent);

    convert(file).then(() => console.log("Success!"));
  };

  return (
    <div>
      <input
        type={"file"}
        name={"file"}
        accept={".md, text/markdown, text/plain"}
        onChange={changeHandler}
      />
      <ReactMarkdown>{fileContent || ""}</ReactMarkdown>
    </div>
  );
};

export default App;
