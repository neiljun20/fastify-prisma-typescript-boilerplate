import { FastifyInstance } from "fastify";
import ProductController from "./product.controller";
import { FastifyRequest, FastifyReply } from "fastify";
import { $ref } from "./product.schema";

export default class ProductRoute {

	private productController = new ProductController();

	public routes = async (server: FastifyInstance) => {
		
		server.post("/", {
			onRequest: [server.authenticate],
			schema : {
				body: $ref("createProductSchema"),
				response: { 201: $ref("productResponseSchema") }
			}
		}, this.productController.createHandler);

		server.get("/", {
			onRequest: [server.authenticate],
			schema: {
				response: {
					200: $ref("productsResponseSchema")
				}
			}
		}, this.productController.getProductsHandler);

	}
}