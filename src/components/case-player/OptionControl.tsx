import type { ReasoningStepKind, SelectableOption } from "../../types";

type OptionControlProps = {
  option: SelectableOption;
  checked: boolean;
  disabled?: boolean;
  kind: ReasoningStepKind;
  name: string;
  order?: number;
  onChange: (optionId: string) => void;
};

export const OptionControl = ({
  option,
  checked,
  disabled = false,
  kind,
  name,
  order,
  onChange,
}: OptionControlProps) => {
  const inputType = kind === "classification" ? "radio" : "checkbox";

  return (
    <label className={`option-control${checked ? " option-control--selected" : ""}`}>
      <input
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={() => onChange(option.id)}
        type={inputType}
      />
      {order !== undefined && <span className="option-control__order">{order}</span>}
      <span>{option.label}</span>
    </label>
  );
};
