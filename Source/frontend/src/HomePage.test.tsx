import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import { HomePage } from './HomePage';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

test('When HomePage first rendered, loading indicator should show', () => {
    let mock: any = jest.fn();
    
    const { getByText } = render(
        <BrowserRouter>
            <HomePage history={mock} location={mock} match={mock} questionsLoading={true}/>
        </BrowserRouter>,
    );

    const loading = getByText('Loading...');
    expect(loading).not.toBeNull();
});
