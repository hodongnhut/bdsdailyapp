
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
     * Lấy danh sách tin tức từ hệ thống
     */
    async getNews(): Promise<ApiResponse<any[]>> {
        try {
            const response = await fetch('/api/news/index', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.getNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải tin tức"
            };
        }
    },
    /**
 * Lấy chi tiết một bài viết
 */
    async getNewsDetail(id: string): Promise<ApiResponse<any>> {
        try {
            const response = await fetch(`/api/news/view?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.getNewsDetail failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tải chi tiết bài viết"
            };
        }
    },
    /**
    * Tạo bài viết mới
   */
    async createNews(data: any): Promise<ApiResponse<any>> {
        try {
            const response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(data)
            });

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.createNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể tạo bài viết"
            };
        }
    },

    /**
     * Cập nhật bài viết
     */
    async updateNews(id: string, data: any): Promise<ApiResponse<any>> {
        try {
            const response = await fetch(`/api/news/update?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(data)
            });

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.updateNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể cập nhật bài viết"
            };
        }
    },

    /**
     * Xóa bài viết (Ẩn bài viết)
     */
    async deleteNews(id: string): Promise<ApiResponse<any>> {
        try {
            const response = await fetch(`/api/news/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            const resData = await response.json();
            return {
                success: resData.status,
                message: resData.msg,
                data: resData.data
            };
        } catch (error) {
            console.error("ApiService.deleteNews failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Không thể xóa bài viết"
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
