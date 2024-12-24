import { Stack, Input, Select, Button} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface Dashboard {
  name: string;
  category: string;
}

interface DashboardFormProps {
  newDashboard: Dashboard;
  setNewDashboard: (dashboard: Dashboard) => void;
  handleAddDashboard: () => void;
  categories: string[];
}

const DashboardForm: React.FC<DashboardFormProps> = ({
  newDashboard,
  setNewDashboard,
  handleAddDashboard,
  categories,
}) => {
  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
      <Input
        placeholder="Dashboard name"
        value={newDashboard.name}
        onChange={(e) =>
          setNewDashboard({ ...newDashboard, name: e.target.value })
        }
      />
      <Select
        placeholder="Select category"
        value={newDashboard.category}
        onChange={(e) =>
          setNewDashboard({ ...newDashboard, category: e.target.value })
        }
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      <Button
        leftIcon={<AddIcon />}
        onClick={handleAddDashboard}
        w={{ base: "100%", sm: "auto" }}
        fontSize="large"
        p={6}
      >
        Add
      </Button>
    </Stack>
  );
};

export default DashboardForm;
