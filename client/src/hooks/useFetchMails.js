import { useRef, useCallback, useEffect } from "react";
import useCreateEmail from "./useCreateEmail";
import useMailStore from "../store/mailStore";

export default function useFetchMails(pollIntervalMs = 5000) {
    const { createEmail } = useCreateEmail();

    const setMailsLoading = useMailStore((state) => state.setMailsLoading);
    const setMailsData = useMailStore((state) => state.setMailsData);
    const emailAddress = useMailStore((state) => state.email.address);

    const isFetchingRef = useRef(false);

    const fetchMails = useCallback(async (isInitialLoad) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        if (isInitialLoad) setMailsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fetch-mails`, { credentials: "include" });
            if (response.status === 401) {
                isFetchingRef.current = false;
                await createEmail();
                return;
            }
            if (!response.ok) throw new Error(`API Error ${response.status}`);
            const data = (await response.json());

            const currentMailsData = useMailStore.getState().mails.data;

            if (JSON.stringify(data) !== JSON.stringify(currentMailsData)) {
                setMailsData(data);
            }
            else if (isInitialLoad) {
                setMailsLoading(false);
            }
        }
        catch (error) {
            console.error(error);
            if (isInitialLoad) setMailsLoading(false);
        }
        finally {
            isFetchingRef.current = false;
        }
    }, [setMailsLoading, createEmail, setMailsData]);

    useEffect(() => {
        if (!emailAddress) return;

        let isMounted = true;
        let timeoutId;

        const startSequentialPoll = async (isInitial) => {
            await fetchMails(isInitial);

            if (isMounted) {
                timeoutId = setTimeout(() => {
                    startSequentialPoll(false);
                }, pollIntervalMs);
            }
        };

        startSequentialPoll(true);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [emailAddress, fetchMails, pollIntervalMs]);

    return { fetchMails };
}