export const codeGithubTheme = `/*
github.com style (c) Vasily Polovnyov <vast@whiteants.net>
*/

/* 代码块样式 - 需要添加 #mdb 前缀以匹配包装后的 HTML | Code Block Style - #mdb prefix required to match wrapped HTML */
#mdb .hljs {
  display: block;
  overflow-x: auto;
  padding: 16px;
  color: #333;
  background: #f8f8f8;
}

#mdb .hljs-comment,
#mdb .hljs-quote {
  color: #998;
  font-style: italic;
}

#mdb .hljs-keyword,
#mdb .hljs-selector-tag,
#mdb .hljs-subst {
  color: #333;
  font-weight: bold;
}

#mdb .hljs-number,
#mdb .hljs-literal,
#mdb .hljs-variable,
#mdb .hljs-template-variable,
#mdb .hljs-tag .hljs-attr {
  color: #008080;
}

#mdb .hljs-string,
#mdb .hljs-doctag {
  color: #d14;
}

#mdb .hljs-title,
#mdb .hljs-section,
#mdb .hljs-selector-id {
  color: #900;
  font-weight: bold;
}

#mdb .hljs-subst {
  font-weight: normal;
}

#mdb .hljs-type,
#mdb .hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}

#mdb .hljs-tag,
#mdb .hljs-name,
#mdb .hljs-attribute {
  color: #000080;
  font-weight: normal;
}

#mdb .hljs-regexp,
#mdb .hljs-link {
  color: #009926;
}

#mdb .hljs-symbol,
#mdb .hljs-bullet {
  color: #990073;
}

#mdb .hljs-built_in,
#mdb .hljs-builtin-name {
  color: #0086b3;
}

#mdb .hljs-meta {
  color: #999;
  font-weight: bold;
}

#mdb .hljs-deletion {
  background: #fdd;
}

#mdb .hljs-addition {
  background: #dfd;
}

#mdb .hljs-emphasis {
  font-style: italic;
}

#mdb .hljs-strong {
  font-weight: bold;
}

/* Imageflow CSS */
#mdb .imageflow-layer1 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  /* white-space: normal; */
  border: 0px none;
  padding: 0px;
  overflow: hidden;
}

#mdb .imageflow-layer2 {
  white-space: nowrap;
  width: 100%;
  overflow-x: scroll;
}

#mdb .imageflow-layer3 {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  vertical-align: top;
  width: 80%;
  margin-right: 10px;
  flex-shrink: 0;
}

#mdb .imageflow-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

#mdb .imageflow-caption {
  text-align: center;
  margin-top: 0px;
  padding-top: 0px;
  color: #888;
}
`;
