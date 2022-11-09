import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";
import { hashPassword } from "../../utils/hash";

export default class ProductService {

	public create = async (data: CreateProductInput & {ownerId: number}) => {
		return await prisma.product.create({ data });
	}

	public findAll = async () => {
		return prisma.product.findMany({
			select: {
				id: true,
				content: true,
				title: true,
				price: true,
				createdAt: true,
				updatedAt: true,
				owner: { select: { id: true, name: true } }
			}
		});
	}

}