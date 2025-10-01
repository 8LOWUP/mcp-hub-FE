// 서버 응답 envelope
export type ApiEnvelopeType<T = unknown> = {
    result: T;
    message: string;
    timestamp: string;
    code: string;
};

// GET /members/me 응답
export type GetMyProfileResponseType = ApiEnvelopeType<{
    id?: number | string;
    memberId?: number | string;
    email?: string;
    nickname?: string;
    avatarUrl?: string;
}>;

// PATCH /members/me 요청 DTO
export type PatchMyProfileRequestType = {
    id: number | string;
    email?: string;
    nickname?: string;
};

// PATCH /members/me 응답 DTO
export type PatchMyProfileResponseType = ApiEnvelopeType<{
    id?: number | string;
    memberId?: number | string;
    email?: string;
    nickname?: string;
    avatarUrl?: string;
}>;

// DELETE /members/me 응답 DTO
export type DeleteMeResponseType =
    | ApiEnvelopeType<{ message?: string }>
    | string;
