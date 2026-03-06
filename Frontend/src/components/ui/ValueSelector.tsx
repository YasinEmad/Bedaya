import { useId, useState } from "react";

export default function ValueSelector() {
    const [value, setValue] = useState("select");
    const groupName = useId(); // unique per component instance

    return (
        <div style={groupStyle}>
            <label style={labelStyle}>
                <input
                    type="radio"
                    name={groupName}
                    checked={value === "select"}
                    onChange={() => setValue("select")}
                    style={radioStyle}
                />
                <span>Select Value</span>
            </label>

            <label style={labelStyle}>
                <input
                    type="radio"
                    name={groupName}
                    checked={value === "-"}
                    onChange={() => setValue("-")}
                    style={radioStyle}
                />
                <span>−</span>
            </label>

            <label style={labelStyle}>
                <input
                    type="radio"
                    name={groupName}
                    checked={value === "+"}
                    onChange={() => setValue("+")}
                    style={radioStyle}
                />
                <span>+</span>
            </label>
        </div>
    );
}

const groupStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
};

const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
};

const radioStyle = {
    width: "16px",
    height: "16px",
    accentColor: "#2563eb",
    cursor: "pointer",
};
