import React from "react";
import { useSuperHeroesData } from "../hooks/useSuperHeroesData";

export const RQSuperHeroesPage = () => {
  const onSuccess = (data) => {
    console.log("perform side effect after data fetching", data);
  };

  const onError = (error) => {
    console.log("perform side effect after encountering error", error);
  };

  /* isLoading remains false when finished, isFetching changes to true when cache is updated */
  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHeroesData(onSuccess, onError);

  if (isLoading || isFetching) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>RQ Superheroes</h2>
      <button onClick={refetch}>Fetch heroes</button>
      {/*       {data?.data.map((hero) => (
        <div key={hero.name}>{hero.name}</div>
      ))} */}
      {data.map((heroName) => (
        <div key={heroName}>{heroName}</div>
      ))}
    </>
  );
};
