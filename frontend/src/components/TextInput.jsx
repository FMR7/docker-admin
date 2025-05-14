import PropTypes from 'prop-types';

const TextInput = ({ id, label, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      id={id}
      name={id}
      placeholder={label}
      className="input input-lg text-center w-full px-3 py-2 my-1 rounded border border-base-300 dark:border-base-700 bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content"
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
