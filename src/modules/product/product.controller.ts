import { FastifyRequest, FastifyReply } from "fastify";
import { CreateProductInput } from "./product.schema";
import ProductService from "./product.service";
import { verifyPassword } from "../../utils/hash";

export default class ProductController {

	private productService = new ProductService();

	public createHandler = async (request: FastifyRequest<{ Body: CreateProductInput }>, reply: FastifyReply) => {
		return await this.productService.create({ ...request.body, ownerId: request.user.id });
	}

	public getProductsHandler = async() => {
		return await this.productService.findAll();
	}
}