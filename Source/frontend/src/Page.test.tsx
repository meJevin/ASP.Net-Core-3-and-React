import React from 'react';
import { render, cleanup } from "@testing-library/react";
import { Page } from './Page';

test("When the Page component is rendered, it should contain the correct title in the H2 element", () => {
    const title = "Test title";

    const renderResult = render(
        <Page title={title}>
        </Page>
    )

    const pageTitleHTMLElement = renderResult.getByText(title);

    expect(pageTitleHTMLElement).not.toBeNull();
    expect(pageTitleHTMLElement.tagName).toBe("H2");
    expect(pageTitleHTMLElement.innerHTML).toBe(title);
});