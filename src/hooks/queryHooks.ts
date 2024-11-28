import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import { ChartConfig } from "@/schema/chartConfigSchema";
import { useToast } from "./use-toast";
import { calculateDateRange } from "@/lib/utils";

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;

const addChart = async (chart: ChartConfig) => {
  const response = await axios.post(API_ENDPOINTS.charts.create, chart, {});
  return response?.data?.charts;
};

export const useAddChartMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation(addChart, {
    onSuccess: () => {
      toast({ title: "Chart added successfully!" });
      queryClient.invalidateQueries("charts");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add the chart",
        description: error?.message || "Something went wrong!",
      });
    },
  });
};

const updateChart = async (data: {
  id?: number;
  updatedChart: ChartConfig;
}) => {
  await axios.put(API_ENDPOINTS.charts.update(data.id), data.updatedChart);
};

export const useUpdateChartMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation(updateChart, {
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the chart. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("charts");
      toast({ title: "Chart updated successfully!" });
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
  return response?.data?.observations || [];
};

export const useChartData = (seriesId: string, frequency: string) => {
  return useQuery(
    ["chartData", seriesId, frequency],
    () => fetchChartData(seriesId, frequency),
    {
      onError: (error: any) =>
        console.error("Error fetching chart data:", error),
      onSuccess: (data) =>
        data.length === 0 && console.warn("No data available"),
      retry: false,
    }
  );
};

export const useChartsQuery = () => {
  return useInfiniteQuery(
    ["charts"],
    async ({ pageParam = 1 }) => {
      const response = await axios.get(API_ENDPOINTS.charts.getAll, {
        params: { page: pageParam, limit: 10 },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    }
  );
};

const deleteChart = async (id: number) => {
  const response = await axios.delete(API_ENDPOINTS.charts.update(id));
  return response?.data?.charts;
};

export const useDeleteChartMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation(deleteChart, {
    onSuccess: () => {
      toast({ title: "Chart deleted successfully!" });
      queryClient.invalidateQueries("charts");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete chart.",
        description: error?.message || "Something went wrong!",
        variant: "destructive",
      });
    },
  });
};
