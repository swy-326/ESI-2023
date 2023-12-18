describe('LandingPage', () => {

    it('should render the landing page with all components and sections', () => {
      const div = document.createElement('div');
  
      ReactDOM.render(<LandingPage />, div);
  
      expect(div.innerHTML).toContain('Topbar');
      expect(div.innerHTML).toContain('Dialog');
      expect(div.innerHTML).toContain('Banner');
      expect(div.innerHTML).toContain('Container');
      expect(div.innerHTML).toContain('Image');
      expect(div.innerHTML).toContain('Button');
      expect(div.innerHTML).toContain('Input');
    });

    it('should allow the user to input email and password in the login dialog', () => {
      const div = document.createElement('div');
      ReactDOM.render(<LandingPage />, div);
      const entrarButton = div.querySelector('.bg-secundary.bg-secundary-hover');
      entrarButton.click();
      const emailInput = div.querySelector('#email');
      const passwordInput = div.querySelector('#password');
  
      emailInput.value = 'test@example.com';
      passwordInput.value = 'password123';
  
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    it('should display an error message when the login credentials are incorrect', () => {
      const div = document.createElement('div');
      ReactDOM.render(<LandingPage />, div);
      const entrarButton = div.querySelector('.bg-secundary.bg-secundary-hover');
      entrarButton.click();
      const emailInput = div.querySelector('#email');
      const passwordInput = div.querySelector('#password');
  
      emailInput.value = 'test@example.com';
      passwordInput.value = 'wrongpassword';
      const loginButton = div.querySelector('.bg-primary-500.text-lg.font-bold');
      loginButton.click();
  
      expect(window.alert).toHaveBeenCalledWith('Usuário ou Senha Incorretas');
    });

    it('should send a POST request to the backend when clicking on the "Entrar" button in the login dialog', () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              token: "mockToken"
            })
        })
      );
      global.fetch = mockFetch;
      const mockNavigate = jest.fn();
      const mockSetIsOpen = jest.fn();
      const mockSetEmail = jest.fn();
      const mockSetPassword = jest.fn();
      const mockChangeEvent = {
        target: {
          value: "mockValue"
        }
      };
      const mockEvent = {
        preventDefault: jest.fn()
      };
      const mockLocalStorage = {
        setItem: jest.fn()
      };
      global.localStorage = mockLocalStorage;

      render(<LandingPage />);
      fireEvent.click(screen.getByText("Entrar"));
      fireEvent.change(screen.getByPlaceholderText("Digite seu email"), mockChangeEvent);
      fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), mockChangeEvent);
      fireEvent.click(screen.getByText("Entrar"));

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "mockValue", password: "mockValue" }),
        headers: { "Content-Type": "application/json" }
      });
      expect(mockNavigate).toHaveBeenCalledWith("/perfil");
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockSetEmail).toHaveBeenCalledWith("");
      expect(mockSetPassword).toHaveBeenCalledWith("");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
    });

});
