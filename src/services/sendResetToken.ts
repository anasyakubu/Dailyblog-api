import resend from "../config/resend.config.js";
import renderResetTokenMail from "../mail/ResetTokenTemplate";

const sendResetToken = async (resetToken: string, email: string) => {
  if (!resetToken) { throw new Error("Invalid Reset Token: Reset Token is required."); }

  // console.log(`${resetToken}`); // for debugging (1)

  try {
    // ********************** MAIL OPTION  **********************//
    const mailOption = {
      from: 'noreply@dailyinvoice.xyz',
      to: email,
      subject: "Daily Pay - Reset Your Password",
      html: renderResetTokenMail(resetToken),
    };

    //console.log(mailOption) //for debugging (2)
    // ********************** Send email  **********************//
    await resend.sendMail(mailOption);

    return { status: "202", message: "Password reset email sent Successful", data: { resetToken }, };
  } catch (error: any) {
    console.log("ERROR", error);
    return { status: "500", msg: error.message, error: error };
  }
};

export default sendResetToken;
