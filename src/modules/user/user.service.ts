import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";

export default class UserService {

	public create = async (input: CreateUserInput) => {
		const { password, ...rest } = input;
		const newPassword = await hashPassword(password);
		const data = { ...rest, password: newPassword};
		return await prisma.user.create({ data });
	};

	public findByEmail = async (email: string) => {
		return prisma.user.findUnique({
			where: { email }
		});
	};

	public findAll = async () => {
		return prisma.user.findMany({
			select: { id: true, email: true, name: true }
		});
	};

}