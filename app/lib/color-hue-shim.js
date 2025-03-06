// This is a shim for the @uiw/react-color-hue package
// It avoids the ESM import issues during deployment

const colorConvert = require('@uiw/color-convert/cjs/index');
const Alpha = require('@uiw/react-color-alpha/cjs/index');
const React = require('react');

// Simple implementation of the Hue component based on the original
function Hue(props) {
  const { prefixCls = 'w-color-hue', className, onChange, hue = 0, ...other } = props;
  const handleChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const { clientX } = e.changedTouches ? e.changedTouches[0] : e;
    let h = Math.round(((clientX - rect.left) / rect.width) * 360);
    h = Math.max(0, Math.min(h, 360));
    onChange && onChange({ h });
  };

  return React.createElement(
    Alpha.default,
    {
      className: [prefixCls, className].filter(Boolean).join(' '),
      style: {
        background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
      },
      ...other,
      onMove: handleChange,
      onDown: handleChange,
    },
    React.createElement('div', {
      style: {
        left: `${(hue / 360) * 100}%`,
        color: colorConvert.hsvaToHex({ h: hue, s: 100, v: 100, a: 1 }),
      },
    })
  );
}

// Export as CommonJS module
module.exports = Hue;
module.exports.default = Hue;