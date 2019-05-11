import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import copy from 'rollup-plugin-copy'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import path from 'path'
import dotenv from 'dotenv'

const production = !process.env.ROLLUP_WATCH
const dotenvResult = dotenv.config({
  path: path.resolve(__dirname, '.env')
})

if (dotenvResult.error) {
  process.exit(1)
}

process.env.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : production
  ? 'production'
  : 'development'

export default {
  input: path.resolve(__dirname, 'web/main.js'),
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: path.resolve(__dirname, 'public/bundle.js')
  },
  onwarn: () => {},
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write(path.resolve(__dirname, 'public/bundle.css'))
      }
    }),
    resolve({
      browser: true
    }),
    replace({
      ...getDotEnvConfig(['NODE_ENV'])
    }),
    json(),
    commonjs(),
    production && terser(),
    copy({
      'web/index.html': 'public/index.html',
      'web/global.css': 'public/global.css',
      'web/design.css': 'public/design.css',
      'node_modules/material-design-lite/material.min.css':
        'public/material-design-lite/material.min.css',
      'node_modules/material-design-lite/material.min.js':
        'public/material-design-lite/material.min.js',
      'node_modules/material-design-icons/iconfont':
        'public/fonts',
      'web/assets': 'public/'
    })
  ]
}

function getDotEnvConfig(keys) {
  return keys.reduce((retVal, key) => {
    return {
      ...retVal,
      [`process.env.${key}`]: `"${process.env[key]}"`
    }
  }, {})
}
