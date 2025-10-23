function createRouteTemplate(serviceName) {
    const pageRouteTemplate = `
import type { NextApiRequest, NextApiResponse } from "next";
import { supaBaseClient } from "@/config/supabase.config";

export const ${serviceName}Service = async(req:NextApiRequest, res:NextApiResponse) => {
    // Service logic here
}
`;
    
    return pageRouteTemplate;
}

module.exports = { createRouteTemplate };
