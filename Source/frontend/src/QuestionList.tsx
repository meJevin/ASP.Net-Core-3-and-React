import { FC } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { gray5, accent2 } from './Styles';
import { QuestionData } from './QuestionData';
import { Question } from './Question';
import React from 'react';


interface QuestionListProps {
    data: QuestionData[];
    renderQuestion?: (question: QuestionData) => JSX.Element; 
}

export const QuestionList: FC<QuestionListProps> = (props) => {
    return (
        <ul
        css={css`
        list-style: none;
        margin: 10px 0 0 0;
        padding: 0px 20px;
        background-color: #fff;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top: 3px solid ${accent2};
        box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
        `}>
            {props.data.map(q => {
                return (
                    <li key={q.questionId}
                        css={css`
                        border-top: 1px solid ${gray5};
                        :first-of-type {
                        border-top: none;
                        }
                        `}
                    >
                        {
                            props.renderQuestion ? 
                            props.renderQuestion(q) 
                            :
                            <Question data={q} />
                        }
                    </li>
                )
            })}
        </ul>
    );
};