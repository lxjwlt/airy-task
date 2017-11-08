const pkg = require('./package.json');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonJS = require('rollup-plugin-commonjs');

module.exports = {
    input: 'src/index.js',
    output: {
        file: `dist/${pkg.name}.js`,
        format: 'umd',
        name: 'aTask'
    },
    plugins: [
        commonJS(),
        nodeResolve()
    ]
};
