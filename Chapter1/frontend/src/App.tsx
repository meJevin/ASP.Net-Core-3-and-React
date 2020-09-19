import React from 'react';
import { Header } from './Header';
import { HomePage } from './HomePage';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { fontFamily, fontSize, gray2 } from './Styles';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { SearchPage } from './SearchPage';
import { AskPage } from './AskPage';
import { SignInPage } from './SignInPage';
import { QuestionPage } from './QuestionPage';
import { NotFoundPage } from './NotFoundPage';

const App: React.FC = () => {
  return (
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
          
          <Route path="/ask" component={AskPage}/>
          
          <Route path="/signin" component={SignInPage}/>

          <Route path="/question/:questionId" component={QuestionPage}/>

          <Route component={NotFoundPage}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
