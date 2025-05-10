import PropTypes from 'prop-types';

const Toogle = ({ active, ...props }) => {
  return (
    <input type="checkbox" checked={active} class="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800" />
  );
};

Toogle.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default Toogle;
