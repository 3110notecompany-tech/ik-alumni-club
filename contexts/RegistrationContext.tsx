"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "registration_flow";

/**
 * 会員登録フローの状態管理
 */
type RegistrationContextType = {
  // 会員規約同意
  termsAgreed: boolean;
  termsAgreedAt: Date | null;
  setTermsAgreed: (agreed: boolean) => void;

  // プラン選択
  selectedPlanId: number | null;
  setSelectedPlanId: (planId: number) => void;

  // フロー全体のリセット
  resetRegistration: () => void;
};

type StoredRegistrationData = {
  termsAgreed: boolean;
  termsAgreedAt: string | null;
  selectedPlanId: number | null;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

/**
 * RegistrationProvider コンポーネント
 */
export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [termsAgreed, setTermsAgreedState] = useState(false);
  const [termsAgreedAt, setTermsAgreedAt] = useState<Date | null>(null);
  const [selectedPlanId, setSelectedPlanIdState] = useState<number | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にlocalStorageから状態を復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredRegistrationData = JSON.parse(stored);
        setTermsAgreedState(data.termsAgreed);
        setTermsAgreedAt(data.termsAgreedAt ? new Date(data.termsAgreedAt) : null);
        setSelectedPlanIdState(data.selectedPlanId);
      }
    } catch (error) {
      console.error("Failed to restore registration state:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 状態が変更されたらlocalStorageに保存
  useEffect(() => {
    if (!isInitialized) return;

    try {
      const data: StoredRegistrationData = {
        termsAgreed,
        termsAgreedAt: termsAgreedAt?.toISOString() || null,
        selectedPlanId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save registration state:", error);
    }
  }, [termsAgreed, termsAgreedAt, selectedPlanId, isInitialized]);

  const setTermsAgreed = useCallback((agreed: boolean) => {
    setTermsAgreedState(agreed);
    if (agreed) {
      setTermsAgreedAt(new Date());
    } else {
      setTermsAgreedAt(null);
    }
  }, []);

  const setSelectedPlanId = useCallback((planId: number) => {
    setSelectedPlanIdState(planId);
  }, []);

  const resetRegistration = useCallback(() => {
    setTermsAgreedState(false);
    setTermsAgreedAt(null);
    setSelectedPlanIdState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear registration state:", error);
    }
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        termsAgreed,
        termsAgreedAt,
        setTermsAgreed,
        selectedPlanId,
        setSelectedPlanId,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

/**
 * useRegistration カスタムフック
 */
export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
}
