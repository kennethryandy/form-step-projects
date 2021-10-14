import { useEffect, useState } from "react";

const usePaginate = ({ data }) => {
  const [pagination, setPagination] = useState({
    active: 0,
    total: 0,
    limit: 12,
  });
  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      total: data.length,
    }));
  }, [data]);

  const handlePagination = (isNext) => {
    let active = isNext ? pagination.active + 1 : pagination.active - 1;
    let total = pagination.total / pagination.limit;

    total = (Math.floor(total) !== total ? Math.floor(total) + 1 : total) - 1;

    if (active < 0) active = 0;

    if (active > total) active = total;

    setPagination((prevState) => ({
      ...prevState,
      active: active,
    }));
  };
  return { pagination, handlePagination };
};

export default usePaginate;
