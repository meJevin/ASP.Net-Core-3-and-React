import React from 'react'
import { Page } from './Page'
import { Form, MinLength, Required } from './Form';
import { Field } from './Field';

export const AskPage: React.FC = () => {
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
                >
                <Field name="title" label="Title" type="Text" />
                <Field name="content" label="Content" type="TextArea" />
            </Form>
        </Page>
    )
}

export default AskPage;