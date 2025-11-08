"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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
