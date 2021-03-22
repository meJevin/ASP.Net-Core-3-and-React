import React, {
useState,
useEffect,
useContext,
createContext,
FC,
} from 'react';

import createAuth0Client, { User } from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { authSettings } from './AppSettings';

interface Auth0User {
    name: string;
    email: string;
}

interface IAuth0Context {
    isAuthenticated: boolean;
    user?: Auth0User;
    signIn: () => void;
    signOut: () => void;
    loading: boolean;
}

export const Auth0Context = createContext<IAuth0Context>({
    isAuthenticated: false,
    signIn: () => { return; },
    signOut: () => { return; },
    loading: true
});

export const useAuth = () => useContext(Auth0Context);

export const AuthProvider: FC = (props) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [user, setUser] = useState<Auth0User | undefined>(undefined);

    const [auth0Client, setAuth0Client] = useState<Auth0Client>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth0 = async () => {
            setLoading(true);

            const auth0FromHook = await createAuth0Client(authSettings);
            setAuth0Client(auth0FromHook);

            if (
                window.location.pathname === "/signin-callback" &&
                window.location.search.indexOf("code=") > -1
            ) {
                await auth0FromHook.handleRedirectCallback();
                window.location.replace(window.location.origin);
            }
            else {
                // Not a sign in callback :)
            }

            const isAuthenticatedFromHook = await auth0FromHook.isAuthenticated();
            if (isAuthenticatedFromHook) {
                const user = await auth0FromHook.getUser();

                if (user && user.name && user.email) {
                    setUser({name: user.name, email: user.email});
                }
            }
            setIsAuthenticated(isAuthenticatedFromHook);

            setLoading(false);
        }

        initAuth0();
    }, []);

    const getAuth0ClientFromState = () => {
        if (auth0Client === undefined) {
            throw new Error("Auth0 client not set");
        }

        return auth0Client;
    };

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                signIn: () => getAuth0ClientFromState().loginWithRedirect(),
                signOut: () => getAuth0ClientFromState().logout({
                    client_id: authSettings.client_id,
                    returnTo: window.location.origin + '/signout-callback'
                })
            }}
        >
                {props.children}
        </Auth0Context.Provider>
    )
}

export const getAccessToken = async () => {
    const auth0FromHook = await createAuth0Client(authSettings);
    const accessToken = await auth0FromHook.getTokenSilently();

    return accessToken;
};