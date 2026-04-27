export const welcomeMessageTemplateForMail = (
  petrolPumpName: string,
  name: string,
  email: string,
  address?: string,
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome – ${petrolPumpName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background:#f0f4f0;font-family:'DM Sans',sans-serif;">

  <!-- Preheader -->
  <span style="display:none;max-height:0;overflow:hidden;color:#f0f4f0;">
    Welcome to ${petrolPumpName} — We're glad to have you with us!
  </span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- TOP LOGO BAR -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1a4d2e;border-radius:50%;width:56px;height:56px;text-align:center;vertical-align:middle;font-size:28px;line-height:56px;">
                    ⛽
                  </td>
                </tr>
              </table>
              <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#1a4d2e;margin-top:12px;letter-spacing:0.5px;">
                ${petrolPumpName}
              </div>
              <div style="font-size:12px;color:#6b8f71;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">
                Your Trusted Fuel Partner
              </div>
            </td>
          </tr>

          <!-- HERO CARD -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1a4d2e 0%,#2d7a47 60%,#3a9457 100%);border-radius:20px 20px 0 0;overflow:hidden;">
                <tr>
                  <td style="padding:48px 40px 40px;text-align:center;">

                    <!-- Decorative line -->
                    <div style="display:inline-block;width:40px;height:3px;background:rgba(255,255,255,0.3);border-radius:2px;margin-bottom:20px;"></div>

                    <div style="font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">
                      Welcome To The Family
                    </div>

                    <div style="font-family:'Playfair Display',serif;font-size:42px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:8px;">
                      Namaste,<br/>
                      <span style="color:#f5c842;">${name}! 🙏</span>
                    </div>

                    <div style="width:60px;height:2px;background:rgba(255,255,255,0.2);margin:20px auto;border-radius:2px;"></div>

                    <p style="font-size:16px;color:rgba(255,255,255,0.88);line-height:1.7;margin:0;max-width:420px;margin:0 auto;">
                      We are truly honoured to welcome you to the
                      <strong style="color:#ffffff;">${petrolPumpName}</strong> family.
                      Your trust means everything to us.
                    </p>

                  </td>
                </tr>

                <!-- Fuel pump illustration bar -->
                <tr>
                  <td style="background:rgba(0,0,0,0.15);padding:14px 40px;text-align:center;">
                    <span style="font-size:28px;">⛽</span>
                    <span style="font-size:28px;margin:0 8px;">🚗</span>
                    <span style="font-size:28px;">⛽</span>
                    <span style="font-size:28px;margin:0 8px;">🛻</span>
                    <span style="font-size:28px;">⛽</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CARD -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:0 0 20px 20px;overflow:hidden;">
                <tr>
                  <td style="padding:36px 40px;">

                    <!-- Welcome message -->
                    <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 28px;">
                      Dear <strong style="color:#1a4d2e;">${name}</strong>,<br/><br/>
                      On behalf of our entire team at <strong>${petrolPumpName}</strong>,
                      we extend a warm welcome to you. We are committed to providing you with
                      the <strong>highest quality fuel</strong> and the most <strong>reliable service</strong>
                      every single time you visit us.
                    </p>

                    <!-- 3 Feature boxes -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <!-- Box 1 -->
                        <td width="31%" style="background:#f0f9f4;border:1px solid #c6e6d1;border-radius:12px;padding:18px 14px;text-align:center;vertical-align:top;">
                          <div style="font-size:26px;margin-bottom:8px;">✅</div>
                          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#1a4d2e;margin-bottom:5px;">Quality Fuel</div>
                          <div style="font-size:12px;color:#6b8f71;line-height:1.5;">100% pure & adulteration-free fuel guaranteed</div>
                        </td>
                        <td width="4%"></td>
                        <!-- Box 2 -->
                        <td width="31%" style="background:#f0f9f4;border:1px solid #c6e6d1;border-radius:12px;padding:18px 14px;text-align:center;vertical-align:top;">
                          <div style="font-size:26px;margin-bottom:8px;">🕐</div>
                          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#1a4d2e;margin-bottom:5px;">24×7 Open</div>
                          <div style="font-size:12px;color:#6b8f71;line-height:1.5;">Always here when you need us, day or night</div>
                        </td>
                        <td width="4%"></td>
                        <!-- Box 3 -->
                        <td width="31%" style="background:#f0f9f4;border:1px solid #c6e6d1;border-radius:12px;padding:18px 14px;text-align:center;vertical-align:top;">
                          <div style="font-size:26px;margin-bottom:8px;">😊</div>
                          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#1a4d2e;margin-bottom:5px;">Friendly Staff</div>
                          <div style="font-size:12px;color:#6b8f71;line-height:1.5;">Courteous team ready to assist you always</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px;background:#e5e7eb;margin-bottom:28px;"></div>

                    <!-- Services -->
                    <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#1a4d2e;margin-bottom:16px;">
                      Our Services
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                          <span style="color:#2d7a47;font-weight:600;font-size:14px;">⛽ &nbsp;Petrol & Diesel Filling</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                          <span style="color:#2d7a47;font-weight:600;font-size:14px;">💨 &nbsp;Free Air & Water Check</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                          <span style="color:#2d7a47;font-weight:600;font-size:14px;">🛢️ &nbsp;Engine Oil & Lubricants</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#2d7a47;font-weight:600;font-size:14px;">💳 &nbsp;UPI, Card & Cash Accepted</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px;background:#e5e7eb;margin-bottom:24px;"></div>

                    <!-- Contact Info -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="vertical-align:top;padding-right:10px;">
                          <div style="font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Address</div>
                          <div style="font-size:13px;color:#374151;line-height:1.6;">NH-58, Near Highway Chowk,<br/>${address || "Uttar Pradesh"}</div>
                        </td>
                        <td width="50%" style="vertical-align:top;padding-left:10px;">
                          <div style="font-size:13px;color:#374151;line-height:1.6;">📞 +91 98765 43210<br/>✉️ ${email}</div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Closing strip -->
                <tr>
                  <td style="background:#f0f9f4;border-top:1px solid #c6e6d1;padding:20px 40px;text-align:center;">
                    <p style="font-size:14px;color:#4b7a57;margin:0;line-height:1.7;">
                      We look forward to serving you for many years to come.<br/>
                      <strong style="color:#1a4d2e;">Safe driving and God bless! 🙏</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <div style="font-size:12px;color:#9ca3af;line-height:1.8;">
                You received this email because you are a valued customer of<br/>
                <strong style="color:#4b7a57;">${petrolPumpName}</strong><br/>
                <a href="#" style="color:#9ca3af;text-decoration:underline;font-size:11px;">Unsubscribe</a> &nbsp;·&nbsp;
                <a href="#" style="color:#9ca3af;text-decoration:underline;font-size:11px;">Privacy Policy</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};

export const dueMessageTemplateForMail = (
  petrolPumpName: string,
  dueAmount: string,
  quantity: string,
  dueDate: string,
  year: string,
  email: string,
  address?: string,
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Due Amount Reminder</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1f2937; color:#ffffff; padding:20px; text-align:center;">
              <h2 style="margin:0;">${petrolPumpName}</h2>
              <p style="margin:5px 0 0; font-size:14px;">Due Amount Reminder</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">

              <p style="font-size:16px; margin-bottom:20px;">
                Dear Customer,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                This is a reminder that an amount of 
                <strong style="color:#dc2626;">₹${dueAmount}</strong> 
                is pending for your fuel purchase of 
                <strong>${quantity}</strong> on 
                <strong>${dueDate}</strong>.
              </p>

              <p style="font-size:15px; margin-top:20px;">
                Kindly clear the outstanding amount at your earliest convenience.
              </p>

              <!-- Highlight Box -->
              <table width="100%" cellpadding="10" cellspacing="0" style="margin:25px 0; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px;">
                <tr>
                  <td>
                    <p style="margin:5px 0;"><strong>Due Amount:</strong> ₹${dueAmount}</p>
                    <p style="margin:5px 0;"><strong>Quantity:</strong> ${quantity}</p>
                    <p style="margin:5px 0;"><strong>Date:</strong> ${dueDate}</p>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; color:#555;">
                If you have already made the payment, please ignore this message.
              </p>

              <p style="font-size:14px; margin-top:20px;">
                For any queries, contact our support team.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="vertical-align:top;padding-right:10px;">
                          <div style="font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Address</div>
                          <div style="font-size:13px;color:#374151;line-height:1.6;">NH-58, Near Highway Chowk,<br/>${address || "Uttar Pradesh"}</div>
                        </td>
                        <td width="50%" style="vertical-align:top;padding-left:10px;">
                          <div style="font-size:13px;color:#374151;line-height:1.6;">📞 +91 98765 43210<br/>✉️ ${email}</div>
                        </td>
                      </tr>
                    </table>

              <p style="margin-top:30px;">
                Regards,<br/>
                <strong>Team ${petrolPumpName}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px; color:#6b7280;">
              © ${year} ${petrolPumpName}. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
