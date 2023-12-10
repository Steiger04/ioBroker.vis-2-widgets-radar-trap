module.exports = {
    semi: true,
    trailingComma: "all",
    singleQuote: false,
    printWidth: 80,
    useTabs: false,
    tabWidth: 4,
    endOfLine: "lf",
    arrowParens: [1, "as-needed"],
    overrides: [
        {
            files: "src-widgets/src/i18n/*.json",
            options: {
                useTabs: false,
            },
        },
    ],
};
