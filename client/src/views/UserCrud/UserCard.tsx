import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import EditUserCard from "./EditUserCard";
import { apiDomain } from "../../util";

interface Props {
  user: User;
  onUserDelete: (user: User) => void;
  onUserUpdate: (user: User) => void;
}

interface User {
  id: string;
  name: string;
  dob: string;
  address: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

const useStyles = makeStyles({});

const UserCard: React.FC<Props> = ({
  user,
  onUserDelete,
  onUserUpdate
}: Props) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const { id, name, dob, address, description, createdAt, updatedAt } = user;
  const handleDeleteClick = async () => {
    try {
      const deleteUserResponse = await window.fetch(`${apiDomain}/user/${id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" }
      });
      const deleteUserResponseBody = await deleteUserResponse.json();

      if (deleteUserResponseBody.id) {
        onUserDelete(deleteUserResponseBody as User);
      } else {
        console.log(deleteUserResponseBody);
      }
    } catch (e) {}
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditUserCard
        user={user}
        onCancel={handleCancelEdit}
        onUserUpdate={onUserUpdate}
      />
    );
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar aria-label="firstInitial">{name.slice(0, 1)}</Avatar>}
        title={name}
        subheader={new Date(dob).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="edit" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default UserCard;
