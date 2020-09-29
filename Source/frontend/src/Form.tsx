import React, { useState, createContext, FormEvent } from 'react';
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
    onSubmit: (values: Values) => Promise<SubmitResult>;
    successMessage?: string;
    failureMessage?: string;
}

export interface Errors {
    [key: string]: string[];
}

export interface Touched {
    [key: string]: boolean;
}

export interface SubmitResult {
    success: boolean;
    errors?: Errors;
}

export const Form : React.FC<Props> = (props) => {

    const [values, setValues] = useState<Values>({});
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(false);

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

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

        let haveError = false;

        if (props.validationRules) {
            Object.keys(props.validationRules).forEach(fieldName => {
                newErrors[fieldName] = validate(fieldName);
                if (newErrors[fieldName].length > 0) {
                    haveError = true;
                }
            });
        }

        setErrors(newErrors);

        return !haveError;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            setSubmitting(true);
            setSubmitError(false);

            const result = await props.onSubmit(values);

            setErrors(result.errors || {});
            setSubmitError(!result.success);

            setSubmitting(false);
            setSubmitted(true);
        }
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
            <form noValidate={true}
                onSubmit={handleSubmit}>
                <fieldset
                    disabled={submitting || (submitted && !submitError)}
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

                    {submitted && submitError && (
                        <p css={css`color: red;`}>
                            {props.failureMessage}
                        </p>
                    )}
                    {submitted && !submitError && (
                        <p css={css`color: green;`}>
                            {props.successMessage}
                        </p>
                    )}
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
    if (value === undefined || value === '' || value.length < minLength) {
        return "This must contain at least " + minLength + " characters";
    } 

    return '';
};