import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import Button from 'components/CustomButtons/Button';
import CustomInput from 'components/CustomInput/CustomInput';
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

export default function Login() {
    const classes = useStyles();

    return (
        <div className={classes.loginWrapper}>
            <GridContainer>
                <GridItem>
                    <form>
                        <Card>
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
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                id="password"
                                                label="Password"
                                                type="password"
                                                autocomplete="current-password"
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
}
