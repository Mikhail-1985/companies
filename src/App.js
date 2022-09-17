import React from 'react';
import './App.css';
import CompaniesTable from './components/companiesTable.jsx'
import EmployeesTable from './components/employeesTable.jsx'
import { useSelector } from 'react-redux';

function App() {
  const selectedCompanies = useSelector(state => state.companies.selectedCompanies)
  return (
    <>
      <div className='mainContainer'>
        <div className='tableContainer'>
        <CompaniesTable/>
        </div>
        <div className='tableContainer'>
        {selectedCompanies.length > 0 && <EmployeesTable/>}
        </div>
      </div>
    </>
  );
}

export default App;
