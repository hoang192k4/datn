import "./SchedulePage.css";

const SchedulePage = () => {
    return (
        <>
            <div className="schedule-page container">
                <h1>Thời Khóa Biểu</h1>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Tiết</th>
                            <th>Thứ 2</th>
                            <th>Thứ 3</th>
                            <th>Thứ 4</th>
                            <th>Thứ 5</th>
                            <th>Thứ 6</th>
                            <th>Thứ 7</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="period">Tiết 1</td>
                            <td data-label="Thứ 2">Toán</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 2</td>
                            <td data-label="Thứ 2">Văn</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 3</td>
                            <td data-label="Thứ 2">Anh</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 4</td>
                            <td data-label="Thứ 2">Lý</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 5</td>
                            <td data-label="Thứ 2">Hóa</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 6</td>
                            <td data-label="Thứ 2">Tin</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>

                        <tr>
                            <td className="period">Tiết 7</td>
                            <td data-label="Thứ 2">Thể dục</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 8</td>
                            <td data-label="Thứ 2">Sinh</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 9</td>
                            <td data-label="Thứ 2">Công nghệ</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 10</td>
                            <td data-label="Thứ 2">Lịch sử</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 11</td>
                            <td data-label="Thứ 2">Địa lý</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td className="period">Tiết 12</td>
                            <td data-label="Thứ 2">GDCD</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SchedulePage;
