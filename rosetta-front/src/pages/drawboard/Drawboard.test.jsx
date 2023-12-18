describe('Drawboard', () => {

    it('should render a dialog box with a title and description', () => {
      render(<Drawboard />);
      expect(screen.getByText('Avaliar Projeto')).toBeInTheDocument();
      expect(screen.getByText('Conte sua experiência com o trabalho do tradutor')).toBeInTheDocument();
    });

    it('should display a star rating component with 5 stars', () => {
      render(<Drawboard />);
      expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    it('should allow the user to select a rating by clicking on a star', () => {
      render(<Drawboard />);
      const stars = screen.getAllByRole('button');
      fireEvent.click(stars[2]);
      expect(stars[2].querySelector('.star')).toHaveStyle('color: yellow');
    });

    it('should display a submit button', () => {
      render(<Drawboard />);
      expect(screen.getByText('Avaliar')).toBeInTheDocument();
    });

    it('should close the dialog box when the user submits their review', () => {
      render(<Drawboard />);
      const submitButton = screen.getByText('Avaliar');
      fireEvent.click(submitButton);
      expect(screen.queryByText('Avaliar Projeto')).not.toBeInTheDocument();
    });

    it('should submit the review when the user clicks the submit button', () => {
      render(<Drawboard />);
      const submitButton = screen.getByText('Avaliar');
      const logSpy = jest.spyOn(console, 'log');
  
      fireEvent.click(submitButton);
  
      expect(logSpy).toHaveBeenCalled();
    });

    it('should display an error message if the review submission fails', () => {
      const mockHandleSubmit = jest.fn().mockImplementation(() => {
        throw new Error('Submission failed');
      });

      render(<Drawboard />);

      fireEvent.click(screen.getByText('Avaliar'));

      expect(screen.getByText('Error: Submission failed')).toBeInTheDocument();
    });

    it('should display a success message when the review submission succeeds', () => {
      render(<Drawboard />);
      const submitButton = screen.getByText('Avaliar');
      fireEvent.click(submitButton);
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
});
