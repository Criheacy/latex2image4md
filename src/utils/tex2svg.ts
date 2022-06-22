type RenderOption = {
  em: number;
  ex: number;
  containerWidth: number;
  display: boolean;
  scale: number;
  lineWidth: number;
};

type MathJaxProps = {
  tex2svg: (tex: string, renderOptions: RenderOption) => HTMLElement;
};

const tex2svg = (tex: string, renderOptions: RenderOption) => {
  return (MathJax as unknown as MathJaxProps).tex2svg(tex, renderOptions)
    .firstElementChild as SVGSVGElement;
};

export type { RenderOption };
export { tex2svg };
