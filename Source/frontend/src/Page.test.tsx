import React from 'react';
import { render, cleanup } from "@testing-library/react";
import { Page } from './Page';

test("When the Page component is rendered with a title, it should contain the correct title in the H2 element", () => {
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

test("When the Page component is rendered with content, it should contain the correct content", () => {
    const contentElement = (
        <button>
            Click me            
        </button>
    );

    const renderResult = render(
        <Page>
            {contentElement}
        </Page>
    )

    const pageTitleHTMLElement = renderResult.getByText("Click me");

    expect(pageTitleHTMLElement).not.toBeNull();
    expect(pageTitleHTMLElement.tagName).toBe("BUTTON");
    expect(pageTitleHTMLElement.innerHTML).toBe("Click me");
});