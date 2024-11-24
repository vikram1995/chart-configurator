import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Navbar from './components/navbar'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
    </>
  )
}

export default App
