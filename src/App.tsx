import Navbar from './components/navbar'
import { Toaster } from "@/components/ui/toaster"

import './App.css'
import ChartGrid from './components/ChartGrid'

function App() {

  return (
    <>
      <Navbar />
      <ChartGrid />
      <Toaster />
    </>
  )
}

export default App
