import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Page } from './Page'
import { QuestionData, getQuestion, postAnswer } from './QuestionData';
import { useState, Fragment, useEffect } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { gray3, gray6 } from './Styles';
import { AnswerList } from './AnswerList';

import { Form, MinLength, Required, SubmitResult, Values } from './Form';
import { Field } from './Field';

interface RouteParams {
    questionId: string;
}

export const QuestionPage:
React.FC<RouteComponentProps<RouteParams>> = (props) => {

    const [question, setQuestion] = useState<QuestionData | null>(null);

    useEffect(() => {
        const fetchQuestion = async (questionId: number) => {
            const foundQuestion = await getQuestion(questionId);
            setQuestion(foundQuestion);
        };

        if (props.match.params.questionId) {
            const questionId = Number(props.match.params.questionId);
            fetchQuestion(questionId);
        }
    }, [props.match.params.questionId]);

    const handleSubmit = async (values: Values): Promise<SubmitResult> => {
        const result = await postAnswer({
            questionId: question!.questionId,
            content: values.content,
            userName: "Michael",
            created: new Date(),
        });

        return { success: result ? true : false };
    }

    return (
        <Page title="Question Page">
            <div
            css={css`
            background-color: white;
            padding: 15px 20px 20px 20px;
            border-radius: 4px;
            border: 1px solid ${gray6};
            box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
            `}
            >
                <div
                css={css`
                font-size: 19px;
                font-weight: bold;
                margin: 10px 0px 5px;
                `}
                >
                {question === null ? '' : question.title}
                </div>

                {question !== null && (
                    <Fragment>
                        <p
                            css={css`
                            margin-top: 0px;
                            background-color: white;
                        `}
                        >
                        {question.content}
                        </p>
                        <div
                            css={css`
                            font-size: 12px;
                            font-style: italic;
                            color: ${gray3};
                        `}
                        >
                            {`Asked by ${question.userName} on
                            ${question.created.toLocaleDateString()}
                            ${question.created.toLocaleTimeString()}`}
                        </div>

                        <AnswerList data={question.answers}/>

                        <div
                            css={css`
                            margin-top: 20px;
                            `}
                        >
                            <Form submitCaption="Submit Your Answer"
                                validationRules={{
                                    content: [
                                        {validator: Required},
                                        {validator: MinLength, arg: 50}
                                    ]
                                }}
                                onSubmit={handleSubmit}
                                successMessage="Your answer was successfully submitted"
                                failureMessage="There was a problem with your answer"
                                >
                                <Field name="content" label="Your Answer" type="TextArea" />
                            </Form>
                        </div>
                    </Fragment>
                )}
            </div>
        </Page>
    )
}
