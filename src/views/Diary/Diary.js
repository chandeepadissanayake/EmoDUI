import React, { useState } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js"
import Table from "components/Table/Table.js";
import CustomInput from "components/CustomInput/CustomInput";

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

import NoteAdd from "@material-ui/icons/NoteAdd";
import ViewDayIcon from '@material-ui/icons/ViewDay';

import modalStyle from "assets/jss/material-dashboard-react/modalStyle.js";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import DialogContentText from '@material-ui/core/DialogContentText';
import { KeyboardDatePicker } from "@material-ui/pickers";

import TextField from '@material-ui/core/TextField';
import moment from 'moment';

import axios from "axios";

import { EnvironmentConfiguration } from "config/environment.js";
import { AuthHelper } from 'helpers/auth.js';

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
    },
};

const useStyles = makeStyles(styles);
const useModalStyles = makeStyles(modalStyle);

export default function Dashboard() {
    const classes = useStyles();
    const classesModals = useModalStyles();

    /* Notifications */

    const [notificationBarOpen, setNotificationBarOpen] = useState(false);
    const [notificationBarColor, setNotificationBarColor] = useState("primary");
    const [notificationMessage, setNotificationMessage] = useState("");

    function showNotification(color, message) {
        setNotificationBarColor(color);
        setNotificationMessage(message);
        setNotificationBarOpen(true);
    }

    /* Entry View Dialogs */

    const [modalViewEntryOpen, setModalViewEntryOpen] = useState(false);
    const [viewEntryID, setViewEntryID] = useState("");
    const [viewEntryDate, setViewEntryDate] = useState(new Date());
    const [viewEntryTitle, setViewEntryTitle] = useState("");
    const [viewEntryEntry, setViewEntryEntry] = useState("");
    const [viewEntryEmotion, setViewEntryEmotion] = useState("");

    /* Fetch and Display the Current Entries. */

    const [diaryEntries, setDiaryEntries] = useState(new Array(0));

    function _refreshEntries() {
        axios({
            url: EnvironmentConfiguration.API_HOST + "/diary/entries",
            method: "GET",
            headers: {
                "Authorization": AuthHelper.getAuthorizationHeader(),
            },
            params: {
                "sorted": true,
            },
            mode: "no-cors",
        }).then(response => {
            if (response.status === 200) {
                setDiaryEntries(response.data.map((kvEntry) => {
                    return [
                        kvEntry["date"],
                        kvEntry["title"],
                        kvEntry["entry"],
                        kvEntry["emotion"],
                        <Button id={kvEntry["id"]} color="primary" round onClick={() => {
                            setViewEntryID(kvEntry["id"]);
                            setViewEntryDate(kvEntry["date"]);
                            setViewEntryTitle(kvEntry["title"]);
                            setViewEntryEntry(kvEntry["entry"]);
                            setViewEntryEmotion(kvEntry["emotion"]);

                            setModalViewEntryOpen(true);
                        }}>
                            <ViewDayIcon />View Entry
                        </Button>
                    ]
                }));
            }
            else {
                showNotification("warning", "Error Fetching Diary Entries with response code: " + response.status);
            }
        }, error => {
            showNotification("warning", "Error Fetching Diary Entries with response code: " + error.response.status);
        });
    }

    React.useEffect(() => {
        _refreshEntries();

        return;
    }, [_refreshEntries]);

    /* Entry Update Functions */

    function _updateEntry() {
        let entryID = viewEntryID;
        let payloadDate = moment(viewEntryDate).format("yyyy-MM-DD");
        let payloadTitle = viewEntryTitle;
        let payloadEntry = viewEntryEntry;

        axios({
            url: EnvironmentConfiguration.API_HOST + "/diary/entries/" + entryID,
            method: "PUT",
            headers: {
                "Authorization": AuthHelper.getAuthorizationHeader(),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            mode: "no-cors",
            data: "date=" + payloadDate + "&title=" + payloadTitle + "&entry=" + payloadEntry,
        }).then(response => {
            if (response.status === 200) {
                showNotification("success", "Successfully updated.");
                _refreshEntries();
            }
            else {
                showNotification("danger", "Failed to update with status code: " + response.status);
            }
        }, error => {
            showNotification("danger", "Failure to update with error code: " + error.response.status);
        });
    }

    /* New Entry Model and its Requests. */

    const [modalNewEntryOpen, setModalNewEntryOpen] = useState(false);

    const [newEntryDate, setNewEntryDate] = useState(new Date());
    const [newEntryTitle, setNewEntryTitle] = useState();
    const [newEntryEntry, setNewEntryEntry] = useState();

    function _resetNewEntry() {
        setNewEntryDate(new Date());
        setNewEntryTitle(null);
        setNewEntryEntry(null);
    }

    function _submitNewEntry() {
        let payloadDate = moment(newEntryDate).format("yyyy-MM-DD");
        let payloadTitle = newEntryTitle;
        let payloadEntry = newEntryEntry;

        axios({
            url: EnvironmentConfiguration.API_HOST + "/diary/entries",
            method: "POST",
            headers: {
                "Authorization": AuthHelper.getAuthorizationHeader(),
                "Content-Type": "application/json",
            },
            mode: "no-cors",
            data: JSON.stringify({
                date: payloadDate,
                title: payloadTitle,
                entry: payloadEntry,
            }),
        }).then(response => {
            if (response.status === 200) {
                setModalNewEntryOpen(false);
                _resetNewEntry();
                showNotification("success", "Successfully added.");
            }
            else {
                showNotification("danger", "Failure with error code: " + response.status);
            }
        }, error => {
            showNotification("danger", "Failure with error code: " + error.response.status);
        });
    }

    return (
        <div>
            <div>
                <Button color="info" round onClick={() => setModalNewEntryOpen(true)}><NoteAdd /> New Entry</Button>
                <Dialog
                    classes={{
                        root: classesModals.center,
                        paper: classesModals.modal
                    }}
                    open={modalNewEntryOpen}
                    onClose={() => setModalNewEntryOpen(false)}
                    aria-labelledby="modal-slide-title"
                    aria-describedby="modal-slide-description"
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classesModals.modalHeader}
                    >
                        <IconButton
                            className={classesModals.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => setModalNewEntryOpen(false)}
                        >
                            <Close className={classesModals.modalClose} />
                        </IconButton>
                        <h4 className={classesModals.modalTitle}>New Diary Entry</h4>
                    </DialogTitle>

                    <DialogContent
                        id="modal-slide-description"
                        className={classesModals.modalBody}
                    >
                        <DialogContentText>Entry Date</DialogContentText>
                        <KeyboardDatePicker
                            clearable
                            value={newEntryDate}
                            onChange={date => {
                                setNewEntryDate(date);
                            }}
                            format="yyyy-MM-DD"
                        />

                        <CustomInput
                            labelText="Give it a Proper Title *"
                            id="float"
                            value={newEntryTitle}
                            inputProps={{
                                onChange: (event) => {
                                    setNewEntryTitle(event.target.value);
                                }
                            }}
                            formControlProps={{
                                fullWidth: true
                            }}
                            required
                        />

                        <TextField
                            id="filled-multiline-static"
                            label="Your Experiences"
                            multiline
                            rows={5}
                            defaultValue={newEntryEntry}
                            fullWidth
                            onChange={event => {
                                setNewEntryEntry(event.target.value);
                            }}
                            required
                        />
                    </DialogContent>

                    <DialogActions
                        className={classesModals.modalFooter + " " + classesModals.modalFooterCenter}
                    >
                        <Button color="success" onClick={() => {
                            _submitNewEntry();
                        }}>
                            Create
                        </Button>
                        <Button onClick={() => {
                            setModalNewEntryOpen(false);
                            _resetNewEntry();
                        }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div>
                <Dialog
                    classes={{
                        root: classesModals.center,
                        paper: classesModals.modal
                    }}
                    open={modalViewEntryOpen}
                    onClose={() => setModalViewEntryOpen(false)}
                    aria-labelledby="modal-slide-title"
                    aria-describedby="modal-slide-description"
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classesModals.modalHeader}
                    >
                        <IconButton
                            className={classesModals.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => setModalViewEntryOpen(false)}
                        >
                            <Close className={classesModals.modalClose} />
                        </IconButton>
                        <h4 className={classesModals.modalTitle}>Diary Entry</h4>
                    </DialogTitle>

                    <DialogContent
                        id="modal-slide-description"
                        className={classesModals.modalBody}
                    >
                        <CustomInput
                            labelText="Entry ID"
                            id="float1"
                            inputProps={{
                                value: viewEntryID,
                                disabled: true
                            }}
                            formControlProps={{
                                fullWidth: true
                            }}
                            required
                        />

                        <DialogContentText>Entry Date</DialogContentText>
                        <KeyboardDatePicker
                            clearable
                            value={viewEntryDate}
                            onChange={date => {
                                setViewEntryDate(date);
                            }}
                            format="yyyy-MM-DD"
                        />

                        <CustomInput
                            labelText="Title *"
                            id="float2"
                            inputProps={{
                                value: viewEntryTitle,
                                onChange: (event) => {
                                    setViewEntryTitle(event.target.value);
                                }
                            }}
                            formControlProps={{
                                fullWidth: true
                            }}
                            required
                        />

                        <TextField
                            id="filled-multiline-static"
                            label="Entry"
                            multiline
                            rows={5}
                            defaultValue={viewEntryEntry}
                            fullWidth
                            onChange={event => {
                                setViewEntryEntry(event.target.value);
                            }}
                            required
                        />

                        <CustomInput
                            labelText="Emotion"
                            id="float3"
                            inputProps={{
                                value: viewEntryEmotion,
                                disabled: true
                            }}
                            formControlProps={{
                                fullWidth: true
                            }}
                            required
                        />
                    </DialogContent>

                    <DialogActions className={classesModals.modalFooter + " " + classesModals.modalFooterCenter}>
                        <Button color="success" onClick={() => {
                            _updateEntry();
                        }}>Update</Button>
                        <Button onClick={() => {
                            setModalViewEntryOpen(false);
                        }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <br />
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="success">
                            <h4 className={classes.cardTitleWhite}>Your Recent Entries</h4>
                            <p className={classes.cardCategoryWhite}>
                                You can find your recent entries here.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="success"
                                tableHead={["Date", "Title", "Entry", "Emotion", ""]}
                                tableData={diaryEntries}
                            />
                        </CardBody>
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
