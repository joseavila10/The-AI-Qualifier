
import type { NextApiRequest, NextApiResponse } from "next";
import { supaBaseClient } from "@/config/supabase.config";
import { openAiClient } from "@/config/open_ai.config";
import { normalizeWebsiteUrl } from "@/helpers/normalizeWebSiteUrl";
import axios from "axios";

const generateQualification = async(icp: any, companyText: string) => {
     try {
        const prompt = `
    You are a B2B sales analyst AI.

    Given this Ideal Customer Profile (ICP):
    ${JSON.stringify(icp, null, 2)}

    And this company's scraped text:
    """
    ${companyText.slice(0, 1500)}
    """

    Your job:
    1. Compare how well this company fits the ICP.
    2. Provide a fit score between 0 and 100.
    3. Explain briefly why it fits or not.
    4. Mention any matched personas or key signals found.

    Return your response ONLY in JSON with this format:
    {
    "score": number,
    "reasoning": string,
    "metadata": {
        "matched_personas": string[],
        "key_signals": string[]
    }
    }
    `;

        const completion = await openAiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message?.content;

        if (!content) throw new Error("Empty AI response");

        const parsed = JSON.parse(content);

        return {
            score: parsed.score ?? 0,
            reasoning: parsed.reasoning ?? "No reasoning provided.",
            metadata: parsed.metadata ?? { matched_personas: [], key_signals: [] },
        };
    } catch (error: any) {
        console.error("Error generating qualification:", error);
        return {
        score: 0,
        reasoning: "Failed to generate qualification.",
        metadata: {},
        };
    }
}

export const getProspectsQualifications = async(req:NextApiRequest, res:NextApiResponse) => {
    if(!req.currentUser) throw new Error('Not current user found');

    const companyId = req.query.company_id;

    const companiesRes = await supaBaseClient
        .from("companies")
        .select("id, user_id, name")
        .eq('id', companyId)
        .maybeSingle();
    
    
    if(!companiesRes){
        return res.status(400).json({
            success: false,
            message: `Error selecting company`,
        });
    }

    if(!companiesRes.data){
        return res.status(404).json({
            success: false,
            message: `Company not found`,
        });
    }

    if(companiesRes.data.user_id !== req.currentUser.id){
        return res.status(404).json({
            success: false,
            message: `Company does not belong to current user`,
        });
    }

    const icpRes:any = await supaBaseClient
        .from("icps")
        .select("id, company_id")
        .eq('company_id', companyId)
        .maybeSingle();

    if(!icpRes){
        return res.status(400).json({
            success: false,
            message: `Error selecting company`,
        });
    }

    if(!icpRes.data){
        return res.status(404).json({
            success: false,
            message: `ICP not found`,
        });
    }

    if(icpRes.data.company_id !== companyId){
        return res.status(404).json({
            success: false,
            message: `ICP does not belong to current company`,
        });
    }

    const prespectQualificationsRes = await supaBaseClient
        .from("prospect_qualifications")
        .select("id, icp_id, domain, fit_score, reasoning, metadata, created_at")
        .eq('icp_id', icpRes.data.id);

        if(!prespectQualificationsRes.data){
            return res.status(404).json({
                success: false,
                message: `Error finding ICPS`,
            });
        }

    return res.status(200).json({
        success: true,
        message: `ICP founds`,
        data: prespectQualificationsRes.data,
    });
}


export const createProspectQualification = async(req:NextApiRequest, res:NextApiResponse) => {
    try{
        if(!req.currentUser) throw new Error('Not current user found');

        const { url, company_id } = req.body;

        if(!url || !company_id) throw new Error('url and company_id are required');

        const url_normalized = normalizeWebsiteUrl(url);

        const icpRes = await supaBaseClient
            .from("icps")
            .select("id, company_id, title, description, buyer_personas, company_size, revenue_range, industries, regions, funding_stage")
            .eq('company_id', company_id)
            .maybeSingle();

        if(!icpRes) throw new Error('Error selecting ICP');
        if(!icpRes.data) throw new Error('No ICP found');

        // console.log(icpRes.data)

        const prospectQualificationsSelectRes = await supaBaseClient
            .from("prospect_qualifications")
            .select("id, icp_id, domain")
            .eq('icp_id', icpRes.data.id)
            .eq('domain', url_normalized)
            .maybeSingle();

        if(!prospectQualificationsSelectRes) {
            return res.status(400).json({
                success: false,
                message: `Error selecting prospect_qualifications`,
            });
        }
        
        if(prospectQualificationsSelectRes.data){
            return res.status(400).json({
                success: false,
                message: `This ICP has been already been checked with ${url_normalized}`,
            });
        }

        const response = await axios({
            url: url_normalized,
            method: 'GET'
        });

        if(!response.data){
            return res.status(201).json({
                success: false,
                message: `Error Fetching ${url_normalized}`,
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

        // console.log(text);

        const prospQualifAiResponse = await generateQualification(icpRes.data, text);

        // console.log('------ prospQualifAiResponse ------')
        // console.log(prospQualifAiResponse)

        const saveProspectQualification = await supaBaseClient
            .from("prospect_qualifications")
            .insert({
                icp_id: icpRes.data.id,
                domain: url_normalized,
                fit_score: prospQualifAiResponse.score,
                reasoning: prospQualifAiResponse.reasoning,
                metadata: prospQualifAiResponse.metadata,
            })
            .select()
            .single();

        if(!saveProspectQualification) throw new Error('Error saving Prospect Qualification');

        return res.status(200).json({
            success: true,
            message: 'Company saved',
            data: saveProspectQualification.data,
        });
    } catch(e){
        console.error(e)
        return res.status(400).json({
            success: true,
            message: 'Unexpected Error',
        });
    }
}
