import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const useSuperHeroesData = (onSuccess, onError) => {
  return useQuery("super-heroes", fetchSuperHeroes, {
    // cacheTime: 5000 // 5min is default, after this value the query is garbage collected
    // staleTime: 30000, // 0 is default, controls when the next network request can run in the background
    // refetchOnMount: true, // true: when data is stale, false: never, always: at every mount
    // refetchOnWindowFocus: true, // default is true, rest is same as on mount
    // refetchInterval: 2000 // false is default, refeteches data in given ms intervals === polling, pauses when window is not in focus
    // refetchIntervalInBackground: true // default is false, enforces refetchInterval also when window is not in focus
    // enabled: false, // disables fetching onMount, using the refetch from useQuery can manually trigger though
    onSuccess, // uses callback
    onError, // uses callback
    /*     select: (data) => {
          const superHeroNames = data.data.map((hero) => hero.name);
          return superHeroNames;
        }, // data will be this value from now, can be filtered/transformed anyhow */
  });
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    /*     onSuccess: (data) => {
          // queryClient.invalidateQueries("super-heroes"); // triggers refetch in the super-heroes query, automatically updating the client in the browser
          queryClient.setQueryData("super-heroes", (oldQueryData) => {
            // updates query cache directly and saves extra network request compared to invalidateQueries
            return {
              ...oldQueryData,
              data: [...oldQueryData.data, data.data], // data.data === mutation response received from server (the posted/updated data)
            };
          });
        }, */
    onMutate: async (newHero) => {
      await queryClient.cancelQueries("super-heroes"); // cancel any outgoing refetches, so they don't overwrite our optimistic update
      const previousHeroData = queryClient.getQueryData("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            { id: oldQueryData.data.length + 1, ...newHero },
          ],
        };
      });
      return {
        previousHeroData, // this will be returned in case the mutation runs on an error and added to the onError fn's context prop
      };
    }, // called before the mutation function is fired and is passed the same inputs the mutation function would receive
    onError: (_error, _hero, context) => {
      queryClient.getQueryData("super-heroes", context.previousHeroData);
    },
    onSettled: () => {
      // called when the mutation is either successful or runs on an error
      queryClient.invalidateQueries("super-heroes"); // ensure client state is in sync with server state
    },
  });
};
