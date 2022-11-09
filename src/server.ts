import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";

import { SECRET_TOKEN } from './config';

import UserRoute from "./modules/user/user.route";
import ProductRoute from "./modules/product/product.route";

import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';

declare module "fastify" {
	export interface FastifyInstance {
		authenticate: any;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			id: number,
			email: string,
			name: string
		}
	}
};

export default class Server{

	private server 			= Fastify();
	private userRoute 		= new UserRoute();
	private productRoute 	= new ProductRoute();

	public constructor(){
		this.server.register(require("@fastify/jwt"), { secret: SECRET_TOKEN });
		this.server.decorate("authenticate", async (request : FastifyRequest, reply: FastifyReply) => {
			try{
				await request.jwtVerify();
			} catch(e){
				return reply.send(e);
			}
		});
	}

	public build = () => {

		this.server.get("/healthcheck", async () => {
			return { status: "ok"};
		});

		for(const schema of [...userSchemas, ...productSchemas]){
			this.server.addSchema(schema);
		}

		this.server.register(swagger, withRefResolver({
			routePrefix: '/docs',
			exposeRoute: true,
			staticCSP: true,
			openapi: {
				info: {
					title: "Fastify API",
					description: "API for some products",
					version: "1.0.0"
				}
			}
		}));

		this.server.register(this.userRoute.routes, {prefix: 'api/users'});
		this.server.register(this.productRoute.routes, {prefix: 'api/products'});

		return this.server;
	}

}