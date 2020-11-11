import React from "react";
import { Page } from "./Page";

import { StatusText } from './Styles';
import { useAuth } from './Auth'; 

type SignInAction = 'signin' | 'signin-callback';
interface Props {
    action: SignInAction;
}

export const SignInPage: React.FC<Props> = (props) => {

    const { signIn } = useAuth();

    if (props.action === 'signin') {
        signIn();
    }

    return (
        <Page title="Sign In Page">
            <StatusText>
                Signing in...
            </StatusText>
        </Page>
    );
}