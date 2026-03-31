'use client';

import { useState, useEffect } from "react";
import { getMyWidgets, createWidgetToken, updateGoalConfig } from "@/app/_apis/widget";
import { WidgetTokenInfo, WidgetGoalConfig } from "@/app/_types/widget";
import { DEFAULT_GOAL_CONFIG } from "./constants";

export function useDonationWidget() {
  const [token, setToken] = useState<WidgetTokenInfo | null>(null);
  const [config, setConfig] = useState<WidgetGoalConfig>(DEFAULT_GOAL_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const widgets = await getMyWidgets();
        let goal = widgets.find((w) => w.widgetType === 'GOAL') ?? null;
        if (!goal) goal = await createWidgetToken('GOAL');
        setToken(goal);
        if (goal.config) setConfig(goal.config as WidgetGoalConfig);
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
      await updateGoalConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    } finally {
      setIsSaving(false);
    }
  }

  return { token, config, setConfig, isLoading, isSaving, saveSuccess, handleSave };
}
