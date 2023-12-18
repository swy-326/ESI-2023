describe('Profile', () => {

    it('should render the component with user data when data is fetched successfully', () => {
      HttpClient.findUser = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(user) });

      render(
        <Router>
          <Profile />
        </Router>
      );

      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByAltText(`Avatar de ${user.name}`)).toBeInTheDocument();
      expect(screen.getByText(user.mini_bio)).toBeInTheDocument();
      expect(screen.getByText(getLanguageLabel(user.languages[0]))).toBeInTheDocument();
      expect(screen.getByText(getTagValue(user.abilities[0]))).toBeInTheDocument();
    });

    it('should display users biography', () => {
      render(
        <Router>
          <Profile />
        </Router>
      );

      expect(screen.getByText(user.biography)).toBeInTheDocument();
    });

    it('should render the users portfolio items', () => {
      HttpClient.findUser = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(user) });

      render(
        <Router>
          <Profile />
        </Router>
      );

      expect(screen.getByText(user.projects[0].name)).toBeInTheDocument();
      expect(screen.getByText(user.projects[1].name)).toBeInTheDocument();
      expect(screen.getByText(user.projects[2].name)).toBeInTheDocument();
    });

    it('should display users average rating and total number of ratings', () => {
      HttpClient.findUser = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(state) });

      render(
        <Router>
          <Profile />
        </Router>
      );

      expect(screen.getByText(mean.toFixed(2))).toBeInTheDocument();
      expect(screen.getByText(stars)).toBeInTheDocument();
      expect(screen.getByText(`(${numberOfRaiting}) avaliações`)).toBeInTheDocument();
    });

});
