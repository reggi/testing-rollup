import babel from 'rollup-plugin-babel'

export default {
  entry: './01.js',
  plugins: [ babel() ],
  format: 'es6'
}
