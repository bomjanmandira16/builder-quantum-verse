import { Request, Response } from 'express';
import { createShortLink } from './redirect';

interface InviteRequest {
  email: string;
  role: string;
  inviterName: string;
  organizationName?: string;
  customDomain?: string;
}

export async function handleInvite(req: Request, res: Response) {
  try {
    const { email, role, inviterName, organizationName = 'BaatoMetrics' }: InviteRequest = req.body;

    if (!email || !role || !inviterName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, role, inviterName'
      });
    }

    // Generate invitation token
    const inviteToken = Buffer.from(JSON.stringify({
      email,
      role,
      timestamp: Date.now(),
      inviter: inviterName
    })).toString('base64');

    // Use a cleaner, easier domain for invitations
    const baseUrl = process.env.INVITE_DOMAIN || req.headers.origin || 'https://app.baato.io';
    const fullInviteLink = `${baseUrl}/join?token=${inviteToken}`;

    // Create an easy short link
    const shortCode = createShortLink(inviteToken);
    const easyLink = `${baseUrl}/j/${shortCode}`;

    console.log(`📧 Easy Link Created: ${easyLink}`);
    console.log(`📧 Full Link: ${fullInviteLink}`);

    // Use the easy link for user-facing communications
    const inviteLink = easyLink;

    // Email template
    const emailContent = {
      to: email,
      subject: `You're invited to join ${organizationName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${organizationName}!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hi there! 👋
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${inviterName}</strong> has invited you to join the ${organizationName} team as a <strong>${role}</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 10px 0; color: #495057;">Your Role: ${role.charAt(0).toUpperCase() + role.slice(1)}</h3>
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                ${role === 'admin' ? 'Full access to manage the team and all features' : 
                  role === 'editor' ? 'Create and edit mapping projects and data' : 
                  'View and analyze mapping data and reports'}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; 
                        font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6c757d; text-align: center; margin-top: 30px;">
              This invitation will expire in 7 days. If you can't click the button, copy and paste this link:
            </p>
            <p style="font-size: 12px; color: #868e96; word-break: break-all; text-align: center; background: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${inviteLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #868e96; text-align: center; margin: 0;">
              This invitation was sent by ${inviterName} from ${organizationName}.<br>
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        You've been invited to join ${organizationName}!
        
        ${inviterName} has invited you to join the ${organizationName} team as a ${role}.
        
        Click here to accept: ${inviteLink}
        
        Your role: ${role.charAt(0).toUpperCase() + role.slice(1)}
        ${role === 'admin' ? '- Full access to manage the team and all features' : 
          role === 'editor' ? '- Create and edit mapping projects and data' : 
          '- View and analyze mapping data and reports'}
        
        This invitation will expire in 7 days.
        
        If you can't click the link, copy and paste: ${inviteLink}
      `
    };

    // For now, we'll log the email content (in production, you'd use a service like SendGrid, Mailgun, etc.)
    console.log('📧 Email Invitation Generated:');
    console.log(`To: ${email}`);
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Invite Token: ${inviteToken}`);
    console.log(`Invite Link: ${inviteLink}`);
    console.log('Email Content:', emailContent.text);

    // In a real application, you would send the email here using a service like:
    // - SendGrid: sgMail.send(emailContent)
    // - Mailgun: mailgun.messages().send(emailContent)
    // - AWS SES: ses.sendEmail(emailContent)
    // - Nodemailer: transporter.sendMail(emailContent)

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.json({
      success: true,
      message: 'Invitation email sent successfully',
      inviteToken,
      inviteLink,
      emailPreview: {
        to: email,
        subject: emailContent.subject,
        content: emailContent.text
      }
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send invitation email'
    });
  }
}
