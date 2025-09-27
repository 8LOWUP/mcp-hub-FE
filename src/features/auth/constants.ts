export type ProviderId = "google" | "github" | "kakao";

export const PROVIDER_LABEL: Record<ProviderId, string> = {
    google: "Sign in using Google",
    github: "Sign in using GitHub",
    kakao:  "Sign in using KaKao",
};
