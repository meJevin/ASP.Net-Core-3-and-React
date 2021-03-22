/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { PageTitle } from "./PageTitle";
import {QuestionList} from "./QuestionList";

interface PageTitleProps {
    title?: string;
}

export const Page: React.FC<PageTitleProps> = (props) => {
    return (
        <div
        css={css`
            margin: 50px auto 20px auto;
            padding: 30px 20px;
            max-width: 600px;
        `}>
            {props.title && <PageTitle>{props.title}</PageTitle>}
            {props.children}
        </div>
    );
};

Page.defaultProps = {
    title: "Enter a title", 
}