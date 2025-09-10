/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order', 'stylelint-no-unsupported-browser-features'],
  customSyntax: 'postcss-styled-syntax',
  ignoreFiles: ['**/node_modules/**', 'src/styles/resetCss/resetCss.ts'],
  rules: {
    'value-keyword-case': null,
    'function-name-case': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'alpha-value-notation': null,
    'color-function-notation': null,
    'function-no-unknown': null,
    'block-no-empty': null,
    'no-descending-specificity': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'no-empty-source': null,
    'no-invalid-double-slash-comments': null,
    'comment-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'nesting-selector-no-missing-scoping-root': null,
    'media-feature-range-notation': null,

    /* --- Perf / robustness --- */
    // 1) Block render-blocking @import in CSS
    'at-rule-disallowed-list': ['import'],

    // 2) Keep CSS small & selector matching cheap
    'selector-max-compound-selectors': 4, // e.g. .a .b .c .d is OK; deeper gets warned
    'selector-max-combinators': 3, // limit descendant/child/sibling chains
    'selector-max-specificity': '0,4,0', // avoid overly specific selectors
    'selector-max-class': 4,
    'selector-max-id': 0,
    'selector-max-universal': 0,
    'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class'] }],

    // 3) Avoid bloat/mistakes that inflate bundles
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] },
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-no-important': true,

    // 4) Tame nesting (important for CSS-in-JS too)
    'max-nesting-depth': 3,

    // 6) Warn on features that require heavy fallbacks (keeps CSS lean)
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignorePartialSupport: true,
      },
    ],
  },
}
