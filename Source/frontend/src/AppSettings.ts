import { Auth0ClientOptions } from "@auth0/auth0-spa-js";

export const webAPIUrl = "https://localhost:44316/api/";

export const authSettings: Auth0ClientOptions = {
    domain: 'dev-uhgue5d5.eu.auth0.com',
    client_id: 'jtdoBdy36tW6w7uF5BYcpaLXdeRrGLdy',
    redirect_uri: window.location.origin + '/signin-callback',
    scope: 'openid profile QandAAPI email',
    audience: 'https://qanda',
};