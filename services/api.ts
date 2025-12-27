
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
    status?: number;
}

/**
 * Service xử lý các yêu cầu API hệ thống
 */
export const ApiService = {
    /**
     * Lấy danh sách người dùng từ hệ thống
     */
    async getUsers(): Promise<ApiResponse<any[]>> {
        let status: number | undefined;
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            status = response.status;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.getUsers failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải danh sách người dùng",
                status: status
            };
        }
    },

    /**
     * Lấy danh sách tin tức từ hệ thống
     */
    async getNews(): Promise<ApiResponse<any[]>> {
        let status: number | undefined;
        try {
            const response = await fetch('/api/news/index', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            status = response.status;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.getNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải tin tức",
                status: status
            };
        }
    },

    /**
     * Lấy chi tiết một bài viết
     */
    async getNewsDetail(id: string): Promise<ApiResponse<any>> {
        let status: number | undefined;
        try {
            const response = await fetch(`/api/news/view?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            status = response.status;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.getNewsDetail failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải chi tiết bài viết",
                status: status
            };
        }
    },

    /**
     * Tạo bài viết mới
     */
    async createNews(data: any): Promise<ApiResponse<any>> {
        let status: number | undefined;
        try {
            const response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(data)
            });
            status = response.status;

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.createNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tạo bài viết",
                status: status
            };
        }
    },

    /**
     * Cập nhật bài viết
     */
    async updateNews(id: string, data: any): Promise<ApiResponse<any>> {
        let status: number | undefined;
        try {
            const response = await fetch(`/api/news/update?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(data)
            });
            status = response.status;

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.updateNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể cập nhật bài viết",
                status: status
            };
        }
    },

    /**
     * Xóa bài viết (Ẩn bài viết)
     */
    async deleteNews(id: string): Promise<ApiResponse<any>> {
        let status: number | undefined;
        try {
            const response = await fetch(`/api/news/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            status = response.status;

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data,
                status: status
            };
        } catch (error) {
            console.error("ApiService.deleteNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể xóa bài viết",
                status: status
            };
        }
    },

    /**
     * Lưu vị trí hiện tại của người dùng
     */
    async saveLocation(payload: LocationPayload): Promise<ApiResponse> {
        let status: number | undefined;
        try {
            const response = await fetch('/api/auth/save-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });
            status = response.status;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                ...resData,
                status: status
            };
        } catch (error) {
            console.error("ApiService.saveLocation failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể kết nối đến máy chủ",
                status: status
            };
        }
    },

    /**
     * Cập nhật thông tin nhân viên
     */
    async updateUser(user: AppUser): Promise<ApiResponse<AppUser>> {
        return {
            success: true,
            message: "Cập nhật nhân viên thành công",
            data: user,
            status: 200
        };
    }
};
