import PropTypes from 'prop-types';

const TextInput = ({ id, label, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      id={id}
      name={id}
      placeholder={label}
      className="text-center w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
      {...props}
    />
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default TextInput;
