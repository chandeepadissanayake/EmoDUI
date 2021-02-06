import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import axios from "axios";
import { EnvironmentConfiguration } from "config/environment.js";
import { AuthHelper } from 'helpers/auth.js';

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

const styles = {
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

export default function UserProfile() {
  const classes = useStyles();

  /* Notifications */

  const [notificationBarOpen, setNotificationBarOpen] = useState(false);
  const [notificationBarColor, setNotificationBarColor] = useState("primary");
  const [notificationMessage, setNotificationMessage] = useState("");

  function showNotification(color, message) {
    setNotificationBarColor(color);
    setNotificationMessage(message);
    setNotificationBarOpen(true);
  }

  /* Profile Details */
  const [viewUserEmail, setViewUserEmail] = useState("");
  const [viewUserFirstName, setViewUserFirstName] = useState("");
  const [viewUserLastName, setViewUserLastName] = useState("");

  function _refreshUser() {
    axios({
      url: EnvironmentConfiguration.API_HOST + "/user",
      method: "GET",
      headers: {
        "Authorization": AuthHelper.getAuthorizationHeader(),
      },
      mode: "no-cors",
    }).then(response => {
      if (response.status === 200) {
        let userData = response.data;

        setViewUserEmail(userData["email"]);
        setViewUserFirstName(userData["firstName"]);
        setViewUserLastName(userData["lastName"]);
      }
      else {
        showNotification("danger", "Failed to fetch user data with error code: " + response.status);
      }
    }, error => {
      showNotification("danger", "Failed to fetch user data with error code: " + error.response.status);
    });
  }

  React.useEffect(() => {
    _refreshUser();

    return;
  }, []);

  /* Profile Updating Details */

  function _updateProfile() {
    axios({
      url: EnvironmentConfiguration.API_HOST + "/user",
      method: "PUT",
      headers: {
        "Authorization": AuthHelper.getAuthorizationHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "no-cors",
      data: "firstName=" + viewUserFirstName + "&lastName=" + viewUserLastName,
    }).then(response => {
      if (response.status === 200) {
        showNotification("success", "Successfully updated.");
      }
      else {
        showNotification("danger", "Failed to update with status code: " + response.status);
      }
    }, error => {
      showNotification("danger", "Failure to update with error code: " + error.response.status);
    });
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    inputProps={{
                      value: viewUserEmail,
                      disabled: true
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    inputProps={{
                      value: viewUserFirstName,
                      onChange: (event) => {
                        setViewUserFirstName(event.target.value);
                      }
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    inputProps={{
                      value: viewUserLastName,
                      onChange: (event) => {
                        setViewUserLastName(event.target.value);
                      }
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={() => { _updateProfile(); }}>Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <Snackbar
        place="bc"
        color={notificationBarColor}
        icon={AddAlert}
        message={notificationMessage}
        open={notificationBarOpen}
        closeNotification={() => setNotificationBarOpen(false)}
        close
      />
    </div>
  );
}
