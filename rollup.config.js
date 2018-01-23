import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  external: ['axios'],
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: 'lib/index.js',
      sourcemap: true
    },
    {
      format: 'es',
      file: 'es/index.js',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
  ]
};