import { r as reactExports } from './index-BQAR1rgm.js';
import { j as jsxRuntimeExports } from './utils-C6Yw6kaM.js';

// packages/react/direction/src/direction.tsx
var DirectionContext = reactExports.createContext(void 0);
var DirectionProvider = (props) => {
  const { dir, children } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DirectionContext.Provider, { value: dir, children });
};
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
var Provider = DirectionProvider;

export { useDirection as u };
//# sourceMappingURL=index-CjyjhAqU.js.map
