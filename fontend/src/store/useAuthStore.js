import { create } from "zustand";
import { axiosInstance } from "../lip/axios";
import toast from "react-hot-toast";
// import { logout } from "../../../backend/src/controllers/auth.controller";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/test");
            set({authUser: res.data});
        } catch (error) {
            console.log(error);
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false});
        }
    },
    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data});
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");  
        } finally {
            set({ isSigningUp: false});
        }

    },
    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}));