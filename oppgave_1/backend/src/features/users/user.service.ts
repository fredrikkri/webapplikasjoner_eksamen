import type { Result } from "@/types";
import { createUser, createUserResponse } from "./user.mapper";
import type { Query } from "@/lib/query";
import { createUserRepository, UserRepository, userRepository } from "./user.repository";
import { CreateUser, User, validateCreateUser } from "../../types/user";

export const createUserService = (userRepository: UserRepository) => {

  const getById = async (id: string): Promise<Result<User>> => {
    return userRepository.getById(id);
  };

  const list = async (query?: Query): Promise<Result<User[]>> => {
    const result = await userRepository.list(query);
    if (!result.success) return result;

    return {
      ...result,
      data: result.data.map(createUserResponse),
    };
  };

  const create = async (data: CreateUser): Promise<Result<string>> => {
    const student = createUser(data);

    if (!validateCreateUser(student).success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid student data" },
      };
    }

    return userRepository.create(student);
  };


  return {
    list,
    create,
    getById
  };
};

export const userService = createUserService(userRepository);

export type UserService = ReturnType<typeof createUserRepository>;