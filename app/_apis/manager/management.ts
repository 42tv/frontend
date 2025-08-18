import api from "../auto_refresh_axios";

/**
 * 매니저 추가 요청 DTO 인터페이스
 */
export interface AddManagerDto {
  userId: string;
}

/**
 * 매니저 제거 요청 DTO 인터페이스
 */
export interface RemoveManagerDto {
  userId: string;
}

/**
 * 매니저 추가 API 응답 인터페이스
 */
export interface AddManagerResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * 매니저 제거 API 응답 인터페이스
 */
export interface RemoveManagerResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * 매니저 추가
 * @param userId - 매니저로 추가할 사용자의 아이디
 * @returns Promise<AddManagerResponse>
 */
export async function addManager(userId: string): Promise<AddManagerResponse> {
  try {
    const requestBody: AddManagerDto = {
      userId: userId
    };

    const response = await api.post("/api/manager", requestBody, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to add manager:", error);
    throw error;
  }
}

/**
 * 매니저 제거
 * @param userId - 매니저에서 제거할 사용자의 아이디
 * @returns Promise<RemoveManagerResponse>
 */
export async function removeManager(userId: string): Promise<RemoveManagerResponse> {
  try {
    const requestBody: RemoveManagerDto = {
      userId: userId
    };

    const response = await api.delete("/api/manager", {
      data: requestBody,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to remove manager:", error);
    throw error;
  }
}