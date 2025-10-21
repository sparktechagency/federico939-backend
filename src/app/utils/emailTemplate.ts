export const OTPmailSubject = 'This Is Your OTP Code';

export const OTPmailBody = (value: number) => {
  const data = `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <img src="https://img.freepik.com/premium-vector/black-white-drawing-tree-with-arrows-pointing-right_788759-6719.jpg?semt=ais_hybrid&w=740" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
    <div style="text-align: center;">
      <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use OTP code is:</p>
      <div style="background-color:rgb(33, 34, 33); width: 150px; padding: 12px 0; text-align: center; border-radius: 8px; color: #fff; font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 20px auto;">
        ${value}
      </div>
      <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for <strong>2 minutes</strong>.</p>
      <p style="color: #b9b4b4; font-size: 14px; line-height: 1.5; margin-bottom: 0; text-align: left;">
        If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
      </p>
    </div>
  </div>
</body>`;
  return data;
}; // https://img.freepik.com/premium-vector/black-white-drawing-tree-with-arrows-pointing-right_788759-6719.jpg?semt=ais_hybrid&w=740

export const resetLinkSubject = 'Reset your password within ten mins!';
export const resetLinkHTML = (resetUILink: string, name: string) => {
  const htmlBody = `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding-top: 10px; padding-bottom: 10px;">
<div style="width: 100%; padding: 20px; background-color: #fff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
<img src="https://res.cloudinary.com/dozeewhei/image/upload/v1725702879/suchorita%2B8801864742013.jpg" alt="Logo" style="width: 100%; margin-bottom: 20px;">
<div style="text-align: center; padding: 20px 0;">
<h2 style="margin: 0;">Reset Your Password</h2>
</div>
<div style="padding: 20px; text-align: center;">
<p>Dear ${name},</p>
<p>You requested a password reset. Please click the button below to reset your password:</p>
<a href="${resetUILink}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
<p>If you did not request a password reset, please ignore this email.</p>
</div>
<div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
<p style="margin: 0;">&copy; ${new Date().getFullYear()} example.com. All rights reserved.</p>
</div>
</div>
</body>
`;
  return htmlBody;
};

export const socialMediaHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Verified Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 50px auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
        <!-- Success Icon -->
        <div style="width: 80px; height: 80px; background-color: #4CAF50; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        
        <!-- Success Message -->
        <h1 style="margin: 0 0 15px; color: #2c3e50; font-size: 28px; font-weight: 600;">Verification Successful!</h1>
        <p style="margin: 0 0 25px; color: #7f8c8d; font-size: 16px;">
            Your social media profile has been successfully verified and linked to your account.
        </p>
        
        <!-- Verified Profile Info -->
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: left;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background-color: #e1f5fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <span id="platform-icon" style="font-size: 20px;">📱</span>
                </div>
                <div>
                    <h3 id="platform-name" style="margin: 0 0 3px; font-size: 18px; color: #2c3e50;">Social Platform</h3>
                    <p id="profile-link" style="margin: 0; font-size: 14px; color: #3498db;">
                        <a href="#" style="color: #3498db; text-decoration: none;">profile link</a>
                    </p>
                </div>
            </div>
            <div style="font-size: 14px; color: #7f8c8d;">
                <p style="margin: 5px 0;">Verified on: <span id="verification-date" style="color: #2c3e50;">Just now</span></p>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; justify-content: center; gap: 15px;">
            <a href="/profile" style="display: inline-block; padding: 12px 25px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: 500; transition: background-color 0.3s;">View Profile</a>
            <a href="/" style="display: inline-block; padding: 12px 25px; background-color: #f1f1f1; color: #333; text-decoration: none; border-radius: 5px; font-weight: 500; transition: background-color 0.3s;">Back to Home</a>
        </div>
    </div>

    <script>
        // This script would be populated with actual data from your backend
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const platform = urlParams.get('platform') || 'Facebook';
            const profileUrl = urlParams.get('profileUrl') || '#';
            const username = urlParams.get('username') || 'your_profile';
            
            // Update platform icon
            const platformIcons = {
                'facebook': '👍',
                'twitter': '🐦',
                'instagram': '📷',
                'linkedin': '💼'
            };
            
            const platformIcon = platformIcons[platform.toLowerCase()] || '📱';
            document.getElementById('platform-icon').textContent = platformIcon;
            
            // Update platform info
            document.getElementById('platform-name').textContent = 
                platform.charAt(0).toUpperCase() + platform.slice(1) + ': @' + username;
            
            const linkElement = document.getElementById('profile-link').querySelector('a');
            linkElement.textContent = profileUrl;
            linkElement.href = profileUrl;
            
            // Update verification date
            const now = new Date();
            document.getElementById('verification-date').textContent = 
                now.toLocaleDateString() + ' at ' + now.toLocaleTimeString();
        });
    </script>
</body>
</html>
`;
