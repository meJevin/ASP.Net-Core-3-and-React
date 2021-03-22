import { FC } from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { QuestionData } from "./QuestionData";
import { gray2, gray3 } from "./Styles";
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    data: QuestionData;
    showContent?: boolean;
}

export const Question: React.FC<Props> = (props) => {
    return (
        <div
        css={css`
        padding: 10px 0px;
        `}
        >
            <div
            css={css`
            padding: 10px 0px;
            font-size: 19px;
            `}
            >
                <Link to={`question/${props.data.questionId}`}
                    css={css`
                    text-decoration: none;
                    color: ${gray2};
                    `}>
                        {props.data.title}
                    </Link>
            </div>

            {props.showContent && (
                <div
                css={css`
                padding-bottom: 10px;
                font-size: 15px;
                color: ${gray2};
                `}
                >
                {props.data.content.length > 50
                ? `${props.data.content.substring(0, 50)}...`
                : props.data.content}
                </div>
            )}

            <div
            css={css`
            font-size: 12px;
            font-style: italic;
            color: ${gray3};
            `}
            >
            {`Asked by ${props.data.userName} on
            ${props.data.created.toLocaleDateString()} ${props.data.created.toLocaleTimeString()}`}
            </div>
        </div>

    );
};

Question.defaultProps = {
    showContent: true,
};