import { api } from "../config/api"

export const getPostsByTeacherSlug = async (slug: string, page: number) => {
    const response = await api.get('/posts', {
        params: {
            slug, 
            page
        }
    });
    return response.data
}