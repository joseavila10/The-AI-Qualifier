import React, { useState, useEffect } from 'react';
import CustomTable from '@/app/components/CustomTable';
import { getUserCompanies } from '../services/companiesServices';

const CompaniesTable = (props:any) => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState<any>([]);

    interface Company {
        id: string;
        domain: string;
        name: string;
        description: string;
    }

    useEffect(() => {
        getUserCompanies()
        .then(res => {
            if(!res.data) return setLoading(false);

            const companiesData = res.data.map((company:any) =>({
                id: company.id, 
                domain: company.domain,
                name: company.name,
                description: company.description,
            }));
            setCompanies(companiesData);
            setLoading(false);
        })
        .catch(e => {
            console.error(e);
            setLoading(false);
        })
    },[]);

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (value: string, row: Company) => (
            <a
                href={`/companies/${row.id}`}
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {value}
            </a>
            ),
        },
        {
            key: "domain",
            label: "Domain",
            render: (value: string, row: Company) => (
            <a
                href={`${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {value}
            </a>
            ),
        },
        { key: "description", label: "Description" },
    ];
  return (
    <CustomTable
    loading={loading}
    columns={columns}
    data={companies}
    onEdit={(row) => console.log("Edit", row)}
    onDelete={(row) => console.log("Delete", row)}
    />
  )
}

export default CompaniesTable