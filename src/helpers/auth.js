import React from 'react';
import { useState } from 'react';
import Login from "views/Login/Login.js";

export class AuthHelper {

    static tryAuth(successAuthResponse) {
        const [authToken, setAuthToken] = useState();
        if (!authToken) {
            return <Login setAuthToken={setAuthToken} />
        }
        else {
            return successAuthResponse;
        }
    }

    static loginIfNot() {
        const [authToken, setAuthToken] = useState();

        if (!authToken) {
            return <Login setAuthToken={setAuthToken} />
        }
        else {
            return null;
        }
    }

}
