'use client';

import { useState, useEffect } from "react";
import { getMyWidgets, createWidgetToken, updateChatConfig } from "@/app/_apis/widget";
import { WidgetTokenInfo, WidgetChatConfig } from "@/app/_types/widget";
import { DEFAULT_CHAT_CONFIG } from "./constants";

export function useChatWidget() {
  const [token, setToken] = useState<WidgetTokenInfo | null>(null);
  const [config, setConfig] = useState<WidgetChatConfig>(DEFAULT_CHAT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const widgets = await getMyWidgets();
        let chat = widgets.find((w) => w.widgetType === 'CHAT') ?? null;
        if (!chat) chat = await createWidgetToken('CHAT');
        setToken(chat);
        if (chat.config) setConfig(chat.config as WidgetChatConfig);
      } catch {
        // 네트워크 오류 시 기본값 유지
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!token) return;
    setIsSaving(true);
    try {
      await updateChatConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopyUrl() {
    const url = token?.widgetUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return { token, config, setConfig, isLoading, isSaving, saveSuccess, copied, handleSave, handleCopyUrl };
}
