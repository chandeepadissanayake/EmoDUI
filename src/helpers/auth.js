const _SESSION_KEY_AUTH_TOKEN = "auth_token";

export class AuthHelper {

    static isAuthed() {
        return sessionStorage.getItem(_SESSION_KEY_AUTH_TOKEN) != null;
    }

    static unAuth() {
        sessionStorage.removeItem(_SESSION_KEY_AUTH_TOKEN);
    }

    static setAuthToken(authToken) {
        sessionStorage.setItem(_SESSION_KEY_AUTH_TOKEN, authToken);
    }

}
