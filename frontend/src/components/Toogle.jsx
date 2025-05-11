import PropTypes from 'prop-types';

const Toogle = ({ active, ...props }) => {
  return (
    <input type="checkbox" checked={active} onChange={props.onChange}
      class="toggle border-error bg-error text-error-content checked:border-success checked:bg-success checked:text-success-content" />
  );
};

Toogle.propTypes = {
  active: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default Toogle;
