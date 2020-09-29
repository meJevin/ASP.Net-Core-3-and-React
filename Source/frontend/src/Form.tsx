import React, { useState, createContext } from 'react';
import { PrimaryButton, gray5, gray6 } from './Styles';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export interface Values {
    [key: string]: any;
}

export interface FormContextProps {
    formValues: Values;
    setFormValue?: (fieldName: string, values: any) => void;
    errors: Errors;
    validate?: (fieldName: string) => void;
    touched: Touched;
    setTouched?: (fieldName: string) => void;
}

export const FormContext = createContext<FormContextProps>({formValues: {}, touched: {}, errors: {}});

type Validator = (value: any, args?: any) => string;

interface Validation {
    validator: Validator;
    arg?: any;
}

interface ValidationProp {
    [key: string]: Validation | Validation[];
}

interface Props {
    submitCaption?: string;
    validationRules?: ValidationProp;
}

export interface Errors {
    [key: string]: string[];
}

export interface Touched {
    [key: string]: boolean;
}

export const Form : React.FC<Props> = (props) => {

    const [values, setValues] = useState<Values>({});
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const validate = (fieldName: string): string[] => {
        if (!props.validationRules) {
            return [];
        }
        if (!props.validationRules[fieldName]) {
            return [];
        }

        const fieldErrors: string[] = [];

        let rules;
        if (Array.isArray(props.validationRules[fieldName])) {
            rules = props.validationRules[fieldName] as Validation[];

            rules.forEach(rule => {
                const error = rule.validator(values[fieldName], rule.arg);

                if (error) {
                    fieldErrors.push(error);
                }
            });
        }
        else {
            rules = props.validationRules[fieldName] as Validation;
            const error = rules.validator(values[fieldName], rules.arg);

            if (error) {
                fieldErrors.push(error);
            }
        }

        setErrors({...errors, [fieldName]: fieldErrors});

        return fieldErrors;
    }

    const setFormValueHandler = (fieldName: string, value: any) => {
        const newValues = {...values};
        newValues[fieldName] = value;

        setValues(newValues);
    };

    return (
        <FormContext.Provider value={
            {
                formValues: values,
                setFormValue: setFormValueHandler,
                errors,
                validate,
                touched,
                setTouched: (fieldName: string) => {
                    setTouched({ ...touched, [fieldName]: true });
                }
            }}>
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

export const Required: Validator = (value: any): string => {
    if (value === undefined || value == null || value === '') {
        return 'This must be populated';
    }

    return '';
};

export const MinLength: Validator = (value: string, minLength: number): string => {
    if (value === undefined || value !== '' || value.length < minLength) {
        return "This must contain at least " + minLength + " characters";
    } 

    return '';
};