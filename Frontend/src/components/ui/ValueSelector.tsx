import { useId, useState } from "react";

type ValueSelectorProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  groupName?: string;
};

export default function ValueSelector({ value, onValueChange, className, groupName }: ValueSelectorProps) {
    const [internalValue, setInternalValue] = useState("select");
    const id = useId();
    const name = groupName || id;
    const selected = value ?? internalValue;

    const setValue = (v: string) => {
        if (onValueChange) onValueChange(v);
        else setInternalValue(v);
    };

    return (
        <div style={groupStyle} className={className}>
            <label style={labelStyle}>
                <input
                    type="radio"
                    name={name}
                    checked={selected === "select"}
                    onChange={() => setValue("select")}
                    style={radioStyle}
                />
                <span>Select Value</span>
            </label>

            <label style={labelStyle}>
                <input
                    type="radio"
                    name={name}
                    checked={selected === "-"}
                    onChange={() => setValue("-")}
                    style={radioStyle}
                />
                <span>−</span>
            </label>

            <label style={labelStyle}>
                <input
                    type="radio"
                    name={name}
                    checked={selected === "+"}
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
