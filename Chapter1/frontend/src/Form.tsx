import React, { useState, createContext } from 'react';
import { PrimaryButton, gray5, gray6 } from './Styles';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { string } from 'prop-types';

export interface Values {
    [key: string]: any;
}

export interface FormContextProps {
    formValues: Values;
    setFormValue?: (fieldName: string, values: any) => void;
}

export const FormContext = createContext<FormContextProps>({formValues: {}});

interface Props {
    submitCaption?: string;
}

export const Form : React.FC<Props> = (props) => {

    const [values, setValues] = useState<Values>({});

    const setFormValueHandler = (fieldName: string, value: any) => {
        const newValues = {...values};
        newValues[fieldName] = value;

        setValues(newValues);
    };

    return (
        <FormContext.Provider value={{formValues: values, setFormValue: setFormValueHandler}}>
            <form noValidate={true}>
                <fieldset
                    css={css`
                    margin: 10px auto 0 auto;
                    padding: 30px;
                    width: 350px;
                    background-color: ${gray6};
                    border-radius: 4px;
                    border: 1px solid ${gray5};
                    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
                    `}
                >
                    {props.children}
                    
                    <div
                        css={css`
                        margin: 30px 0px 0px 0px;
                        padding: 20px 0px 0px 0px;
                        border-top: 1px solid ${gray5};
                    `}
                    >
                        <PrimaryButton type="submit">
                            {props.submitCaption}
                        </PrimaryButton>
                    </div>
                </fieldset>
            </form>
        </FormContext.Provider>
    )
}
