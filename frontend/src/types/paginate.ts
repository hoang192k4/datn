export interface Paginate {
    page?: number | null | undefined;
    limit?: number | null | undefined;
    previous_page?: number | null;
    next_page?: number | null;
    current_page?: number | null;
    from?: number | null | undefined;
    to?: number | null | undefined;
    total?: number | null | undefined;
    total_pages?: number | null | undefined;
    key?: string;
}