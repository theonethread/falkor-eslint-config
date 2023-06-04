// Use 'Ctrl+K Ctrl+8' to fold all '#region' markers (use 'Ctrl+K Ctrl+J' to unfold everything).

//cspell:ignore estree
const EsprimaAbstractSymbolTree = require("@typescript-eslint/typescript-estree");
const AstNodeTypes = EsprimaAbstractSymbolTree.AST_NODE_TYPES;

//------------------
// ESLint: Settings
//------------------
//#region

// this configuration should be imported in the root of the workspace
const root = true;

const env = {
    es6: true,
    browser: true
    // jest: true
};

const reportUnusedDisableDirectives = true;

const globals = {
    document: "readonly",
    navigator: "readonly",
    window: "readonly",
    console: "readonly",
    fetch: "readonly"
};

const plugins = [];

//#endregion

//----------------
// ESLint: Parser
//----------------
//#region

// use TypeScript plugin's parser
const parser = "@typescript-eslint/parser";

const parserOptions = {
    sourceType: "module",
    ecmaVersion: "latest",
    ecmaFeatures: { impliedStrict: true },
    "import/resolver": {
        // just use 'true' for now, the consumer configuration can override
        // this with the project's TypeScript configuration location:
        // 'typescript: { project: ./path/to/tsconfig.eslint.json }'
        // see: importSettings
        typescript: true,
        node: true
    }
};

//#endregion

//----------------
// ESLint: Ignore
//----------------
//#region

// ignore all '.js' and '.cjs' files for now, since those can only be
// configurations in our setup
const ignorePatterns = ["*.js", "*.cjs"];

//#endregion

//---------------
// ESLint: Rules
//---------------
// Recommended ECMAScript linting
//#region

// altered by TypeScript plugin's ruleset
// see: 'plugin:@typescript-eslint/eslint-recommended'
const eslintExtends = ["eslint:recommended"];

const eslintRules = {
    // nested callbacks should be avoided, was '10' by default, we could lower it even more
    "max-nested-callbacks": ["error", { max: 5 }],
    // allow async methods without 'await' present in their body, encourage future-proof async operation
    // see: '@typescript-eslint/require-await'
    "require-await": "off",
    // disallow unnecessary uses of '.call()' and '.apply()'
    "no-useless-call": "error",
    // base rule must be disabled in favor of TypeScript plugin's, as it can report incorrect errors
    // see: '@typescript-eslint/no-unused-expressions'
    "no-unused-expressions": "off",
    // base rule must be disabled in favor of TypeScript plugin's, as it can report incorrect errors
    // see: '@typescript-eslint/padding-line-between-statements'
    "padding-line-between-statements": "off",
    // debugger statements are not allowed to commit
    "no-debugger": "error",
    // require 'let' or 'const' instead of 'var'
    "no-var": "error",
    // require 'const' wherever possible
    "prefer-const": "error",
    // force usage of '===' and '!=='
    eqeqeq: ["error", "always"],
    // disallow literal value of the condition coming first while the variable being second
    yoda: "error",
    // require spaced comments, except for ASCII headings and compilation / tooling directives
    "spaced-comment": [
        "error",
        "always",
        {
            exceptions: ["-"],
            markers: [
                // VSCode
                "#region",
                "#endregion",
                // Prettier
                "prettier-ignore",
                "prettier-ignore-start",
                "prettier-ignore-end",
                // ESLint
                "eslint-disable-next-line",
                // CSpell
                "cspell:disable-next-line",
                "cspell:disable",
                "cspell:enable",
                // JSCC
                "#set",
                "#unset",
                "#if",
                "#ifset",
                "#ifnset",
                "#elif",
                "#else",
                "#endif",
                "#error"
            ]
        }
    ],
    // base rule must be disabled in favor of TypeScript plugin's, as it can report incorrect errors
    // see: '@typescript-eslint/no-shadow'
    "no-shadow": "off"

    // TO CONSIDER

    // only log through the dedicated logger, where this rule is suppressed
    // "no-console": "error",
    // base rule must be disabled in favor of TypeScript plugin's, as it can report incorrect errors
    // see: '@typescript-eslint/no-magic-numbers'
    // "no-magic-numbers": "off",
    // see: '@typescript-eslint/no-use-before-define'
    // "no-use-before-define": "off",
};

//#endregion

//-------------------------
// Plugin: ESLint Comments
//-------------------------
// Rules regarding usage of ESLint control comments
//#region

// just use the recommended settings, this will disallow disabling ESLint
// on whole files, and will match up disable & re-enable comments
const eslintCommentsExtends = ["plugin:eslint-comments/recommended"];

//#endregion

//----------------
// Plugin: Import
//----------------
// Rules regarding 'import' statements
//#region

plugins.push("import");

const importSettings = {
    "import/extensions": [".ts"],
    "import/parsers": { "@typescript-eslint/parser": [".ts"] },
    "import/resolver": {
        // just use 'true' for now, the consumer configuration can override
        // this with the project's TypeScript configuration location:
        // 'typescript: { project: ./path/to/tsconfig.eslint.json }'
        // see: parserOptions
        typescript: true,
        node: true
    }
};

const importExtends = ["plugin:import/recommended", "plugin:import/typescript"];

const importRules = {
    "import/no-unresolved": "error",
    // we prefer default exports used everywhere, optionally accompanied by other exports
    "import/prefer-default-export": "error"
};

//#endregion

//--------------------
// Plugin: TypeScript
//--------------------
// Strict TypeScript linting
//#region

plugins.push("@typescript-eslint");

const typescriptExtends = [
    // alters base ruleset
    // see: 'eslint-recommended'
    "plugin:@typescript-eslint/eslint-recommended",
    // TypeScript recommended ruleset
    "plugin:@typescript-eslint/recommended",
    // TypeScript extended ruleset with type checking (turns on parser features)
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // TypeScript strict ruleset
    "plugin:@typescript-eslint/strict"
];

const typescriptRules = {
    // base naming conventions
    "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["camelCase" /*, "PascalCase", "UPPER_CASE" */] },
        { selector: "function", format: ["camelCase" /*, "PascalCase"*/] },
        { selector: "interface", format: ["PascalCase"], custom: { regex: "^I[A-Z]", match: true } },
        { selector: "typeLike", format: ["PascalCase"] }
    ],
    // default parameter handling - probably already handled by TypeScript compiler
    "@typescript-eslint/default-param-last": "error",
    // allow async methods without 'await' preset in their body, encourage future-proof async operation
    // see: 'require-await'
    "@typescript-eslint/require-await": "off",
    // allow deleting properties of objects
    "@typescript-eslint/no-dynamic-delete": "off",
    // note: you must disable the base rule as it can report incorrect errors
    // see: 'no-unused-expressions'
    "@typescript-eslint/no-unused-expressions": "error",
    // forces to write out function return types (including ': void')
    "@typescript-eslint/explicit-function-return-type": "warn",
    // prefer no types used where possible, except in function parameters and object properties to
    // be able to maintain code consistency
    // eg. 'const f = (a: boolean, b: boolean = true) => a && b;' is valid this way
    "@typescript-eslint/no-inferrable-types": ["warn", { ignoreParameters: true, ignoreProperties: true }],
    // forces to explicitly set member accessibility ('public', 'protected', 'private') except on
    // constructors
    "@typescript-eslint/explicit-member-accessibility": ["warn", { overrides: { constructors: "no-public" } }],
    // prefer type-casting with 'as' instead '<type>' prefix
    "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as" }],
    // enforce the usage of custom types and 'unknown' instead 'any', except when dealing with rest
    // arguments in a method declaration
    "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
    // unused variable handling, they must be prefixed with '_'
    "@typescript-eslint/no-unused-vars": [
        // note: this reports imported classes unused, when they only appear in JSDoc documentation's
        // '@see {@link <class>}' tag, so for now those classes are imported as "underscored" aliases :/
        "error",
        {
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_"
        }
    ],
    // when blank lines are required / forbidden
    // see: 'padding-line-between-statements'
    "@typescript-eslint/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "any", prev: "export", next: "export" },
        { blankLine: "always", prev: ["class", "interface", "type"], next: "*" },
        { blankLine: "any", prev: "type", next: "type" },
        { blankLine: "always", prev: ["throw", "return"], next: "*" }
        // { blankLine: "always", prev: ["case", "default"], next: "*" }
    ],
    // forbid shadowing variables, parameters, and globals
    // see: 'no-shadow'
    "@typescript-eslint/no-shadow": [
        "error",
        {
            builtinGlobals: true,
            ignoreTypeValueShadow: false,
            ignoreFunctionTypeParameterNameValueShadow: false
        }
    ]

    // TO CONSIDER

    // disallow magic numbers, except in enums and readonly properties
    // see: 'no-magic-numbers'
    // "@typescript-eslint/no-magic-numbers": ["error", { ignoreEnums: true, ignoreReadonlyClassProperties: true, { ignore: [-1, 0, 1] } }],
    // do not use symbols before defined, except for functions for code readability
    // see: 'no-use-before-define'
    // "@typescript-eslint/no-use-before-define": ["warn", { functions: false /*, classes: true*/ }],
    // force consistent member declaration order
    // "@typescript-eslint/member-ordering": "warn"
};

//#endregion

//---------------
// Plugin: JSDoc
//---------------
// Rules regarding Typedoc documentation
//#region

plugins.push("jsdoc");

const jsdocSettings = {
    jsdoc: {
        mode: "typescript",
        tagNamePreference: {
            todo: {
                // disallow '@todo' tag in JSDoc
                // since no 'replacement' property in preference, this is an error
                message: "Please move TODO to line comment, so it will not appear in documentation."
            },
            ignore: {
                // disallow '@ignored' tag in JSDoc
                // since no 'replacement' property in preference, this is an error
                message: "Please move ignored content to line comment(s), so it will not appear in documentation."
            }
        }
    }
};

const jsdocExtends = ["plugin:jsdoc/recommended"];

const jsdocRules = {
    "jsdoc/check-syntax": "error",
    // disallow to align parameters and returns, we prefer single spacing
    "jsdoc/check-line-alignment": ["error", "never"],
    // handle JSDoc tag names
    "jsdoc/check-tag-names": [
        "error",
        // allow custom '@note' tag
        { definedTags: ["note"] }
    ],
    // handle optionally documented parameters
    "jsdoc/check-param-names": [
        "error",
        {
            // forces to explicitly document rest parameters
            checkRestProperty: true,
            // disallows documenting non-existing properties of destructed default
            // objects / rest parameters
            disableExtraPropertyReporting: true
        }
    ],
    // only allow company standards in author and license tags (as per NPM private settings)
    "jsdoc/check-values": [
        "error",
        {
            allowedLicenses: ["UNLICENSED", "MIT"]
        }
    ],
    // where to forcefully require documentation blocks
    "jsdoc/require-jsdoc": [
        "warn",
        {
            publicOnly: { esm: true, cjs: true, window: true },
            // prefer 'contexts' over 'require', since using the TS parser
            contexts: [
                AstNodeTypes.FunctionDeclaration,
                AstNodeTypes.ClassDeclaration,
                // AstNodeTypes.TSInterfaceDeclaration,
                AstNodeTypes.MethodDefinition,
                AstNodeTypes.TSAbstractMethodDefinition,
                // TsAstNodeTypes.PropertyDefinition,
                AstNodeTypes.TSAbstractPropertyDefinition
                // TsAstNodeTypes.VariableDeclaration
            ],
            exemptEmptyFunctions: true,
            exemptEmptyConstructors: true
        }
    ],
    // we require description in every possible documentation block
    "jsdoc/require-description": [
        "warn",
        {
            checkGetters: false,
            checkSetters: false,
            contexts: [
                AstNodeTypes.FunctionDeclaration,
                AstNodeTypes.ClassDeclaration,
                AstNodeTypes.TSInterfaceDeclaration,
                AstNodeTypes.MethodDefinition,
                AstNodeTypes.TSAbstractMethodDefinition,
                AstNodeTypes.PropertyDefinition,
                AstNodeTypes.TSAbstractPropertyDefinition,
                AstNodeTypes.VariableDeclaration
            ]
        }
    ],
    // descriptions must me complete sentences
    "jsdoc/require-description-complete-sentence": "warn",
    // force compact style, no empty JSDoc lines
    "jsdoc/newline-after-description": ["error", "never"],
    // documenting parameters are optional since using TypeScript
    "jsdoc/require-param": "off",
    // if documenting parameters, the name must be present everywhere
    "jsdoc/require-param-name": ["error", { contexts: ["any"] }],
    // do not report missing parameter types since using TypeScript
    // see: 'jsdoc/no-types'
    "jsdoc/require-param-type": "off",
    // if documenting parameters, there must be a description everywhere
    "jsdoc/require-param-description": ["error", { contexts: ["any"] }],
    // disallow hyphen between parameter tag and name
    "jsdoc/require-hyphen-before-param-description": ["error", "never"],
    // documenting return value is optional since using TypeScript
    "jsdoc/require-returns": "off",
    // do not report missing return value types since using TypeScript
    // see: 'jsdoc/no-types'
    "jsdoc/require-returns-type": "off",
    // if documenting return value, there must be a description everywhere
    "jsdoc/require-returns-description": ["error", { contexts: ["any"] }],
    // do not report missing '@throws' tag(s)
    "jsdoc/require-throws": "off",
    // disallow documenting parameter types in JSDoc since using TypeScript
    // see: 'jsdoc/require-param-type'
    // see: 'jsdoc/require-returns-type'
    "jsdoc/no-types": "error",
    // disallow documenting default values in JSDoc since using TypeScript
    "jsdoc/no-defaults": "error",
    // allow extra asterisk(s) after whitespace for use in Markdown formatting
    "jsdoc/no-multi-asterisks": ["error", { allowWhitespace: true }],
    // disallow indentation everywhere forcing the use of Markdown code blocks
    "jsdoc/check-indentation": ["error", { excludeTags: [] }]

    // TO CONSIDER

    // where to require examples in documentation blocks (off for now)
    // "jsdoc/require-example": ["off", { contexts: [] }],
};

//#endregion

//------------------
// Plugin: Prettier
//------------------
// This ruleset only disables formatting rules in ESLint and
// plugins known by it (including TypeScript).
//#region

const prettierExtends = ["prettier"];

//#endregion

//-------------------
// ESLint: Overrides
//-------------------
//#region

const overrides = [];

//#endregion

//------------------------------
// ESLint: Build final settings
//------------------------------
//#region

/** @type { import("eslint").Linter.BaseConfig } */
module.exports = {
    root,
    env,
    plugins,
    globals,
    parser,
    parserOptions,
    settings: {
        ...importSettings,
        ...jsdocSettings
    },
    reportUnusedDisableDirectives,
    ignorePatterns,
    // mind extends order!
    extends: [
        ...eslintExtends,
        ...eslintCommentsExtends,
        ...importExtends,
        // alters ESLint!
        ...typescriptExtends,
        ...jsdocExtends,
        // alters ESLint & TypeScript!
        ...prettierExtends
    ],
    rules: {
        ...eslintRules,
        ...importRules,
        ...jsdocRules,
        ...typescriptRules
    },
    overrides
};

//#endregion
