// Used chatGPT to generate these SVG components from my icons
import Svg, { G, Path, Rect } from "react-native-svg";

type Props = {
  stroke?: string;
};

const ListIcon = ({ stroke = "#FFF" }: Props) => (
  <Svg width={48} height={50} viewBox="0 0 13.229 13.229">
    <G transform="translate(-46.909 -104.058)">
      <Path
        d="M49.92 107.61h3.174M49.92 109.201h3.174M49.92 110.792h3.174M49.872 112.369h2.33M49.821 113.952h.97M54.534 107.37l.446.475 1.07-1.189M54.534 108.96l.446.475 1.07-1.188M54.534 110.55l.446.476 1.07-1.188"
        fill="none"
        stroke={stroke}
        strokeWidth={0.509}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x={47.59}
        y={104.74}
        width={10.81}
        height={11.866}
        ry={0.586}
        fill="none"
        stroke={stroke}
        strokeWidth={0.6}
        strokeLinecap="round"
      />
    </G>
  </Svg>
);

export default ListIcon;
