import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHero = ({ queryKey }) => {
  const heroId = queryKey[1]; // same array as the dependency array of the useQuery hook
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  // 1st input: array of items to be cached, this way all superHeroId queries will be cashed
  return useQuery(["super-hero", heroId], fetchSuperHero);
};
