import React from 'react'

const FormRow = ({
  type,
  name,
  labelText,
  defaultValue = '',
  onChange = () => null,
  placeholder,
}) => {
  return (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className='block text-gray-700 text-sm font-bold mb-2'
      >
        {labelText || name}
      </label>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        placeholder={placeholder}
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        required
        onChange={onChange}
      />
    </div>
  )
}

export default FormRow
