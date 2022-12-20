import { hello } from '../../src/index';

describe('hello', () => {
    it('casual', () => {
        expect(hello()).toBe('world');
    });
});
