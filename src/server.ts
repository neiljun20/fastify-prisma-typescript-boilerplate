import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";

import { SECRET_TOKEN, ENABLE_SWAGGER, ORIGIN, CREDENTIALS } from './config';

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

	private server = Fastify();
	private userRoute = new UserRoute();
	private productRoute = new ProductRoute();

	 public constructor (){

		this.server.register(require('@fastify/cors'), () => {
			return (req, callback) => {
				const origin = /^localhost$/m.test(req.headers.origin) || !ORIGIN ? false : ( ORIGIN == "*" ? ORIGIN : false );
				const credentials = CREDENTIALS == "true" ? true : false ; 
				callback(null, { origin, credentials });
			}
		});

		this.server.register(require("@fastify/jwt"), { secret: SECRET_TOKEN });

		this.server.decorate("authenticate", async (request : FastifyRequest, reply: FastifyReply) => {
			try{
				await request.jwtVerify();
			} catch(e){
				return reply.send(e);
			}
		});

		const info = {
			title: "Fastify Prisma Typescript Boilerplate",
			description: "This is a OOP RESTful API boilerplate using Fastify, JWT, Prisma, and Typescript.",
			version: "1.0.0"
		};

		const exposeRoute = ENABLE_SWAGGER == "true" ? true : false ;

		this.server.register(swagger, withRefResolver({
			routePrefix: '/docs',
			staticCSP: true,
			openapi: { info },
			exposeRoute
		}));
	}

	public build = () => {

		this.server.get("/healthcheck", async () => {
			return { status: "ok"};
		});

		for(const schema of [...userSchemas, ...productSchemas]){
			this.server.addSchema(schema);
		}

		this.server.register(this.userRoute.routes, {prefix: 'api/users'});
		this.server.register(this.productRoute.routes, {prefix: 'api/products'});

		return this.server;
	}

}