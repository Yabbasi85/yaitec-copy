import {
  Select,
  Input,
  Stack,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface Filter {
  status: string;
  category: string;
  search: string;
}

interface DashboardFiltersProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  categories: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filter,
  setFilter,
  categories,
}) => {

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
      <Select
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
      >
        <option value="all">All Status</option>
        <option value="enabled">Enabled</option>
        <option value="disabled">Disabled</option>
      </Select>

      <Select
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search dashboards"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </InputGroup>
    </Stack>
  );
};

export default DashboardFilters;
