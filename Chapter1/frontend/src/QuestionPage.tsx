import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Page } from './Page'

interface RouteParams {
    questionId: string;
}

export const QuestionPage: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    return (
        <Page title="Question Page">
            Question {props.match.params.questionId} 
        </Page>
    )
}
