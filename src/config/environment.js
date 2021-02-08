
const KEY_CONFIG_DEVELOPMENT = "development";
const KEY_CONFIG_PRODUCTION = "production";

const _KEY_CONFIG_API_URL = "API_URL";

const CONFIGS = {
    [KEY_CONFIG_DEVELOPMENT]: {
        [_KEY_CONFIG_API_URL]: "http://localhost:8080/api"
    },
    [KEY_CONFIG_PRODUCTION]: {
        [_KEY_CONFIG_API_URL]: "https://emod-api.herokuapp.com"
    },
};

export class EnvironmentConfiguration {

    static get API_HOST() {
        return CONFIGS[process.env.NODE_ENV][_KEY_CONFIG_API_URL];
    }

}
