import React, { FC, useState, useEffect } from 'react'
import { Page } from './Page'

import { 
    Form, 
    MinLength, 
    Required, 
    SubmitResult, 
    Values 
} from './Form';

import { Field } from './Field';
import { 
    PostQuestionData,
    QuestionData 
} from './QuestionData';

import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import {
    postQuestionActionCreator,
    AppState,
    clearPostedQuestionActionCreator
} from './Store';

import { AnyAction } from 'redux';

interface Props {
    postQuestion: (q: PostQuestionData) => Promise<void>;
    postedQuestionResult?: QuestionData;
    clearPostedQuestion: () => void;
}

export const AskPage: React.FC<Props> = (props) => {

    useEffect(() => {
        return function cleanUp() {
            props.clearPostedQuestion();
        };
    }, [props.clearPostedQuestion]);

    const handleSubmit = (values: Values) => {
        props.postQuestion({
            title: values.title,
            content: values.content,
            userName: "Michael",
            created: new Date(),
        });
    };

    let submitResult: SubmitResult | undefined;

    if (props.postedQuestionResult) {
        submitResult = { success: props.postedQuestionResult !== undefined };
    }

    return (
        <Page title="Ask Page">
            <Form submitCaption="Submit Your Question"
                validationRules={{
                    title: [
                        {
                            validator: Required
                        },
                        {
                            validator: MinLength,
                            arg: 10
                        },
                    ],
                    content: [
                        {
                            validator: Required
                        },
                        {
                            validator: MinLength,
                            arg: 50
                        },
                    ],
                }}
                onSubmit={handleSubmit}
                submitResult={submitResult}
                failureMessage="There was a problem with your question"
                successMessage="Your question was successfully submitted"
                >
                    <Field name="title" label="Title" type="Text" />
                    <Field name="content" label="Content" type="TextArea" />
            </Form>
        </Page>
    )
}

const mapStateToProps = (store: AppState) => {
    return {
        postedQuestionResult: store.questions.postedResult,
    };
};
    
const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AnyAction>,
    ) => {
    return {
        postQuestion: (question: PostQuestionData) =>
        dispatch(postQuestionActionCreator(question)),
        clearPostedQuestion: () =>
        dispatch(clearPostedQuestionActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AskPage);