import Navbar from './components/navbar'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css'
import ChartGrid from './components/ChartGrid'

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <ChartGrid />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
