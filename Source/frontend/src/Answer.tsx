import React from 'react'
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { AnswerData } from './QuestionData';
import { gray3 } from './Styles';


interface Props {
    data: AnswerData;
}

export const Answer: React.FC<Props> = (props) => {
    return (
        <div
        css={css`
        padding: 10px 0px;
        `}
        >
            <div
                css={css`
                padding: 10px 0px;
                font-size: 13px;
                `}
            >
                {props.data.content}
            </div>

            <div
                css={css`
                font-size: 12px;
                font-style: italic;
                color: ${gray3};
                `}
            >
                {`Answered by ${props.data.userName} on
                ${props.data.created.toLocaleDateString()}
                ${props.data.created.toLocaleTimeString()}`}
            </div>
        </div>
    )
}
