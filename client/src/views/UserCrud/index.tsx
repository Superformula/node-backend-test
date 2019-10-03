import React, { useState } from "react";
import UserCard from "./UserCard";
import AddUserCard from "./AddUserCard";
import Grid from "@material-ui/core/Grid";
import { User } from "../../util";

interface Props {}

const UserCrud: React.FC<Props> = ({}) => {
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
