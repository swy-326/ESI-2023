describe('Orders', () => {

    it('should render the component without crashing', () => {
      jest.mock('../../components', () => ({
        Button: jest.fn(),
        Container: jest.fn(),
        Topbar: jest.fn(),
      }));
      jest.mock('react-tailwindcss-select', () => ({
        default: jest.fn(),
      }));
      jest.mock('../../components/common/OrderItem/OrderItem', () => jest.fn());
      jest.mock('../../services/http/api', () => ({
        fetchOrders: jest.fn(),
      }));
      jest.mock('react-router-dom', () => ({
        Link: jest.fn(),
      }));
      jest.mock('react-spinners/ClipLoader', () => ({
        default: jest.fn(),
      }));

      const Orders = require('./Orders').default;

      const div = document.createElement('div');
      ReactDOM.render(<Orders />, div);
    });

    it('should fetch orders from the API and display them', async () => {
      jest.mock('../../components', () => ({
        Button: jest.fn(),
        Container: jest.fn(),
        Topbar: jest.fn(),
      }));
      jest.mock('react-tailwindcss-select', () => ({
        default: jest.fn(),
      }));
      jest.mock('../../components/common/OrderItem/OrderItem', () => jest.fn());
      jest.mock('../../services/http/api', () => ({
        fetchOrders: jest.fn().mockResolvedValueOnce([{ id: 1, title: 'Order 1' }, { id: 2, title: 'Order 2' }]),
      }));
      jest.mock('react-router-dom', () => ({
        Link: jest.fn(),
      }));
      jest.mock('react-spinners/ClipLoader', () => ({
        default: jest.fn(),
      }));

      const Orders = require('./Orders').default;

      const div = document.createElement('div');
      ReactDOM.render(<Orders />, div);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(div.querySelectorAll('.order-item')).toHaveLength(2);
    });

    it('should filter orders based on selected tags, languages, and price', async () => {
      jest.mock('../../components', () => ({
        Button: jest.fn(),
        Container: jest.fn(),
        Topbar: jest.fn(),
      }));
      jest.mock('react-tailwindcss-select', () => ({
        default: jest.fn(),
      }));
      jest.mock('../../components/common/OrderItem/OrderItem', () => jest.fn());
      jest.mock('../../services/http/api', () => ({
        fetchOrders: jest.fn().mockResolvedValueOnce([{ id: 1, title: 'Order 1' }, { id: 2, title: 'Order 2' }]),
      }));
      jest.mock('react-router-dom', () => ({
        Link: jest.fn(),
      }));
      jest.mock('react-spinners/ClipLoader', () => ({
        default: jest.fn(),
      }));

      const Orders = require('./Orders').default;

      const div = document.createElement('div');
      ReactDOM.render(<Orders />, div);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectTags = div.querySelector('.select-tags');
      const selectLanguages = div.querySelector('.select-languages');
      const inputPrice = div.querySelector('.input-price');
      selectTags.value = 'WORK_PROJECT';
      selectLanguages.value = 'ENGLISH';
      inputPrice.value = 50;
      fireEvent.change(selectTags);
      fireEvent.change(selectLanguages);
      fireEvent.change(inputPrice);

      const filterButton = div.querySelector('.filter-button');
      fireEvent.click(filterButton);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(div.querySelectorAll('.order-item')).toHaveLength(1);
    });

    it('should navigate to order details page when an order is clicked', () => {
      jest.mock('../../components', () => ({
        Button: jest.fn(),
        Container: jest.fn(),
        Topbar: jest.fn(),
      }));
      jest.mock('react-tailwindcss-select', () => ({
        default: jest.fn(),
      }));
      jest.mock('../../components/common/OrderItem/OrderItem', () => jest.fn());
      jest.mock('../../services/http/api', () => ({
        fetchOrders: jest.fn(),
      }));
      jest.mock('react-router-dom', () => ({
        Link: jest.fn(),
        useNavigate: jest.fn(),
      }));
      jest.mock('react-spinners/ClipLoader', () => ({
        default: jest.fn(),
      }));

      const Orders = require('./Orders').default;

      const orders = [
        {
          id: 1,
          user: {
            avatar: 'avatar_url',
          },
          main_language: 'English',
          languages: ['English', 'Spanish'],
          tags: ['Work Project', 'Video'],
          title: 'Order 1',
        },
        {
          id: 2,
          user: {
            avatar: 'avatar_url',
          },
          main_language: 'Spanish',
          languages: ['Spanish', 'Portuguese'],
          tags: ['Book'],
          title: 'Order 2',
        },
      ];

      const fetchOrdersMock = jest.fn().mockResolvedValue({ json: () => orders });
      const waitMock = jest.fn().mockResolvedValue();

      jest.mock('../../services/http/api', () => ({
        fetchOrders: fetchOrdersMock,
      }));

      jest.mock('./Orders', () => ({
        wait: waitMock,
      }));

      const div = document.createElement('div');
      ReactDOM.render(<Orders />, div);

      const orderLink = div.querySelector('a');
      fireEvent.click(orderLink);

      expect(fetchOrdersMock).toHaveBeenCalledTimes(1);
      expect(fetchOrdersMock).toHaveBeenCalledWith();
      expect(waitMock).toHaveBeenCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1000);
    });

});
