import React from "react";

export type LongPressOptions = {
  threshold?: number;
  onStart?: (e: React.MouseEvent | React.TouchEvent) => void;
  onFinish?: (e: React.MouseEvent | React.TouchEvent) => void;
  onCancel?: (e: React.MouseEvent | React.TouchEvent) => void;
};

function isTouchEvent({ nativeEvent }: React.MouseEvent | React.TouchEvent) {
  return window.TouchEvent
    ? nativeEvent instanceof TouchEvent
    : "touches" in nativeEvent;
}

function isMouseEvent(event: React.MouseEvent | React.TouchEvent) {
  return event.nativeEvent instanceof MouseEvent;
}

export function useLongPress(
  callback: (e: React.MouseEvent | React.TouchEvent) => void,
  options: LongPressOptions = {},
) {
  const { threshold = 400, onStart, onFinish, onCancel } = options;
  const isLongPressActive = React.useRef(false);
  const isPressed = React.useRef(false);
  const timerId = React.useRef<NodeJS.Timeout | null>(null);

  return React.useMemo(() => {
    if (typeof callback !== "function") {
      return {};
    }

    const start = (event: React.MouseEvent | React.TouchEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return;

      if (onStart) {
        onStart(event);
      }

      isPressed.current = true;
      timerId.current = setTimeout(() => {
        callback(event);
        isLongPressActive.current = true;
      }, threshold);
    };

    const cancel = (event: React.MouseEvent | React.TouchEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return;

      if (isLongPressActive.current) {
        if (onFinish) {
          onFinish(event);
        }
      } else if (isPressed.current) {
        if (onCancel) {
          onCancel(event);
        }
      }

      isLongPressActive.current = false;
      isPressed.current = false;

      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };

    const mouseHandlers = {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
    };

    const touchHandlers = {
      onTouchStart: start,
      onTouchEnd: cancel,
    };

    return {
      ...mouseHandlers,
      ...touchHandlers,
    };
  }, [callback, threshold, onCancel, onFinish, onStart]);
}
