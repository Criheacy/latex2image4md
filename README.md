# LaTeX to Image for Markdown

A serverless web application to convert LaTeX formula in markdown content into rendered image.

## [Project Site](https://latex2image4md.criheacy.com/)

## Motivation

Some markdown editors and platforms don't support LaTeX formula rendering, they just display it in plain text. For example, here is a LaTeX equation surrounded by a pair of `$` signs:

```text
$$
\int_a^bf(x)\mathrm{d}x = \lim_{\lambda\rightarrow 0}\sum_{i=1}^nf(\xi_i)\Delta x_i
$$
```

As you can see, it is pretty hard to read, especially for those who are not familiar with the LaTeX syntax. But if it was displayed in the correct format by pictures:

![example-1](./README-asset/example-1.svg)

It would become a lot easier to be recognized. So if you just want to make it more convenient for readers, you might as well convert these formulas into pictures.