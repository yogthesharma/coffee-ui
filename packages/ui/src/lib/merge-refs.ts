import * as React from "react";

export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") ref(value);
      else (ref as React.MutableRefObject<T | null>).current = value;
    }
  };
}
