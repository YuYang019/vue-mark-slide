let highlighter;

exports.setHighlighter = func => (highlighter = func);

exports.highlight = (code, lang) => {
  return typeof highlighter === "function" ? highlighter(code, lang) : code;
};
