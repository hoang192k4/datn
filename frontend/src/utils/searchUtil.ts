export const normalizeString = (str: string) => {
    return str
        .normalize('NFD')                // Tách dấu khỏi ký tự gốc
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')                 
        .replace(/Đ/g, 'd')                 // Xoá dấu
        .replace(/\s+/g, '')             // Xoá khoảng trắng
        .toLowerCase();                 
};