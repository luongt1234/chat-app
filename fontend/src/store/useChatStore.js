import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lip/axios";

export const UseChatStore = create((set) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
            
        } catch (error) {
            toast.error(error.message.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userID) => {
        set({isMessageLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userID}`);
            set({message: res.data});
        } catch (error) {
            toast.error(error.message.data.message);
        } finally {
            set({isMessageLoading: false})
        }
    }
}));