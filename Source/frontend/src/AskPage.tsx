import React from 'react'
import { Page } from './Page'
import { Form, MinLength, Required, SubmitResult, Values } from './Form';
import { Field } from './Field';
import { postQuestion } from './QuestionData';

export const AskPage: React.FC = () => {

    const handleSubmit = async (values: Values): Promise<SubmitResult> => {
        const question = await postQuestion({
            title: values.title,
            content: values.content,
            userName: "Michael",
            created: new Date(),
        });

        return { success: question ? true : false };
    };

    return (
        <Page title="Ask Page">
            <Form submitCaption="Submit Your Question"
                validationRules={{
                    title: [
                        {
                            validator: Required
                        },
                        {
                            validator: MinLength,
                            arg: 10
                        },
                    ],
                    content: [
                        {
                            validator: Required
                        },
                        {
                            validator: MinLength,
                            arg: 50
                        },
                    ],
                }}
                onSubmit={handleSubmit}
                failureMessage="There was a problem with your question"
                successMessage="Your question was successfully submitted"
                >
                    <Field name="title" label="Title" type="Text" />
                    <Field name="content" label="Content" type="TextArea" />
            </Form>
        </Page>
    )
}

export default AskPage;