import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lip/axios";
import { useAuthStore } from "./useAuthStore";

export const UseChatStore = create((set, get) => ({
    messages: [],
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
            const res = await axiosInstance.get(`/message/${userID}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.message.data.message);
        } finally {
            set({isMessageLoading: false})
        }
    },
    setSelectedUser: (selectedUser) => set({
        selectedUser
    }),
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error(error.message.data.message);
        }
    },
    subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return ;
        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));