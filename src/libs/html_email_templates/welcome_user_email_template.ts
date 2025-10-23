interface WelcomeEmailDTO {
    loginUrl: string;
    unsubscribeUrl: string;
    reportsEmail: string;
}

export function generateWelcomeEmailContent({
    loginUrl,
    unsubscribeUrl,
    reportsEmail
}: WelcomeEmailDTO) {
    return (
        `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827;">
  
            <h2 style="color: #1d4ed8; text-align: center; margin-bottom: 16px;">
                🚀 Welcome to Sparkly Board — Validate Your SaaS Smarter!
            </h2>

            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Hi there! We're excited to have you join <strong>Sparkly Board</strong>, the platform that helps founders validate SaaS ideas before they invest months of work.
            </p>
            
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                With Sparkly Board, you can quickly launch validation pages and start learning what your audience really wants — all in one simple dashboard.
            </p>

            <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px; margin-bottom: 20px;">
                <li>⚡ Create a validation landing page in minutes</li>
                <li>📊 Track signups and interest levels in real time</li>
                <li>💬 Collect insights from potential users</li>
                <li>🧠 Make data-driven decisions before building your MVP</li>
            </ul>

            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Your dashboard is ready — start validating your ideas, testing pricing, and discovering what really resonates with your future customers.
            </p>

            <div style="text-align: center; margin-bottom: 30px;">
                <a href="${loginUrl}" 
                style="display: inline-block; background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Go to My Dashboard →
                </a>
            </div>

            <!-- Unsubscribe and report section -->
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin-bottom: 6px;">
                <a href="${unsubscribeUrl}" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">
                    Unsubscribe me
                </a>
                </p>
                <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 0;">
                <small>
                    If you didn’t create an account with Sparkly Board, please ignore this email or report it to 
                    <a href="mailto:${reportsEmail}" style="color: #1d4ed8; text-decoration: none;">${reportsEmail}</a>.
                </small>
                </p>
            </div>

            </div>

        `
    )
}
