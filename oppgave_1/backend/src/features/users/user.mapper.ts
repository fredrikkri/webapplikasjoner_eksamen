import { User } from "@/types/types";
import { createId } from "../../util/utils";

export const createUserResponse = (user: User): User => {
  const { name } = user;
     
  return {
    ...user,
    name
  };
};

export const fromDb = (user: User) => {
    return {
      id: user.id ?? createId(),  
      name: user?.name ?? "unknown", 
      email: user?.email ?? "unknown"
    };
};

export const createUser = (user: Partial<User>): User => {
    return {
      id: user.id ?? createId(),
      name: user.name ?? "unknown",
      email: user.email ?? "unknown"
    };
};

export const toDb = (data: Partial<User>) => {
    const user = createUser(data)
    return {
      id: user.id,  
      name: user.name, 
      email: user.email
    };
};