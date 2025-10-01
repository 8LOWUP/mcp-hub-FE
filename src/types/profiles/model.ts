// 앱 내부에서 쓰는 순수 모델
export type ProfileType = {
    id?: number | string;
    memberId?: number | string;
    email?: string;
    nickname?: string;
    avatarUrl?: string;
};

// 프로필 수정 시 화면에서 사용하는 payload
export type UpdateProfilePayloadType = {
    email?: string;
    nickname?: string;
    avatarUrl?: string;
};
