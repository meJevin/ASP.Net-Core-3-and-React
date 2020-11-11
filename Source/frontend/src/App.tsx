import React, { lazy, Suspense } from 'react';
import { HeaderWithRouter as Header } from './Header';
import HomePage from './HomePage';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { fontFamily, fontSize, gray2 } from './Styles';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { SignOutPage } from './SignOutPage';
import { QuestionPage } from './QuestionPage';
import { NotFoundPage } from './NotFoundPage';

import { Provider } from 'react-redux';
import { configureStore } from './Store';

import {AuthProvider} from './Auth';

const AskPage = lazy(() => import("./AskPage"));

const store = configureStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App" 
          css={css`
            font-family: ${fontFamily};
            font-size: ${fontSize};
            color: ${gray2};
          `}>

            <Header/>

            <Switch>
              <Redirect from="/home" to="/"/>

              <Route exact path="/" component={HomePage}/>

              <Route path="/search" component={SearchPage}/>
              
              <Route path="/ask">
                <Suspense fallback={
                  <div
                  css={css`
                  margin-top: 100px;
                  text-align: center;
                  `}
                  >
                    Loading...
                  </div>
                }>
                  <AskPage/>
                </Suspense>
              </Route>
              
              <Route 
                path="/signin" 
                render={() => <SignInPage action="signin"/>}
              />

              <Route 
                path="/signin-callback" 
                render={() => <SignInPage action="signin-callback"/>}
              />

              <Route 
                path="/signout" 
                render={() => <SignOutPage action="signout"/>}
              />

              <Route 
                path="/signout-callback" 
                render={() => <SignOutPage action="signout-callback"/>}
              />

              <Route path="/question/:questionId" component={QuestionPage}/>

              <Route component={NotFoundPage}/>
            </Switch>
          </div>
        </BrowserRouter>  
      </AuthProvider>
    </Provider>
  );
}

export default App;
