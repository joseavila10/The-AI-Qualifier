import React, { useState, useEffect } from "react";
import CustomForm from "@/app/components/CustomForm";
import CustomTable from "@/app/components/CustomTable";
import { getProspectsQualifications, generateProspectQualification } from "../services/companiesServices";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const NewProspectQualification = (props: any) => {
  const [generatingPospectQualifications, setGeneratingPospectQualifications] = useState(false);
  const [prospectsQualifications, setProspectsQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProspectsQualifications(props.company.company.id)
      .then((res) => {
        setProspectsQualifications(res.data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const submitProspectQualifications = async (vals: any) => {
    setGeneratingPospectQualifications(true);

    const urls = vals.urls.split(",").map((u: string) => u.trim());

    for (let url of urls) {
      const newProspect = await generateProspectQualification(url, props.company.company.id);
      if (newProspect) {
        setProspectsQualifications((prev) => [newProspect, ...prev]);
      }
    }

    setGeneratingPospectQualifications(false);
  };

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Prospect Qualification
      </h3>

      <CustomForm
        fields={[
          {
            name: "urls",
            type: "textarea",
            label: "Website URLs (comma-separated)",
            placeholder:
              "https://windmillgrowth.com, https://www.deloitte.com, https://www.walmart.com",
            required: true,
            rows: 6,
          },
        ]}
        onSubmit={submitProspectQualifications}
        disableSubmitBtn={generatingPospectQualifications}
        submitLabel={
          generatingPospectQualifications
            ? "Generating ..."
            : "Generate Prospect Qualification"
        }
      />

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <LoadingSpinner loadingMessage="Loading qualifications..." />
        </div>
      ) : prospectsQualifications.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No prospect qualifications found.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {prospectsQualifications.map((p) => (
            <div
              key={p.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <a
                  href={p.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {p.domain}
                </a>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                  Fit Score:{" "}
                  <span
                    className={`font-bold ${
                      p.fit_score >= 70
                        ? "text-green-600"
                        : p.fit_score >= 40
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.fit_score}%
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                {p.reasoning}
              </p>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Signals */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Key Signals
                  </h4>
                  <CustomTable
                    columns={[{ key: "signal", label: "Signal" }]}
                    data={(p.metadata?.key_signals || []).map((s: string, i: number) => ({
                      id: i,
                      signal: s,
                    }))}
                  />
                </div>

                {/* Matched Personas */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Matched Personas
                  </h4>
                  <CustomTable
                    columns={[{ key: "persona", label: "Persona" }]}
                    data={(p.metadata?.matched_personas || []).map(
                      (persona: string, i: number) => ({
                        id: i,
                        persona,
                      })
                    )}
                  />
                </div>
              </div>

              {/* Created at */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Created: {new Date(p.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewProspectQualification;
