import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div>
      <Card>
        <CardHeader color="rose">
          <h4 className={classes.cardTitle}>What is EmoD</h4>
          <p>EmoD Description</p>
        </CardHeader>
        <CardBody>
          EmoD is a typical digital diary where users can keep track of their daily life. It will be a web application
          and will have the default CRUD operations on entries of the diary. Different users will have a separate
          private workspace on their own, and their personal entries will never be shared with anyone else using
          the application. EmoD also provides feedback on a sentimental/emotional basis on how the day was for
          you and remembered your emotional patterns each day. You will be informed about how ere days were
          when entering a new entry. This, as we suggest, will help to bring up a nostalgic atmosphere and cheer
          you up to build up a remarkable diary or consolidate yourself over past traumatic chronicles and write
          up a new, better record. You do not have to be unsettled to compile your day into words with EmoD;
          nobody else, not even your computer itself, will be capable of reading them alone without you.
        </CardBody>
      </Card>
    </div>
  );
}
