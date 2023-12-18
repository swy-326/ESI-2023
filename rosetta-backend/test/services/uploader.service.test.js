describe('generateFilename', () => {

    it('should generate a unique filename with a random 16-byte string and the current timestamp', () => {
        const file = { originalname: 'testfile' }
        const cb = jest.fn()
        generateFilename(null, file, cb)
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^[a-f0-9]{32}-\d+\.\w+$/))
    });

    it('should return an error when called with a null file argument', () => {
        const file = null
        const cb = jest.fn()
        generateFilename(null, file, cb)
        expect(cb).toHaveBeenCalledWith(expect.any(Error), null)
    });

});