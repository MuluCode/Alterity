import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --color-oxford-blue: #002147;
    --color-dark-blue:#03162b;
    --color-alabama-crimson: #AA001E;
    --color-light-grey: #656d75;
    --color-dark-grey: #35383b;
    --color-very-dark-grey: #202224;
    --color-beige: #E3C4A6;
    --color-dark-mustard:#b57207;
    --color-brown: #613d04;
    --font-logo: 'Mitr', sans-serif;
    --font-heading: 'Jura', sans-serif;
    --font-body: 'Special Elite', cursive;
    --padding-page: 24px;
  }
  /* http://meyerweb.com/eric/tools/css/reset/
      v2.0 | 20110126
      License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      font-size: 100%;
      vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
      display: block;
  }
  body {
      line-height: 1;
  }
  ol, ul {
      list-style: none;
  }
  blockquote, q {
      quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
      content: '';
      content: none;
  }
  h1,
h2,
h3,
label,
button {
  font-family: var(--font-heading);
  text-align: center;
	background: none;
	color: inherit;
	border: none;
	padding: 5px;
	cursor: pointer;
	outline: inherit;
  border-radius: 5px;
}
p,
a,
li,
blockquote,
input {
  font-family: var(--font-body);
}
  input, textarea {
    font-size: 24px;
    height: 42px;
    border: 2px solid var(--color-orange);
    border-radius: 4px;
    padding: 0 12px;
  }
`;
