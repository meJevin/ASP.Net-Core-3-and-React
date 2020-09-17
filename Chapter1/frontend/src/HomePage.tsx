import React from "react";
import { PrimaryButton } from "./Styles";
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { QuestionList } from "./QuestionList";
import { getUnansweredQuestions, QuestionData } from "./QuestionData";
import { Page } from "./Page";
import { PageTitle } from "./PageTitle";
import { Question } from "./Question";

export const HomePage = () => (
    <Page title="niggers?">
        <div
            css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            `}
            >
            <PageTitle>Unanswered questions</PageTitle>
            <PrimaryButton>Ask a question</PrimaryButton>
        </div>
        
        <QuestionList 
            data={getUnansweredQuestions()}
            renderQuestion={renderQuestionInList}/>
    </Page>
);

function renderQuestionInList(qData: QuestionData): JSX.Element {
    return (
        <div>
            <h5>
                This is a custom question renderer!
            </h5>
            <span>
                Question info: {qData.content}
            </span>
            <Question data={qData}/>
        </div>
    );
}