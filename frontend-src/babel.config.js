//порядок важен, т.к. языки в призме обрабатываются по этому порядку, а одни расширяют другие
//kotlin расширяет clike
//cpp раширят c, который расширяет clike
//поэтому clike вынесен в начало
const prismLangs = ['clike', 'python', 'javascript', 'java', 'php', 'go', 'swift', 'kotlin', 'c', 'cpp'];

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ["prismjs", {
      "languages": prismLangs,
      "plugins": ["line-numbers"],
    }]
  ]
};
