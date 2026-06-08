// src/components/buttons/Button.tsx
import React, { forwardRef } from "react";

// src/utils/index.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getMoonPhase(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  if (month < 3) {
    year--;
    month += 12;
  }
  ++month;
  const c = 365.25 * year;
  const e = 30.6 * month;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const b_trunc = Math.trunc(jd);
  jd -= b_trunc;
  let b = Math.round(jd * 8);
  if (b >= 8) b = 0;
  switch (b) {
    case 0:
      return "new";
    case 1:
    case 2:
    case 3:
      return "waxing";
    case 4:
      return "full";
    case 5:
    case 6:
    case 7:
      return "waning";
    default:
      return "new";
  }
}

// src/components/buttons/Button.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var variantAliases = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  success: "success",
  warning: "warning",
  default: "primary",
  outline: "secondary",
  destructive: "warning",
  link: "ghost",
  "section-stamp": "section-stamp"
};
var sizeAliases = {
  sm: "sm",
  md: "md",
  lg: "lg",
  default: "md",
  icon: "icon"
};
function buttonVariants({
  variant = "primary",
  size = "md"
} = {}) {
  return cn(
    "mh-button",
    `mh-button--${variantAliases[variant ?? "primary"]}`,
    `mh-button--${sizeAliases[size ?? "md"]}`
  );
}
var Button = forwardRef(
  ({
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    icon,
    iconPosition = "left",
    children,
    href,
    type = "button",
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    const hasText = React.Children.count(children) > 0;
    const content = /* @__PURE__ */ jsxs(Fragment, { children: [
      loading && /* @__PURE__ */ jsx("span", { className: "mh-button__spinner", "aria-hidden": "true" }),
      !loading && icon && iconPosition === "left" && /* @__PURE__ */ jsx("span", { className: "mh-button__icon", "aria-hidden": !hasText, children: icon }),
      hasText && children,
      !loading && icon && iconPosition === "right" && /* @__PURE__ */ jsx("span", { className: "mh-button__icon", "aria-hidden": !hasText, children: icon })
    ] });
    if (href) {
      return /* @__PURE__ */ jsx(
        "a",
        {
          className: cn(buttonVariants({ variant, size }), className),
          href: isDisabled ? void 0 : href,
          "aria-disabled": isDisabled,
          "data-loading": loading || void 0,
          children: content
        }
      );
    }
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type,
        className: cn(buttonVariants({ variant, size }), className),
        disabled: isDisabled,
        "aria-disabled": isDisabled,
        "data-loading": loading || void 0,
        ...props,
        children: content
      }
    );
  }
);
Button.displayName = "Button";

// src/components/buttons/SelectionButton.tsx
import { memo, useId } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SelectionButton = memo(function SelectionButton2({
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className,
  id
}) {
  const generatedId = useId();
  const inputId = id ?? `mh-selection-${generatedId}`;
  return /* @__PURE__ */ jsxs2(
    "label",
    {
      className: cn("mh-choice mh-choice--selection", className),
      htmlFor: inputId,
      "data-checked": checked || indeterminate || void 0,
      "data-disabled": disabled || void 0,
      children: [
        /* @__PURE__ */ jsx2(
          "input",
          {
            id: inputId,
            className: "mh-choice__input",
            type: "checkbox",
            value,
            checked,
            disabled,
            "aria-checked": indeterminate ? "mixed" : checked,
            onChange: (event) => onChange?.(event.currentTarget.checked)
          }
        ),
        /* @__PURE__ */ jsx2("span", { className: "mh-choice__box", "data-indeterminate": indeterminate || void 0, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx2("span", { className: "mh-choice__label", children: label })
      ]
    }
  );
});

// src/components/buttons/RadioButton.tsx
import { memo as memo2, useId as useId2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var RadioButton = memo2(function RadioButton2({
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id
}) {
  const generatedId = useId2();
  const inputId = id ?? `mh-radio-${generatedId}`;
  return /* @__PURE__ */ jsxs3(
    "label",
    {
      className: cn("mh-choice mh-choice--radio", className),
      htmlFor: inputId,
      "data-checked": checked || void 0,
      "data-disabled": disabled || void 0,
      children: [
        /* @__PURE__ */ jsx3(
          "input",
          {
            id: inputId,
            className: "mh-choice__input",
            type: "radio",
            name,
            value,
            checked,
            disabled,
            "aria-checked": checked,
            onChange: () => onChange?.(value)
          }
        ),
        /* @__PURE__ */ jsx3("span", { className: "mh-choice__radio", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx3("span", { className: "mh-choice__label", children: label })
      ]
    }
  );
});

// src/components/buttons/ToggleButton.tsx
import { memo as memo3, useId as useId3 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var ToggleButton = memo3(function ToggleButton2({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id
}) {
  const generatedId = useId3();
  const inputId = id ?? `mh-toggle-${generatedId}`;
  return /* @__PURE__ */ jsxs4(
    "label",
    {
      className: cn("mh-toggle", className),
      htmlFor: inputId,
      "data-checked": checked || void 0,
      "data-disabled": disabled || void 0,
      children: [
        /* @__PURE__ */ jsx4(
          "input",
          {
            id: inputId,
            className: "mh-toggle__input",
            type: "checkbox",
            role: "switch",
            checked,
            disabled,
            "aria-checked": checked,
            onChange: (event) => onChange?.(event.currentTarget.checked)
          }
        ),
        /* @__PURE__ */ jsx4("span", { className: "mh-toggle__track", "aria-hidden": "true", children: /* @__PURE__ */ jsx4("span", { className: "mh-toggle__thumb" }) }),
        label && /* @__PURE__ */ jsx4("span", { className: "mh-toggle__label", children: label })
      ]
    }
  );
});

// src/components/buttons/IconButton.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var IconButton = forwardRef2(
  ({
    icon,
    size = "md",
    variant = "secondary",
    tooltip,
    disabled,
    className,
    type = "button",
    "aria-label": ariaLabel,
    ...props
  }, ref) => /* @__PURE__ */ jsxs5("span", { className: "mh-icon-button-wrap", "data-tooltip": tooltip || void 0, children: [
    /* @__PURE__ */ jsx5(
      "button",
      {
        ref,
        type,
        className: cn(
          "mh-icon-button",
          `mh-icon-button--${size}`,
          `mh-icon-button--${variant === "default" ? "primary" : variant === "outline" ? "secondary" : variant}`,
          className
        ),
        disabled,
        "aria-disabled": disabled,
        "aria-label": ariaLabel,
        ...props,
        children: /* @__PURE__ */ jsx5("span", { className: "mh-icon-button__icon", "aria-hidden": "true", children: icon })
      }
    ),
    tooltip && /* @__PURE__ */ jsx5("span", { className: "mh-icon-button__tooltip", children: tooltip })
  ] })
);
IconButton.displayName = "IconButton";

// src/components/buttons/ButtonGroup.tsx
import { memo as memo4, useId as useId4 } from "react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var ButtonGroup = memo4(function ButtonGroup2({
  label,
  orientation = "vertical",
  children,
  className,
  role = "group",
  ...props
}) {
  const generatedId = useId4();
  const labelId = label ? `mh-button-group-${generatedId}` : void 0;
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: cn("mh-button-group", `mh-button-group--${orientation}`, className),
      role,
      "aria-labelledby": labelId,
      "data-orientation": orientation,
      ...props,
      children: [
        label && /* @__PURE__ */ jsx6("div", { id: labelId, className: "mh-button-group__label", children: label }),
        /* @__PURE__ */ jsx6("div", { className: "mh-button-group__items", children })
      ]
    }
  );
});

// src/components/buttons/useButtonGroup.ts
import { useCallback, useState } from "react";
function useButtonGroup({
  type,
  defaultValue,
  onChange
}) {
  const initialValue = defaultValue ?? (type === "checkbox" ? [] : "");
  const [selected, setSelected] = useState(initialValue);
  const isSelected = useCallback(
    (value) => Array.isArray(selected) ? selected.includes(value) : selected === value,
    [selected]
  );
  const toggle = useCallback(
    (value) => {
      setSelected((current) => {
        const next = type === "radio" ? value : Array.isArray(current) ? current.includes(value) ? current.filter((item) => item !== value) : [...current, value] : [value];
        onChange?.(next);
        return next;
      });
    },
    [onChange, type]
  );
  const reset = useCallback(() => {
    setSelected(initialValue);
    onChange?.(initialValue);
  }, [initialValue, onChange]);
  return {
    selected,
    isSelected,
    toggle,
    reset
  };
}

export {
  cn,
  getMoonPhase,
  buttonVariants,
  Button,
  SelectionButton,
  RadioButton,
  ToggleButton,
  IconButton,
  ButtonGroup,
  useButtonGroup
};
//# sourceMappingURL=chunk-5SXWAUHV.js.map