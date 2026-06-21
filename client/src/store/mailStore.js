import { create } from "zustand";

const useMailStore = create((set) => ({
    email: { loading: true, address: null, expiresAt: null },
    setEmailLoading: (loading) => set((state) => ({
        email: { ...state.email, loading }
    })),
    setEmailData: (address, expiresAt) => set(() => ({
        email: { loading: false, address, expiresAt }
    })),

    mails: { loading: true, data: [] },
    setMailsLoading: (loading) => set((state) => ({
        mails: { ...state.mails, loading }
    })),
    setMailsData: (data) => set({
        mails: { loading: false, data }
    }),

    search: "",
    setSearch: (input) => set({ search: input })
}));

export default useMailStore;