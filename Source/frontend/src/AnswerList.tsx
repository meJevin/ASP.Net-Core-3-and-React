import React from 'react'

import { AnswerData } from './QuestionData';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Answer } from './Answer';
import { gray5 } from './Styles';

interface Props {
    data: AnswerData[];
}

export const AnswerList: React.FC<Props> = (props) => {
    return (
        <ul
            css={css`
            list-style: none;
            margin: 10px 0 0 0;
            padding: 0;
            `}
        >
            {props.data.map(el => {
                return (
                <li
                    css={css`
                    border-top: 1px solid ${gray5};
                    `}
                    key={el.answerId}
                >
                     <Answer data={el}></Answer>
                </li>
                );
            })}
        </ul>
    )
}
