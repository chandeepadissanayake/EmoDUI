import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { EnvironmentConfiguration } from "config/environment.js"
import { AuthHelper } from 'helpers/auth.js';

import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import TextField from '@material-ui/core/TextField';

const styles = {
    loginWrapper: {

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
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
            <GridContainer>
                <GridItem>
                    <form>
                        <Card >
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Log In</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={20} sm={20} md={20}>
                                        <div>
                                            <TextField
                                                id="email"
                                                label="Email"
                                                type="text"
                                                fullWidth
                                                margin="dense"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                id="password"
                                                label="Password"
                                                type="password"
                                                autocomplete="current-password"
                                                fullWidth
                                                margin="dense"
                                            />
                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <div>
                                    <Button
                                        color='success'
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </form>
                </GridItem>
            </GridContainer>
        </div>
    );
};

Login.propTypes = {
    setAuthToken: PropTypes.func.isRequired
};
