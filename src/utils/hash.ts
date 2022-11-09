import bcrypt from "bcrypt";

const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, generateRandomNumber(10 ,30));
};

export const verifyPassword = async (password: string, hash: string) => {
	return await bcrypt.compare(password, hash);
};