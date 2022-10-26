import { ListFiltersInput } from 'src/http/graphql/inputs/list-filters-input';

export function getFilters(filters: ListFiltersInput) {
  return Object.entries(filters).map(([filterKey, filterValue]) => ({
    [filterKey]: filterValue,
  }));
}
