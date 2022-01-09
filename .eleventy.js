// require Luxon for date conversion
const { DateTime } = require("luxon");

// SVG sprite plugin
const svgSprite = require("eleventy-plugin-svg-sprite");

module.exports = function(eleventyConfig) {

  eleventyConfig.setBrowserSyncConfig({
		files: './_site/assets/css/**/*.css',
	});

  // SVG sprite
  eleventyConfig.addPlugin(svgSprite, {
    path: "./_src/assets/icons",
    globalClasses: "icon",
  });

  return {
    // set the input and output directories
    dir: {
      input: '_src',
      output: '_site'
    },
    // set default template engine to Nunjucks
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };

};