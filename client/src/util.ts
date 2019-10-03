export const apiDomain = "http://localhost:3000";

export const defaultUser = {
  name: "",
  address: "",
  dob: new Date(),
  description: ""
};

export interface User {
  id: string | undefined;
  name: string;
  dob: string;
  address: string;
  description: string;
  createdAt: number | undefined;
  updatedAt: number | undefined;
}
