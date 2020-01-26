# Gulp 4 Template
### In this boilerplate you can use:
- Javascript ES6 Modules - processing using Webpack 4;
- Sass - Bootstrap 4 grid-generator, a set of useful mixins out of the box;
- SVG-sprites;
- HTML - processing using Pug.js
### Available immediately:
- Trimmed version(**~40 kb** size) of Bootsrap 4 - grid, flex, spacing, display and text utilites, functions, mixins, variables;
- Without jQuery - instead in this template included small helper-class - Assistant;
- [gsap](https://github.com/greensock/GSAP) -  is a JavaScript library for building high-performance animations that work in every major browser.
- [RFS](https://github.com/twbs/rfs) - plugin for responsive font size;
- [svgxuse](https://github.com/Keyamoon/svgxuse) - simple polyfill that fetches external SVGs referenced in <use> elements when the browser itself fails to do so.
	### Installation:
	> Note: latest versions of **[node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)** must be installed!
	```sh
	$ git clone https://github.com/ToTibis/gulp4template FOLDER_NAME
	```
    ```sh
    $ cd FOLDER_NAME
    ```
	```sh
	$ npm i
	```
	### Usage
	For **development** mode:
	```sh
	$ gulp
	```
	For **production** mode:
	```sh
	$ gulp build
	```
	### Notes
	>SVG-sprites work and display content only on the server - local or any other. The reason this doesn't work is due to a security concern.