import api from "../auto_refresh_axios";
import {
  CreatePolicyDto,
  UpdatePolicyDto,
  PolicyResponseDto,
  PolicyListResponseDto,
  PolicyCreateSuccessResponseDto,
  PolicyPageType
} from "@/app/_types/admin";

/**
 * 정책 목록 조회 (전체)
 * @returns Promise<PolicyListResponseDto>
 */
export async function getAllPolicies(): Promise<PolicyListResponseDto> {
  try {
    const response = await api.get("/api/policy", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch policies:", error);
    return {
      success: false,
      message: "정책 목록을 가져오는데 실패했습니다.",
      data: []
    };
  }
}

/**
 * 특정 페이지 타입의 정책 조회
 * @param page - 정책 페이지 타입
 * @returns Promise<PolicyResponseDto>
 */
export async function getPolicyByPage(page: PolicyPageType): Promise<PolicyResponseDto | null> {
  try {
    const response = await api.get(`/api/policy?page=${page}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch policy by page:", error);
    return null;
  }
}

/**
 * 정책 생성
 * @param createPolicyDto - 정책 생성 데이터
 * @returns Promise<PolicyCreateSuccessResponseDto>
 */
export async function createPolicy(createPolicyDto: CreatePolicyDto): Promise<PolicyCreateSuccessResponseDto> {
  try {
    const response = await api.post("/api/policy", createPolicyDto, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to create policy:", error);
    throw error;
  }
}

/**
 * 정책 삭제
 * @param id - 정책 ID
 * @returns Promise<PolicyResponseDto>
 */
export async function deletePolicy(id: number): Promise<PolicyResponseDto> {
  try {
    const response = await api.delete(`/api/policy/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to delete policy:", error);
    throw error;
  }
}