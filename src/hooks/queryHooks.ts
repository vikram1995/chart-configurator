import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query"; // React Query hooks
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import { ChartConfig } from "@/chartConfigSchema";
import { useToast } from "./use-toast";
import { calculateDateRange } from "@/lib/utils";

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;

// API Calls
const fetchCharts = async () => {
  const response = await axios.get(API_ENDPOINTS.charts.getAll);
  return response?.data?.charts ?? [];
};

// Define the add chart API call function
const addChart = async (chart: ChartConfig) => {
  const response = await axios.post(API_ENDPOINTS.charts.create, chart, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response?.data?.charts; // Return the updated chart list after adding the chart
};

// Custom Hook for the Mutation
export const useAddChartMutation = () => {
  const queryClient = useQueryClient(); // React Query client for managing cache
  const { toast } = useToast(); // Initialize the toast hook

  return useMutation(addChart, {
    // On Success
    onSuccess: (charts: any) => {
      toast({
        title: "Chart added successfully!",
      });
      queryClient.invalidateQueries("charts");
    },
    // On Error
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add the chart",
        description: error?.message || "Something went wrong!",
      });
    },
    // Optionally handle optimistic updates or retries here if needed
  });
};

const updateChart = async ({
  id,
  updatedChart,
}: {
  id: number | undefined;
  updatedChart: ChartConfig;
}) => {
  await axios.put(API_ENDPOINTS.charts.update(id), updatedChart);
};

export const useUpdateChartMutation = () => {
  const queryClient = useQueryClient(); // React Query client for managing queries
  const { toast } = useToast();
  return useMutation(updateChart, {
    // Optimistic Updates
    onMutate: async (newData) => {
      await queryClient.cancelQueries("charts"); // Cancel any ongoing fetch

      const previousCharts = queryClient.getQueryData("charts"); // Snapshot current data

      queryClient.setQueryData("charts", (old: any) =>
        old.map((chart: any) =>
          chart.id === newData.id ? { ...chart, ...newData } : chart
        )
      );

      return { previousCharts };
    },
    // Rollback in case of error
    onError: (err, newData, context: any) => {
      queryClient.setQueryData("charts", context.previousCharts);
      toast({
        title: "Error",
        description: "Failed to update the chart title. Please try again.",
        variant: "destructive",
      });
    },
    // Always refetch to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries("charts");
      toast({
        title: "Chart updated successfully!",
      });
    },
  });
};

const fetchChartData = async (seriesId: string, frequency: string) => {
  const { startDate, endDate } = calculateDateRange(frequency);

  const response = await axios.get(API_ENDPOINTS.dataSource.observations, {
    params: {
      series_id: seriesId,
      api_key: FRED_API_KEY,
      observation_start: startDate,
      observation_end: endDate,
      file_type: "json",
    },
  });

  const observations = response?.data?.observations || [];
  return observations; // Return the data directly
};

// Custom Hook for fetching chart data
export const useChartData = (seriesId: string, frequency: string) => {
  return useQuery(
    ["chartData", seriesId, frequency], // Query key depends on dataSource and frequency
    () => fetchChartData(seriesId, frequency),
    {
      onError: (error: any) => {
        console.error("Error fetching chart data:", error);
        // Handle any custom error logic here (optional)
      },
      onSuccess: (data) => {
        if (data.length === 0) {
          console.warn("No data available");
        }
      },
      retry: false, // Optionally disable retries if you don't want the query to retry on failure
    }
  );
};

export const useChartsQuery = () => {
  return useInfiniteQuery(
    ["charts"],
    async ({ pageParam = 1 }) => {
      console.log("pageParam", pageParam);
      const response = await axios.get(API_ENDPOINTS.charts.getAll, {
        params: { page: pageParam, limit: 10 },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
      },
    }
  );
};

// Define the delete chart function
const deleteChart = async (id: number) => {
  const response = await axios.delete(API_ENDPOINTS.charts.update(id));
  return response?.data?.charts;
};

// Custom Hook for the Mutation
export const useDeleteChartMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast(); // Initialize the toast hook

  return useMutation(deleteChart, {
    // On Success
    onSuccess: (charts: any) => {
      toast({
        title: "Chart deleted successfully!",
      });

      // update the local chart list in the cache
      queryClient.setQueryData("charts", charts);
    },

    onError: (error: any) => {
      toast({
        title: "Failed to delete chart.",
        description: error?.message || "Something went wrong!",
        variant: "destructive", // For a red-colored failure toast
      });
    },
  });
};
