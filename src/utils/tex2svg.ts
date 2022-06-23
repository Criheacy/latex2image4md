type RenderOption = {
  em?: number;
  ex?: number;
  containerWidth?: number;
  display?: boolean;
  scale?: number;
  lineWidth?: number;
};

type MathJaxProps = {
  tex2svg: (tex: string, renderOptions?: RenderOption) => HTMLElement;
};

const tex2svg = (tex: string, renderOptions?: RenderOption) => {
  const svg = (MathJax as unknown as MathJaxProps).tex2svg(tex, renderOptions)
    .firstElementChild as SVGSVGElement;

  svg.setAttribute(
    "width",
    ex2px(svg.getAttribute("width") || "", renderOptions?.scale)
  );
  svg.setAttribute(
    "height",
    ex2px(svg.getAttribute("height") || "", renderOptions?.scale)
  );
  svg.removeAttribute("style");
  svg.removeAttribute("focusable");
  svg.removeAttribute("role");

  return svg;
};

const defaultScale = 8;

/* https://viereck.ch/latex-to-svg/ */
const ex2px = (value: string, scaling: number = defaultScale) => {
  const match = value.match(/^(.*)ex$/);
  return match ? (parseFloat(match[1]) * scaling).toFixed(3) + "px" : value;
};

export type { RenderOption };
export { tex2svg, defaultScale };
