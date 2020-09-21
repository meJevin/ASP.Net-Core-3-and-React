import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Page } from './Page'
import { QuestionData, getQuestion } from './QuestionData';
import { FC, useState, Fragment, useEffect } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { gray3, gray6 } from './Styles';

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
                    </Fragment>
                )}
            </div>
        </Page>
    )
}
