describe('CreateOrder', () => {

    it('should render the form with all necessary inputs and selects', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const form = div.querySelector('form');
      const titleInput = div.querySelector('input[id="name"]');
      const tagsSelect = div.querySelector('div[class="w-1/2 mb-4"] select');
      const mainLanguageSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:first-child');
      const languagesSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:last-child');
      const descriptionTextarea = div.querySelector('textarea');
      const fileInput = div.querySelector('input[type="file"]');
      const priceInput = div.querySelector('input[type="range"]');
      const submitButton = div.querySelector('button[type="submit"]');

      expect(form).toBeInTheDocument();
      expect(titleInput).toBeInTheDocument();
      expect(tagsSelect).toBeInTheDocument();
      expect(mainLanguageSelect).toBeInTheDocument();
      expect(languagesSelect).toBeInTheDocument();
      expect(descriptionTextarea).toBeInTheDocument();
      expect(fileInput).toBeInTheDocument();
      expect(priceInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      ReactDOM.unmountComponentAtNode(div);
    });

    it('should allow the user to select multiple tags and languages', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const tagsSelect = div.querySelector('div[class="w-1/2 mb-4"] select');
      const languagesSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:last-child');

      fireEvent.change(tagsSelect, { target: { value: ['tag1', 'tag2'] } });
      expect(tagsSelect.value).toEqual(['tag1', 'tag2']);

      fireEvent.change(languagesSelect, { target: { value: ['language1', 'language2'] } });
      expect(languagesSelect.value).toEqual(['language1', 'language2']);

      ReactDOM.unmountComponentAtNode(div);
    });

    it('should allow the user to select a main language', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const mainLanguageSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:first-child');

      fireEvent.change(mainLanguageSelect, { target: { value: 'mainLanguage' } });
      expect(mainLanguageSelect.value).toEqual('mainLanguage');

      ReactDOM.unmountComponentAtNode(div);
    });

    it('should submit the form with empty fields and display error messages', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const form = div.querySelector('form');
      const submitButton = div.querySelector('button[type="submit"]');

      // Submit the form with empty fields
      fireEvent.submit(form);
      expect(submitButton).toBeDisabled();
      expect(div.textContent).toContain('Please fill out this field');

      ReactDOM.unmountComponentAtNode(div);
    });

    it('should render the form with all necessary inputs and selects', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const form = div.querySelector('form');
      const titleInput = div.querySelector('input[id="name"]');
      const tagsSelect = div.querySelector('div[class="w-1/2 mb-4"] select');
      const mainLanguageSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:first-child');
      const languagesSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:last-child');
      const descriptionTextarea = div.querySelector('textarea');
      const fileInput = div.querySelector('input[type="file"]');
      const priceInput = div.querySelector('input[type="range"]');
      const submitButton = div.querySelector('button[type="submit"]');

      expect(form).toBeInTheDocument();
      expect(titleInput).toBeInTheDocument();
      expect(tagsSelect).toBeInTheDocument();
      expect(mainLanguageSelect).toBeInTheDocument();
      expect(languagesSelect).toBeInTheDocument();
      expect(descriptionTextarea).toBeInTheDocument();
      expect(fileInput).toBeInTheDocument();
      expect(priceInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      ReactDOM.unmountComponentAtNode(div);
    });

    it('should render the form with a price input', () => {
      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);
      const priceInput = div.querySelector('input[type="range"]');
      expect(priceInput).toBeInTheDocument();
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should submit the form and create a new order when all required fields are filled', () => {
      const mockNavigate = jest.fn();
      const mockFetch = jest.fn();
      const mockFormData = jest.fn();
      const mockLocalStorageGetItem = jest.fn();
      const mockUseNavigate = jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
      jest.spyOn(require('react'), 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
      jest.spyOn(require('react-hook-form'), 'useForm').mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((callback) => callback),
        watch: jest.fn(),
      });
      jest.spyOn(require('react-tailwindcss-select'), 'default').mockReturnValue(jest.fn());
      jest.spyOn(require('react'), 'useContext').mockReturnValue({ avatar: null });
      jest.spyOn(require('react'), 'useEffect').mockImplementation((callback) => callback());
      jest.spyOn(require('react'), 'useMemo').mockReturnValueOnce([{ value: 'tag1' }, { value: 'tag2' }]);
      jest.spyOn(require('../../static/languages'), 'default').mockReturnValue([{ value: 'language1' }, { value: 'language2' }]);
      jest.spyOn(require('../../components'), 'Topbar').mockReturnValue(<div />);
      jest.spyOn(require('react-dom'), 'render').mockImplementation((component, container) => {
        ReactDOM.render(component, container);
        return container.firstChild;
      });
      jest.spyOn(require('react-dom'), 'unmountComponentAtNode').mockImplementation((container) => {
        ReactDOM.unmountComponentAtNode(container);
      });
      jest.spyOn(global, 'fetch').mockImplementation(mockFetch);
      global.FormData = mockFormData;
      global.localStorage = { getItem: mockLocalStorageGetItem };

      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);

      const titleInput = div.querySelector('input[id="name"]');
      const tagsSelect = div.querySelector('div[class="w-1/2 mb-4"] select');
      const mainLanguageSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:first-child');
      const languagesSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:last-child');
      const descriptionTextarea = div.querySelector('textarea');
      const fileInput = div.querySelector('input[type="file"]');
      const priceInput = div.querySelector('input[type="range"]');
      const submitButton = div.querySelector('button[type="submit"]');

      titleInput.value = 'Test Title';
      tagsSelect.value = 'tag1';
      mainLanguageSelect.value = 'language1';
      languagesSelect.value = ['language1', 'language2'];
      descriptionTextarea.value = 'Test Description';
      fileInput.files = ['file1', 'file2'];
      priceInput.value = 50;

      submitButton.click();

      expect(mockFormData).toHaveBeenCalledTimes(1);
      expect(mockFormData).toHaveBeenCalledWith();
      expect(mockFormData().append).toHaveBeenCalledTimes(6);
      expect(mockFormData().append).toHaveBeenCalledWith('title', 'Test Title');
      expect(mockFormData().append).toHaveBeenCalledWith('tags', 'tag1');
      expect(mockFormData().append).toHaveBeenCalledWith('main_language', 'language1');
      expect(mockFormData().append).toHaveBeenCalledWith('languages', 'language1,language2');
      expect(mockFormData().append).toHaveBeenCalledWith('description', 'Test Description');
      expect(mockFormData().append).toHaveBeenCalledWith('files', 'file1');
      expect(mockFormData().append).toHaveBeenCalledWith('files', 'file2');
      expect(mockLocalStorageGetItem).toHaveBeenCalledTimes(1);
      expect(mockLocalStorageGetItem).toHaveBeenCalledWith('token');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/orders/create', {
        body: mockFormData(),
        method: 'POST',
        headers: {
          Authorization: 'Bearer null',
        },
      });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/pedidos');

      ReactDOM.unmountComponentAtNode(div);
      mockUseNavigate.mockRestore();
    });

    it('should submit the form with invalid file types and display error messages', () => {
      const navigateMock = jest.fn();
      const useFormMock = jest.spyOn(require('react-hook-form'), 'useForm');
      useFormMock.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((callback) => callback),
        watch: jest.fn(),
      });
      const setSelectedTagsMock = jest.fn();
      const setSelectedLanguagesMock = jest.fn();
      const setSelectedMainLanguageMock = jest.fn();
      const useStateMock = jest.spyOn(require('react'), 'useState');
      useStateMock.mockImplementation((initialValue) => [initialValue, jest.fn()]);

      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);

      const titleInput = div.querySelector('input[id="name"]');
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      const tagsSelect = div.querySelector('div[class="w-1/2 mb-4"] select');
      fireEvent.change(tagsSelect, { target: { value: 'tag1' } });

      const mainLanguageSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:first-child');
      fireEvent.change(mainLanguageSelect, { target: { value: 'language1' } });

      const languagesSelect = div.querySelector('div[class="w-full grid grid-cols-2 gap-x-6 mb-4"] select:last-child');
      fireEvent.change(languagesSelect, { target: { value: ['language2', 'language3'] } });

      const descriptionTextarea = div.querySelector('textarea');
      fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });

      const fileInput = div.querySelector('input[type="file"]');
      const file1 = new File(['file1'], 'file1.txt', { type: 'text/plain' });
      const file2 = new File(['file2'], 'file2.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file1, file2],
      });
      fireEvent.change(fileInput);

      const priceInput = div.querySelector('input[type="range"]');
      fireEvent.change(priceInput, { target: { value: 50 } });

      const submitButton = div.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/orders/create', {
        body: expect.any(FormData),
        method: 'POST',
        headers: {
          Authorization: 'Bearer null',
        },
      });

      expect(navigateMock).toHaveBeenCalledWith('/pedidos');

      ReactDOM.unmountComponentAtNode(div);
      useFormMock.mockRestore();
      useStateMock.mockRestore();
    });

    it('should cancel the form submission and return to the orders page when the cancel button is clicked', () => {
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        useNavigate: () => mockNavigate,
      }));

      const div = document.createElement('div');
      ReactDOM.render(<CreateOrder />, div);

      const cancelButton = div.querySelector('button[type="button"]');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/pedidos');

      ReactDOM.unmountComponentAtNode(div);
    });

});
