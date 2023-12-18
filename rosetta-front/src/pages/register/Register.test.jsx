describe('Register', () => {

    it('should render the registration form with all required fields', () => {
      const wrapper = shallow(<Register />);
      
      expect(wrapper.find('form')).toHaveLength(1);
      expect(wrapper.find('Input[labelText="Nome"]')).toHaveLength(1);
      expect(wrapper.find('Input[labelText="Email"]')).toHaveLength(1);
      expect(wrapper.find('Input[labelText="Senha"]')).toHaveLength(1);
      expect(wrapper.find('Input[labelText="Confirmar senha"]')).toHaveLength(1);
      expect(wrapper.find('Button[type="submit"]')).toHaveLength(1);
    });

    it('should submit the form and send a POST request to the backend with the user data', () => {
      // Arrange
      const navigateMock = jest.fn();
      const fetchMock = jest.fn(() => Promise.resolve({ json: () => Promise.resolve() }));
      global.fetch = fetchMock;
      useNavigate.mockReturnValue(navigateMock);
      const wrapper = shallow(<Register />);
  
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
  
      expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/user/create", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          email: "",
          password: "",
          confirm_password: ""
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      expect(navigateMock).toHaveBeenCalledWith("/");
    });

    it('should redirect the user to the homepage after successful registration', () => {
      const navigateMock = jest.fn();
      useNavigate.mockReturnValue(navigateMock);
      const wrapper = shallow(<Register />);
  
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
  
      expect(navigateMock).toHaveBeenCalledWith("/");
    });

    it('should submit the form with missing required fields and display error messages', () => {
      const wrapper = shallow(<Register />);
  
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
  
      expect(wrapper.find('Input[labelText="Nome"]').prop('required')).toBe(true);
      expect(wrapper.find('Input[labelText="Email"]').prop('required')).toBe(true);
      expect(wrapper.find('Input[labelText="Senha"]').prop('required')).toBe(true);
      expect(wrapper.find('Input[labelText="Confirmar senha"]').prop('required')).toBe(true);
      expect(wrapper.find('Button[type="submit"]').prop('onClick')).toBeInstanceOf(Function);
      expect(wrapper.find('Button[type="submit"]').prop('onClick')).toThrowError("As senhas não coincidem");
    });

    it('should display an error message if the passwords do not match', () => {
      const wrapper = shallow(<Register />);
      const form = wrapper.find('form');
      const passwordInput = wrapper.find('Input[labelText="Senha"]');
      const confirmPasswordInput = wrapper.find('Input[labelText="Confirmar senha"]');
      const button = wrapper.find('Button[type="submit"]');
      const alertSpy = jest.spyOn(window, 'alert');

      passwordInput.props().onChange({ target: { value: 'password' } });
      confirmPasswordInput.props().onChange({ target: { value: 'differentpassword' } });
      form.simulate('submit');

      expect(alertSpy).toHaveBeenCalledWith('As senhas não coincidem');
    });

});
