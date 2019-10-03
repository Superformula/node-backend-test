import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import UserForm from "./UserForm";
import { apiDomain, User } from "../../util";

interface Props {
  user: User;
  onCancel: () => void;
  onUserUpdate: (user: User) => void;
}

const EditUserCard: React.FC<Props> = ({
  user: propsUser,
  onCancel,
  onUserUpdate
}: Props) => {
  const [user, setUser] = useState({ ...propsUser });
  const { id } = user;
  const handleUserSubmission = async () => {
    try {
      const updateUserResponse = await window.fetch(`${apiDomain}/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" }
      });
      const updateUserResponseBody = await updateUserResponse.json();

      if (updateUserResponseBody.id) {
        onCancel();
        onUserUpdate(updateUserResponseBody as User);
      } else {
        console.log(updateUserResponseBody);
      }
    } catch (e) {}
  };

  return (
    <Card>
      <CardHeader title="Edit User" />
      <CardContent>
        <UserForm user={user} onUserChange={setUser} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add" onClick={handleUserSubmission}>
          <SaveIcon />
        </IconButton>
        <IconButton aria-label="add" onClick={onCancel}>
          <CancelIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default EditUserCard;
