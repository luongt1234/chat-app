import { create } from "zustand";
import { axiosInstance } from "../lip/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { use } from "react";
// import { data } from "react-router-dom";
// import { logout } from "../../../backend/src/controllers/auth.controller";

const BASE_URL = "http://localhost:8080";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/test");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            set({ isSigningUp: false });
        }

    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Account login successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.post("/auth/updateProfile");
            set({ authUser: res.data });
            toast.success("Account updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            return
        }
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}));