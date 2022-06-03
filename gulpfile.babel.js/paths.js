const
  srcPath = './src',
  buildPath = './public',
  imageFormats = '{png,jpg,jpeg,gif,svg}',
  fontFormats = '{eot,ttf,otf,otc,ttc,woff,woff2,svg}'
;

export default {
  build: buildPath,

  pug: {
    src: `${srcPath}/pug/pages/*.pug`,
    watch: `${srcPath}/pug/**/*.pug`,
    dest: buildPath
  },
  scss: {
    src: `${srcPath}/scss/**/*.scss`,
    watch: `${srcPath}/scss/**/*.scss`,
    dest: `${buildPath}/css`
  },
  js: {
    src: `${srcPath}/js/main.js`,
    watch: `${srcPath}/js/**/*.js`,
    dest: `${buildPath}/js`
  },
  img: {
    src: `${srcPath}/img/images/**/*.${imageFormats}`,
    watch: `${srcPath}/img/images/**/*.${imageFormats}`,
    dest: `${buildPath}/img`
  },
  font: {
    src: `${srcPath}/font/**/*.${fontFormats}`,
    watch: `${srcPath}/font/**/*.${fontFormats}`,
    dest: `${buildPath}/font`
  },
  svg: {
    src: `${srcPath}/img/sprite/*.svg`,
    watch: `${srcPath}/img/sprite/*.svg`,
    dest: `${buildPath}/img`
  }
};
