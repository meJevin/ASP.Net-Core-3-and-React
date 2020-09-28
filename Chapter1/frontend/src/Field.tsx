import { FC } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
    fontFamily,
    fontSize,
    gray5,
    gray2,
    gray6,
} from './Styles';

import React from 'react'

interface Props {
    name: string;
    label?: string;
    type?: 'Text' | 'TextArea' | 'Password';
}

export const Field: React.FC<Props> = (props) => {

    // Make type text by default
    if (!props.type) props.type = 'Text';

    return (
        <div
            css={css`
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        `}
        >
        {props.label && (
            <label
                css={css`
                    font-weight: bold;
                `}
                htmlFor={props.name}
            >
                {props.label}
            </label>
        )}
        
        {(props.type === 'Text' || props.type === 'Password') && (
            <input type={props.type.toLowerCase()} id={name} css={baseCSS} />
        )}

        {(props.type === 'TextArea') && (
            <textarea 
                id={props.name} 
                css={
                    css`${baseCSS};
                     height: 100px;`
                }
            >

            </textarea>
        )}
        </div>
    )
}

const baseCSS = css`
    box-sizing: border-box;
    font-family: ${fontFamily};
    font-size: ${fontSize};
    margin-bottom: 5px;
    padding: 8px 10px;
    border: 1px solid ${gray5};
    border-radius: 3px;
    color: ${gray2};
    background-color: white;
    width: 100%;

    :focus {
        outline-color: ${gray5};
    }

    :disabled {
        background-color: ${gray6};
    }
`;
