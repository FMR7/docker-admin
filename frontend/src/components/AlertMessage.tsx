import PropTypes from 'prop-types';

const AlertMessage = ({ message, isSuccess }) => {
  if (!message) return null;

  return (
    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'} mb-4`} style={{ whiteSpace: 'pre-line' }}>
      <p dangerouslySetInnerHTML={{ __html: message }}></p>
    </div>
  );
};

AlertMessage.propTypes = {
  message: PropTypes.string,
  isSuccess: PropTypes.bool
};

export default AlertMessage;
