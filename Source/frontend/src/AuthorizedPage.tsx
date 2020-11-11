import React, { Fragment } from 'react'
import { Page } from './Page';
import { useAuth } from './Auth';

export const AuthorizedPage: React.FC = (props) => {
    
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <Fragment>
                {props.children}
            </Fragment>
        );
    } else {
        return (
            <Page title="You're not authorized to access this page!">

            </Page>
        );
    }

}