import Server from "./server";
import { PORT } from './config';

const main = async () =>  {
	const server = new Server().build();
	await server.listen({ port: Number(PORT) });
	console.log(`Server ready at http://localhost:${PORT}`);
}

try{

	main();

} catch(e){

	console.error(e);
	process.exit(1);

}