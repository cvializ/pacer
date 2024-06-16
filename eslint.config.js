// import config from "eslint-config-standard";


// export default [
//   ...[].concat(config),
// ];

import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,

    // {
    //     rules: {
    //         "no-unused-vars": "warn",
    //         "no-undef": "warn"
    //     }
    // }
    {
    languageOptions: {
            globals: {
                    ...globals.browser
            }
        }
    }
];
