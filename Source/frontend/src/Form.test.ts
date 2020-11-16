import { Required } from "./Form";

test('When required is called with empty string, an error should be returned', () => {
    const result = Required("");

    expect(result).toBe("This must be populated");
});

test('When required is called with a value, an empty string should be returned', () => {
    const result = Required('test');
    expect(result).toBe('');
});