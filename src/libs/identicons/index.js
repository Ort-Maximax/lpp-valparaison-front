
// Simple hash function
// see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashCode(s) {
  if (!s) return 0;
  let value = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    value = ((value << 5) - value) + char;
    value &= value;
  }
  return value;
}

exports.generate = function (id, options, generator) {
  const size = options.size;
  const hash = options.hash || hashCode;
  const value = hash(id);
  const bin = value.toString(2);
  generator.start(value);
  let n = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size * 2; y++) {
      if (+bin.charAt(n++ % bin.length)) {
        generator.rect(x, y);
        generator.rect(size * 2 - x - 2, y);
      }
    }
  }
  generator.end();
};

exports.generateSVGString = function (id, options) {
  const width = options.width;
  const size = options.size;
  const side = width / ((size * 2) - 1);
  let color;
  let str = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">`;
  exports.generate(id, options, {
    start(value) {
      color = `#${Math.abs(value).toString(16).substring(0, 6)}`;
    },
    rect(x, y) {
      x = Math.floor(x * side);
      y = Math.floor(y * side);
      const xside = side + 1;
      str += `<rect x="${x}" y="${y}" width="${xside}" height="${xside}" style="fill:${color}" />`;
    },
    end() {
      str += '</svg>';
    },
  });
  return str;
};

const base64 = (typeof window !== 'undefined')
  ? window.btoa
  : function (str) {
    return new global.Buffer(str).toString('base64');
  };

exports.generateSVGDataURIString = function (id, options) {
  const str = exports.generateSVGString(id, options);
  return `data:image/svg+xml;base64,${base64(str)}`;
};

exports.generateSVGDOM = function (id, options) {
  const width = options.width;
  const size = options.size;
  const side = width / ((size * 2) - 1);
  let color;
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(width));
  exports.generate(id, options, {
    start(value) {
      color = `#${Math.abs(value).toString(16).substring(0, 6)}`;
    },
    rect(x, y) {
      const rect = document.createElementNS(xmlns, 'rect');
      rect.setAttribute('x', String(Math.floor(x * side)));
      rect.setAttribute('y', String(Math.floor(y * side)));
      rect.setAttribute('width', String(side + 1));
      rect.setAttribute('height', String(side + 1));
      rect.setAttribute('style', `fill:${color}`);
      svg.appendChild(rect);
    },
    end() {
    },
  });
  return svg;
};
