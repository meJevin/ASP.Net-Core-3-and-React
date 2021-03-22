
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "./Styles";
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { QuestionList } from "./QuestionList";
import { getUnansweredQuestions, QuestionData } from './QuestionData';
import { Page } from "./Page";
import { PageTitle } from "./PageTitle";
import { Question } from "./Question";
import { RouteComponentProps } from "react-router-dom";

import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { useAuth } from "./Auth";

import {
    getUnansweredQuestionsActionCreator,
    AppState
} from './Store';

interface Props extends RouteComponentProps {
    getUnansweredQuestions: () => Promise<void>;
    questions: QuestionData[] | null;
    questionsLoading: boolean;
} 

export const HomePage : React.FC<Props> = (props) => {
 
    useEffect(() => {
        if (props.questions === null) {
            props.getUnansweredQuestions();
        }
    }, [props.questions, props.getUnansweredQuestions]);

    const { isAuthenticated } = useAuth();

    const handleAskQuestionClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.history.push("/ask");
    };

    return <Page title="Home page">
        <div
            css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            `}
            >
            <PageTitle>Unanswered questions</PageTitle>
            
            {isAuthenticated && (
                <PrimaryButton onClick={handleAskQuestionClick}>
                Ask a question
                </PrimaryButton>
            )}
        </div>
        {props.questionsLoading ? 
        (<div css={css`
            font-size: 16px;
            font-style: italic;
        `}>
            Loading...
        </div>)
        :
        (<QuestionList 
            data={props.questions || []}
            />)
        }
        
    </Page>
};

const mapStateToProps = (store: AppState) => {
    return {
        questions: store.questions.unanswered,
        questionsLoading: store.questions.loading
    };
};
    
const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AnyAction>,
    ) => {
    return {
        getUnansweredQuestions: () =>
        dispatch(getUnansweredQuestionsActionCreator()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

function renderQuestionInList(qData: QuestionData): JSX.Element {
    return (
        <div>
            <h5>
                This is a custom question renderer!
            </h5>
            <span>
                Question info: {qData.content}
            </span>
            <Question data={qData || []}/>
        </div>
    );
}