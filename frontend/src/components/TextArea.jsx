import PropTypes from 'prop-types';

const TextArea = ({ id, label, type = 'text', ...props }) => {
  return (
    <textarea
      id={id}
      name={id}
      placeholder={label}
      className="textarea input-lg text-center w-full px-3 py-2 my-1 rounded border border-base-300 dark:border-base-700 bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content"
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
