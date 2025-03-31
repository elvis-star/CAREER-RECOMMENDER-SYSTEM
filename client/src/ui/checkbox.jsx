import { useState } from 'react';
import PropTypes from 'prop-types';

export function Checkbox({ id, checked, onChange, className }) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    if (onChange) onChange(e);
  };

  return (
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      className={`w-4 h-4 rounded border-gray-300 text-primary focus:ring focus:ring-primary ${className}`}
    />
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
  onChange: null,
  className: '',
};
