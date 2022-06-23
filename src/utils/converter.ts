import JSZip from "jszip";
import { tex2svg } from "./tex2svg";
import { saveAs } from "file-saver";

const defaultOption = {
  em: 16,
  ex: 8,
  containerWidth: 640,
  display: true,
  scale: 1,
  lineWidth: 1000000,
};

const templates = [
  {
    regex: /\$\$.+?\$\$/gs,
    option: { display: true },
  },
  {
    regex: /\$.+?\$/g,
    option: { display: false },
  },
];

type ConverterConfig = {
  displayMode?: "auto" | "inline" | "block";
  scale?: number;
};

const convert = async (file: File, config?: ConverterConfig) => {
  const fileName = file.name.match(/.+(?=\..+)/g)![0];
  let fileContent = await file.text();

  const zip = new JSZip();
  const asset = zip.folder(`${fileName}-asset`); // TODO: make it customizable

  let imageId = 0;
  templates.forEach(({ regex, option }) => {
    fileContent = fileContent.replaceAll(regex, (substr) => {
      // render to image
      const tex = substr.replaceAll("$", "");
      const svgElement = tex2svg(tex, {
        ...defaultOption,
        ...option,

        // display mode
        ...(config?.displayMode === "inline"
          ? { display: false }
          : config?.displayMode === "block"
          ? { display: true }
          : {}),

        // scale
        ...(config?.scale ? { scale: config.scale } : {}),
      });

      // append image in zip folder
      imageId += 1;
      asset?.file(`${imageId}.svg`, svgElement.outerHTML);

      // replace svg image with the formula
      return `![${imageId}](./${fileName}-asset/${imageId}.svg)`;
    });
  });

  // save file name
  zip?.file(`${file.name}`, fileContent);

  await zip?.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${fileName}.zip`);
  });
};

export type { ConverterConfig };
export { convert };
