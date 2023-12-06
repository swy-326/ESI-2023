// Generated by CodiumAI

describe('AddProjectModal', () => {

    // Renders a dialog with a form to add a project
    it('should render a dialog with a form to add a project', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
  
      // Act
      const dialog = wrapper.find(Dialog);
      const form = wrapper.find('form');
  
      // Assert
      expect(dialog.exists()).toBe(true);
      expect(form.exists()).toBe(true);
    });

    // Displays a title and description for the dialog
    it('should display a title and description for the dialog', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
  
      // Act
      const title = wrapper.find(Dialog.Title);
      const description = wrapper.find(Dialog.Description);
  
      // Assert
      expect(title.exists()).toBe(true);
      expect(description.exists()).toBe(true);
    });

    // Renders two input fields for project name and URL
    it('should render two input fields for project name and URL', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
  
      // Act
      const inputs = wrapper.find(Input);
  
      // Assert
      expect(inputs.length).toBe(2);
    });

    // Submitting the form with empty fields should not log any data
    it('should not log any data when submitting the form with empty fields', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
      const form = wrapper.find('form');
      const logSpy = jest.spyOn(console, 'log');
  
      // Act
      form.simulate('submit');
  
      // Assert
      expect(logSpy).not.toHaveBeenCalled();
    });

    // Closing the dialog without submitting the form should not log any data
    it('should not log any data when closing the dialog without submitting the form', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
      const dialog = wrapper.find(Dialog);
      const logSpy = jest.spyOn(console, 'log');
  
      // Act
      dialog.props().onClose();
  
      // Assert
      expect(logSpy).not.toHaveBeenCalled();
    });

    // Clicking outside the dialog should close it
    it('should close the dialog when clicking outside', () => {
      // Arrange
      const wrapper = mount(<AddProjectModal />);
      const dialog = wrapper.find(Dialog);
  
      // Act
      dialog.props().onClose();
  
      // Assert
      expect(dialog.props().open).toBe(false);
    });
});
