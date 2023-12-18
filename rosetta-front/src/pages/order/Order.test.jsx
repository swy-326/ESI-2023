describe('Order', () => {

    it('should fetch order data from API and render it on the page', () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      expect(wrapper.find('h1').text()).toBe('Order Title');
    });

    it('should allow user to submit an answer to the order and update the page with the new answer', () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      wrapper.find('form').simulate('submit', { files: [] });

      expect(wrapper.find('.answer').text()).toBe('New Answer');
    });

    it('should display files associated with the order and answer(s)', () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      expect(wrapper.find('.order-files').text()).toBe('Order Files');
      expect(wrapper.find('.answer-files').text()).toBe('Answer Files');
    });

    it('should allow user to accept an order', async () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));
      jest.mock('react-hook-form', () => ({
        useForm: jest.fn().mockReturnValue({
          register: jest.fn(),
          handleSubmit: jest.fn(),
        }),
      }));
      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: jest.fn(),
        useEffect: jest.fn(),
      }));
      jest.mock('@uiw/react-md-editor', () => ({
        MDEditor: jest.fn().mockReturnValue({
          value: '**Digite sua resposta...**',
          onChange: jest.fn(),
        }),
      }));
      jest.mock('../../components/modal/RateProjectModal', () => ({
        RateProjectModal: jest.fn().mockReturnValue({
          isOpen: false,
          setIsOpen: jest.fn(),
          onSucess: jest.fn(),
        }),
      }));
      jest.mock('react-spinners/ClipLoader', () => ({
        ClipLoader: jest.fn().mockReturnValue({
          size: 150,
          color: '#fff',
        }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      wrapper.find('useState').mockImplementation((initialValue) => {
        if (initialValue === false) {
          return [false, jest.fn()];
        } else if (initialValue === null) {
          return [null, jest.fn()];
        } else if (initialValue === '**Digite sua resposta...**') {
          return ['**Digite sua resposta...**', jest.fn()];
        }
      });

      wrapper.find('useEffect').mockImplementation((effect, dependencies) => {
        if (dependencies.length === 0) {
          effect();
        }
      });

      wrapper.find('Button').at(1).simulate('click');
      wrapper.find('Button').at(3).simulate('click');

      expect(wrapper.find('fetchOrder')).toHaveBeenCalled();
      expect(wrapper.find('handleSubmitAnswer')).toHaveBeenCalled();
      expect(wrapper.find('handleAccept')).toHaveBeenCalled();
      expect(wrapper.find('handleSubmitRating')).toHaveBeenCalled();
    });

    it('should fetch order data from API and render it on the page', () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      expect(wrapper.find('h1').text()).toBe('Order Title');
    });

    it('should not display the accept button if the order has already been accepted by another user', () => {
      jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '123' }),
      }));
      jest.mock('../../services/http/api', () => ({
        fetchOrder: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      }));

      const Order = require('./Order').default;

      const wrapper = shallow(<Order />);

      expect(wrapper.find('Button').exists()).toBe(false);
    });

});
