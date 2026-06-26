export const emailTemplates = {
  verifyEmail: (name: string, verificationUrl: string) => ({
    subject: "Verify your AutoFX account",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Inter,sans-serif;background:#0F0A1E;color:#fff;padding:40px 20px;margin:0">
        <div style="max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:3px;border-radius:12px">
            <div style="background:#160D2B;border-radius:10px;padding:40px">
              <div style="text-align:center;margin-bottom:32px">
                <span style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#A78BFA,#60A5FA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AutoFX</span>
              </div>
              <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;color:#fff">Verify Your Email</h1>
              <p style="color:#A78BFA;margin:0 0 24px;line-height:1.6">Hello ${name},<br><br>Thank you for registering with AutoFX. Please verify your email address to get started.</p>
              <a href="${verificationUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">Verify Email Address</a>
              <p style="color:#6B7280;margin:24px 0 0;font-size:14px">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentConfirmation: (name: string, amount: string, packageName: string, invoiceUrl: string) => ({
    subject: "Payment Confirmed — AutoFX Subscription Active",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Inter,sans-serif;background:#0F0A1E;color:#fff;padding:40px 20px;margin:0">
        <div style="max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:3px;border-radius:12px">
            <div style="background:#160D2B;border-radius:10px;padding:40px">
              <div style="text-align:center;margin-bottom:32px">
                <span style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#A78BFA,#60A5FA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AutoFX</span>
              </div>
              <div style="text-align:center;margin-bottom:24px">
                <div style="width:64px;height:64px;background:rgba(16,185,129,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
                  <span style="font-size:32px">✓</span>
                </div>
                <h1 style="font-size:24px;font-weight:700;margin:0;color:#10B981">Payment Confirmed!</h1>
              </div>
              <p style="color:#A78BFA;margin:0 0 24px">Hello ${name},<br><br>Your payment of <strong style="color:#fff">${amount}</strong> for <strong style="color:#fff">${packageName}</strong> has been confirmed.</p>
              <a href="${invoiceUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">View Invoice</a>
              <p style="color:#6B7280;margin:24px 0 0;font-size:14px">Next step: Connect your broker account to activate copy trading.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  subscriptionActivated: (name: string, packageName: string) => ({
    subject: "Copy Trading Activated — Welcome to AutoFX!",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Inter,sans-serif;background:#0F0A1E;color:#fff;padding:40px 20px;margin:0">
        <div style="max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:3px;border-radius:12px">
            <div style="background:#160D2B;border-radius:10px;padding:40px">
              <div style="text-align:center;margin-bottom:32px">
                <span style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#A78BFA,#60A5FA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AutoFX</span>
              </div>
              <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;color:#10B981">🎉 Copy Trading is Live!</h1>
              <p style="color:#A78BFA;line-height:1.6">Hello ${name},<br><br>Your <strong style="color:#fff">${packageName}</strong> subscription is now active and copy trading has been enabled on your account. Trades will be copied automatically from our master account.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;margin-top:24px">Go to Dashboard</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentFailed: (name: string, amount: string, retryUrl: string) => ({
    subject: "Payment Failed — Action Required",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Inter,sans-serif;background:#0F0A1E;color:#fff;padding:40px 20px;margin:0">
        <div style="max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#EF4444,#DC2626);padding:3px;border-radius:12px">
            <div style="background:#160D2B;border-radius:10px;padding:40px">
              <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;color:#EF4444">Payment Failed</h1>
              <p style="color:#A78BFA;line-height:1.6">Hello ${name},<br><br>We were unable to process your payment of <strong style="color:#fff">${amount}</strong>. Please update your payment method to avoid service interruption.</p>
              <a href="${retryUrl}" style="display:inline-block;background:linear-gradient(135deg,#EF4444,#DC2626);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;margin-top:24px">Update Payment Method</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  subscriptionRenewal: (name: string, packageName: string, nextBillingDate: string, amount: string) => ({
    subject: "Subscription Renewed — AutoFX",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Inter,sans-serif;background:#0F0A1E;color:#fff;padding:40px 20px;margin:0">
        <div style="max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:3px;border-radius:12px">
            <div style="background:#160D2B;border-radius:10px;padding:40px">
              <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;color:#A78BFA">Subscription Renewed</h1>
              <p style="color:#A78BFA;line-height:1.6">Hello ${name},<br><br>Your <strong style="color:#fff">${packageName}</strong> subscription has been successfully renewed for <strong style="color:#fff">${amount}</strong>. Next billing date: <strong style="color:#fff">${nextBillingDate}</strong>.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}
