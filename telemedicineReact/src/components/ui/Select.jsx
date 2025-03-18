const Select = ({ options = [], value, onChange, className }) => {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
      >
        {options.length === 0 ? (
          <option disabled>No options available</option>
        ) : (
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    );
  };
  
  export default Select;