import React from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

type Props = { children: React.ReactNode };

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  main: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "scroll"
  }
});

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Header Typography</Typography>
          <Button color="inherit">Header Button</Button>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default View;
