import { Request, Response } from "express";
import { User, UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";

const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;
  console.log(req.body);
  const user = await User.findOne<UserDocument>({
    $or: [{ email }, { phoneNo }],
  });
  if (user) {
    try {
      let created = await User.create({
        firstName,
        lastName,
        email,
        phoneNo,
        password,
      });
      res.send({
        message: "User created",
        // data: { ...created, password: "" },
        success: true,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log("failed to create user", err.message);
      } else {
        console.log("failed to create user", err);
      }
    }
  } else {
    console.log("User already exists.");
    res.status(409).send({ message: "User already exists.", success: false });
  }
};

// function to login user user will provide email and password
const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (isMatch) {
        const token = user.generateToken();
        res.send({
          message: "User authenticated",
          data: { ...user.toObject(), token },
          success: true,
        });
      } else {
        res
          .status(401)
          .send({ message: "Invalid email or password", success: false });
      }
    } else {
      res
        .status(401)
        .send({ message: "Invalid email or password", success: false });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.send({ message: "User with " + id + " deleted", success: true });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete user", success: false });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  res.send({ message: "User Updated " + id });
};

export { registerUser, deleteUser, authenticateUser, updateUser };
