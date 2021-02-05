import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const styles = {
    loginWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }
};

const useStyles = makeStyles(styles);

export default function Login() {
    const classes = useStyles();

    return (
        <div className={classes.loginWrapper}>
            <h1>Please Log In</h1>
            <form>
                <label>
                    <p>Email</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}
