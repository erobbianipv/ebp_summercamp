import React, { useState, useEffect } from 'react';

interface EditableTextProps {
  initialValue: string;
  onSave: (value: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ initialValue, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="bg-green-900/50 text-white px-2 py-1 rounded-md outline-none"
      />
    );
  }

  return (
    <span onDoubleClick={handleDoubleClick} className="px-2 py-1">
      {value}
    </span>
  );
};

export default EditableText;
