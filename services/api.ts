
import { AppUser } from "../types";

export interface LocationPayload {
    latitude: number;
    longitude: number;
    device_type: string;
    os: string;
    browser: string;
    session_id: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Service xử lý các yêu cầu API hệ thống
 */
export const ApiService = {
    /**
   * Lấy danh sách người dùng từ hệ thống
   */
    async getUsers(): Promise<ApiResponse<any[]>> {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status, // API trả về "status" là boolean thành công
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.getUsers failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải danh sách người dùng"
            };
        }
    },
    /**
     * Lưu vị trí hiện tại của người dùng
     */
    async saveLocation(payload: LocationPayload): Promise<ApiResponse> {
        try {
            const response = await fetch('/api/auth/save-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("ApiService.saveLocation failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể kết nối đến máy chủ"
            };
        }
    },

    /**
     * Cập nhật thông tin nhân viên
     */
    async updateUser(user: AppUser): Promise<ApiResponse<AppUser>> {
        // Giả lập call API cập nhật user
        return {
            success: true,
            message: "Cập nhật nhân viên thành công",
            data: user
        };
    }
};
