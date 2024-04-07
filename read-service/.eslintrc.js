module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "plugins": [
        "import"
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        // Ensures an imported module can be resolved to an actual file
        "import/no-unresolved": ["error", { commonjs: true, amd: true }],
    
        // Ensures named imports correspond to a named export in the remote file
        "import/named": "error",
    
        // Ensures a default export is present, given a default import
        "import/default": "error",
    
        // Ensures imported namespaces contain dereferenced properties as they are dereferenced
        "import/namespace": "error",
    
        // Ensures all exports appear after imports
        "import/export": "error",
    
        // Reports use of an exported name as the locally imported name of a default export
        "import/no-named-as-default": "error",
    
        // Reports use of a renamed import of a default export when the original name matches a named export
        "import/no-named-as-default-member": "error",
    
        // Reports duplicate imports
        "import/no-duplicates": "error",
    
        // Reports the use of variables or functions before they were defined
        "no-undef": "error",
    
        // Warns when you define a variable but never use it
        "no-unused-vars": "warn",
    
        // Warns when you use console (like console.log)
        "no-console": "off",
    
        // Requires the use of === and !==
        "eqeqeq": "error",
    
        // Disallow the use of alert, confirm, and prompt
        "no-alert": "warn",
    
        // Disallow use of arguments.caller or arguments.callee
        "no-caller": "error",
    
        // Disallow null comparisons without type-checking operators
        "no-eq-null": "error",
    
        // Disallow the use of eval()
        "no-eval": "error",
    
        // Warn against function declarations and expressions inside loop statements
        "no-loop-func": "warn"
    }
}
