module.exports = {
    "env": {
        "commonjs": true,
        "node": true,
        "mocha": true,
        "mongo": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double",
            {"avoidEscape": true}
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off",
        "no-unused-vars": [
            "warn",
            {"argsIgnorePattern": "^_",
             "varsIgnorePattern": "^_"}
        ],
        "no-undef": "warn",
        "indent": "warn",
    },
    "globals": {
        "fs"         : true,
        "log"        : true,
        "GET"        : true,
        "millis"     : true,
        "http"       : true,
        "https"      : true,
    }
};
