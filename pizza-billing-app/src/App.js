import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemsPage from './pages/ItemsPage/ItemPage';
import HomePage from './pages/HomePage';
import CreateItemForm from './pages/ItemsPage/CreateItemForm';
import ItemDetailPage from './pages/ItemsPage/ItemDetails';
import InvoicePage from './pages/InvoicePage/Invoicepage';
import CreateInvoicePage from './pages/InvoicePage/CreateInvoicePage';
import PrintInvoice from './pages/InvoicePage/PrintInvoice';
import ViewInvoice from './pages/InvoicePage/ViewInvoice';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/create-item" element={<CreateItemForm/>} />
        <Route path="/item/:id" element={<ItemDetailPage />} />


        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/create-invoice" element={<CreateInvoicePage/>} />
        <Route path="/print-invoice" element={<PrintInvoiceWrapper />}/>
        <Route path="/invoice/:id" element={<ViewInvoice />} />
            
      </Routes>
    </Router>
  );

  
};

// Wrapper component to access the state
const PrintInvoiceWrapper = () => {
  const location = useLocation();
  const invoice = location.state?.invoice;

  return <PrintInvoice invoice={invoice} />;
};

export default App;
