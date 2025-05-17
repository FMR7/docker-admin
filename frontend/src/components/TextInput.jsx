import PropTypes from 'prop-types';

const TextInput = ({ id, label, type = 'text', readOnly = false, ...props }) => {
  const baseClass = 'input input-lg text-center w-full px-3 py-2 my-1 rounded border border-base-300 dark:border-base-700 text-base-content dark:text-base-content';
  const bgClass = readOnly ? 'bg-base-300 dark:bg-base-700' : 'bg-base-100 dark:bg-base-700';


  return (
    <input
      type={type}
      id={id}
      name={id}
      placeholder={label}
      readOnly={readOnly}
      className={`${baseClass} ${bgClass}`}
      {...props}
    />
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  readOnly: PropTypes.bool
};

export default TextInput;
