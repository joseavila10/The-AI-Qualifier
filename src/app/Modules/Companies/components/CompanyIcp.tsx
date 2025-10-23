import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import CustomTable from "@/app/components/CustomTable";
import { getSingleCompany } from "../services/companiesServices";
import CustomForm from "@/app/components/CustomForm";
import NewProspectQualification from "./NewProspectQualification";

const CompanyIcp = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    getSingleCompany(props.companyId)
      .then((res) => {
        if (!res.data) return setLoading(false);
        setCompany(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <LoadingSpinner loadingMessage="Loading..." />
      </div>
    );

  if (!company) return <div>No company data found.</div>;

  const { company: companyInfo, icp } = company;

  const buyerPersonaColumns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    {
      key: "pain_points",
      label: "Pain Points",
      render: (value: string[]) => (
        <ul className="list-disc list-inside">
          {value.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {companyInfo.name}
            </h2>
            <a
            href={companyInfo.domain}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mb-2 block"
            >
            {companyInfo.domain}
            </a>
            <p className="text-gray-700 dark:text-gray-300">{companyInfo.description}</p>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {icp.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{icp.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Company Size</h4>
                <p className="text-gray-700 dark:text-gray-300">{icp.company_size}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Revenue Range</h4>
                <p className="text-gray-700 dark:text-gray-300">{icp.revenue_range}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Industries</h4>
                <p className="text-gray-700 dark:text-gray-300">{icp.industries.join(", ")}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Regions</h4>
                <p className="text-gray-700 dark:text-gray-300">{icp.regions.join(", ")}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Funding Stage</h4>
                <p className="text-gray-700 dark:text-gray-300">{icp.funding_stage}</p>
            </div>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Buyer Personas
            </h3>
            <CustomTable columns={buyerPersonaColumns} data={icp.buyer_personas} />
        </div>

        <NewProspectQualification
        company={company}
        />
    </div>
  );
};

export default CompanyIcp;
