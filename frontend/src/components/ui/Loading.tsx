export const Loading = () => {
    return (
        <>
            <style>
                {`
    .gm-loading {
        text-align: center;
        padding: 40px;
        color: #666;
    }
       .gm-loading-spinner {
                    display: inline-block;
                width: 30px;
                height: 30px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3b4d99;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
        }
    `}
            </style>
            <div className="gm-loading">
                <div className="gm-loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        </>
    )
}