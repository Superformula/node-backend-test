import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import UserCard from "./UserCard";
import AddUserCard from "./AddUserCard";
import Grid from "@material-ui/core/Grid";

interface Props {}

interface User {
  id: string;
  name: string;
  dob: string;
  address: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

const useStyles = makeStyles({
  root: {}
});

const domain = "http://localhost:3000";

const UserCrud: React.FC<Props> = ({}) => {
  const classes = useStyles();
  const [users, setUsers]: [User[], (users: User[]) => void] = useState([]);

  const handleAddedUser = (user: User) => setUsers([...users, user]);
  const handleDeletedUser = (user: User) => {
    setUsers(users.filter(({ id }) => id !== user.id));
  };
  const handleUpdatedUser = (updatedUser: User) => {
    setUsers(
      users.map((user: User) =>
        updatedUser.id === user.id ? updatedUser : user
      )
    );
  };

  return (
    <Grid container spacing={3}>
      <>
        {users.map((user: User) => (
          <Grid item key={user.id} xs={12} sm={3}>
            <UserCard
              user={user}
              onUserDelete={handleDeletedUser}
              onUserUpdate={handleUpdatedUser}
            />
          </Grid>
        ))}
        ,
        <Grid item key="add-user" xs={12} sm={3}>
          <AddUserCard onUserAdd={handleAddedUser} />
        </Grid>
      </>
    </Grid>
  );
};

export default UserCrud;
