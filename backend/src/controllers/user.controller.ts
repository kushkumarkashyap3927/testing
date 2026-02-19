import { prisma } from "../config/prisma";
import Api, { apiError } from "../utils/apiRes.util";

export const createUser = async (req: any, res: any, next: any) => {
  try {
    const { fullName, email, password, desc, role } = req.body;
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        desc,
        role,
      } as any,
    });
    return Api.success(res, user, "User created successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to create user", [error?.message || String(error)], error?.stack));
  }
};

export const loginUser = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return next(new apiError(401, "Invalid email or password"));
    }

    return Api.success(res, user, "Login successful");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Internal Server Error", [error?.message || String(error)], error?.stack));
  }
};



