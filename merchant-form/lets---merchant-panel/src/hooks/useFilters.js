import { useState, useEffect } from "react";

const useFilters = (initialData, search, searchType, type) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [byMonths, setByMonths] = useState(false);
  useEffect(() => {
    if (initialData?.length > 0) {
      // if (status === "expired") {
      //   setData(() => {
      //     return initialData?.filter((data) => {
      //       if (filterType) {
      //         return (
      //           new Date(data.end_date).getTime() < new Date().getTime() &&
      //           data.percentage === filterType &&
      //           data.promo.toLowerCase().includes(search.value.toLowerCase())
      //         );
      //       } else {
      //         return (
      //           new Date(data.end_date).getTime() < new Date().getTime() &&
      //           data.promo.toLowerCase().includes(search.value.toLowerCase())
      //         );
      //       }
      //     });
      //   });
      // } else
      if (
        Date.parse(new Date(filterType)) &&
        Date.parse(new Date(filterType)) !== 0 &&
        !filterType.toString().includes("%")
      ) {
        setData(() => {
          if (byMonths) {
            return initialData?.filter((data) => {
              if (status) {
                return (
                  data.status === status &&
                  new Date(data.created_at).getMonth() ===
                    new Date(filterType).getMonth() &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              } else {
                return (
                  new Date(data.created_at).getMonth() ===
                    new Date(filterType).getMonth() &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              }
            });
          } else {
            return initialData?.filter((data) => {
              if (status) {
                return (
                  data.status === status &&
                  new Date(data.created_at).toDateString() ===
                    new Date(filterType).toDateString() &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              } else {
                return (
                  new Date(data.created_at).toDateString() ===
                    new Date(filterType).toDateString() &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              }
            });
          }
        });
      } else {
        setData(() => {
          if (status && filterType) {
            return initialData?.filter((data) => {
              if (data.end_date) {
                return (
                  data.status === status &&
                  (filterType.includes("%")
                    ? data[type].toString().split(".")[1].charAt(0) ===
                      filterType.charAt(0)
                    : data[type] === filterType) &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              } else {
                return (
                  data.status === status &&
                  data[type] === filterType &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              }
            });
          } else if (status) {
            return initialData?.filter((data) => {
              if (data.end_date) {
                return (
                  // new Date(data.end_date).getTime() > new Date().getTime() &&
                  data.status === status &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              } else {
                return (
                  data.status === status &&
                  Object.keys(data).some((key) => {
                    const individData = data[key];
                    if (individData) {
                      return individData
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(search.value.toLowerCase());
                    }
                  })
                );
              }
            });
          } else if (filterType) {
            return initialData?.filter((data) => {
              return (
                (filterType.includes("%")
                  ? data[type].toString().split(".")[1].charAt(0) ===
                    filterType.charAt(0)
                  : data[type] === filterType) &&
                Object.keys(data).some((key) => {
                  const individData = data[key];
                  if (individData) {
                    return individData
                      ?.toString()
                      ?.toLowerCase()
                      ?.includes(search.value.toLowerCase());
                  }
                })
              );
            });
          } else {
            return initialData?.filter((data) =>
              Object.keys(data).some((key) => {
                const individData = data[key];
                if (individData) {
                  return individData
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(search.value.toLowerCase());
                }
              })
            );
          }
        });
      }
    } else {
      setData([]);
    }
  }, [
    search.value,
    status,
    filterType,
    initialData,
    searchType,
    type,
    byMonths,
    setByMonths,
  ]);

  const resetFilters = () => {
    setData(initialData);
    setStatus("");
    setFilterType("");
    search.resetSearch();
  };

  return {
    data,
    setStatus,
    status,
    filterType,
    setFilterType,
    resetFilters,
    setData,
    setByMonths,
  };
};

export default useFilters;
