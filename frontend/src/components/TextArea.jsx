import PropTypes from 'prop-types';

const TextArea = ({ id, label, type = 'text', ...props }) => {
  return (
    <textarea
      id={id}
      name={id}
      placeholder={label}
      className="textarea input-lg text-center w-full px-3 py-2 my-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
      {...props}
    />
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default TextArea;
