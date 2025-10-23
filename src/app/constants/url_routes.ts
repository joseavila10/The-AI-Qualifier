export const urlRoutes = {
    auth: {
        auth: '/api/auth',
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        companies: '/api/companies',
    },
    company: (id: string) => `/api/companies/${id}`,
    prospectQualifications: '/api/prospect-qualifications',
    allProspectQualifications:(company_id: string) => `/api/prospect-qualifications/${company_id}`,
};
