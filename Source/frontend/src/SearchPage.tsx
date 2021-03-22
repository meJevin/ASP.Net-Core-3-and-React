import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Page } from './Page';
import { QuestionList } from './QuestionList';
import { searchQuestions, QuestionData } from './QuestionData';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export const SearchPage: React.FC<RouteComponentProps> = (props) => {

    const [questions, setQuestions] = useState<QuestionData[]>([]);

    const searchParams = new URLSearchParams(props.location.search);
    const search = searchParams.get('criteria') || '';

    useEffect(() => {
        const fetchSearchQuestions = async (criteria: string) => {
            const foundQuestions = await searchQuestions(criteria);
            setQuestions(foundQuestions);
        };

        fetchSearchQuestions(search);
    }, [search]);

    return (
        <Page title="Search Page">
            {search && (
            <p
                css={css`
                font-size: 16px;
                font-style: italic;
                margin-top: 0px;
            `}
            >
                for {search}
            </p>
            )}
            <QuestionList data={questions} />
        </Page>
    )
}
