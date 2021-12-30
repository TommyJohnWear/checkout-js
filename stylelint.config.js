module.exports = {
    extends: 'stylelint-config-standard',
    plugins: ['stylelint-order'],
    ignoreFiles: ['./node_modules/**/*.css', './node_modules/**/*.scss'],
    rules: {
        indentation: 2,
        'order/properties-alphabetical-order': true,
        'function-name-case': null,
        'at-rule-no-unknown': null,
        'at-rule-empty-line-before': null,
        'selector-type-no-unknown': null,
        'no-descending-specificity': null,
        'no-missing-end-of-source-newline': false,
    },
};
