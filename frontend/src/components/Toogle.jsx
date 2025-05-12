import PropTypes from 'prop-types';

const Toogle = ({ id, active, label, ...props }) => {
  return (
    <div class="flex justify-start items-center space-x-2 my-3">
      {label && <label htmlFor={id} class="w-32 text-right">{label}</label>}
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={active}
        onChange={props.onChange}
        class="toggle border-error bg-error text-error-content checked:border-success checked:bg-success checked:text-success-content"
      />
    </div>
  );
};

Toogle.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Toogle;
