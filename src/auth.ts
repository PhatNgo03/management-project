import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sendRequest } from "./utils/api";
import { InActiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { IUser } from "./types/next-auth";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: "http://localhost:8080/api/v1/auth/login",
                    body: {
                        username: credentials.email,
                        password: credentials.password
                    }
                })
                console.log(">>> Check res: ", res)
                if (!res.statusCode) {
                    return {
                        _id: res.data?.user?._id,
                        name: res.data?.user?.name,
                        email: res.data?.user?.email,
                        access_token: res.data?.access_token,
                    };
                }
                //invalid Email/password
                else if (+res.statusCode == 401) {
                    throw new InvalidEmailPasswordError()
                }
                //Account not activated
                else if (+res.statusCode === 400) {
                    throw new InActiveAccountError()
                }
                else {
                    throw new Error("Internal server error")
                }
            },
        }),

    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser)
            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            return session
        },
    },

})