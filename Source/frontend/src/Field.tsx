import { ChangeEvent, useContext } from 'react';
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

import { FormContext } from './Form';

interface Props {
    name: string;
    label?: string;
    type: 'Text' | 'TextArea' | 'Password';
}

export const Field: React.FC<Props> = (props) => {

    const formContext = useContext(FormContext);

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        if (formContext.setFormValue) {
            formContext.setFormValue(props.name, e.currentTarget.value);
        }

        if (formContext.touched[props.name]) {
            if (formContext.validate) {
                formContext.validate(props.name);
            }
        }
    };

    const handleBlur = () => {
        if (formContext.setTouched) {
            formContext.setTouched(props.name);
        }
        if (formContext.validate) {
            formContext.validate(props.name);
        }
    };

    return (
        <FormContext.Consumer>
            {(context) => {
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
                        <input type={props.type.toLowerCase()} 
                            id={props.name} 
                            css={baseCSS} 
                            onChange={handleFieldChange}
                            value={context.formValues[props.name]}
                            onBlur={handleBlur}
                        />
                    )}

                    {(props.type === 'TextArea') && (
                        <textarea 
                            id={props.name} 
                            css={
                                css`${baseCSS};
                                height: 100px;`
                            }
                            onChange={handleFieldChange}
                            value={context.formValues[props.name]}
                            onBlur={handleBlur}
                        >

                        </textarea>
                    )}

                    {formContext.errors[props.name] &&
                    formContext.errors[props.name].length > 0 &&
                    formContext.errors[props.name].map(error => (
                    <div
                        key={error}
                        css={css`
                        font-size: 12px;
                        color: red;
                        `}
                    >
                        {error}
                    </div>
                    ))}

                    </div>
                )
            }}
        </FormContext.Consumer>
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
