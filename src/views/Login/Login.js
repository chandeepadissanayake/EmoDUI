import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { EnvironmentConfiguration } from "config/environment.js";
import { AuthHelper } from 'helpers/auth.js';

const styles = {
    loginWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }
};

const useStyles = makeStyles(styles);

function loginUser(email, password, onSuccess, onFailure) {
    axios({
        url: EnvironmentConfiguration.API_HOST + "/auth/login",
        method: "POST",
        mode: "no-cors",
        data: "email=" + email + "&password=" + password,
    }).then(response => {
        onSuccess(response);
    }, (error) => {
        onFailure(error.response);
    });
}

export default function Login({ setAuthToken, stateUpdater }) {
    const classes = useStyles();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        loginUser(email, password, (response) => {
            if (response.status === 200) {
                const token = response.data;
                setAuthToken(token);
                stateUpdater(AuthHelper.isAuthed());
            }
            else {
                alert("Unexpected Error. Try again later.");
            }
        }, (errorResponse) => {
            if (errorResponse.status === 401) {
                alert("Invalid Username/Password.");
            }
            else {
                alert("Unexpected Error. Try again later.");
            }
        });
    }

    return (
        <div className={classes.loginWrapper}>
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

Login.propTypes = {
    setAuthToken: PropTypes.func.isRequired
};
