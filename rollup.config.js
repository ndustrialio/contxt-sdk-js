import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  external: ['axios'],
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: 'lib/index.js'
    },
    {
      format: 'es',
      file: 'es/index.js'
    }
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  sourcemap: true
};
