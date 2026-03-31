'use client';

import { useState, useEffect } from "react";
import { getMyWidgets, createWidgetToken, updateDonationConfig } from "@/app/_apis/widget";
import { WidgetTokenInfo, WidgetDonationConfig } from "@/app/_types/widget";
import { DEFAULT_DONATION_CONFIG } from "./constants";

export function useDonationWidget() {
  const [token, setToken] = useState<WidgetTokenInfo | null>(null);
  const [config, setConfig] = useState<WidgetDonationConfig>(DEFAULT_DONATION_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const widgets = await getMyWidgets();
        let donation = widgets.find((w) => w.widgetType === 'DONATION') ?? null;
        if (!donation) donation = await createWidgetToken('DONATION');
        setToken(donation);
        if (donation.config) setConfig(donation.config as WidgetDonationConfig);
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
      await updateDonationConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    } finally {
      setIsSaving(false);
    }
  }

  return { token, config, setConfig, isLoading, isSaving, saveSuccess, handleSave };
}
