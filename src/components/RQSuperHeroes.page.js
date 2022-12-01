import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  /* isLoading remains false when finished, isFetching changes to true when cache is updated */
  const { isLoading, data, isError, error, isFetching } = useQuery(
    "super-heroes",
    fetchSuperHeroes,
    {
      // https://www.youtube.com/watch?v=A3gN4ji5p6E&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=8
      // cacheTime: 5000 // 5min is default, after this value the query is garbage collected
      // staleTime: 30000, // 0 is default, controls when the next network request can run in the background
      // refetchOnMount: true, // true: when data is stale, false: never, always: at every mount
      // refetchOnWindowFocus: true, // default is true, rest is same as on mount
    }
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>RQ Superheroes</h2>
      {data?.data.map((hero) => (
        <div key={hero.name}>{hero.name}</div>
      ))}
    </>
  );
};
