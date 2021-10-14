import { useState } from "react";

const useSearch = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const resetSearch = () => {
    setValue("");
  };

  return { value, onChange, resetSearch };
};

export default useSearch;
