import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Select,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue,
  Button,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FaChartBar, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IconType } from 'react-icons';

interface Campaign {
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  helpText?: string;
  borderColor: string;
  bgColor: string;
  accentColor: string;
}

// Define the brand colors
const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: "#00ff89",
  white: '#FFFFFF',
};

const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'budget' | 'duration'>('budget');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterType, setDateFilterType] = useState<'day' | 'month' | 'year'>('month');
  const apiUrl = import.meta.env.VITE_API_URL;

  // Use brand colors instead of useColorModeValue
  const bgColor = brandColors.white;
  const textColor = brandColors.darkBlue;
  const accentColor = brandColors.purple;

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${apiUrl}/campaigns/`);
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [startDate, endDate, dateFilterType, campaigns]);

  const filterCampaigns = () => {
    if (!startDate || !endDate) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const filtered = campaigns.filter((campaign) => {
      const campaignStart = new Date(campaign.startDate);
      const campaignEnd = new Date(campaign.endDate);

      let condition = false;
      switch (dateFilterType) {
        case 'day':
          condition = campaignStart <= endDate && campaignEnd >= startDate;
          break;
        case 'month':
          condition =
            campaignStart.getFullYear() === startDate.getFullYear() &&
            campaignStart.getMonth() === startDate.getMonth();
          break;
        case 'year':
          condition = campaignStart.getFullYear() === startDate.getFullYear();
          break;
      }

      return condition;
    });

    setFilteredCampaigns(filtered);
  };

  const calculateMetrics = () => {
    const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const avgBudget = totalBudget / filteredCampaigns.length || 0;
    const totalDuration = filteredCampaigns.reduce((sum, campaign) => {
      const duration =
        new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime();
      return sum + duration;
    }, 0);
    const avgDuration = totalDuration / filteredCampaigns.length || 0;

    return {
      totalBudget,
      avgBudget,
      avgDuration: Math.ceil(avgDuration / (1000 * 60 * 60 * 24)),
      totalCampaigns: filteredCampaigns.length,
    };
  };

  const abbreviateName = (name: string, maxLength = 15) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const getBudgetData = () => {
    return filteredCampaigns.map((campaign) => ({
      name: abbreviateName(campaign.name),
      fullName: campaign.name,
      value: campaign.budget,
    }));
  };

  const getTimelineData = () => {
    return filteredCampaigns.map((campaign) => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      const duration = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        name: abbreviateName(campaign.name),
        fullName: campaign.name,
        value: selectedMetric === 'budget' ? campaign.budget : duration,
        budget: campaign.budget,
        duration,
      };
    });
  };

  const metrics = calculateMetrics();

  // Update COLORS array to use brand colors
  const COLORS = [
    brandColors.purple,
    brandColors.electricGreen,
    brandColors.darkBlue,
    '#ffc658', // Additional colors if needed
    '#ff8042',
    '#a4de6c',
  ];

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    helpText,
    borderColor,
    bgColor,
    accentColor,
  }) => (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={borderColor}
      rounded={'lg'}
      bg={bgColor}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {value}
          </StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Box>
        <Box my={'auto'} color={accentColor} alignContent={'center'}>
          <Icon as={icon} w={8} h={8} />
        </Box>
      </Flex>
    </Stat>
  );

  return (
    <Box p={4} minH="100vh">
      <VStack spacing={8} align="stretch">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4}
        >
          <Select
            value={dateFilterType}
            onChange={(e) => setDateFilterType(e.target.value as 'day' | 'month' | 'year')}
            width={{ base: '100%', md: '200px' }}
          >
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </Select>
          <Flex gap={2}>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date || undefined)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat={
                dateFilterType === 'day'
                  ? 'dd/MM/yyyy'
                  : dateFilterType === 'month'
                  ? 'MM/yyyy'
                  : 'yyyy'
              }
              showMonthYearPicker={dateFilterType === 'month'}
              showYearPicker={dateFilterType === 'year'}
              customInput={
                <Button>{startDate ? startDate.toLocaleDateString() : 'Start Date'}</Button>
              }
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || undefined)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat={
                dateFilterType === 'day'
                  ? 'dd/MM/yyyy'
                  : dateFilterType === 'month'
                  ? 'MM/yyyy'
                  : 'yyyy'
              }
              showMonthYearPicker={dateFilterType === 'month'}
              showYearPicker={dateFilterType === 'year'}
              customInput={
                <Button>{endDate ? endDate.toLocaleDateString() : 'End Date'}</Button>
              }
            />
          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          <Box
            flex={1}
            border="1px solid"
            borderColor={brandColors.purple}
            p={6}
            borderRadius="12px"
            bg={brandColors.white}
            boxShadow="lg"
          >
            <StatCard
              title="Total Campaigns"
              value={metrics.totalCampaigns}
              icon={FaChartBar}
              helpText="Active campaigns"
              borderColor={brandColors.purple}
              bgColor={brandColors.white}
              accentColor={brandColors.purple}
            />
          </Box>
          <Box
            flex={1}
            border="1px solid"
            borderColor={brandColors.purple}
            p={6}
            borderRadius="12px"
            bg={brandColors.white}
            boxShadow="lg"
          >
            <StatCard
              title="Total Budget"
              value={`$${metrics.totalBudget.toFixed(2).toLocaleString()}`}
              icon={FaDollarSign}
              helpText="Cumulative budget"
              borderColor={brandColors.purple}
              bgColor={brandColors.white}
              accentColor={brandColors.purple}
            />
          </Box>
          <Box
            flex={1}
            border="1px solid"
            borderColor={brandColors.purple}
            p={6}
            borderRadius="12px"
            bg={brandColors.white}
            boxShadow="lg"
          >
            <StatCard
              title="Avg Budget"
              value={`$${metrics.avgBudget.toFixed(2).toLocaleString()}`}
              icon={FaDollarSign}
              helpText="Per campaign"
              borderColor={brandColors.purple}
              bgColor={brandColors.white}
              accentColor={brandColors.purple}
            />
          </Box>
          <Box
            flex={1}
            border="1px solid"
            borderColor={brandColors.purple}
            p={6}
            borderRadius="12px"
            bg={brandColors.white}
            boxShadow="lg"
          >
            <StatCard
              title="Avg Duration"
              value={`${metrics.avgDuration} days`}
              icon={FaCalendarAlt}
              helpText="Per campaign"
              borderColor={brandColors.purple}
              bgColor={brandColors.white}
              accentColor={brandColors.purple}
            />
          </Box>
        </SimpleGrid>

        <Flex direction="column" gap={4}>
          <Flex justify="space-between" align="center" wrap="wrap">
            <Heading as="h2" size="lg" color={textColor}>
              Campaign Metrics
            </Heading>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'budget' | 'duration')}
              width={{ base: '100%', sm: '200px' }}
              mt={{ base: 2, sm: 0 }}
            >
              <option value="budget">Budget</option>
              <option value="duration">Duration</option>
            </Select>
          </Flex>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            border="1px solid"
            borderColor={accentColor}
          >
            <Heading as="h3" size="md" mb={4} color={textColor}>
              {selectedMetric === 'budget' ? 'Budget Comparison' : 'Duration Comparison'}
            </Heading>
            <Box height={{ base: '300px', md: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getTimelineData()}
                  layout={isMobile ? 'vertical' : 'horizontal'}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {isMobile ? (
                    <>
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                    </>
                  ) : (
                    <>
                      <XAxis dataKey="name" />
                      <YAxis />
                    </>
                  )}
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const campaign = payload[0].payload;
                        return (
                          <Box bg={bgColor} p={2} borderRadius="md" boxShadow="md">
                            <Text fontWeight="bold">{campaign.fullName}</Text>
                            <Text>Budget: ${campaign.budget.toLocaleString()}</Text>
                            <Text>Duration: {campaign.duration} days</Text>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill={accentColor}
                    name={selectedMetric === 'budget' ? 'Budget' : 'Duration'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            border="1px solid"
            borderColor={accentColor}
          >
            <Heading as="h3" size="md" mb={4} color={textColor}>
              Budget Distribution
            </Heading>
            <Box height={{ base: '300px', md: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getBudgetData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? '80%' : '90%'}
                    fill={brandColors.purple}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getBudgetData().map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const campaign = payload[0].payload;
                        return (
                          <Box bg={bgColor} p={2} borderRadius="md" boxShadow="md">
                            <Text fontWeight="bold">{campaign.fullName}</Text>
                            <Text>Budget: ${campaign.value.toLocaleString()}</Text>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CampaignDashboard;
