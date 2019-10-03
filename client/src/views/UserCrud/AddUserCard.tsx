import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/PersonAdd";
import UserForm from "./UserForm";
import { apiDomain, defaultUser, User } from "../../util";

interface Props {
  onUserAdd: (user: User) => void;
}

const AddUserCard: React.FC<Props> = ({ onUserAdd }: Props) => {
  const [user, setUser] = useState({ ...defaultUser });
  const { name, address, dob, description } = user;
  const handleUserSubmission = async () => {
    try {
      const createUserResponse = await window.fetch(`${apiDomain}/user`, {
        method: "post",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" }
      });
      const createUserResponseBody = await createUserResponse.json();

      if (createUserResponseBody.id) {
        onUserAdd(createUserResponseBody as User);
        setUser({ ...defaultUser });
      } else {
        console.log(createUserResponseBody);
      }
    } catch (e) {}
  };

  const isAddButtonDisabled = !name || !address || !dob || !description;

  return (
    <Card>
      <CardHeader title="Add User" />
      <CardContent>
        <UserForm user={user} onUserChange={setUser} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add"
          disabled={isAddButtonDisabled}
          onClick={handleUserSubmission}
        >
          <AddIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default AddUserCard;
