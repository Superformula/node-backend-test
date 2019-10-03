import React from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  MaterialUiPickersDate
} from "@material-ui/pickers";
import { User } from "../../util";

interface Props {
  user: User;
  onUserChange: (user: User) => void;
}

const useStyles = makeStyles({
  formField: {},
  form: {
    display: "flex",
    flexDirection: "column"
  },
  logoInput: {
    display: "none"
  }
});

const UserForm: React.FC<Props> = ({ user, onUserChange }: Props) => {
  const classes = useStyles();
  const handleUserChange = ({ target: { name, value } }: any) =>
    onUserChange({
      ...user,
      [name]: value
    });
  const handleDobChange = (date: MaterialUiPickersDate) => {
    onUserChange({
      ...user,
      dob: date.toUTCString()
    });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="sm">
        <form className={classes.form}>
          <TextField
            id="name"
            name="name"
            label="Name"
            value={user.name}
            onChange={handleUserChange}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="dob"
            label="DOB"
            value={user.dob}
            onChange={handleDobChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
          <TextField
            id="address"
            name="address"
            label="Address"
            value={user.address}
            onChange={handleUserChange}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            value={user.description}
            onChange={handleUserChange}
          />
        </form>
      </Container>
    </MuiPickersUtilsProvider>
  );
};

export default UserForm;
