import { useQuery } from "@tanstack/react-query";
import { http } from "../utils/http";
import type { CategoryResponse } from "../utils/type";

export const fetchCategories = async ({ queryKey }: { queryKey: any }) => {
  const [_key] = queryKey;
  const response = await http
    .get<CategoryResponse>("api_category.php")
    .then((result: any) => {
      return result.trivia_categories;
    })
    .catch((err) => {
      throw err;
    });
  return response;
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
