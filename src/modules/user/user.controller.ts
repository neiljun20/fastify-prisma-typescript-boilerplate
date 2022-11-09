import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import UserService from "./user.service";
import { verifyPassword } from "../../utils/hash";

export default class UserController {

	private userService = new UserService();

	public registerHandler = async (request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) => {
		try{
			const user = await this.userService.create(request.body);
			return reply.code(201).send(user);
		} catch(e){
			console.error(e);
			return reply.code(500).send(e);
		}
	}

	public loginHandler = async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
		const body = request.body;
		const user = await this.userService.findByEmail(body.email);
		if(!user){
			return reply.code(401).send({
				message: "Invalid email or password"
			});
		}
		const correctPassword = await verifyPassword(body.password, user.password);
		if(correctPassword){
			const { password, ...rest} = user;
			return { accessToken: await reply.jwtSign(rest) };
		}
		return reply.code(401).send({
			message: "Invalid email or password"
		});
	}

	public getUsersHandler = async() => {
		return await this.userService.findAll();
	}
}