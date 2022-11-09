import { FastifyInstance } from "fastify";
import UserController from "./user.controller";
import { FastifyRequest, FastifyReply } from "fastify";
import { $ref } from "./user.schema";

export default class UserRoute {

	private userController = new UserController();

	public routes = async (server: FastifyInstance) => {

		server.post("/", {
			schema : {
				body: $ref("createUserSchema"),
				response: { 201: $ref("createUserResponseSchema") }
			}
		}, this.userController.registerHandler);

		server.post("/login", {
			schema: {
				body: $ref("loginSchema"),
				response: { 201: $ref("loginResponseSchema") }
			}
		}, this.userController.loginHandler);

		server.get("/", { onRequest: [server.authenticate] }, this.userController.getUsersHandler);
		
	};

}