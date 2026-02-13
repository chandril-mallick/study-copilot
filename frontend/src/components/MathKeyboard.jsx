import React, { useEffect, useRef } from "react";
import "mathlive";

const MathKeyboard = ({ value, onChange, onSend, className }) => {
  const mathfieldRef = useRef(null);

  useEffect(() => {
    const mathfield = mathfieldRef.current;
    if (mathfield) {
      // Set initial value only once
      mathfield.value = value;

      // Add event listener for changes
      const handleInput = (e) => {
        onChange(e.target.value);
      };

      const handleKeydown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (onSend) onSend();
        }
      };

      mathfield.addEventListener("input", handleInput);
      mathfield.addEventListener("keydown", handleKeydown);

      // Customize the mathfield
      // Use "manual" policy so the virtual keyboard doesn't pop up automatically
      // This allows the user to use their physical keyboard.
      mathfield.mathVirtualKeyboardPolicy = "manual";
      mathfield.smartMode = true;

      // Maintain focus if mathMode was just enabled
      mathfield.focus();

      return () => {
        mathfield.removeEventListener("input", handleInput);
        mathfield.removeEventListener("keydown", handleKeydown);
      };
    }
  }, []);

  // Update value from prop only if it's different from the internal value
  // This prevents cursor jumps while typing
  useEffect(() => {
    const mathfield = mathfieldRef.current;
    if (mathfield && mathfield.value !== value) {
      mathfield.setValue(value, { suppressionChangeNotifications: true });
    }
  }, [value]);

  return (
    <div className={className}>
      <math-field
        ref={mathfieldRef}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "1.2rem",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          outline: "none",
          display: "block",
          minHeight: "50px",
        }}
      />
    </div>
  );
};

export default MathKeyboard;
