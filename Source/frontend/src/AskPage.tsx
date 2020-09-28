import React from 'react'
import { Page } from './Page'
import { Form } from './Form';
import { Field } from './Field';

export const AskPage: React.FC = () => {
    return (
        <Page title="Ask Page">
            <Form submitCaption="Submit Your Question">
                <Field name="title" label="Title" type="Text" />
                <Field name="content" label="Content" type="TextArea" />
            </Form>
        </Page>
    )
}

export default AskPage;