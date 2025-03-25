const Select = ({ options = [], value, onChange, className, children }) => {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
      >
        {/* If children are provided, render them. Otherwise, use options */}
        {children && children.length > 0 ? (
          children
        ) : options.length === 0 ? (
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