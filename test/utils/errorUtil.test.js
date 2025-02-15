const { throwIfMissing } = require("@utils");

describe('errorUtil', () => {
  describe('#throwIfMissing', () => {
    const message = 'is required';
    const error = new TypeError(message);

    it('should throw error if argument is missing', () => {
      expect(() => throwIfMissing(null, message)).toThrow(error);
    });

    it('should not throw error if argument is provided', () => {
      expect(() => throwIfMissing('value', message)).not.toThrow();
    });
  });
});