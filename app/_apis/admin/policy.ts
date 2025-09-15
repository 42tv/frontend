import api from "../auto_refresh_axios";
import {
  CreatePolicyDto,
  UpdatePolicyDto,
  PolicyResponseDto,
  PolicyListResponseDto,
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
export async function getPolicyByPage(page: PolicyPageType): Promise<PolicyResponseDto> {
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
    return {
      success: false,
      message: `${page === 'terms' ? '이용약관' : '개인정보처리방침'}을 가져오는데 실패했습니다.`,
      data: undefined
    };
  }
}

/**
 * 특정 정책 조회
 * @param id - 정책 ID
 * @returns Promise<PolicyResponseDto>
 */
export async function getPolicy(id: number): Promise<PolicyResponseDto> {
  try {
    const response = await api.get(`/api/policy/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch policy:", error);
    return {
      success: false,
      message: "정책을 가져오는데 실패했습니다.",
      data: undefined
    };
  }
}

/**
 * 페이지 타입별 활성 정책 조회 (일반 사용자용)
 * @param page - 정책 페이지 타입 ('privacy', 'terms' 등)
 * @returns Promise<PolicyResponseDto>
 */
export async function getActivePolicy(page: PolicyPageType): Promise<PolicyResponseDto> {
  try {
    const response = await api.get(`/api/policy?page=${page}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch active policy:", error);
    return {
      success: false,
      message: `활성 ${page === 'terms' ? '이용약관' : '개인정보처리방침'}을 가져오는데 실패했습니다.`,
      data: undefined
    };
  }
}

/**
 * 정책 생성
 * @param createPolicyDto - 정책 생성 데이터
 * @returns Promise<PolicyResponseDto>
 */
export async function createPolicy(createPolicyDto: CreatePolicyDto): Promise<PolicyResponseDto> {
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
 * 정책 수정
 * @param id - 정책 ID
 * @param updatePolicyDto - 정책 수정 데이터
 * @returns Promise<PolicyResponseDto>
 */
export async function updatePolicy(id: number, updatePolicyDto: UpdatePolicyDto): Promise<PolicyResponseDto> {
  try {
    const response = await api.patch(`/api/policy/${id}`, updatePolicyDto, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update policy:", error);
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

/**
 * 정책 활성화/비활성화
 * @param id - 정책 ID
 * @param is_active - 활성화 여부
 * @returns Promise<PolicyResponseDto>
 */
export async function togglePolicyStatus(id: number, is_active: boolean): Promise<PolicyResponseDto> {
  try {
    const response = await api.patch(`/api/policy/${id}/status`, { is_active }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to toggle policy status:", error);
    throw error;
  }
}