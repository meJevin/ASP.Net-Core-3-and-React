import React from "react";
import { Page } from "./Page";

import { StatusText } from './Styles';
import { useAuth } from './Auth'; 

type SignoutAction = 'signout' | 'signout-callback';

interface Props {
    action: SignoutAction;
}

export const SignOutPage: React.FC<Props> = (props) => {
    
    let message = "Signing out...";

    const { signOut } = useAuth();

    if (props.action === 'signout') {
        signOut();
    }
    else if (props.action === 'signout-callback') {
        message = "Succesfully signed out!";
    }

    return (
        <Page title="Sign Out Page">
            <StatusText>
                {message}
            </StatusText>
        </Page>
    );
}