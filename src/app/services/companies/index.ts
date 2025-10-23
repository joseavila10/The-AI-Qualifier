
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { supaBaseClient } from "@/config/supabase.config";
import { isUrlValid } from "@/helpers/validations";
import { openAiClient } from "@/config/open_ai.config";
import { normalizeWebsiteUrl } from "@/helpers/normalizeWebSiteUrl";

type Body = {
    website_url: string;
};

const analyzeCompanyText = async (text: string) => {
    try{
            const prompt = `
    Read the following webpage text and extract:
    1. The company's name.
    2. A short 1-2 sentence description of what the company does.

    Return the answer in JSON with the format:
    {
    "name": "...",
    "description": "..."
    }

    Text:
    ${text.slice(0, 3000)}
    `;

        const response = await openAiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a precise data extractor for company descriptions." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        });

        const result = response.choices[0].message?.content;
        if (!result) throw new Error("No result from OpenAI.");

        const parsed = JSON.parse(result);
        return parsed;
    } catch (err) {
    console.error("OpenAI error:", err);
    return null;
  }
}

const generateICP = async({
    company_name,
    company_description,
    web_scrapping_text,

}: {
    company_name: string;
    company_description: string;
    web_scrapping_text: string;
}) => {
    const prompt = `
    You are a B2B marketing expert. Generate an Ideal Customer Profile (ICP) for the company below.

    Company Name: ${company_name}
    Company Description: ${company_description}
    Web Scrapping Analysis: ${web_scrapping_text.slice(0, 1500)}

    Please provide the output in strict JSON format like this:

    {
    "title": "ICP Title",
    "description": "Brief description of ideal customers",
    "buyer_personas": [
        {
        "name": "Persona Name",
        "role": "Job Title",
        "department": "Department",
        "pain_points": ["Pain point 1", "Pain point 2"]
        }
    ],
    "company_size": "Number of employees or range",
    "revenue_range": "Revenue range",
    "industries": ["Industry 1", "Industry 2"],
    "regions": ["Region 1", "Region 2"],
    "funding_stage": "Funding stage"
    }

    And please, ensure to create 3 to 5 buyer personas for the ICP
    `;

    const response = await openAiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
    });

    const text = response.choices[0].message?.content ?? "";
    try {
        const icp = JSON.parse(text);
        return icp;
    } catch (err) {
        console.error("Failed to parse ICP JSON:", text, err);
        throw new Error("AI returned invalid JSON");
    }
}

export const getSingleCompany = async(req:NextApiRequest, res:NextApiResponse) => {
    try{
        let returnData:any = {
            company: null,
            icp: null,
        }

        if(!req.currentUser) throw new Error("No current user found.");

        const companyId = req.query.id

        const companyRes = await supaBaseClient
            .from("companies")
            .select("id, user_id, domain, name, description")
            .eq('id', companyId)
            .eq("user_id", req.currentUser?.id)
            .maybeSingle();

        if(!companyRes) throw new Error("Error selecting company");
        if(!companyRes.data) throw new Error("No company found for this user");

        returnData.company = companyRes.data;

        const icpRes = await supaBaseClient
            .from("icps")
            .select("id, company_id, title, description, buyer_personas, company_size, revenue_range, industries, regions, funding_stage")
            .eq('company_id', companyId)
            .maybeSingle();

        if(!icpRes) throw new Error("Error selecting ICP");
        if(!icpRes.data) throw new Error("No ICP found for this company");

        returnData.icp = icpRes.data;

        return res.status(200).json({
            success: true,
            message: 'Company fetched succesfuly',
            data: returnData,
        });
    } catch(e){
        console.error(e);
        return res.status(400).json({
            success: false,
            message: 'Unexpected Error',
        });
    }
}

export const getUserCompanies = async(req:NextApiRequest, res:NextApiResponse) => {
    try{
        if(!req.currentUser) throw new Error("No current user found.");

        const companyRes = await supaBaseClient
        .from("companies")
        .select("id, user_id, domain, name, description, created_at")
        .eq('user_id', req.currentUser.id);

        if(!companyRes || !companyRes.data) throw new Error("Error selecting user companies");

        return res.status(201).json({
            success: true,
            message: 'Companies fetched succesfuly',
            data: companyRes.data,
        });

    } catch(e){
        console.error(e);
        return res.status(400).json({
            success: false,
            message: 'Unexpected Error',
        });
    }
}

export const getCompanyInformationAndGenerateIcp = async(req:NextApiRequest, res:NextApiResponse) => {
    try{
        if(!req.currentUser) throw new Error("No current user found.");
        
        const body:Body = req.body;

        const { website_url } = body;

        if(!website_url) return res.status(400).json({ success: false, message: 'Website URL must be provided' });

        const validUrl = isUrlValid(website_url);
        if(!validUrl){
            return res.status(201).json({
                success: false,
                message: 'Invalid URL',
            });
        }

        const normalizedUrl = normalizeWebsiteUrl(website_url);

        const response = await axios({
            url: normalizedUrl,
            method: 'GET'
        });

        if(!response.data){
            return res.status(201).json({
                success: false,
                message: `Error Fetching ${normalizedUrl}`,
            });
        }

        // const text = response.data.replace(/<[^>]*>?/gm, " ").slice(0, 3000);
        const text = response.data
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/&[a-z]+;/gi, " ")
            .replace(/\s+/g, " ")
            .trim()

        const companyExtractedData = await analyzeCompanyText(text);

        const companyRes = await supaBaseClient
        .from("companies")
        .select("id")
        .eq('name', companyExtractedData.name)
        .eq('user_id', req.currentUser.id);

        if(!companyRes?.data){
            return res.status(400).json({
                success: false,
                message: 'Error on companies select query',
            }); 
        }

        if(companyRes.data.length >= 1){
            return res.status(400).json({
                success: false,
                message: 'Company has already been saved',
            }); 
        }
        
        const newCompanyData = {
            user_id: req.currentUser?.id,
            domain: normalizedUrl,
            name: companyExtractedData.name,
            description: companyExtractedData.description,
        }

        const createCompanyRes:any = await supaBaseClient
        .from("companies")
        .insert([
            newCompanyData
        ])
        .select();

        if(!createCompanyRes?.data){
            return res.status(400).json({
                success: false,
                message: 'Error saving company',
            }); 
        }

        const icpGenerate = await generateICP({
            company_name: companyExtractedData.name,
            company_description: companyExtractedData.description,
            web_scrapping_text: text,
        });

        const newIcpData = {
            ...icpGenerate,
            company_id: createCompanyRes?.data[0].id,
        }

        const createIcpRes:any = await supaBaseClient
        .from("icps")
        .insert([
            newIcpData
        ])
        .select();

        if(!createIcpRes?.data){
            return res.status(400).json({
                success: false,
                message: 'Error saving ICP',
            }); 
        }

        const returnData = {
            user_id: createCompanyRes.data[0].user_id,
            domain: createCompanyRes.data[0].domain,
            name: createCompanyRes.data[0].name,
            description: createCompanyRes.data[0].description,
            companyRecord: createCompanyRes?.data[0],
            icpRecord: createIcpRes?.data[0],
        }

        return res.status(200).json({
            success: true,
            message: 'Company saved',
            data: returnData,
        });
    } catch(e){
        console.error(e);
        return res.status(400).json({
            success: false,
            message: 'Unexpected Error',
        });
    }
}
