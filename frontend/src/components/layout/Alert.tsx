import React, { useEffect } from "react";

type AlertProps = {
    open: boolean;
    message?: string;
    onResult: (value: boolean) => void;
    okText?: string;
    cancelText?: string;
};

const Alert: React.FC<AlertProps> = ({
    open,
    message = "Are you sure?",
    onResult,
    okText = "Yes",
    cancelText = "No",
}) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onResult(false);
        };

        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onResult]);

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={() => onResult(false)}
        >
            <div
                style={{
                    width: "min(90vw, 380px)",
                    background: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <p style={{ margin: 0, marginBottom: 18, fontSize: 16 }}>{message}</p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                        onClick={() => onResult(false)}
                        style={{
                            border: "1px solid #ccc",
                            background: "#fff",
                            padding: "8px 14px",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => onResult(true)}
                        style={{
                            border: "none",
                            background: "#2563eb",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        {okText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;