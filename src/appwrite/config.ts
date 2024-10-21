import conf from "@/conf/config";
import { Client, Account, ID } from "appwrite";

type CreateUserAccount = {
    email: string,
    password: string,
    name: string
}

type LoginUserAccount = {
    email: string,
    password: string
}

const appwriteClient = new Client();

appwriteClient.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(appwriteClient);

export class AppwriteService {
    // create a new record of user inside appwrite account

    createUserAccount = async ({ email, password, name }: CreateUserAccount) => {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);

            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error: any) {
            throw error;
        }

    }

    login = async ({ email, password }: LoginUserAccount) => {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            throw error;
        }
    }

    isLoggedIn = async (): Promise<boolean> => {
        try {
            const data = await this.getCurrentUser();
            return Boolean(data);
        } catch (error: any) { }

        return false;
    }

    getCurrentUser = async () => {
        try {
            return account.get();
        } catch (error: any) {
            console.log("GetCurrentUser Error: ", error);
        }

        return null;
    }

    logout = async () => {
        try {
            return await account.deleteSession("current");
        } catch (error: any) {
            console.log("Logout Error: ", error);

        }
    }
}

const appwriteService = new AppwriteService();

export default appwriteService;
