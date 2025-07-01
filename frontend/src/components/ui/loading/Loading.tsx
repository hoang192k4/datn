export const Loading = ({ title }: any) => {
    return (
        <>
            <style>
                {`   /* Loading overlay */
                .loading - overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
               
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
        }

                .loading-overlay.show {
                    opacity: 1;
                visibility: visible;
        }

                /* Loading container */
                .loading-container {
                    background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 300px;
                transform: scale(0.8);
                transition: transform 0.3s ease;
        }

                .loading-overlay.show .loading-container {
                    transform: scale(1);
        }

                /* Spinner */
                .spinner {
                    width: 50px;
                height: 50px;
                border: 4px solid #f3f4f6;
                border-top: 4px solid #4a5bcc;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
        }

                @keyframes spin {
                    0 % { transform: rotate(0deg); }
            100% {transform: rotate(360deg); }
        }

                /* Loading text */
                .loading-text {
                    font - size: 16px;
                font-weight: 500;
                color: #1f2937;
                margin-bottom: 8px;
        }

                .loading-subtext {
                    font - size: 14px;
                color: #6b7280;
        }

                /* Dots animation */
                .dots {
                    display: inline-block;
        }

                .dots::after {
                    content: '';
                animation: dots 1.5s steps(4, end) infinite;
        }

                @keyframes dots {
                    0 %, 20 % { content: ''; }
            40% {content: '.'; }
                60% {content: '..'; }
                80%, 100% {content: '...'; }
        }

                /* Demo styling */
                .demo-container {
                    max - width: 400px;
                margin: 50px auto;
                padding: 30px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

                .demo-title {
                    font - size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
                text-align: center;
        }
        
        @media (max-width: 480px) {
            .loading-overlay {
                padding: 16px;
            }

            .loading-container {
                max-width: 280px;
                padding: 24px 20px;
                border-radius: 10px;
            }

            .spinner {
                width: 38px;
                height: 38px;
                border-width: 2.5px;
                margin-bottom: 18px;
            }

            .loading-text {
                font-size: 14px;
                margin-bottom: 6px;
            }

            .loading-subtext {
                font-size: 12px;
            }
        }

        /* Demo styling */
        .demo-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .demo-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }

        /* Mobile demo adjustments */
        @media (max-width: 768px) {
            .demo-container {
                margin: 20px;
                padding: 24px;
                max-width: none;
            }

            .demo-title {
                font-size: 16px;
                margin-bottom: 16px;
            }

            .create-btn {
                width: 100%;
                padding: 14px 20px;
                font-size: 15px;
            }

        } 

          @media (max-width: 768px) {
            .loading-overlay {
                padding: 20px;
            }

            .loading-container {
                min-width: auto;
                width: 100%;
                max-width: 320px;
                padding: 28px 24px;
                margin: 0 auto;
                border-radius: 12px;
            }

            .spinner {
                width: 42px;
                height: 42px;
                margin-bottom: 20px;
            }

            .loading-text {
                font-size: 15px;
            }

            .loading-subtext {
                font-size: 13px;
            }
        }

        `}
            </style>
            <div className="loading-overlay" id="loadingOverlay">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">{title}</div>
                    <div className="loading-subtext">Vui lòng đợi<span className="dots"></span></div>
                </div>
            </div>
        </>
    )
}