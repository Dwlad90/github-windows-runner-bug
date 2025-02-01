import test from 'ava'

// import { transform } from '../dist/index.js'

const nodeVersion = process.version
console.log('Current Node.js version:', nodeVersion)

import { transform } from '../dist/index'

const rootDir = process.cwd()



test('sync function from native code', (t) => {
  const fixture = `
    import stylex from "@stylexjs/stylex";

    export const styles = stylex.create({
      default: {
        backgroundColor: "red",
        color: "blue",
      },
    });
  `

  const result = transform('page.tsx', fixture, {
    dev: false,
    genConditionalClasses: true,
    treeshakeCompensation: true,
    unstable_moduleResolution: {
      type: 'commonJS',
      rootDir,
    },
  })

  const expected = {
    code: 'import stylex from "@stylexjs/stylex";\nexport const styles = {\n    default: {\n        backgroundColor: "xrkmrrc",\n        color: "xju2f9n",\n        $$css: true\n    }\n};\n',
    metadata: {
      stylex: [
        [
          'xrkmrrc',
          {
            ltr: '.xrkmrrc{background-color:red}',
            rtl: null,
          },
          3000,
        ],
        [
          'xju2f9n',
          {
            ltr: '.xju2f9n{color:blue}',
            rtl: null,
          },
          3000,
        ],
      ],
    },
    map: '{"version":3,"sources":["page.tsx"],"names":[],"mappings":"AACI;AAEA;;;;;;EAKG"}',
  }

  t.deepEqual(result, expected)
})
