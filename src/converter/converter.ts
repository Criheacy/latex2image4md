import JSZip from "jszip";
import { tex2svg } from "../utils/tex2svg";
import { saveAs } from "file-saver";

const defaultOption = {
  em: 16,
  ex: 8,
  containerWidth: 579,
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

const convert = async (file: File) => {
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

export { convert };
