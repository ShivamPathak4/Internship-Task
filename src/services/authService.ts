import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { endpoints } from "./apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export const sendOtp = async (email, navigate) => {
  try {
    toast.loading("Sending OTP...");
    const response = await apiConnector("POST", SENDOTP_API, {
      email,
      checkUserPresent: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss();
    toast.success("OTP Sent Successfully");
    navigate("/verify-email");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Failed to send OTP");
    return false;
  }
};

export const signUp = async (name, email, password, navigate) => {
  try {
    toast.loading("Creating Account...");
    const response = await apiConnector("POST", SIGNUP_API, {
      accountType: "User", // Assuming a default account type since not specified
      firstName: name, 
      lastName:"4g",// Using 'name' as firstName since lastName is not available
      email,
      password,
      confirmPassword: password, // Assuming confirmPassword is same as password for simplicity
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss();
    toast.success("Signup Successful");
    navigate("/verify-email");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Signup Failed");
    navigate("/signup");
    return false;
  }
};

export const verifyEmail = async (otp, email, setUser) => {
  try {
    toast.loading("Verifying Email...");
    const response = await apiConnector("POST", SIGNUP_API, {
      email,
      otp,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const userImage = response.data?.user?.image
      ? response.data.user.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}`;
    
    const user = { ...response.data.user, image: userImage };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(response.data.token));

    toast.dismiss();
    toast.success("Email Verified Successfully");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Invalid OTP");
    return false;
  }
};

export const login = async (email, password, setUser, navigate) => {
  try {
    toast.loading("Logging In...");
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const userImage = response.data?.user?.image
      ? response.data.user.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}`;
    
    const user = { ...response.data.user, image: userImage };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(response.data.token));

    toast.dismiss();
    toast.success("Login Successful");
    navigate("/interests");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Invalid email or password");
    return false;
  }
};

export const forgotPassword = async (email, setEmailSent) => {
  try {
    toast.loading("Sending Reset Email...");
    const response = await apiConnector("POST", RESETPASSTOKEN_API, {
      email,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss();
    toast.success("Reset Email Sent");
    setEmailSent(true);
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Failed to Send Reset Email");
    return false;
  }
};

export const resetPassword = async (password, confirmPassword, token, setResetComplete) => {
  try {
    toast.loading("Resetting Password...");
    const response = await apiConnector("POST", RESETPASSWORD_API, {
      password,
      confirmPassword,
      token,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss();
    toast.success("Password Reset Successfully");
    setResetComplete(true);
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || "Failed to Reset Password");
    return false;
  }
};

export const logout = (navigate, setUser) => {
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged Out");
  navigate("/");
};