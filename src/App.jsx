import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BulkChangeProvider } from './context/BulkChangeContext'
import Layout from './components/Layout'
import BulkChangeList from './pages/BulkChangeList'
import CreateBulkChange from './pages/CreateBulkChange'
import Builder from './pages/Builder'
import { mockBulkChanges } from './data/bulkChanges'

function App() {
  return (
    <BulkChangeProvider initialData={mockBulkChanges}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<BulkChangeList />} />
            <Route path="/create" element={<CreateBulkChange />} />
            <Route path="/builder/:id" element={<Builder />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BulkChangeProvider>
  )
}

export default App
