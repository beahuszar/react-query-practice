import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const fetchSuperHero = ({ queryKey }) => {
  const heroId = queryKey[1]; // same array as the dependency array of the useQuery hook
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  const queryClient = useQueryClient(); // has access to query cache

  // 1st input: array of items to be cached, this way all superHeroId queries will be cashed
  return useQuery(["super-hero", heroId], fetchSuperHero, {
    initialData: () => {
      const hero = queryClient
        .getQueryData("super-heroes") // This is called on the listing page, from where we can navigate to the hero page.
        ?.data?.find((hero) => hero.id === parseInt(heroId)); //  If matching data is found we can use that and 'super-hero' can be fetched in the background to see if there is any difference

      if (hero) {
        return {
          data: hero,
        };
      } else {
        return undefined;
      }
    },
  });
};
