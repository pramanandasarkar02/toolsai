import React from 'react'
import data from '../data/data.json'
import { useNavigate } from 'react-router-dom';


const CompanyPage = () => {
  // const companies = data.organizations;
  const [companies, setCompanies] = React.useState(data.organizations);
  React.useEffect(() => {
    fetch('http://localhost:8080/api/v1/organizations')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  }, []);


  const naigate = useNavigate();

  const handleClick = (comapanySlug) => {
    naigate(`/company/${comapanySlug}`);
  }
  
  return (
    <div className='grid grid-cols-3 gap-4'>
      {companies.map((company) => (
        <div key={company.id} className='bg-gray-200 p-4 hover:bg-gray-300 cursor-pointer' onClick={() => handleClick(company.orgName)}>
          <h2 className='text-lg font-bold'>{company.orgName}</h2>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CompanyPage