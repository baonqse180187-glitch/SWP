// Common input component
export default function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    icon,
    className = ''
}) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`
            block w-full rounded-lg border 
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
