import { useState, useEffect } from "react";
import { getBroadcastSetting, updateBroadcastSetting } from "@/app/_apis/user";
import { reCreateStreamKey } from "@/app/_apis/ivs";
import { getApiErrorMessage } from "@/app/_lib/api";

export const useBroadcastSettings = () => {
    const [streamKey, setStreamKey] = useState("");
    const [serverUrl, setServerUrl] = useState("");
    const [title, setTitle] = useState("test");
    const [showStreamKey, setShowStreamKey] = useState(false);
    const [isAdult, setIsAdult] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [isFanClub, setIsFanClub] = useState(false);
    const [fanLevel, setFanLevel] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [copiedText, setCopiedText] = useState("");

    useEffect(() => {
        async function fetchBroadcastSetting() {
            try {
                const response = await getBroadcastSetting();
                setStreamKey(response.ivs.stream_key);
                setServerUrl(response.ivs.ingest_endpoint);
                setTitle(response.broadcastSetting.title);
                setIsAdult(response.broadcastSetting.is_adult);
                setIsPrivate(response.broadcastSetting.is_pw);
                setPassword(response.broadcastSetting.password ?? '');
                setIsFanClub(response.broadcastSetting.is_fan);
                setFanLevel(response.broadcastSetting.fan_level);
                console.log(response);
            } catch (error) {
                console.error("Error fetching broadcast settings:", error);
            }
        }
        fetchBroadcastSetting();
    }, []);

    const toggleStreamKeyVisibility = () => {
        setShowStreamKey(!showStreamKey);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Copied to clipboard');
                setCopiedText(label);
                setShowToast(true);
                
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const reissueStreamKey = async () => {
        try {
            const response = await reCreateStreamKey();
            setStreamKey(response.streamKey);
            setCopiedText("스트림키가 변경되었습니다");
            setShowStreamKey(true);
            setShowToast(true);  
            
            setTimeout(() => {
                setShowToast(false);
                setShowStreamKey(false);
            }, 2000);
            console.log(response);
        } catch (e) {
            const message = getApiErrorMessage(e);
            return { error: message };
        }
    };

    const validateValues = () => {
        if (title.length < 1 || title.length > 30) {
            return { error: "방송 제목은 1자 이상 30자 이하로 입력해주세요" };
        }
        if (isPrivate && (password.length < 4 || password.length > 8)) {
            return { error: "비밀번호는 4~8글자로 설정해주세요" };
        }
        if (isFanClub && (fanLevel < 1 || fanLevel > 5)) {
            return { error: "팬 레벨은 1~5입니다" };
        }
        return { success: true };
    };

    const handleSave = async () => {
        const validation = validateValues();
        if (!validation.success) {
            return validation;
        }
        try {
            await updateBroadcastSetting(title, isAdult, isPrivate, isFanClub, fanLevel, password);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { error: "유효하지 않은 설정입니다" };
        }
    };

    return {
        streamKey,
        serverUrl,
        title,
        showStreamKey,
        isAdult,
        isPrivate,
        password,
        isFanClub,
        fanLevel,
        showToast,
        copiedText,
        setTitle,
        setIsAdult,
        setIsPrivate,
        setPassword,
        setIsFanClub,
        setFanLevel,
        toggleStreamKeyVisibility,
        copyToClipboard,
        reissueStreamKey,
        handleSave
    };
};